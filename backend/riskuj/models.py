from django.db import models


class Question(models.Model):
    text = models.TextField()

    def _str_(self):
        return self.text


class User(models.Model):
    name = models.CharField(max_length=256)
    points = models.IntegerField()

    def _str_(self):
        return self.name
