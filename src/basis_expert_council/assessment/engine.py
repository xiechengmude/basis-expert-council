"""
CAT (Computerized Adaptive Testing) engine.
Pure Python, deterministic, no LLM dependency.
"""

import statistics


class CATEngine:
    def __init__(self, questions: list[dict]):
        self.questions = questions

    def select_next_question(
        self,
        current_difficulty: float,
        answered_ids: list[int],
        topic_counts: dict,
        consecutive_correct: int,
        consecutive_wrong: int,
    ) -> dict | None:
        """Select next question based on adaptive algorithm."""
        # 1. Filter out already-answered questions
        candidates = [q for q in self.questions if q["id"] not in answered_ids]
        if not candidates:
            return None

        # 2. Find candidates within difficulty window (+-0.2)
        window = 0.2
        in_window = [
            q for q in candidates
            if abs(q["difficulty"] - current_difficulty) <= window
        ]

        # Widen window if no candidates found
        if not in_window:
            in_window = sorted(candidates, key=lambda q: abs(q["difficulty"] - current_difficulty))[:5]

        if not in_window:
            return None

        # 3. Among candidates, prefer under-represented topics
        if topic_counts:
            min_count = min(topic_counts.values()) if topic_counts else 0
            under_represented = [
                q for q in in_window
                if topic_counts.get(q["topic"], 0) <= min_count
            ]
            if under_represented:
                in_window = under_represented

        # 4. Pick the candidate closest to target difficulty
        in_window.sort(key=lambda q: abs(q["difficulty"] - current_difficulty))
        return in_window[0]

    def adjust_difficulty(
        self,
        current: float,
        is_correct: bool,
        consecutive_correct: int,
        consecutive_wrong: int,
    ) -> float:
        """Adjust difficulty: +/-0.15 per answer, +/-0.25 on 2+ consecutive."""
        if is_correct:
            delta = 0.25 if consecutive_correct >= 2 else 0.15
            new = current + delta
        else:
            delta = 0.25 if consecutive_wrong >= 2 else 0.15
            new = current - delta

        return max(0.05, min(0.95, new))

    def should_stop(self, total_answered: int, recent_difficulties: list[float]) -> bool:
        """Min 15, max 25, early stop if last 5 difficulties converge (std < 0.05)."""
        if total_answered >= 25:
            return True
        if total_answered < 15:
            return False
        if len(recent_difficulties) >= 5:
            last_five = recent_difficulties[-5:]
            if statistics.stdev(last_five) < 0.05:
                return True
        return False

    def compute_ability(self, recent_difficulties: list[float]) -> float:
        """Recency-weighted average of last 5 difficulty levels."""
        if not recent_difficulties:
            return 0.5
        last = recent_difficulties[-5:]
        weights = list(range(1, len(last) + 1))  # 1,2,3,4,5
        total_weight = sum(weights)
        return sum(d * w for d, w in zip(last, weights)) / total_weight
