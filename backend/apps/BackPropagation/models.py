from django.db import models

class BackPropagation(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    classA = models.IntegerField(null=True, blank=True)
    classB = models.IntegerField(null=True, blank=True)
    idBackPropagation = models.AutoField(auto_created=True, primary_key=True)
    epochs = models.IntegerField(null=True, blank=True)
    learning_rate = models.FloatField(null=True, blank=True)
    batch_size = models.IntegerField(null=True, blank=True)
    input_size = models.IntegerField(null=True, blank=True)
    training_percentage = models.FloatField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)