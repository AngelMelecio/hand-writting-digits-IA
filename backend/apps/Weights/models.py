from django.db import models

class Weights(models.Model):
    idWeights = models.AutoField(auto_created=True, primary_key=True)
    backPropagation = models.ForeignKey('BackPropagation.BackPropagation', on_delete=models.CASCADE, null=False, blank=False)
    hiden_weights = models.JSONField(null=True, blank=True)
    output_weights = models.JSONField(null=True, blank=True)
    hiden_bias = models.JSONField(null=True, blank=True)
    output_bias = models.JSONField(null=True, blank=True)