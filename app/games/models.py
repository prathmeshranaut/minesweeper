from django.db import models
import uuid
from django.contrib.auth import get_user_model


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game_field = models.TextField()
    open_tile = models.TextField(blank=True)
    is_over = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
