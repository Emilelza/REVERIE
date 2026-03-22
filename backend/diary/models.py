from django.db import models
import uuid, random, string


def generate_room_code():
    while True:
        code = "".join(random.choices(string.digits, k=6))
        if not Pair.objects.filter(room_code=code).exists():
            return code


class Pair(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_code  = models.CharField(max_length=6, unique=True)
    passphrase = models.TextField(blank=True, null=True)
    member_one = models.CharField(max_length=50, blank=True, default="")
    member_two = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Room {self.room_code}"

    def has_member(self, name):
        return name.strip() in (self.member_one, self.member_two)

    def add_member(self, name):
        name = name.strip()
        if self.has_member(name):
            return True
        if not self.member_one:
            self.member_one = name
            self.save(update_fields=["member_one"])
            return True
        if not self.member_two:
            self.member_two = name
            self.save(update_fields=["member_two"])
            return True
        return False


class DiaryEntry(models.Model):
    MOOD_CHOICES = [
        ("🥰","Loved"), ("😊","Happy"), ("😢","Sad"),
        ("😤","Frustrated"), ("😌","Calm"), ("🥺","Soft"),
        ("🌸","Grateful"), ("✨","Inspired"), ("😴","Tired"),
        ("💭","Thoughtful"),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pair         = models.ForeignKey(Pair, on_delete=models.CASCADE, related_name="entries")
    author_name  = models.CharField(max_length=50)
    content      = models.TextField(blank=True, default="")
    mood_emoji   = models.CharField(max_length=10, blank=True, default="")
    is_favourite = models.BooleanField(default=False)
    photo        = models.TextField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Reaction(models.Model):
    id           = models.BigAutoField(primary_key=True)
    entry        = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE, related_name="reactions")
    reactor_name = models.CharField(max_length=50)
    emoji        = models.CharField(max_length=10, default="❤️")
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("entry", "reactor_name", "emoji")]


class PresenceStatus(models.Model):
    id            = models.BigAutoField(primary_key=True)
    pair          = models.ForeignKey(Pair, on_delete=models.CASCADE, related_name="presences")
    member_name   = models.CharField(max_length=50)
    vibe_emoji    = models.CharField(max_length=10, blank=True, default="")
    vibe_text     = models.CharField(max_length=60, blank=True, default="")
    is_online     = models.BooleanField(default=False)
    timezone_name = models.CharField(max_length=60, default="Asia/Kolkata")
    last_seen     = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("pair", "member_name")]


class ChatMessage(models.Model):
    id          = models.BigAutoField(primary_key=True)
    pair        = models.ForeignKey(Pair, on_delete=models.CASCADE, related_name="messages")
    sender_name = models.CharField(max_length=50)
    text        = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
