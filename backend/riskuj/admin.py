from django.contrib import admin

from .models import Question, User


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text',)


class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'points')


admin.site.register(Question, QuestionAdmin)
admin.site.register(User, UserAdmin)
