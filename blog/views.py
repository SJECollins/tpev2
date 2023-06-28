from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from plant_exchange.permissions import IsOwnerOrReadOnly
from .models import Post, Comment, PostLike, CommentLike
from .serializers import (
    PostSerializer,
    CommentSerializer,
    CommentDetailSerializer,
    PostLikeSerializer,
    CommentLikeSerializer,
)


class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = (
        Post.objects.filter(status=1)
        .annotate(
            likes_count=Count("postlike", distinct=True),
            comments_count=Count("comment", distinct=True),
        )
        .order_by("-added_on")
    )
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = ["postlike__owner__profile", "owner__profile", "owner"]
    search_fields = [
        "owner__username",
        "title",
        "content",
    ]
    ordering_fields = [
        "likes_count",
        "comment_count",
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.annotate(
        likes_count=Count("postlike", distinct=True),
        comments_count=Count("comment", distinct=True),
    ).order_by("-added_on")


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.annotate(
        likes_count=Count("commentlike", distinct=True)
    ).order_by("-added_on")
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["post"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()


class PostLikeList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = PostLikeSerializer
    queryset = PostLike.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostLikeDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = PostLikeSerializer
    queryset = PostLike.objects.all()


class CommentLikeList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentLikeSerializer
    queryset = CommentLike.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentLikeDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentLikeSerializer
    queryset = CommentLike.objects.all()
