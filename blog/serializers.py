from django.db import IntegrityError
from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Post, Comment, PostLike, CommentLike


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    profile_image = serializers.ReadOnlyField(source="owner.profile.avatar.url")
    added_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.user == obj.owner

    def get_added_on(self, obj):
        return naturaltime(obj.added_on)

    def get_updated_on(self, obj):
        return naturaltime(obj.updated_on)

    def get_like_id(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            like = PostLike.objects.filter(owner=user, post=obj).first()
            return like.id if like else None
        return None

    class Meta:
        model = Post
        fields = [
            "id",
            "owner",
            "is_owner",
            "profile_id",
            "profile_image",
            "title",
            "added_on",
            "updated_on",
            "image",
            "content",
            "like_id",
            "likes_count",
            "comments_count",
        ]


class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    profile_image = serializers.ReadOnlyField(source="owner.profile.avatar.url")
    added_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.user == obj.owner

    def get_added_on(self, obj):
        return naturaltime(obj.added_on)

    def get_updated_on(self, obj):
        return naturaltime(obj.updated_on)

    def get_like_id(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            like = CommentLike.objects.filter(owner=user, comment=obj).first()
            return like.id if like else None
        return None

    class Meta:
        model = Comment
        fields = [
            "id",
            "owner",
            "is_owner",
            "profile_id",
            "profile_image",
            "post",
            "added_on",
            "updated_on",
            "content",
            "like_id",
            "likes_count",
        ]


class CommentDetailSerializer(CommentSerializer):
    post = serializers.ReadOnlyField(source="post.id")


class PostLikeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = PostLike
        fields = ["id", "owner", "added_on", "post"]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})


class CommentLikeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = CommentLike
        fields = ["id", "owner", "added_on", "comment"]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})
