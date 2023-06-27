from django.db import models
from django.contrib.auth.models import User
from likes.models import Like


STATUS = ((0, "Private"), (1, "Open"))


class Forum(models.Model):
    """
    Forum model for admin use.
    Default to private so shouldn't be visible when first created.
    Can set ordering by order field
    """

    title = models.CharField(max_length=180)
    description = models.TextField()
    staff_only = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Discussion(models.Model):
    """
    Discussion model to add topics to forum.
    Order by the latest reply so more active topics to top.
    Last reply updated when new reply added to topic.
    """

    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=140)
    content = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    last_reply = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to="images/", null=True, blank=True)
    open = models.BooleanField(default=True)

    class Meta:
        ordering = ["-last_reply"]
        get_latest_by = ["added_on"]

    def __str__(self):
        return self.title


class Follow(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-added_on"]
        unique_together = ["owner", "discussion"]

    def __str__(self):
        return self.discussion.title


class Reply(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to="images/", null=True, blank=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ["added_on"]
        get_latest_by = ["added_on"]
        verbose_name_plural = "replies"

    def __str__(self):
        return self.content

    def save(self, *args, **kwargs):
        super(Reply, self).save(*args, **kwargs)
        self.discussion.last_reply = self.added_on
        self.discussion.save()


class ReplyLike(Like):
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-added_on"]
        unique_together = ["owner", "reply"]

    def __str__(self):
        return self.owner + " " + self.reply
