"""
BasisPilot (贝领) — 学力档案 v2 计算引擎
错题本驱动的全生命周期学习追踪系统

核心函数: compute_academic_profile(user_id) → dict
执行流程:
  1. scan_and_update_mistake_book  — 扫描所有答题记录，维护错题本
  2. compute_topic_mastery         — 按 (subject, topic) 统计能力分数
  3. extract_goals_from_mem0       — 从 Mem0 记忆提取学习目标
  4. compute_goal_gaps             — 计算当前能力与目标的差距
  5. build_activity_heatmap        — 构建 90 天活跃度热力图
  6. build_and_cache_payload       — 组装完整 JSON 并缓存
"""

import json
import logging
import re
import time
from datetime import datetime, timezone

from . import db
from .memory import get_memory, user_id_to_mem0

logger = logging.getLogger("basis.academic_profile")


# ---------------------------------------------------------------------------
# 主入口
# ---------------------------------------------------------------------------


async def compute_academic_profile(user_id: int) -> dict:
    """计算并缓存用户的完整学力档案，返回 profile JSON。"""
    t0 = time.monotonic()
    pool = await db.get_pool()

    async with pool.acquire() as conn:
        # Step 1: 错题本
        await scan_and_update_mistake_book(user_id, conn)

        # Step 2: 知识点掌握度
        await compute_topic_mastery(user_id, conn)

        # Step 3: 目标提取
        await extract_goals_from_mem0(user_id, conn)

        # Step 4: 目标差距
        await compute_goal_gaps(user_id, conn)

    # Step 5 & 6: 组装 payload (uses db helpers that acquire their own conn)
    activity = await db.get_activity_heatmap(user_id)
    payload = await _build_payload(user_id, activity)

    elapsed_ms = int((time.monotonic() - t0) * 1000)
    await db.upsert_profile_cache(user_id, payload, elapsed_ms)
    payload["meta"]["compute_time_ms"] = elapsed_ms

    logger.info(f"Academic profile computed for user {user_id} in {elapsed_ms}ms")
    return payload


# ---------------------------------------------------------------------------
# Step 1: 扫描并更新错题本
# ---------------------------------------------------------------------------


async def scan_and_update_mistake_book(user_id: int, conn) -> None:
    """扫描所有已完成测评的答题记录，维护错题本状态。"""
    # 获取该用户所有已在错题本中的 question_ids
    existing_ids = await db.get_mistake_book_question_ids(user_id)

    # 查询所有答题记录（按时间正序）
    rows = await conn.fetch(
        """
        SELECT a.question_id, a.user_answer, a.is_correct, a.created_at,
               q.subject, q.topic, q.subtopic, q.difficulty, q.tags,
               q.content_zh, q.content_en,
               q.explanation_zh, q.explanation_en
        FROM assessment_answers a
        JOIN assessment_questions q ON q.id = a.question_id
        JOIN assessment_sessions s ON s.id = a.session_id
        WHERE s.user_id = $1 AND s.status = 'completed'
        ORDER BY a.created_at ASC
        """,
        user_id,
    )

    for row in rows:
        qid = row["question_id"]
        is_correct = row["is_correct"]

        if not is_correct and is_correct is not None:
            # 答错 → UPSERT 到错题本
            tags = row["tags"] or []
            bloom, mcs, skills = _parse_question_tags(tags)
            content_zh = row["content_zh"] or {}
            content_en = row["content_en"] or {}
            if isinstance(content_zh, str):
                content_zh = json.loads(content_zh)
            if isinstance(content_en, str):
                content_en = json.loads(content_en)

            user_answer = row["user_answer"]
            if isinstance(user_answer, str):
                try:
                    user_answer = json.loads(user_answer)
                except (json.JSONDecodeError, TypeError):
                    user_answer = {"text": user_answer}

            await db.upsert_mistake_book_entry(
                user_id, qid,
                subject=row["subject"],
                topic=row["topic"],
                subtopic=row["subtopic"],
                difficulty=float(row["difficulty"]),
                wrong_at=row["created_at"],
                bloom_level=bloom,
                misconception_ids=mcs if mcs else None,
                skill_tags=skills if skills else None,
                last_wrong_answer=user_answer if isinstance(user_answer, dict) else None,
                correct_answer=content_zh.get("answer") or content_en.get("answer"),
                explanation_zh=row["explanation_zh"],
                explanation_en=row["explanation_en"],
                question_stem_zh=content_zh.get("stem"),
                question_stem_en=content_en.get("stem"),
            )
            existing_ids.add(qid)

        elif is_correct and qid in existing_ids:
            # 答对且该题在错题本中 → 记录正确
            await db.record_correct_after_wrong(user_id, qid)


# ---------------------------------------------------------------------------
# Step 2: 计算知识点掌握度
# ---------------------------------------------------------------------------


async def compute_topic_mastery(user_id: int, conn) -> None:
    """从 assessment_answers 按 (subject, topic) 统计并 UPSERT 到 student_ability_scores。"""
    # 统计每个 (subject, topic) 的答题情况
    stats = await conn.fetch(
        """
        SELECT q.subject, q.topic,
               COUNT(*) as total,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct,
               SUM(CASE WHEN a.is_correct = false THEN 1 ELSE 0 END) as wrong
        FROM assessment_answers a
        JOIN assessment_questions q ON q.id = a.question_id
        JOIN assessment_sessions s ON s.id = a.session_id
        WHERE s.user_id = $1 AND s.status = 'completed' AND a.is_correct IS NOT NULL
        GROUP BY q.subject, q.topic
        """,
        user_id,
    )

    # 获取错题本统计
    mistake_stats = await conn.fetch(
        """
        SELECT subject, topic,
               COUNT(*) FILTER (WHERE mastery_status = 'mastered') as mastered,
               COUNT(*) FILTER (WHERE mastery_status != 'mastered') as active
        FROM mistake_book_entries
        WHERE user_id = $1
        GROUP BY subject, topic
        """,
        user_id,
    )
    mistake_map: dict[tuple, dict] = {}
    for r in mistake_stats:
        mistake_map[(r["subject"], r["topic"])] = {
            "mastered": r["mastered"], "active": r["active"],
        }

    # Bloom 统计
    bloom_stats = await conn.fetch(
        """
        SELECT q.subject, q.topic, t as tag,
               COUNT(*) as total,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct
        FROM assessment_answers a
        JOIN assessment_questions q ON q.id = a.question_id
        JOIN assessment_sessions s ON s.id = a.session_id,
             unnest(q.tags) as t
        WHERE s.user_id = $1 AND s.status = 'completed'
              AND a.is_correct IS NOT NULL AND t LIKE 'bloom:%'
        GROUP BY q.subject, q.topic, t
        """,
        user_id,
    )
    bloom_map: dict[tuple, dict] = {}
    for r in bloom_stats:
        key = (r["subject"], r["topic"])
        if key not in bloom_map:
            bloom_map[key] = {}
        level = r["tag"].split(":", 1)[1]
        bloom_map[key][level] = round(r["correct"] / r["total"], 2) if r["total"] > 0 else 0

    # Subject-level aggregates
    subject_agg: dict[str, dict] = {}
    for row in stats:
        subj = row["subject"]
        if subj not in subject_agg:
            subject_agg[subj] = {"total": 0, "correct": 0, "wrong": 0}
        subject_agg[subj]["total"] += row["total"]
        subject_agg[subj]["correct"] += row["correct"]
        subject_agg[subj]["wrong"] += row["wrong"]

    # UPSERT topic-level scores
    for row in stats:
        subj, topic = row["subject"], row["topic"]
        total, correct = row["total"], row["correct"]
        accuracy = correct / total if total > 0 else 0
        score_100 = round(accuracy * 100, 1)
        mdata = mistake_map.get((subj, topic), {"mastered": 0, "active": 0})
        bloom = bloom_map.get((subj, topic), {})

        # Check previous score for history insertion
        prev = await conn.fetchrow(
            "SELECT score_100 FROM student_ability_scores WHERE user_id = $1 AND subject = $2 AND topic = $3",
            user_id, subj, topic,
        )
        prev_score = float(prev["score_100"]) if prev else None

        await conn.execute(
            """
            INSERT INTO student_ability_scores
                (user_id, subject, topic, ability_score, score_100, confidence,
                 assessment_count, total_questions, correct_questions, wrong_questions,
                 mastered_mistakes, active_mistakes, bloom_mastery, last_computed_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
            ON CONFLICT (user_id, subject, topic) DO UPDATE SET
                ability_score = EXCLUDED.ability_score,
                score_100 = EXCLUDED.score_100,
                confidence = EXCLUDED.confidence,
                assessment_count = EXCLUDED.assessment_count,
                total_questions = EXCLUDED.total_questions,
                correct_questions = EXCLUDED.correct_questions,
                wrong_questions = EXCLUDED.wrong_questions,
                mastered_mistakes = EXCLUDED.mastered_mistakes,
                active_mistakes = EXCLUDED.active_mistakes,
                bloom_mastery = EXCLUDED.bloom_mastery,
                last_computed_at = NOW(),
                updated_at = NOW()
            """,
            user_id, subj, topic, accuracy, score_100,
            min(1.0, 0.5 + total * 0.05),  # confidence grows with sample size
            total,  # assessment_count = total answers for this topic
            total, correct, row["wrong"],
            mdata["mastered"], mdata["active"],
            json.dumps(bloom, ensure_ascii=False),
        )

        # Insert history if score changed significantly
        if prev_score is not None and abs(score_100 - prev_score) >= 2:
            await db.insert_ability_history(user_id, subj, topic, accuracy)
        elif prev_score is None:
            await db.insert_ability_history(user_id, subj, topic, accuracy)

    # UPSERT subject-level scores (topic=None)
    for subj, agg in subject_agg.items():
        total, correct = agg["total"], agg["correct"]
        accuracy = correct / total if total > 0 else 0
        score_100 = round(accuracy * 100, 1)

        # Subject-level mistake stats
        subj_mistakes = await conn.fetchrow(
            """SELECT
                COUNT(*) FILTER (WHERE mastery_status = 'mastered') as mastered,
                COUNT(*) FILTER (WHERE mastery_status != 'mastered') as active
               FROM mistake_book_entries WHERE user_id = $1 AND subject = $2""",
            user_id, subj,
        )
        mastered = subj_mistakes["mastered"] if subj_mistakes else 0
        active = subj_mistakes["active"] if subj_mistakes else 0

        # Subject-level bloom
        subj_bloom: dict[str, float] = {}
        for key, bloom in bloom_map.items():
            if key[0] == subj:
                for level, rate in bloom.items():
                    if level not in subj_bloom:
                        subj_bloom[level] = []
                    subj_bloom[level].append(rate) if isinstance(subj_bloom.get(level), list) else None
        # Average bloom rates across topics — rebuild correctly
        subj_bloom_agg: dict[str, list] = {}
        for key, bloom in bloom_map.items():
            if key[0] == subj:
                for level, rate in bloom.items():
                    subj_bloom_agg.setdefault(level, []).append(rate)
        subj_bloom_avg = {
            k: round(sum(v) / len(v), 2) for k, v in subj_bloom_agg.items()
        }

        prev = await conn.fetchrow(
            "SELECT score_100 FROM student_ability_scores WHERE user_id = $1 AND subject = $2 AND topic IS NULL",
            user_id, subj,
        )
        prev_score = float(prev["score_100"]) if prev else None

        await conn.execute(
            """
            INSERT INTO student_ability_scores
                (user_id, subject, topic, ability_score, score_100, confidence,
                 assessment_count, total_questions, correct_questions, wrong_questions,
                 mastered_mistakes, active_mistakes, bloom_mastery, last_computed_at, updated_at)
            VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
            ON CONFLICT (user_id, subject, topic) DO UPDATE SET
                ability_score = EXCLUDED.ability_score,
                score_100 = EXCLUDED.score_100,
                confidence = EXCLUDED.confidence,
                assessment_count = EXCLUDED.assessment_count,
                total_questions = EXCLUDED.total_questions,
                correct_questions = EXCLUDED.correct_questions,
                wrong_questions = EXCLUDED.wrong_questions,
                mastered_mistakes = EXCLUDED.mastered_mistakes,
                active_mistakes = EXCLUDED.active_mistakes,
                bloom_mastery = EXCLUDED.bloom_mastery,
                last_computed_at = NOW(),
                updated_at = NOW()
            """,
            user_id, subj, accuracy, score_100,
            min(1.0, 0.5 + total * 0.02),
            total, total, correct, agg["wrong"],
            mastered, active,
            json.dumps(subj_bloom_avg, ensure_ascii=False),
        )

        if prev_score is not None and abs(score_100 - prev_score) >= 2:
            await db.insert_ability_history(user_id, subj, None, accuracy)
        elif prev_score is None:
            await db.insert_ability_history(user_id, subj, None, accuracy)


# ---------------------------------------------------------------------------
# Step 3: 从 Mem0 提取学习目标
# ---------------------------------------------------------------------------


async def extract_goals_from_mem0(user_id: int, conn) -> None:
    """从 Mem0 记忆中提取学习目标并 UPSERT 到 goal_snapshots。"""
    try:
        mem0_uid = user_id_to_mem0(str(user_id))
        memory = get_memory()
        all_memories = memory.get_all(user_id=mem0_uid)

        # Handle different Mem0 return formats
        memories = all_memories if isinstance(all_memories, list) else all_memories.get("results", [])

        for mem in memories:
            meta = mem.get("metadata", {}) or {}
            category = meta.get("category", "")
            text = mem.get("memory", "") or mem.get("text", "")

            if category not in ("goal", "exam_prep", "college_planning", "grade"):
                continue

            goal = _extract_goal_from_memory(text, category)
            if not goal:
                continue

            await db.upsert_goal_snapshot(
                user_id,
                goal_type=goal["goal_type"],
                goal_text=goal["goal_text"],
                target_value=goal.get("target_value"),
                goal_metadata={"source_memory": text, "subject": goal.get("subject")},
                source="mem0",
            )

    except Exception as e:
        logger.warning(f"Failed to extract goals from Mem0 for user {user_id}: {e}")


# ---------------------------------------------------------------------------
# Step 4: 计算目标差距
# ---------------------------------------------------------------------------


async def compute_goal_gaps(user_id: int, conn) -> None:
    """对每个 active goal 查找对应学科的 score_100 并计算 gap_pct。"""
    goals = await conn.fetch(
        "SELECT * FROM goal_snapshots WHERE user_id = $1 AND status = 'active'",
        user_id,
    )

    for goal in goals:
        meta = goal["goal_metadata"]
        if isinstance(meta, str):
            meta = json.loads(meta)

        subject = meta.get("subject")
        target = goal["target_value"]

        if not target or not subject:
            continue

        # Find subject-level score
        score_row = await conn.fetchrow(
            "SELECT score_100 FROM student_ability_scores WHERE user_id = $1 AND subject = $2 AND topic IS NULL",
            user_id, subject,
        )
        current = float(score_row["score_100"]) if score_row else 0

        gap = max(0, (target - current) / target * 100) if target > 0 else 0

        await conn.execute(
            """UPDATE goal_snapshots SET
                current_value = $1, gap_pct = $2, extracted_at = NOW()
               WHERE id = $3""",
            current, round(gap, 1), goal["id"],
        )


# ---------------------------------------------------------------------------
# Step 5 & 6: 组装 payload
# ---------------------------------------------------------------------------


async def _build_payload(user_id: int, activity: dict) -> dict:
    """组装完整的学力档案 JSON payload。"""
    pool = await db.get_pool()
    async with pool.acquire() as conn:
        # Student info (join biz_users + student_profiles)
        student_row = await conn.fetchrow(
            """SELECT u.id, u.nickname, sp.grade, sp.school_name, sp.campus, sp.ap_courses
               FROM biz_users u
               LEFT JOIN student_profiles sp ON sp.user_id = u.id
               WHERE u.id = $1""",
            user_id,
        )
        if not student_row:
            return {"error": "User not found"}

        student = {
            "id": student_row["id"],
            "nickname": student_row["nickname"],
            "grade": student_row["grade"],
            "school_name": student_row["school_name"],
            "campus": student_row["campus"],
            "ap_courses": student_row["ap_courses"],
        }

        # Ability scores
        scores = await conn.fetch(
            "SELECT * FROM student_ability_scores WHERE user_id = $1 ORDER BY subject, topic NULLS FIRST",
            user_id,
        )

        subjects_map: dict[str, dict] = {}
        for row in scores:
            s = row["subject"]
            if s not in subjects_map:
                subjects_map[s] = {
                    "subject": s,
                    "score_100": 0, "confidence": 0,
                    "total_questions": 0, "correct_questions": 0, "wrong_questions": 0,
                    "mastered_mistakes": 0, "active_mistakes": 0,
                    "bloom_mastery": {},
                    "topics": [],
                }
            if row["topic"] is None:
                subjects_map[s]["score_100"] = float(row["score_100"])
                subjects_map[s]["confidence"] = float(row["confidence"])
                subjects_map[s]["total_questions"] = row["total_questions"] or 0
                subjects_map[s]["correct_questions"] = row["correct_questions"] or 0
                subjects_map[s]["wrong_questions"] = row["wrong_questions"] or 0
                subjects_map[s]["mastered_mistakes"] = row["mastered_mistakes"] or 0
                subjects_map[s]["active_mistakes"] = row["active_mistakes"] or 0
                bloom = row["bloom_mastery"]
                if isinstance(bloom, str):
                    bloom = json.loads(bloom)
                subjects_map[s]["bloom_mastery"] = bloom or {}
            else:
                subjects_map[s]["topics"].append({
                    "topic": row["topic"],
                    "score_100": float(row["score_100"]),
                    "total": row["total_questions"] or 0,
                    "correct": row["correct_questions"] or 0,
                    "wrong": row["wrong_questions"] or 0,
                    "active_mistakes": row["active_mistakes"] or 0,
                })

        subjects_list = list(subjects_map.values())

        # KPI
        kpi_row = await conn.fetchrow(
            """SELECT
                COUNT(*) as total_assessments,
                COALESCE(SUM(total_questions), 0) as total_questions
               FROM assessment_sessions
               WHERE user_id = $1 AND status = 'completed'""",
            user_id,
        )
        total_q = sum(s["total_questions"] for s in subjects_list)
        correct_q = sum(s["correct_questions"] for s in subjects_list)
        overall_acc = round(correct_q / total_q * 100, 1) if total_q > 0 else 0

        # Mistake book summary
        mistake_summary = await db.get_mistake_book_summary(user_id)
        mistake_entries = await db.get_mistake_book_entries(user_id, limit=100)

        # Serialize mistake entries
        serialized_mistakes = []
        for e in mistake_entries:
            entry = {}
            for k, v in e.items():
                if hasattr(v, "isoformat"):
                    entry[k] = v.isoformat()
                elif isinstance(v, (dict, list)):
                    entry[k] = v
                else:
                    entry[k] = v
            serialized_mistakes.append(entry)

        total_mistakes = mistake_summary["total"]
        mastered_m = mistake_summary["by_status"].get("mastered", 0)
        active_m = total_mistakes - mastered_m
        mastery_rate = round(mastered_m / total_mistakes * 100, 1) if total_mistakes > 0 else 0

        # Improvement: compare first vs last assessment scores
        sessions = await conn.fetch(
            """SELECT final_score, completed_at FROM assessment_sessions
               WHERE user_id = $1 AND status = 'completed' AND final_score IS NOT NULL
               ORDER BY completed_at ASC""",
            user_id,
        )
        improvement_pct = 0.0
        if len(sessions) >= 2:
            first = float(sessions[0]["final_score"])
            last = float(sessions[-1]["final_score"])
            if first > 0:
                improvement_pct = round(((last - first) / first) * 100, 1)

        # Goals
        goals_rows = await db.get_goal_snapshots(user_id)
        goals = []
        for g in goals_rows:
            goals.append({
                "goal_type": g["goal_type"],
                "goal_text": g["goal_text"],
                "target_value": g["target_value"],
                "current_value": g["current_value"],
                "gap_pct": g["gap_pct"],
                "status": g["status"],
            })

        # History
        history_rows = await conn.fetch(
            """SELECT subject, topic, score_100, recorded_at
               FROM ability_score_history
               WHERE user_id = $1
               ORDER BY recorded_at ASC LIMIT 200""",
            user_id,
        )
        history = [
            {
                "subject": r["subject"],
                "topic": r["topic"],
                "score_100": float(r["score_100"]),
                "recorded_at": r["recorded_at"].isoformat() if r["recorded_at"] else None,
            }
            for r in history_rows
        ]

        # Recent sessions
        recent = await conn.fetch(
            """SELECT id, subject, final_score, assessment_type, completed_at
               FROM assessment_sessions
               WHERE user_id = $1 AND status = 'completed'
               ORDER BY completed_at DESC LIMIT 20""",
            user_id,
        )
        recent_sessions = [
            {
                "id": str(s["id"]),
                "subject": s["subject"],
                "final_score": float(s["final_score"]) if s["final_score"] else None,
                "assessment_type": s["assessment_type"],
                "completed_at": s["completed_at"].isoformat() if s["completed_at"] else None,
            }
            for s in recent
        ]

        # Data range
        first_session = await conn.fetchval(
            "SELECT MIN(completed_at) FROM assessment_sessions WHERE user_id = $1 AND status = 'completed'",
            user_id,
        )
        last_session = await conn.fetchval(
            "SELECT MAX(completed_at) FROM assessment_sessions WHERE user_id = $1 AND status = 'completed'",
            user_id,
        )

        return {
            "meta": {
                "computed_at": datetime.now(timezone.utc).isoformat(),
                "version": 2,
                "data_range": {
                    "first_session": first_session.isoformat() if first_session else None,
                    "last_session": last_session.isoformat() if last_session else None,
                },
            },
            "student": student,
            "kpi": {
                "total_assessments": kpi_row["total_assessments"] if kpi_row else 0,
                "total_questions": total_q,
                "overall_accuracy": overall_acc,
                "improvement_pct": improvement_pct,
                "total_mistakes": total_mistakes,
                "mastered_mistakes": mastered_m,
                "active_mistakes": active_m,
                "mastery_rate": mastery_rate,
            },
            "subjects": subjects_list,
            "mistake_book": {
                "summary": {
                    "total": total_mistakes,
                    "by_status": mistake_summary["by_status"],
                    "by_subject": mistake_summary["by_subject"],
                    "top_misconceptions": mistake_summary["top_misconceptions"],
                },
                "entries": serialized_mistakes,
            },
            "goals": goals,
            "history": history,
            "recent_sessions": recent_sessions,
            "activity_heatmap": activity,
        }


# ---------------------------------------------------------------------------
# 辅助函数
# ---------------------------------------------------------------------------


def _parse_question_tags(tags: list[str]) -> tuple[str | None, list[str], list[str]]:
    """从题目 tags 提取 bloom level, misconception ids, skill tags。"""
    bloom = None
    misconceptions = []
    skills = []

    for t in tags:
        if t.startswith("bloom:"):
            bloom = t.split(":", 1)[1]
        elif t.startswith("mc:"):
            misconceptions.append(t.split(":", 1)[1])
        elif t.startswith("skill:"):
            skills.append(t.split(":", 1)[1])

    return bloom, misconceptions, skills


def _extract_goal_from_memory(text: str, category: str) -> dict | None:
    """从 Mem0 记忆文本中解析学习目标。"""
    if not text:
        return None

    # Subject detection
    subject_map = {
        "数学": "math", "math": "math",
        "英语": "english", "english": "english",
        "物理": "physics", "physics": "physics",
        "化学": "chemistry", "chemistry": "chemistry",
        "生物": "biology", "biology": "biology",
        "历史": "history", "history": "history",
        "科学": "science", "science": "science",
    }

    subject = None
    for key, val in subject_map.items():
        if key in text.lower():
            subject = val
            break

    # Extract target score from text
    target_value = None
    # Patterns like "90分", "score 90", "达到90", "目标90"
    score_match = re.search(r'(?:达到|目标|score|get|aim)\s*(\d{2,3})\s*(?:分|points|%)?', text, re.IGNORECASE)
    if score_match:
        val = float(score_match.group(1))
        target_value = val if val <= 100 else None

    # Determine goal type
    goal_type = "skill_target"
    if category == "exam_prep" or "AP" in text.upper():
        goal_type = "ap_target"
    elif category == "grade" or re.search(r'GPA|成绩|grade', text, re.IGNORECASE):
        goal_type = "grade_target"
    elif category == "college_planning":
        goal_type = "college_target"

    return {
        "goal_type": goal_type,
        "goal_text": text[:200],
        "target_value": target_value,
        "subject": subject,
    }


def _compute_trend(history: list[dict]) -> str:
    """Compute trend direction from score history."""
    if len(history) < 2:
        return "stable"
    recent = history[-5:]
    scores = [h["score_100"] for h in recent]
    if len(scores) < 2:
        return "stable"
    delta = scores[-1] - scores[0]
    if delta > 3:
        return "improving"
    elif delta < -3:
        return "declining"
    return "stable"
