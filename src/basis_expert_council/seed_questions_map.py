"""
BasisPilot — MAP Question Bank Seeder (K-G12, 430 questions)

Loads the expanded MAP question bank from data/map_questions_bank_expanded.json,
transforms to assessment_questions format, and seeds into the database.

Run: python -m src.basis_expert_council.seed_questions_map
"""

import asyncio
import json
from pathlib import Path

from . import db
from .question_bank.map_transformer import transform_batch


MAP_BANK_PATH = Path(__file__).parent.parent.parent / "data" / "map_questions_bank_expanded.json"


async def seed() -> int:
    """Load MAP questions, transform, and insert into database. Returns count inserted."""
    await db.init_schema()

    if not MAP_BANK_PATH.exists():
        print(f"MAP 题库文件不存在: {MAP_BANK_PATH}")
        return 0

    with open(MAP_BANK_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data.get("questions", [])
    if not questions:
        print("MAP 题库为空")
        return 0

    # Transform to assessment_questions format
    batch = transform_batch(questions, batch_name="MAP Question Bank K-G12 (430 questions)")
    transformed = batch["questions"]

    # Create import batch record
    import_batch = await db.create_import_batch(
        batch_name=batch["batch_name"],
        source="map_testprep",
        imported_by="seed_questions_map",
    )
    batch_id = import_batch["id"]

    # Bulk insert
    count = await db.bulk_insert_questions(transformed, batch_id=batch_id)
    await db.update_import_batch(batch_id, status="imported", question_count=count)

    return count


if __name__ == "__main__":
    async def main():
        count = await seed()
        print(f"Seeded {count} MAP questions (K-G12, Math + Reading + Language Usage)")
        await db.close_pool()

    asyncio.run(main())
