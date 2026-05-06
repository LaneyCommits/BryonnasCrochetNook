from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path("", views.index),
    path("index.htm", views.index),
    path("Shop.htm", views.shop),
    path("customorders.htm", views.customorders),
    path("aboutme.htm", views.aboutme),
    path("contact.htm", RedirectView.as_view(url="/aboutme.htm", permanent=False)),
]
