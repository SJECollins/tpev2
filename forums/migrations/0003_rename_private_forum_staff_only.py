# Generated by Django 4.2 on 2023-06-13 15:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0002_alter_discussion_options_discussion_last_reply_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='forum',
            old_name='private',
            new_name='staff_only',
        ),
    ]
