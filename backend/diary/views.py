import random as pyrandom
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Pair, DiaryEntry, Reaction, PresenceStatus, ChatMessage, generate_room_code
from .serializers import (
    PairSerializer, DiaryEntrySerializer, DiaryEntryWriteSerializer,
    ReactionSerializer, PresenceSerializer, ChatMessageSerializer,
)


class CreateRoomView(APIView):
    def post(self, request):
        name       = request.data.get("author_name", "").strip()
        passphrase = request.data.get("passphrase", "").strip() or None
        if not name:
            return Response({"error": "author_name is required."}, status=400)
        pair = Pair.objects.create(room_code=generate_room_code(), passphrase=passphrase, member_one=name)
        PresenceStatus.objects.create(pair=pair, member_name=name, is_online=True)
        return Response({"pair": PairSerializer(pair).data, "author_name": name}, status=201)


class JoinRoomView(APIView):
    def post(self, request, room_code):
        name       = request.data.get("author_name", "").strip()
        passphrase = request.data.get("passphrase", "").strip() or None
        if not name:
            return Response({"error": "author_name is required."}, status=400)
        pair = get_object_or_404(Pair, room_code=room_code)
        if pair.passphrase and passphrase != pair.passphrase:
            return Response({"error": "Incorrect passphrase."}, status=403)
        if not pair.add_member(name):
            return Response({"error": "Room is full."}, status=409)
        PresenceStatus.objects.update_or_create(pair=pair, member_name=name, defaults={"is_online": True})
        return Response({"pair": PairSerializer(pair).data, "author_name": name})


class RoomDetailView(APIView):
    def get(self, request, room_code):
        pair = get_object_or_404(Pair, room_code=room_code)
        return Response({
            "pair":      PairSerializer(pair).data,
            "presences": PresenceSerializer(PresenceStatus.objects.filter(pair=pair), many=True).data,
        })


class EntryListCreateView(APIView):
    def get(self, request, room_code):
        pair    = get_object_or_404(Pair, room_code=room_code)
        entries = pair.entries.prefetch_related("reactions").all()
        if request.query_params.get("favourite") == "true":
            entries = entries.filter(is_favourite=True)
        return Response(DiaryEntrySerializer(entries, many=True).data)

    def post(self, request, room_code):
        pair = get_object_or_404(Pair, room_code=room_code)
        data = request.data.copy()
        data["pair"] = pair.id
        s = DiaryEntryWriteSerializer(data=data)
        if s.is_valid():
            return Response(DiaryEntrySerializer(s.save()).data, status=201)
        return Response(s.errors, status=400)


class EntryDetailView(APIView):
    def patch(self, request, entry_id):
        entry  = get_object_or_404(DiaryEntry, id=entry_id)
        author = request.data.get("author_name", "").strip()
        if author and author != entry.author_name:
            return Response({"error": "You can only edit your own entries."}, status=403)
        for f in ("content", "mood_emoji", "is_favourite", "photo"):
            if f in request.data:
                setattr(entry, f, request.data[f])
        entry.save()
        return Response(DiaryEntrySerializer(entry).data)

    def delete(self, request, entry_id):
        entry  = get_object_or_404(DiaryEntry, id=entry_id)
        author = request.data.get("author_name", "").strip()
        if author and author != entry.author_name:
            return Response({"error": "You can only delete your own entries."}, status=403)
        entry.delete()
        return Response(status=204)


class FavouriteToggleView(APIView):
    def post(self, request, entry_id):
        entry = get_object_or_404(DiaryEntry, id=entry_id)
        entry.is_favourite = not entry.is_favourite
        entry.save(update_fields=["is_favourite"])
        return Response({"is_favourite": entry.is_favourite})


class MemoriesView(APIView):
    def get(self, request, room_code):
        pair  = get_object_or_404(Pair, room_code=room_code)
        today = timezone.localdate()
        mems  = DiaryEntry.objects.filter(
            pair=pair,
            created_at__month=today.month,
            created_at__day=today.day,
        ).exclude(created_at__year=today.year).prefetch_related("reactions")
        return Response(DiaryEntrySerializer(mems, many=True).data)


class ReactionView(APIView):
    def post(self, request, entry_id):
        entry   = get_object_or_404(DiaryEntry, id=entry_id)
        reactor = request.data.get("reactor_name", "").strip()
        emoji   = request.data.get("emoji", "❤️")
        if not reactor:
            return Response({"error": "reactor_name is required."}, status=400)
        if reactor == entry.author_name:
            return Response({"error": "Cannot react to your own entry."}, status=400)
        reaction, created = Reaction.objects.get_or_create(entry=entry, reactor_name=reactor, emoji=emoji)
        if not created:
            reaction.delete()
            return Response({"action": "removed", "emoji": emoji})
        return Response({"action": "added", "emoji": emoji}, status=201)


class PresenceView(APIView):
    def get(self, request, room_code):
        pair = get_object_or_404(Pair, room_code=room_code)
        return Response(PresenceSerializer(PresenceStatus.objects.filter(pair=pair), many=True).data)

    def patch(self, request, room_code):
        pair = get_object_or_404(Pair, room_code=room_code)
        name = request.data.get("member_name", "").strip()
        if not name:
            return Response({"error": "member_name is required."}, status=400)
        presence, _ = PresenceStatus.objects.get_or_create(pair=pair, member_name=name)
        for f in ("vibe_emoji", "vibe_text", "is_online", "timezone_name"):
            if f in request.data:
                setattr(presence, f, request.data[f])
        presence.save()
        return Response(PresenceSerializer(presence).data)


class ChatListCreateView(APIView):
    def get(self, request, room_code):
        pair     = get_object_or_404(Pair, room_code=room_code)
        messages = ChatMessage.objects.filter(pair=pair)
        after_id = request.query_params.get("after")
        if after_id:
            try:
                messages = messages.filter(id__gt=int(after_id))
            except ValueError:
                pass
        return Response(ChatMessageSerializer(messages.order_by("created_at")[:100], many=True).data)

    def post(self, request, room_code):
        pair   = get_object_or_404(Pair, room_code=room_code)
        sender = request.data.get("sender_name", "").strip()
        text   = request.data.get("text", "").strip()
        if not sender:
            return Response({"error": "sender_name is required."}, status=400)
        if not text:
            return Response({"error": "text is required."}, status=400)
        if len(text) > 1000:
            return Response({"error": "Message too long."}, status=400)
        msg = ChatMessage.objects.create(pair=pair, sender_name=sender, text=text)
        return Response(ChatMessageSerializer(msg).data, status=201)


DATE_IDEAS = [
    {"emoji":"🎬","title":"Watch Party",      "desc":"Sync a movie, pick the same snacks, watch together on a call.","tag":"Virtual"},
    {"emoji":"🍳","title":"Cook Together",     "desc":"Pick a recipe, cook simultaneously, have dinner on video call.","tag":"Virtual"},
    {"emoji":"🌙","title":"Midnight Entry",    "desc":"Write diary entries simultaneously at midnight, then read each other's.","tag":"Virtual"},
    {"emoji":"✈️","title":"Plan the Reunion",  "desc":"Write about your next meeting in detail.","tag":"Future"},
    {"emoji":"📦","title":"Virtual Gift",      "desc":"Leave a poem, playlist, or doodle in the diary for them to find.","tag":"Gift"},
    {"emoji":"📸","title":"Photo of Your Day", "desc":"Both take one meaningful photo and attach it to a shared entry.","tag":"Virtual"},
    {"emoji":"🎮","title":"Play Together",     "desc":"Play Skribbl, Chess.com, or Among Us while on a video call.","tag":"Virtual"},
    {"emoji":"🎵","title":"Playlist for You",  "desc":"Curate 10 songs that describe how you feel about them right now.","tag":"Gift"},
    {"emoji":"📖","title":"Read Together",     "desc":"Pick the same chapter, read it, then discuss it in your diary.","tag":"Virtual"},
    {"emoji":"🌅","title":"Good Morning Note", "desc":"Write a diary entry tonight so they wake up to your words.","tag":"Virtual"},
    {"emoji":"🗺️","title":"Dream Trip",        "desc":"Write about your perfect trip together every single detail.","tag":"Future"},
    {"emoji":"💌","title":"Write a Letter",    "desc":"A long-form diary entry as a letter everything you want to say.","tag":"Gift"},
]


class DateIdeasView(APIView):
    def get(self, request):
        n     = request.query_params.get("random")
        ideas = pyrandom.sample(DATE_IDEAS, min(int(n), len(DATE_IDEAS))) if n else DATE_IDEAS
        return Response(ideas)


class MoodChoicesView(APIView):
    def get(self, request):
        return Response([{"emoji": e, "label": l} for e, l in DiaryEntry.MOOD_CHOICES])
