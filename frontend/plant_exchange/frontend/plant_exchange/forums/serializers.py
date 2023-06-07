from django.db import IntegrityError
from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Forum, Discussion, Reply, ReplyLike, Follow


class ForumSerializer(serializers.ModelSerializer):
    discussions_count = serializers.ReadOnlyField()

    class Meta:
        model = Forum
        fields = [
            "id",
            "title",
            "description",
            "private",
            "order",
            "discussions_count",
        ]


class DiscussionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    profile_image = serializers.ReadOnlyField(source="owner.profile.avatar.url")
    replies_count = serializers.ReadOnlyField()
    added_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()

    def validate_image(self, value):
        if value.size > 1024 * 1024:
            raise serializers.ValidationError("Image size larger than 1MB!")
        if value.image.height > 2048:
            raise serializers.ValidationError("Image height larger than 2048px!")
        if value.image.width > 2048:
            raise serializers.ValidationError("Image width larger than 2048px!")
        return value

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.user == obj.owner

    def get_added_on(self, obj):
        return naturaltime(obj.added_on)

    def get_updated_on(self, obj):
        return naturaltime(obj.updated_on)

    class Meta:
        model = Discussion
        fields = [
            "id",
            "owner",
            "is_owner",
            "profile_id",
            "profile_image",
            "forum",
            "title",
            "content",
            "added_on",
            "updated_on",
            "image",
            "open",
            "replies_count",
        ]


class ReplySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    profile_image = serializers.ReadOnlyField(source="owner.profile.avatar.url")
    added_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField()

    def validate_image(self, value):
        if value.size > 1024 * 1024:
            raise serializers.ValidationError("Image size larger than 1MB!")
        if value.image.height > 2048:
            raise serializers.ValidationError("Image height larger than 2048px!")
        if value.image.width > 2048:
            raise serializers.ValidationError("Image width larger than 2048px!")
        return value

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.owner == obj.owner

    def get_added_on(self, obj):
        return naturaltime(obj.added_on)

    def get_updated_on(self, obj):
        return naturaltime(obj.updated_on)

    def get_like_id(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            like = ReplyLike.objects.filter(owner=user, reply=obj).first()
            return like.id if like else None
        return None

    class Meta:
        model = Reply
        fields = [
            "id",
            "owner",
            "is_owner",
            "profile_id",
            "profile_image",
            "discussion",
            "content",
            "added_on",
            "updated_on",
            "image",
            "deleted",
        ]


class ReplyDetailSerializer(ReplySerializer):
    discussion = serializers.ReadOnlyField(source="discussion.id")


class ReplyLikeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = ReplyLike
        fields = ["id", "owner", "added_on", "reply"]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})


class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source="owner.username")
    discussion_title = serializers.ReadOnlyField(source="discussion.title")

    class Meta:
        model = Follow
        fields = [
            "id",
            "owner",
            "follower",
            "discussion",
            "added_on",
            "discussion_title",
        ]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})
