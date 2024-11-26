from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from riskuj import views


router = routers.DefaultRouter()
# router.register(r'questions', views.get_questions.as_view(), 'question')
router.register(r'users', views.UserView, 'user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/questions/', views.get_questions, name='question'),
]