from django.urls import path
from .views import (
    CreateRoomView, JoinRoomView, RoomDetailView,
    EntryListCreateView, EntryDetailView, FavouriteToggleView,
    MemoriesView, ReactionView, PresenceView,
    ChatListCreateView,
    DateIdeasView, MoodChoicesView,
)

urlpatterns = [
    path("rooms/",                           CreateRoomView.as_view()),
    path("rooms/<str:room_code>/",           RoomDetailView.as_view()),
    path("rooms/<str:room_code>/join/",      JoinRoomView.as_view()),
    path("entries/<str:room_code>/",         EntryListCreateView.as_view()),
    path("entry/<uuid:entry_id>/",           EntryDetailView.as_view()),
    path("entry/<uuid:entry_id>/favourite/", FavouriteToggleView.as_view()),
    path("memories/<str:room_code>/",        MemoriesView.as_view()),
    path("reactions/<uuid:entry_id>/",       ReactionView.as_view()),
    path("presence/<str:room_code>/",        PresenceView.as_view()),
    path("chat/<str:room_code>/",            ChatListCreateView.as_view()),
    path("dateideas/",                       DateIdeasView.as_view()),
    path("moods/",                           MoodChoicesView.as_view()),
]
