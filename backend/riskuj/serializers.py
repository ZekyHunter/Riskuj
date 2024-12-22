from rest_framework import serializers
from .models import Question, Player, ActivePlayer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', )


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('id', 'name', 'unique_username', 'points', 'answered', )


class ActivePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivePlayer
        fields = ('id', 'user', 'timestamp', )
