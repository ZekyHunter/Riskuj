from django.contrib import admin

from .models import Category, Question, User


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('category', 'points', 'text',)


class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'points')


admin.site.register(Category, CategoryAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(User, UserAdmin)
