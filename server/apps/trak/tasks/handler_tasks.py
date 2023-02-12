from celery import shared_task, states
from celery.exceptions import Ignore

from apps.trak.services import HandlerService


@shared_task(name="get handler", bind=True)
def get_handler(self, *, site_id: str, username: str) -> str:
    try:
        handler_service = HandlerService(username=username)
        handler = handler_service.pull_rcra_handler(site_id=site_id)
        return handler.epa_id
    except Exception as e:
        self.update_state(
            state=states.FAILURE,
            meta=f'Internal Error {e}'
        )
        raise Ignore()
