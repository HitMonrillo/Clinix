import os
import json
import base64
from typing import Optional

import gspread
from backend.utils.logging import get_logger
from backend.utils.retry import retry


logger = get_logger(__name__)


def get_gspread_client() -> gspread.Client:
    """
    Create a gspread client using environment-provided credentials.

    Supports the following env vars (checked in order):
    - GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: base64-encoded JSON key
    - GOOGLE_SERVICE_ACCOUNT_JSON: raw JSON string
    - GOOGLE_APPLICATION_CREDENTIALS: filesystem path to JSON key
    Falls back to default ADC if none are provided.
    """
    b64 = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
    if b64:
        data = json.loads(base64.b64decode(b64).decode("utf-8"))
        return retry(lambda: gspread.service_account_from_dict(data))

    raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if raw:
        data = json.loads(raw)
        return retry(lambda: gspread.service_account_from_dict(data))

    path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if path:
        return retry(lambda: gspread.service_account(filename=path))

    # Last resort: attempt default creds (may fail if not configured)
    return retry(lambda: gspread.service_account())


def load_sheet_records(spreadsheet_name: str, worksheet_title: Optional[str] = None):
    """
    Load all records from a Google Sheet.
    - spreadsheet_name: name of the spreadsheet to open
    - worksheet_title: optional worksheet name; defaults to first sheet
    """
    gc = get_gspread_client()
    logger.info(f"Opening spreadsheet: {spreadsheet_name} (worksheet={worksheet_title or 'sheet1'})")
    sh = retry(lambda: gc.open(spreadsheet_name))
    ws = retry(lambda: sh.worksheet(worksheet_title)) if worksheet_title else sh.sheet1
    return retry(lambda: ws.get_all_records())
