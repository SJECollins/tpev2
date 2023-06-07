from django.urls import path
from . import views


urlpatterns = [
    path("categories/", views.CategoryList.as_view()),
    path("ads/", views.AdList.as_view()),
    path("ad/<int:pk>/", views.AdDetail.as_view()),
    path("watch-list/", views.WatchList.as_view()),
    path("watching/<int:pk>/", views.WatchDetail.as_view()),
    path("ad-images/", views.AdImageList.as_view()),
    path("ad-image/<int:pk>/", views.AdImageDetail.as_view()),
    path("ad-messaged/", views.MessagedList.as_view()),
]
