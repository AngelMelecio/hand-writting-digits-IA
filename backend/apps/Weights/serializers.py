from rest_framework import serializers
 
from apps.Weights.models import Weights
 

class WeightsSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Weights
        fields = '__all__'