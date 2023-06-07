from django.urls import path
from . import views


urlpatterns = [
    path("blog/", views.PostList.as_view()),
    path("post/<int:pk>/", views.PostDetail.as_view()),
    path("comments/", views.CommentList.as_view()),
    path("comment/<int:pk>/", views.CommentDetail.as_view()),
    path("post-likes/", views.PostLikeList.as_view()),
    path("post-like/<int:pk>/", views.PostLikeDetail.as_view()),
    path("comment-likes/", views.CommentLikeList.as_view()),
    path("comment-like/<int:pk>/", views.CommentLikeDetail.as_view()),
]
