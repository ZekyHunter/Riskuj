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

    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = PlayerSerializer(instance, data=request.data, partial=True)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save(**serializer.validated_data)
    #     return Response(serializer.validated_data)


class ActivePlayerView(viewsets.ModelViewSet):

    serializer_class = ActivePlayerSerializer
    queryset = ActivePlayer.objects.all().order_by("timestamp")

    def destroy(self, request, *args, **kwargs):
        ActivePlayer.objects.all().delete()
        return Response(data='delete success')


@api_view(['GET'])
def get_questions(request):
    data = {}
    try:
        categories = Category.objects.order_by('?')[:6]

        for category in categories:
            questions = [Question.objects.filter(
                category=category, points=pt).order_by('?').values_list('text', flat=True)[0] for pt in (
                '100', '200', '300', '400', '500')]
            data[category.name] = questions

    except Exception as e:
        return HttpResponseBadRequest

    return HttpResponse(content=json.dumps(data), content_type='application/json')


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

