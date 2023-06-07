from django.db import models
from django.contrib.auth.models import User
from ads.models import Ad


class Message(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_DEFAULT,
        default="deleted user",
        related_name="sender",
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.SET_DEFAULT,
        default="deleted user",
        related_name="recipient",
    )
    parent = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="next"
    )
    subject = models.ForeignKey(
        Ad, on_delete=models.SET_NULL, null=True, blank=True, default="No Subject"
    )
    content = models.TextField()
    sent = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    trashed = models.BooleanField(default=False)
    trashed_on = models.DateTimeField(auto_now=True)

    def new(self):
        if self.read:
            return False
        return True

    def has_replied(self):
        if self.replied:
            return True
        return False

    def __str__(self):
        return self.subject.title

    class Meta:
        ordering = ["-sent"]
        verbose_name_plural = "messages"
