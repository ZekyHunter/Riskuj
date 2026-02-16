from django.contrib import admin
from import_export.admin import ExportMixin
from import_export.resources import ModelResource
from import_export.formats.base_formats import XLSX

from .models import Category, Question, Player, ActivePlayer


class PlayerResource(ModelResource):
    class Meta:
        model = Player


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.action(description="Set selected questions as inactive")
def make_inactive(modeladmin, request, queryset):
    queryset.update(is_active=False)


@admin.action(description="Set selected questions as active")
def make_active(modeladmin, request, queryset):
    queryset.update(is_active=True)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('category', 'points', 'text', 'is_active')
    actions = [make_active, make_inactive]


class PlayerAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = PlayerResource
    list_display = ('id', 'name', 'unique_username', 'points', 'can_answer', 'answered_wrong')

    # def get_export_formats(self):
    #     formats = super().get_export_formats()
    #     return [f for f in formats if isinstance(f, XLSX)]


class ActivePlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'player', 'timestamp')


admin.site.register(Category, CategoryAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Player, PlayerAdmin)
admin.site.register(ActivePlayer, ActivePlayerAdmin)
