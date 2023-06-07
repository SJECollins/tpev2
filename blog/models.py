from django.db import models
from django.contrib.auth.models import User
from likes.models import Like

STATUS = ((0, "Draft"), (1, "Published"))


class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=140)
    content = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=STATUS, default=0)
    image = models.ImageField(
        upload_to="images/", blank=True, default="../default_post_o1dtak.jpg"
    )

    class Meta:
        ordering = ["-added_on"]

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-added_on"]

    def __str__(self):
        return self.owner.username


class PostLike(Like):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-added_on"]
        unique_together = ["owner", "post"]

    def __str__(self):
        return self.owner + " " + self.post.title


class CommentLike(Like):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-added_on"]
        unique_together = ["owner", "comment"]

    def __str__(self):
        return self.owner + " " + self.comment
