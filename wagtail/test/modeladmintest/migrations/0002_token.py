# Generated by Django 1.9.7 on 2016-06-07 11:22
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("modeladmintest", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Token",
            fields=[
                (
                    "key",
                    models.CharField(max_length=40, primary_key=True, serialize=False),
                ),
            ],
        ),
    ]
