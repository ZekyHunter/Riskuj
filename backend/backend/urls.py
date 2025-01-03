from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from riskuj import views


router = routers.DefaultRouter()
router.register(r'users', views.PlayerView, 'user')
router.register(r'active-players', views.ActivePlayerView, 'active-player')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/questions/', views.get_questions, name='question'),
    path('api/button-press/', views.button_press, name='button-press'),
]
