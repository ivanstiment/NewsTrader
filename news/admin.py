from django.contrib import admin
from .models import New, Research, Quote, StockInfo, CompanyOfficer

admin.site.register([New, Research, Quote])

@admin.register(StockInfo)
class StockInfoAdmin(admin.ModelAdmin):
    list_display = ("symbol","shortName","currentPrice","marketCap")
    search_fields = ("symbol","shortName","longName")

@admin.register(CompanyOfficer)
class CompanyOfficerAdmin(admin.ModelAdmin):
    list_display = ("name","title","stock")
    list_filter  = ("title",)