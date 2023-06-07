# Generated by Django 4.2 on 2023-05-18 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ads', '0005_alter_ad_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ad',
            name='status',
            field=models.CharField(choices=[('Available', 'Available'), ('Taken', 'Taken')], default='Available', max_length=10),
        ),
    ]
