from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from plant_exchange.permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from .models import Ad, Watch, Category, AdImage, Messaged
from .serializers import (
    WatchSerializer,
    AdSerializer,
    CategorySerializer,
    AdImageSerializer,
    MessagedSerializer,
)


class CategoryList(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()


class AdList(generics.ListCreateAPIView):
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Ad.objects.all().order_by("-updated_on")
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ["owner__profile", "category", "owner"]
    search_fields = ["owner__username", "title", "description", "trade_for"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AdImageList(generics.ListAPIView):
    serializer_class = AdImageSerializer
    queryset = AdImage.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["ad"]


class AdImageDetail(generics.DestroyAPIView):
    serializer_class = AdImageSerializer
    queryset = AdImage.objects.all()


class AdDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Ad.objects.all().order_by("-updated_on")


class MessagedList(generics.ListCreateAPIView):
    serializer_class = MessagedSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Messaged.objects.filter(ad__status="Available")

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class WatchList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Watch.objects.filter(ad__status="Available")
    serializer_class = WatchSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class WatchDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Watch.objects.filter(ad__status="Available")
    serializer_class = WatchSerializer
