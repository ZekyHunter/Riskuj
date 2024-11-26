from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class Question(models.Model):
    POINTS = [
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


class User(models.Model):
    name = models.CharField(max_length=256)
    points = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.points:
            print("no points")
            self.points = 0
        super().save(*args, **kwargs)
