# Generated by Django 4.2.7 on 2023-11-24 01:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BackPropagation', '0002_backpropagation_accuracy_backpropagation_batch_size_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='backpropagation',
            name='date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
