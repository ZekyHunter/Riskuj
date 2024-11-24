from django.shortcuts import render
from rest_framework import viewsets
from .serializers import QuestionSerializer, UserSerializer
from .models import Question, User


class QuestionView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
