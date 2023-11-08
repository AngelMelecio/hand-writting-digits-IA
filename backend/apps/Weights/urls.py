from django.urls import path
from apps.Weights.api import weights_api_view,weights_detail_api_view

urlpatterns = [
    path('weightss/', weights_api_view, name='weightss_api'),
    path('weightss/<int:pk>', weights_detail_api_view, name='weights_detail_api_view'),
]