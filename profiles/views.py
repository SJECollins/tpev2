from django.db.models import Count
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from plant_exchange.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.annotate(
        ad_count=Count("owner__ad", distinct=True),
        post_count=Count("owner__post", distinct=True),
        reply_count=Count("owner__reply", distinct=True),
    ).order_by("-joined_on")
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = ["owner__watch__ad", "owner__follow__discussion"]
    ordering_fields = [
        "ad_count",
        "post_count",
        "reply_count",
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.annotate(
        ad_count=Count("owner__ad", distinct=True),
        post_count=Count("owner__post", distinct=True),
        reply_count=Count("owner__reply", distinct=True),
    ).order_by("-joined_on")
