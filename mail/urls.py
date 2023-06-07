from django.urls import path
from . import views


urlpatterns = [
    path("inbox/", views.InboxView.as_view()),
    path("sent/", views.SentView.as_view()),
    path("trash/", views.TrashView.as_view()),
    path("messages/", views.Messages.as_view()),
    path("message/<int:pk>/", views.MessageDetail.as_view()),
]
