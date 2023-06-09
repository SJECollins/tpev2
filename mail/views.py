from django.db.models import Q
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from ads.models import Ad
from .models import Message
from .serializers import MessageSerializer


class InboxView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(
            recipient=self.request.user, trashed=False
        ).order_by("-sent")


class SentView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(sender=self.request.user, trashed=False).order_by(
            "-sent"
        )


class TrashView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(
            trashed=True, recipient=self.request.user
        ).order_by("-trashed_on")


class Messages(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["subject"]

    def get_queryset(self):
        user = self.request.user
        queryset = Message.objects.filter(Q(sender=user) | Q(recipient=user))
        queryset = queryset.filter(Q(parent__isnull=True) | Q(parent__in=queryset))
        queryset = queryset.select_related("sender", "recipient")
        queryset = queryset.prefetch_related("sender__profile", "recipient__profile")

        return queryset

    def create(self, request, *args, **kwargs):
        sender = request.user
        recipient = request.data.get("recipient")
        parent_id = request.data.get("parent")
        subject = request.data.get("subject")
        content = request.data.get("content", "")

        if parent_id:
            parent = Message.objects.get(id=parent_id)
            parent.replied = True
            parent.save()
            ad = Ad.objects.get(title=subject)
            if parent.sender == sender or parent.recipient == sender:
                message = Message.objects.create(
                    sender=sender,
                    recipient=parent.sender,
                    parent=parent,
                    subject=ad,
                    content=content,
                )
                serializer = MessageSerializer(message, context={"request": request})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"detail": "You do not have permission to reply to this message."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            recipient_user = User.objects.get(id=recipient)
            subject_id = Ad.objects.get(id=subject)
            message = Message.objects.create(
                sender=sender,
                recipient=recipient_user,
                subject=subject_id,
                content=content,
            )
            serializer = MessageSerializer(message, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageDetail(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(
            recipient=self.request.user, trashed=False
        ).order_by("-sent")
