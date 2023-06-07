from django.db import models
from django.contrib.auth.models import User


class Like(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
