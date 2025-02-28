from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from riskuj import views


router = routers.DefaultRouter()
router.register(r'players', views.PlayerView, 'player')
router.register(r'active-players', views.ActivePlayerView, 'active-player')

urlpatterns = [
    path('/', views.index, name='index'),
    path('player/', views.index, name='player'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/bonus-question/', views.bonus_question, name='bonus-question'),
    path('api/players-answered/', views.players_answered, name='players-answered'),
    path('api/questions/', views.get_questions, name='question'),
    path('api/button-press/', views.button_press, name='button-press'),
    path('api/players/lookup/<str:unique_username>/', views.retrieve_by_username, name='retrieve-by-username'),
    path('api/clear/', views.clear, name="clear"),
]
