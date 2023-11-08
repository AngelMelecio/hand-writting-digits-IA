from rest_framework import serializers
 
from apps.BackPropagation.models import BackPropagation
 

class BackPropagationSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = BackPropagation
        fields = '__all__'