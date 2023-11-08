from django.urls import path
from apps.BackPropagation.api import backPropagation_api_view

urlpatterns = [
    path('train/', backPropagation_api_view, name='backPropagations_api')
]