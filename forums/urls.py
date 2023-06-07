from django.urls import path
from . import views


urlpatterns = [
    path("forums/", views.ForumList.as_view()),
    path("forum/<int:pk>/", views.ForumDetail.as_view()),
    path("discussions/", views.DiscussionList.as_view()),
    path("discussion/<int:pk>/", views.DiscussionDetail.as_view()),
    path("replies/", views.ReplyList.as_view()),
    path("reply/<int:pk>/", views.ReplyDetail.as_view()),
    path("reply-likes/", views.ReplyLikeList.as_view()),
    path("reply-like/<int:pk>/", views.ReplyLikeDetail.as_view()),
    path("follow-list/", views.FollowList.as_view()),
    path("following/<int:pk>/", views.FollowDetail.as_view()),
]
