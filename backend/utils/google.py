import csv
from pathlib import Path

from backend.utils.logging import get_logger


BASE_DIR = Path(__file__).resolve().parents[2]
logger = get_logger(__name__)


def load_sheet_records(relative_path: str) -> list[dict]:
    """Load records from a CSV file located within the repository.

    The provided path can be absolute or relative to the project root.
    """
    csv_path = Path(relative_path)
    if not csv_path.is_absolute():
        csv_path = BASE_DIR / csv_path

    csv_path = csv_path.resolve()

    if not csv_path.is_file():
        raise FileNotFoundError(
            f"CSV file not found: {relative_path} (resolved to {csv_path})"
        )

    logger.info(f"Loading spreadsheet from CSV: {csv_path}")

    with csv_path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))