# Generated by Django 4.2 on 2023-05-23 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_postlike_commentlike'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, default='../default_post_o1dtak.jpg', upload_to='images/'),
        ),
    ]
