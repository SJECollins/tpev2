from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    is_sender = serializers.SerializerMethodField()
    sender_id = serializers.ReadOnlyField(source="sender.profile.id")
    sender_image = serializers.ReadOnlyField(source="sender.profile.avatar.url")
    recipient = serializers.ReadOnlyField(source="recipient.username")
    is_recipient = serializers.SerializerMethodField()
    recipient_id = serializers.ReadOnlyField(source="recipient.profile.id")
    recipient_image = serializers.ReadOnlyField(source="recipient.profile.avatar.url")
    subject = serializers.ReadOnlyField(source="subject.title")

    def get_is_sender(self, obj):
        request = self.context["request"]
        return request.user == obj.sender

    def get_is_recipient(self, obj):
        request = self.context["request"]
        return request.user == obj.recipient

    def get_sent(self, obj):
        return naturaltime(obj.sent)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "is_sender",
            "sender_id",
            "sender_image",
            "recipient",
            "is_recipient",
            "recipient_id",
            "recipient_image",
            "parent",
            "subject",
            "content",
            "sent",
            "read",
            "replied",
            "trashed",
            "trashed_on",
        ]
