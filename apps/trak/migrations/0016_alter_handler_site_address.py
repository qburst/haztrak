# Generated by Django 4.0.4 on 2022-05-06 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0015_alter_handler_site_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='handler',
            name='site_address',
            field=models.JSONField(),
        ),
    ]
