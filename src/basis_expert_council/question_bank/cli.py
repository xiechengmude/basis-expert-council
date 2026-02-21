"""
真题库 CLI — 命令行管理工具

用法:
  python -m src.basis_expert_council.question_bank import <path.json>
  python -m src.basis_expert_council.question_bank import-csv <path.csv|xlsx>
  python -m src.basis_expert_council.question_bank import-dir <dir>
  python -m src.basis_expert_council.question_bank validate <path.json>
  python -m src.basis_expert_council.question_bank stats
  python -m src.basis_expert_council.question_bank export --subject math --grade G7 -o output.json
  python -m src.basis_expert_council.question_bank export-csv --subject math --grade G7 -o output.csv
"""

import argparse
import asyncio
import json
import sys


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="question_bank",
        description="BasisPilot 真题库管理工具",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # import
    p_import = sub.add_parser("import", help="导入 JSON 文件")
    p_import.add_argument("path", help="JSON 文件路径")
    p_import.add_argument("--by", default=None, help="导入人")
    p_import.add_argument("--no-validate", action="store_true", help="跳过校验")

    # import-csv
    p_csv = sub.add_parser("import-csv", help="导入 CSV/Excel 文件")
    p_csv.add_argument("path", help="CSV/Excel 文件路径")
    p_csv.add_argument("--by", default=None, help="导入人")

    # import-dir
    p_dir = sub.add_parser("import-dir", help="递归导入目录下所有 JSON 文件")
    p_dir.add_argument("path", help="目录路径")
    p_dir.add_argument("--by", default=None, help="导入人")

    # validate
    p_val = sub.add_parser("validate", help="校验 JSON 文件（不导入）")
    p_val.add_argument("path", help="JSON 文件路径")

    # stats
    sub.add_parser("stats", help="题库统计")

    # export
    p_export = sub.add_parser("export", help="导出为 JSON")
    p_export.add_argument("--subject", default=None)
    p_export.add_argument("--grade", default=None)
    p_export.add_argument("--status", default=None)
    p_export.add_argument("-o", "--output", default=None, help="输出文件路径")

    # export-csv
    p_exportc = sub.add_parser("export-csv", help="导出为 CSV")
    p_exportc.add_argument("--subject", default=None)
    p_exportc.add_argument("--grade", default=None)
    p_exportc.add_argument("--status", default=None)
    p_exportc.add_argument("-o", "--output", default=None, help="输出文件路径")

    return parser


async def cmd_import(args):
    from .importer import import_questions, load_json_file

    batch_meta, questions = load_json_file(args.path)
    print(f"读取 {len(questions)} 道题目, batch: {batch_meta.get('batch_name')}")
    result = await import_questions(
        questions, batch_meta,
        imported_by=args.by,
        validate=not args.no_validate,
    )
    if result["errors"]:
        print(f"导入失败! {len(result['errors'])} 个错误:")
        for e in result["errors"]:
            print(f"  - {e}")
        sys.exit(1)
    print(f"成功导入 {result['imported']} 道题目 (batch_id={result['batch_id']})")
    if result["warnings"]:
        print(f"  警告 ({len(result['warnings'])}):")
        for w in result["warnings"]:
            print(f"  - {w}")


async def cmd_import_csv(args):
    from .importer import import_questions, load_csv_file

    batch_meta, questions = load_csv_file(args.path)
    print(f"读取 {len(questions)} 道题目 from {args.path}")
    result = await import_questions(questions, batch_meta, imported_by=args.by)
    if result["errors"]:
        print(f"导入失败! {len(result['errors'])} 个错误:")
        for e in result["errors"]:
            print(f"  - {e}")
        sys.exit(1)
    print(f"成功导入 {result['imported']} 道题目 (batch_id={result['batch_id']})")


async def cmd_import_dir(args):
    from .importer import import_questions, load_json_file, scan_directory

    files = scan_directory(args.path, suffix=".json")
    if not files:
        print(f"目录 {args.path} 下未找到 JSON 文件")
        sys.exit(1)

    print(f"扫描到 {len(files)} 个 JSON 文件")
    total_imported = 0
    for f in files:
        try:
            batch_meta, questions = load_json_file(f)
            result = await import_questions(questions, batch_meta, imported_by=args.by)
            if result["errors"]:
                print(f"  FAIL {f.name}: {result['errors'][0]}")
            else:
                total_imported += result["imported"]
                print(f"  OK   {f.name}: +{result['imported']}")
        except Exception as e:
            print(f"  ERR  {f.name}: {e}")

    print(f"\n总计导入 {total_imported} 道题目")


async def cmd_validate(args):
    from .importer import load_json_file
    from .validator import validate_batch

    _, questions = load_json_file(args.path)
    result = validate_batch(questions)
    if result.valid:
        print(f"校验通过! {len(questions)} 道题目全部合格")
    else:
        print(f"校验失败! {len(result.errors)} 个错误:")
        for e in result.errors:
            print(f"  - {e}")
    if result.warnings:
        print(f"警告 ({len(result.warnings)}):")
        for w in result.warnings:
            print(f"  - {w}")
    sys.exit(0 if result.valid else 1)


async def cmd_stats(_args):
    from .stats import get_stats_report

    report = await get_stats_report()
    print(report)


async def cmd_export(args):
    from .exporter import export_json

    json_str = await export_json(
        subject=args.subject,
        grade_level=args.grade,
        review_status=args.status,
        output_path=args.output,
    )
    if args.output:
        print(f"已导出到 {args.output}")
    else:
        print(json_str)


async def cmd_export_csv(args):
    from .exporter import export_csv

    csv_str = await export_csv(
        subject=args.subject,
        grade_level=args.grade,
        review_status=args.status,
        output_path=args.output,
    )
    if args.output:
        print(f"已导出到 {args.output}")
    else:
        print(csv_str)


async def main_async():
    parser = build_parser()
    args = parser.parse_args()

    # Ensure DB pool is ready
    from .. import db
    await db.init_schema()

    handlers = {
        "import": cmd_import,
        "import-csv": cmd_import_csv,
        "import-dir": cmd_import_dir,
        "validate": cmd_validate,
        "stats": cmd_stats,
        "export": cmd_export,
        "export-csv": cmd_export_csv,
    }
    handler = handlers.get(args.command)
    if handler:
        try:
            await handler(args)
        finally:
            await db.close_pool()
    else:
        parser.print_help()


def main():
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
