# Generated by Django 4.2.7 on 2023-11-24 02:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BackPropagation', '0003_backpropagation_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='backpropagation',
            name='classA',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backpropagation',
            name='classB',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
