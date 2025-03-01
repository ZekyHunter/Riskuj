from django.db import models

import unicodedata
import re


def clean_string(text):
    text = unicodedata.normalize('NFKD', text)
    text = ''.join([c for c in text if not unicodedata.combining(c)])
    text = re.sub(r'[\s\-/\\]', '', text)
    text = re.sub(r'[^a-zA-Z0-9]', '', text)
    return text.lower()


class Category(models.Model):
    class Meta:
        verbose_name_plural = "categories"

    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class Question(models.Model):
    POINTS = [
        ("BONUS", "Bonusová otázka"),
        ("100", "One hundred"),
        ("200", "Two hundred"),
        ("300", "Three hundred"),
        ("400", "Four hundred"),
        ("500", "Five hundred"),
    ]

    text = models.TextField()
    points = models.CharField(max_length=245, choices=POINTS)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.text


class Player(models.Model):
    name = models.CharField(max_length=256)
    unique_username = models.CharField(max_length=256, unique=True, null=True, blank=True)
    points = models.IntegerField(null=True, blank=True, default=0)
    can_answer = models.BooleanField(default=False)
    answered_wrong = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.points:
            self.points = 0
        if not self.unique_username:
            self.unique_username = clean_string(self.name)
        super().save(*args, **kwargs)


class ActivePlayer(models.Model):
    player = models.ForeignKey(to=Player, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.BigIntegerField()

    def __str__(self):
        return self.player.name
