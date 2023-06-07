from django.contrib import admin
from .models import Category, Ad, AdImage, Messaged


class AdImageInline(admin.TabularInline):
    model = AdImage


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    inlines = (AdImageInline,)
    list_filter = ("category",)
    list_display = (
        "title",
        "category",
    )
    search_fields = (
        "title",
        "category",
    )


admin.site.register(Category)
admin.site.register(AdImage)
admin.site.register(Messaged)
