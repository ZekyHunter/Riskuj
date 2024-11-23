from django.db import models


class Question(models.Model):
    text = models.TextField()

    def _str_(self):
        return self.text
