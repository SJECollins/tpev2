# Generated by Django 4.2 on 2023-05-23 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_profile_birthday'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, default='../default_avatar_zf68aj.png', upload_to='images/'),
        ),
    ]