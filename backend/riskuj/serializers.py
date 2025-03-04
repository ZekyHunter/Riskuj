from rest_framework import serializers
from .models import Question, Player, ActivePlayer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', )


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('id', 'name', 'unique_username', 'points', 'can_answer', 'answered_wrong', )


class ActivePlayerSerializer(serializers.ModelSerializer):
    points = serializers.IntegerField(source='player.points')

    class Meta:
        model = ActivePlayer
        fields = ('id', 'player', 'points', 'timestamp', )
