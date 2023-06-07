from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import cloudinary

STATUS = (("Available", "Available"), ("Taken", "Taken"))


class Category(models.Model):
    """
    Category model for admin use.
    Provide categories for users to select when uploading ads.
    """

    name = models.CharField(max_length=80)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Ad(models.Model):
    """
    Ad model for user use.
    Title, description and status required.
    Default image provided.
    Default trade for open to anything.
    """

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default="none")
    title = models.CharField(max_length=40)
    description = models.TextField()
    trade_for = models.CharField(max_length=140, default="Open to any trades.")
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    status = models.CharField(choices=STATUS, max_length=10, default="Available")
    image = models.ImageField(
        upload_to="images/", default="../default_plant_xc6ngh.png"
    )

    class Meta:
        ordering = ["-added_on"]
        get_latest_by = ["added_on"]

    def __str__(self):
        return self.title


class AdImage(models.Model):
    """
    Additional image model for ads.
    For users to add extra images if required.
    """

    ad = models.ForeignKey(Ad, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="images/", blank=True, null=True)

    def __str__(self):
        return self.ad.title


class Messaged(models.Model):
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    sent_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-sent_on"]
        unique_together = ["ad", "sender"]

    def __str__(self):
        return self.ad.title


class Watch(models.Model):
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-added_on"]
        unique_together = ["ad", "owner"]

    def __str__(self):
        return self.ad.title
