from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class Question(models.Model):
    POINTS = [
        ("100", "One hundred"),
    ]

    text = models.TextField()
    points = models.CharField(max_length=245, choices=POINTS)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.text


class User(models.Model):
    name = models.CharField(max_length=256)
    points = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.points and not self._loaded_values["points"]:
            self.points = 0
            super().save(*args, **kwargs)
