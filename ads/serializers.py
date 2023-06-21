from django.db import IntegrityError
from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Ad, AdImage, Watch, Category, Messaged


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AdImageSerializer(serializers.ModelSerializer):
    """
    Serializer for extra image model.
    """

    def validate_image(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Image size larger than 2MB!")
        if value.image.height > 4096:
            raise serializers.ValidationError("Image height larger than 4096px!")
        if value.image.width > 4096:
            raise serializers.ValidationError("Image width larger than 4096px!")
        return value

    class Meta:
        model = AdImage
        fields = [
            "id",
            "ad",
            "image",
        ]


class AdSerializer(serializers.ModelSerializer):
    """
    Ad serializer.
    Validates uploaded images.
    Extra fields for owner, profile details, extra images.
    Returns natural time for added and updated fields.
    """

    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    added_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    profile_image = serializers.ReadOnlyField(source="owner.profile.avatar.url")
    messaged_id = serializers.SerializerMethodField()
    watching_id = serializers.SerializerMethodField()
    watching_count = serializers.ReadOnlyField()
    gallery = AdImageSerializer(many=True, read_only=True)
    extra_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        max_length=4,
        required=False,
    )

    def validate_image(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Image size larger than 2MB!")
        if value.image.height > 4096:
            raise serializers.ValidationError("Image height larger than 4096px!")
        if value.image.width > 4096:
            raise serializers.ValidationError("Image width larger than 4096px!")
        return value

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.user == obj.owner

    def get_added_on(self, obj):
        return naturaltime(obj.added_on)

    def get_updated_on(self, obj):
        return naturaltime(obj.updated_on)

    def get_messaged_id(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            messaged = Messaged.objects.filter(sender=user, ad=obj).first()
            return messaged.id if messaged else None
        return None

    def get_watching_id(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            watching = Watch.objects.filter(owner=user, ad=obj).first()
            return watching.id if watching else None
        return None

    class Meta:
        model = Ad
        fields = [
            "id",
            "owner",
            "is_owner",
            "profile_id",
            "profile_image",
            "category",
            "title",
            "description",
            "trade_for",
            "added_on",
            "updated_on",
            "status",
            "image",
            "watching_id",
            "watching_count",
            "gallery",
            "extra_images",
            "messaged_id",
        ]

    def create(self, validated_data):
        if validated_data.get("extra_images") is not None:
            extra_images = validated_data.pop("extra_images")
            for image in extra_images:
                AdImage.objects.create(ad=ad, image=image)
        ad = Ad.objects.create(**validated_data)
        return ad

    def update(self, instance, validated_data):
        if validated_data.get("extra_images") is not None:
            new_images = validated_data.pop("extra_images")
            for image in new_images:
                AdImage.objects.create(ad=instance, image=image)
        instance.title = validated_data.get("title", instance.title)
        instance.category = validated_data.get("category", instance.category)
        instance.description = validated_data.get("description", instance.description)
        instance.trade_for = validated_data.get("trade_for", instance.trade_for)
        instance.status = validated_data.get("status", instance.status)
        instance.image = validated_data.get("image", instance.image)
        instance.save()

        return instance


class MessagedSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    ad_title = serializers.ReadOnlyField(source="ad.title")

    class Meta:
        model = Messaged
        fields = ["id", "ad", "sender", "sent_on", "ad_title"]

    def validate_ad(self, ad):
        if ad.status != "Available":
            raise serializers.ValidationError({"detail": "plant not available"})
        return ad

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})


class WatchSerializer(serializers.ModelSerializer):
    watcher = serializers.ReadOnlyField(source="owner.username")
    owner = serializers.ReadOnlyField(source="owner.username")
    ad_title = serializers.ReadOnlyField(source="ad.title")

    class Meta:
        model = Watch
        fields = ["id", "owner", "watcher", "added_on", "ad", "ad_title"]

    def validate_ad(self, ad):
        if ad.status != "Available":
            raise serializers.ValidationError({"detail": "plant not available"})
        return ad

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "possible duplicate"})
