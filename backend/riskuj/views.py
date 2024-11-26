from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse, HttpResponseBadRequest
import json
from .serializers import QuestionSerializer, UserSerializer
from .models import Question, User, Category


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


@api_view(['GET'])
def get_questions(request):
    data = {}
    try:
        categories = Category.objects.order_by('?')[:5]

        for category in categories:
            questions = [Question.objects.filter(
                category=category, points=pt).order_by('?').values_list('text', flat=True)[0] for pt in (
                '100', '200', '300', '400', '500')]
            data[category.name] = questions

    except Exception as e:
        print(e)
        return HttpResponseBadRequest

    return HttpResponse(content=json.dumps(data), content_type='application/json')

