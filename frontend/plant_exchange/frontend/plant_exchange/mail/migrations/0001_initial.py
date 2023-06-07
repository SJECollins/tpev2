# Generated by Django 4.2 on 2023-04-13 18:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ads', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('sent', models.DateTimeField(auto_now_add=True)),
                ('read', models.BooleanField(default=False)),
                ('replied', models.BooleanField(default=False)),
                ('trashed', models.BooleanField(default=False)),
                ('trashed_on', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='next', to='mail.message')),
                ('recipient', models.ForeignKey(default='deleted user', on_delete=django.db.models.deletion.SET_DEFAULT, related_name='recipient', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(default='deleted user', on_delete=django.db.models.deletion.SET_DEFAULT, related_name='sender', to=settings.AUTH_USER_MODEL)),
                ('subject', models.ForeignKey(blank=True, default='No Subject', null=True, on_delete=django.db.models.deletion.SET_NULL, to='ads.ad')),
            ],
            options={
                'verbose_name_plural': 'messages',
                'ordering': ['-sent'],
            },
        ),
    ]
