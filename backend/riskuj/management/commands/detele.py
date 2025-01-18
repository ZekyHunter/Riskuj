from django.core.management.base import BaseCommand
from riskuj.models import ActivePlayer


class Command(BaseCommand):
    help = "Delete data from database"

    def handle(self, *args, **options):
        ActivePlayer.objects.all().delete()
