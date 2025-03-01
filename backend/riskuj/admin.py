from django.contrib import admin

from .models import Category, Question, Player, ActivePlayer


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('category', 'points', 'text')


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'unique_username', 'points', 'can_answer', 'answered_wrong')


class ActivePlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'player', 'timestamp')


admin.site.register(Category, CategoryAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Player, PlayerAdmin)
admin.site.register(ActivePlayer, ActivePlayerAdmin)
