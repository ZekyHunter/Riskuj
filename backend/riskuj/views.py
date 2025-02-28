from django.db.models import Max
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse

from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .serializers import PlayerSerializer, ActivePlayerSerializer
from .models import Question, Player, Category, ActivePlayer

from django.shortcuts import render


def index(request):
    return render(request, 'public/index.html')


class PlayerView(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all().order_by('name')


class ActivePlayerView(viewsets.ModelViewSet):
    serializer_class = ActivePlayerSerializer
    queryset = ActivePlayer.objects.all().order_by("timestamp")


@api_view(['POST'])
def bonus_question(request):
    player_id = request.data.get('player', None)
    Player.objects.exclude(id=player_id).update(answered=True)
    return HttpResponse()


@api_view(['POST'])
def players_answered(request):
    answered = request.data.get('answered')
    Player.objects.all().update(answered=answered)
    return HttpResponse()


@api_view(['GET'])
def get_questions(request):
    data = {}
    categories = Category.objects.order_by('?')[:6]

    for category in categories:
        questions = Question.objects.filter(category=category)
        category_questions = []

        for pt in ['BONUS', '100', '200', '300', '400', '500']:
            question = questions.filter(points=pt).first()
            category_questions.append(question.text)

        data[category.name] = category_questions

    return Response(data)


@api_view(['GET'])
def retrieve_by_username(request, unique_username=None):
    player = get_object_or_404(Player, unique_username=unique_username)
    serializer = PlayerSerializer(player)
    return Response(serializer.data)


@api_view(['POST'])
def button_press(request):
    player_id = request.data.get('player', None)
    player = get_object_or_404(Player, id=player_id)
    timestamp = request.data.get('timestamp', None)
    latest_timestamp = ActivePlayer.objects.aggregate(Max('timestamp'))['timestamp__max']
    if not latest_timestamp or timestamp < latest_timestamp:
        ActivePlayer.objects.all().delete()
        ActivePlayer.objects.create(player=player, timestamp=timestamp)
    return HttpResponse()


@api_view(['GET'])
def clear(request):
    Player.objects.all().update(answered=True)
    ActivePlayer.objects.all().delete()
    return HttpResponse()
