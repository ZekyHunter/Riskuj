from typing import Optional

from django.db.models import Max, QuerySet
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse

from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .serializers import PlayerSerializer, ActivePlayerSerializer
from .models import Question, Player, Category, ActivePlayer

from django.shortcuts import render


def set_can_answer(can_answer_value: bool, player_id: Optional[int] = None,
                   exclude_queryset: Optional[QuerySet] = None) -> None:
    if player_id:
        player = get_object_or_404(Player, id=player_id)
        player.can_answer = can_answer_value
        player.save()

    elif exclude_queryset:
        a = Player.objects.exclude(id__in=exclude_queryset.values_list('id', flat=True))
        a.update(can_answer=can_answer_value)

    else:
        Player.objects.all().update(can_answer=can_answer_value)

    return


def index(request):
    return render(request, 'public/index.html')


class PlayerView(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all().order_by('name')


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
    ActivePlayer.objects.all().delete()
    Player.objects.all().update(answered_wrong=False)
    return HttpResponse()


@api_view(['POST'])
def can_answer(request):
    can_answer_value = request.data.get('can_answer')
    player_id = request.data.get('player', None)
    exclude = request.data.get('exclude', None)  # typing: str or int
    # TODO: improve the code by adding typing handling
    exclude_queryset = None
    if exclude:
        exclude_queryset = Player.objects.filter(id=exclude)

    set_can_answer(can_answer_value, player_id, exclude_queryset)
    return HttpResponse()


@api_view(['POST'])
def answered_wrong(request):

    player_id = request.data.get('player_id', None)
    player = get_object_or_404(Player, id=player_id)

    from django.db import transaction

    with transaction.atomic():
        player.answered_wrong = True
        player.save()
        transaction.on_commit(lambda: print("Transaction committed!"))
        players_answered_wrong = Player.objects.all().filter(answered_wrong=True)
        set_can_answer(True, exclude_queryset=players_answered_wrong)

    return HttpResponse()
