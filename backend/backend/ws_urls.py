from django.urls import re_path

from apps.BackPropagation.consumer import BackPropConsumer

websocket_urlpatterns = [
    re_path(r'ws/back_prop/$', BackPropConsumer.as_asgi()),
]