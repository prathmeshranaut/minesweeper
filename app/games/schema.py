import graphene
import json

from graphene_django import DjangoObjectType
from graphene import ObjectType
from graphql import GraphQLError

from .utils import Utils
from .models import Game


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        exclude = ["game_field"]

    size = graphene.Int()
    win = graphene.Boolean()

    def resolve_size(self, info):
        return len(json.loads(self.game_field))

    def resolve_win(self, info):
        return self.open_tile.count(';') >= 70

    def resolve_open_tile(self, info):
        coordinates_list = Utils().parse_open_tile(game_field=self.game_field, open_tile=self.open_tile)

        return json.dumps(coordinates_list)


class Query(graphene.ObjectType):
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

        game_field = Utils().create_game_field(size=10)

        game = Game(game_field=json.dumps(game_field), user=user)
        game.save()

        return CreateGame(game=game)


class OpenTile(graphene.Mutation):
    game = graphene.Field(GameType)

    class Arguments:
        game_id = graphene.UUID(required=True)
        x = graphene.Int(required=True)
        y = graphene.Int(required=True)

    def mutate(self, info, game_id, x, y):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError("Login to play a new game!")

        game = Game.objects.get(id=game_id)

        if game.user != user:
            raise GraphQLError("Game not found")

        if game.is_over:
            raise GraphQLError("Game over")

        game_field = json.loads(game.game_field)
        parsed_open_tiles = Utils().parse_open_tile(game_field=game.game_field, open_tile=game.open_tile)

        if parsed_open_tiles.get(x) and parsed_open_tiles.get(x).get(y):
            # Cell already opened
            return OpenTile(game=game)

        # TODO Recursively start opening neighboring cells which are 0
        if x in parsed_open_tiles:
            parsed_open_tiles[x][y] = game_field[x][y]
        else:
            parsed_open_tiles[x] = {y: game_field[x][y]}

        if game_field[x][y] == 9:
            game.is_over = True

        game.open_tile = Utils().dump_open_tile(open_tile_list=parsed_open_tiles)

        game.save()

        return OpenTile(game=game)


class Mutation(graphene.ObjectType):
    create_game = CreateGame.Field()
    open_tile = OpenTile.Field()
