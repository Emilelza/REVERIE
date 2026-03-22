from django.contrib import admin
from .models import Pair


@admin.register(Pair)
class PairAdmin(admin.ModelAdmin):
    list_display   = ['room_code', 'member_one', 'member_two', 'entry_count', 'created_at']
    search_fields  = ['room_code', 'member_one', 'member_two']
    readonly_fields = ['id', 'room_code', 'created_at']
    list_per_page  = 20

    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'Entries'

    def has_change_permission(self, request, obj=None):
        return False