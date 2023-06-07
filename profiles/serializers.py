from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    ad_count = serializers.ReadOnlyField()
    post_count = serializers.ReadOnlyField()
    reply_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context["request"]
        return request.user == obj.owner

    class Meta:
        model = Profile
        fields = [
            "id",
            "owner",
            "first_name",
            "last_name",
            "location",
            "bio",
            "interested_in",
            "avatar",
            "joined_on",
            "is_owner",
            "ad_count",
            "reply_count",
            "post_count",
        ]
