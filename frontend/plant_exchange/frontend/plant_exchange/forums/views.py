from django.db.models import Count, Max
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from plant_exchange.permissions import IsOwnerOrReadOnly
from .models import Forum, Discussion, Reply, ReplyLike, Follow
from .serializers import (
    ForumSerializer,
    DiscussionSerializer,
    ReplySerializer,
    ReplyDetailSerializer,
    ReplyLikeSerializer,
    FollowSerializer,
)


class ForumList(generics.ListAPIView):
    serializer_class = ForumSerializer
    queryset = Forum.objects.annotate(
        discussions_count=Count("discussion", distinct=True)
    ).order_by("order")


class ForumDetail(generics.RetrieveAPIView):
    serializer_class = ForumSerializer
    queryset = Forum.objects.annotate(
        discussions_count=Count("discussion", distinct=True)
    ).order_by("order")


class DiscussionList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = DiscussionSerializer
    queryset = Discussion.objects.annotate(
        replies_count=Count("reply", distinct=True)
    ).order_by("-last_reply")
    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = ["owner__profile"]
    search_fields = ["owner__username", "title" "description"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DiscussionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = DiscussionSerializer
    queryset = Discussion.objects.annotate(
        replies_count=Count("reply", distinct=True)
    ).order_by("-last_reply")


class FollowList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FollowDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()


class ReplyList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["discussion"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ReplyDetailSerializer
    queryset = Reply.objects.all()


class ReplyLikeList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReplyLikeSerializer
    queryset = ReplyLike.objects.all()


class ReplyLikeDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ReplySerializer
    queryset = ReplyLike.objects.all()
