import graphene
import json

from graphene_django import DjangoObjectType
from graphene import ObjectType
from graphql import GraphQLError

from .models import Game


class Coordinate(ObjectType):
    x = graphene.Int()
    y = graphene.Int()

    def resolve_x(self, info):
        return self.x

    def resolve_y(self, info):
        return self.y


class GameType(DjangoObjectType):
    class Meta:
        open_tile = graphene.List(Coordinate)
        model = Game
        only_fields = ["id", "open_tile", "user", "updated_at"]

    def resolve_open_tile(self, info):
        coordinates_list = []
        split_open_tile_list = self.open_tile.strip(';').split(';')

        game_field = json.loads(self.game_field)

        for i in split_open_tile_list:
            x_coordinate, y_coordinate = map(int, i.split(','))
            coordinates_list.append(
                {
                    "x": x_coordinate,
                    "y": y_coordinate,
                    "v": game_field[x_coordinate][y_coordinate]
                }
            )

        return json.dumps(coordinates_list)


class Query(graphene.ObjectType):
    games = graphene.List(GameType)
    game = graphene.Field(GameType, game_id=graphene.UUID())

    def resolve_game(self, info, game_id=None):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Login to continue playing your game.')

        if game_id is None:
            raise GraphQLError('Provide a valid game UUID')

        game = Game.objects.get(id=game_id)

        if game is None or game.user != user:
            raise GraphQLError('Game not found')

        return game


class CreateGame(graphene.Mutation):
    game = graphene.Field(GameType)

    def mutate(self, info):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError("Login to play a new game!")

        # TODO Core business logic to setup the game field
        game_field = ""
        game = Game(game_field=game_field, user=user)
        game.save()

        return CreateGame(game=game)


# TODO Open Tile Method

class Mutation(graphene.ObjectType):
    create_game = CreateGame.Field()
