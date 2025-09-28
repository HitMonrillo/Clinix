import logging
import os
from typing import Optional


def get_logger(name: Optional[str] = None) -> logging.Logger:
    logger = logging.getLogger(name or "clinix")
    if not logger.handlers:
        level = os.getenv("LOG_LEVEL", "INFO").upper()
        logger.setLevel(level)
        handler = logging.StreamHandler()
        fmt = logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")
        handler.setFormatter(fmt)
        logger.addHandler(handler)
        logger.propagate = False
    return logger

