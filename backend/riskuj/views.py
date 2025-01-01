from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse, HttpResponseBadRequest
import json

from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .serializers import PlayerSerializer, ActivePlayerSerializer
from .models import Question, Player, Category, ActivePlayer


class PlayerView(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()

    def retrieve_by_username(self, request, unique_username=None):
        player = get_object_or_404(Player, unique_username=unique_username)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

    def mark_not_answered(self, request, *args, **kwargs):
        Player.objects.all().update(answered=False)


class ActivePlayerView(viewsets.ModelViewSet):

    serializer_class = ActivePlayerSerializer
    queryset = ActivePlayer.objects.all().order_by("timestamp")


@api_view(['GET'])
def get_questions(request):
    data = {}
    categories = Category.objects.order_by('?')[:6]

    for category in categories:
        questions = Question.objects.filter(category=category)
        category_questions = []

        for pt in ['100', '200', '300', '400', '500']:
            question = questions.filter(points=pt).first()
            category_questions.append(question.text)

        data[category.name] = category_questions

    return Response(data)


@api_view(['POST'])
def button_press(request):
    user_id = request.data.get('user', None)
    user = get_object_or_404(Player, id=user_id)
    timestamp = request.data.get('timestamp', None)
    if not ActivePlayer.objects.all().exists():
        ActivePlayer.objects.create(user=user, timestamp=timestamp)
    else:
        for active_player in ActivePlayer.objects.all():
            if active_player.timestamp > timestamp:
                active_player.delete()
                ActivePlayer.objects.create(user=user, timestamp=timestamp)
    return HttpResponse()

