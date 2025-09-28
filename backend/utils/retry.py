import time
from typing import Callable, Type, Tuple, Any


def retry(
    func: Callable[[], Any],
    attempts: int = 3,
    delay: float = 0.5,
    backoff: float = 2.0,
    retry_on: Tuple[Type[BaseException], ...] = (Exception,),
):
    last_exc = None
    for i in range(attempts):
        try:
            return func()
        except retry_on as exc:
            last_exc = exc
            if i == attempts - 1:
                break
            time.sleep(delay)
            delay *= backoff
    if last_exc:
        raise last_exc
    return None

