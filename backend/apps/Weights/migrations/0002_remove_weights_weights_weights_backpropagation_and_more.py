# Generated by Django 4.2.7 on 2023-11-07 23:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('BackPropagation', '0002_backpropagation_accuracy_backpropagation_batch_size_and_more'),
        ('Weights', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='weights',
            name='weights',
        ),
        migrations.AddField(
            model_name='weights',
            name='backPropagation',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='BackPropagation.backpropagation'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='weights',
            name='hiden_bias',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='weights',
            name='hiden_weights',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='weights',
            name='output_bias',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='weights',
            name='output_weights',
            field=models.JSONField(blank=True, null=True),
        ),
    ]