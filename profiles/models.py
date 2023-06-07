from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=20, null=True, blank=True)
    last_name = models.CharField(max_length=20, null=True, blank=True)
    location = models.CharField(max_length=40, null=True, blank=True, default="Private")
    bio = models.TextField(null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    interested_in = models.CharField(
        max_length=140, null=True, blank=True, default="All plants"
    )
    avatar = models.ImageField(
        upload_to="images/", blank=True, default="../default_avatar_zf68aj.png"
    )
    joined_on = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-joined_on"]

    def __str__(self):
        return f"{self.owner.username}'s Profile"


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(owner=instance)
