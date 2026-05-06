from django.shortcuts import render
from django.views.generic import TemplateView


def index(request):
    return render(request, "index.html")


def shop(request):
    return render(request, "Shop.html")


def customorders(request):
    return render(request, "customorders.html")


def aboutme(request):
    return render(request, "aboutme.html")
