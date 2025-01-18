import random
from django.core.management.base import BaseCommand
from riskuj.models import Question, Category


class Command(BaseCommand):
    help = "Prefill database"

    def handle(self, *args, **options):
        Question.objects.all().delete()
        Category.objects.all().delete()

        data = {
            'Historie': [
                'Kdy začala druhá světová válka?',
                'Kdo byl prvním prezidentem Československa?',
                'Kde se odehrála bitva u Waterloo?',
                'Kdo byl faraonem v období stavby Velké pyramidy v Gíze?',
                'Jaký byl název první americké kolonie?',
                'Kdo vynalezl žárovku?',
                'Kdy byla podepsána Magna Charta?',
                'Kdo byl generálem při bitvě u Stalingradu?',
                'Co znamenal „Pád Berlínské zdi“?',
                'Jaký rok byl začátek americké občanské války?',
                'Který rok se považuje za začátek první světové války?',
                'Jak se jmenoval první československý prezident?'
            ],
            'Geografie': [
                'Jaké je hlavní město Francie?',
                'Která řeka je nejdelší na světě?',
                'Kde se nachází Mount Everest?',
                'Jaké moře obklopuje Egypt?',
                'Který stát je největší v Austrálii?',
                'Jaké je hlavní město Kanady?',
                'Jaký je největší ostrov na světě?',
                'Na jakém kontinentu leží stát Etiopie?',
                'Kde se nachází město Tokyo?',
                'Jaké moře je mezi Itálií a Balkánem?',
                'Jaké je hlavní město Brazílie?',
                'Která řeka je nejdelší na světě?'
            ],
            'Literatura': [
                'Kdo napsal román „1984“?',
                'Jaký je název první knihy ze série o Harrym Potterovi?',
                'Kdo napsal „Pána prstenů“?',
                'Kdo je autorem „Romeo a Julie“?',
                'Jak se jmenuje hlavní postava v románu „Robinson Crusoe“?',
                'Kdo napsal „Don Quijote“?',
                'Kdo napsal detektivní romány o Hercule Poirot?',
                'Jaký spisovatel vytvořil postavu Sherlocka Holmese?',
                'Jaké město je dějištěm románu „Na Větrné hůrce“?',
                'Kdo napsal „Sto roků samoty“?',
                'Kdo napsal román 1984?',
                'Jak se jmenuje hlavní postava románu Malý princ?'
            ],
            'Věda': [
                'Kdo vynalezl teorii relativity?',
                'Jaký je chemický vzorec vody?',
                'Co je DNA?',
                'Jaký prvek má atomové číslo 1?',
                'Kdo objevil penicilin?',
                'Jaký je název největšího měsíce planety Saturn?',
                'Co je nejlehčí plyn na Zemi?',
                'Kdo vynalezl telefon?',
                'Co je to fotosyntéza?',
                'Co je za hranicí vesmíru?',
                'Kdo je známý jako objevitel gravitace?',
                'Jaký chemický prvek má symbol H?'
            ],
            'Umění': [
                'Kdo namaloval „Mona Lisu“?',
                'Kdo složil skladbu „Ode to Joy“?',
                'Jaký je název slavného obrazu, který zobrazuje slavnou scénu z Poslední večeře?',
                'Kdo je autorem sochy Davida?',
                'Jaké je jméno známého českého malíře, který maloval „Sluneční hodiny“?',
                'Jaký je název nejslavnějšího díla Vincenta van Gogha?',
                'Kdo napsal balet „Louskáček“?',
                'Kdo vytvořil sochu „Myšlenka“?',
                'Kdo je autorem opera „Carmen“?',
                'Kdo napsal hudbu k „Maškarnímu bálu“?',
                'Který malíř vytvořil slavný obraz Mona Lisa?',
                'Jak se jmenuje období, ve kterém vznikaly díla jako Michelangelova David?'
            ],
            'Sport': [
                'Kdo vyhrál mistrovství světa ve fotbale v roce 2018?',
                'Která země hostila Olympijské hry v roce 2008?',
                'Kdo je známý jako „Bohatý“ v boxu?',
                'Kdo je nejúspěšnějším tenistou v historii?',
                'Jaký sport se hraje v tenisových turnajích jako Wimbledon?',
                'Kdo je držitelem rekordu v běhu na 100 metrů?',
                'Jaký je název největší fotbalové ligy na světě?',
                'Kolik hráčů je v jednom týmu v basketbalu?',
                'Jaké zvíře je symbolem olympijských her?',
                'Kde se konají zimní olympijské hry v roce 2026?',
                'Kolik hráčů má fotbalový tým na hřišti během zápasu?',
                'Jak se jmenuje slavný tenista, který vyhrál nejvíce grandslamových titulů do roku 2025?'
            ],
            'Filmy a Televize': [
                'Kdo režíroval film „Titanic“?',
                'Jaký je název první Star Wars trilogie?',
                'Kdo hrál hlavní roli ve filmu „Forrest Gump“?',
                'Jak se jmenuje hlavní hrdinka v „Příběhu hraček“?',
                'Kdo je autorem filmu „Inception“?',
                'Jaký je název filmu o kouzelném světě Harryho Pottera?',
                'Kdo je režisérem filmu „Pulp Fiction“?',
                'Jaké zvíře je hlavní postavou ve filmu „Hledá se Nemo“?',
                'Kdo je režisérem trilogie „Pán prstenů“?',
                'Jak se jmenuje film o osudu planety Země po katastrofě?',
                'Kdo zrežíroval trilogii Pán prstenů?',
                'Jak se jmenuje oblíbený animovaný seriál o rodině žijící ve Springfieldu?'
            ],
            'Hudba': [
                'Kdo napsal píseň „Imagine“?',
                'Jak se jmenuje nejslavnější rocková kapela ze 60. let z Británie?',
                'Kdo je autorem písně „Bohemian Rhapsody“?',
                'Jaký je název nejslavnější písně Elvise Presleyho?',
                'Kdo složil hudbu k „Symfonii č. 5“?',
                'Kdo je známý jako "Král popu"?',
                'Kdo zpíval hit „I Will Always Love You“?',
                'Kdo byl zpěvákem skupiny Queen?',
                'Jaký nástroj hraje virtuóz Itzhak Perlman?',
                'Jaké je skutečné jméno zpěváka „Lady Gaga“?',
                'Který nástroj byl typický pro hudbu Ludwiga van Beethovena?',
                'Jak se jmenuje britská kapela, která vytvořila album Abbey Road?'
            ],
            'Technologie': [
                'Kdo je zakladatelem společnosti Microsoft?',
                'Jaký je název nejznámějšího operačního systému pro mobilní telefony?',
                'Co znamená zkratka „URL“?',
                'Kdo vynalezl internet?',
                'Jaký je název první webové stránky na světě?',
                'Kdy byl uveden první iPhone?',
                'Co znamená zkratka „HTTP“?',
                'Jaký je název největší sociální sítě?',
                'Kdo je zakladatelem společnosti Tesla?',
                'Co je to blockchain?',
                'Kdo založil společnost Microsoft?',
                'Jak se jmenuje největší internetový vyhledávač na světě?'
            ],
            'Jazyky': [
                'Jaký jazyk je oficiálním jazykem v Brazílii?',
                'Kolik písmen má česká abeceda?',
                'Jak se říká „dobrý den“ ve španělštině?',
                'Který jazyk je oficiálním jazykem v Japonsku?',
                'Jaké písmeno začíná anglická abeceda?',
                'Co znamená slovo „merci“ ve francouzštině?',
                'Jaký jazyk je úředním jazykem v Indii kromě hindštiny?',
                'Kdo vynalezl písmo?',
                'Jaké slovo znamená v angličtině „děkuji“?',
                'Kolik pádů má čeština?',
                'Který jazyk má nejvíce rodilých mluvčích na světě?',
                'Jaké písmo se používá v ruštině?'
            ]
        }
        points = ['BONUS', '100', '200', '300', '400', '500']

        for category, questions in data.items():
            ctg = Category.objects.create(name=category)

            for i in range(len(points)):
                Question.objects.create(points=points[i], text=questions[i], category=ctg)
                Question.objects.create(points=points[i], text=questions[i+6], category=ctg)
