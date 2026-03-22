from rest_framework import serializers
from .models import Pair, DiaryEntry, Reaction, PresenceStatus, ChatMessage


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Reaction
        fields = ["id", "entry_id", "reactor_name", "emoji", "created_at"]
        read_only_fields = ["id", "created_at"]


class DiaryEntrySerializer(serializers.ModelSerializer):
    reactions        = ReactionSerializer(many=True, read_only=True)
    reaction_summary = serializers.SerializerMethodField()

    class Meta:
        model  = DiaryEntry
        fields = [
            "id", "pair_id", "author_name", "content",
            "mood_emoji", "is_favourite", "photo",
            "created_at", "updated_at",
            "reactions", "reaction_summary",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_reaction_summary(self, obj):
        result = {}
        for r in obj.reactions.all():
            result[r.emoji] = result.get(r.emoji, 0) + 1
        return result


class DiaryEntryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DiaryEntry
        fields = ["pair", "author_name", "content", "mood_emoji", "is_favourite", "photo"]


class PairSerializer(serializers.ModelSerializer):
    entry_count = serializers.SerializerMethodField()

    class Meta:
        model  = Pair
        fields = ["id", "room_code", "member_one", "member_two", "created_at", "entry_count"]
        read_only_fields = ["id", "room_code", "created_at"]

    def get_entry_count(self, obj):
        return obj.entries.count()


class PresenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PresenceStatus
        fields = ["member_name", "vibe_emoji", "vibe_text",
                  "is_online", "timezone_name", "last_seen"]
        read_only_fields = ["last_seen"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ChatMessage
        fields = ["id", "pair_id", "sender_name", "text", "created_at"]
        read_only_fields = ["id", "created_at"]
