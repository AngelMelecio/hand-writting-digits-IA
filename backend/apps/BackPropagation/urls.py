from django.urls import path
from apps.BackPropagation.api import \
    backPropagation_api_view, \
    trainings_api_view, \
    predict_api_view

urlpatterns = [
    path('train/', backPropagation_api_view, name='backPropagations_api'),
    path('trainings/', trainings_api_view, name='backPropagations_detail_api'),
    path('predict', predict_api_view, name='predict_api')
]