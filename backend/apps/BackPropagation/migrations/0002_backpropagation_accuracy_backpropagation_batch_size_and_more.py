# Generated by Django 4.2.7 on 2023-11-07 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BackPropagation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='backpropagation',
            name='accuracy',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='batch_size',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='epochs',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='input_size',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='learning_rate',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='training_percentage',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
