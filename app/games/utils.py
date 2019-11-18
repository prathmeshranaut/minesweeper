import json
import random
from json import JSONEncoder


class Holder(JSONEncoder):
    def __init__(self, int_value):
        self.intvalue = int_value

    def set_value(self, int_value):
        self.intvalue = int_value

    def __str__(self):
        return str(self.intvalue)

    def __repr__(self):
        return str(self.intvalue)

    def __str__(self):
        return str(self.intvalue)

    def default(self, o):
        return o.__dict


class Utils:
    def parse_open_tile(self, game_field, open_tile):
        coordinates_list = {}
        split_open_tile_list = open_tile.strip(';').split(';')
        game_field = json.loads(game_field)
        for i in split_open_tile_list:
            if len(i):
                x_coordinate, y_coordinate = map(int, i.split(','))
                if x_coordinate in coordinates_list:
                    coordinates_list[x_coordinate][y_coordinate] = game_field[x_coordinate][y_coordinate]
                else:
                    coordinates_list[x_coordinate] = {y_coordinate: game_field[x_coordinate][y_coordinate]}
                # coordinates_list.append(
                #     {
                #         "x": x_coordinate,
                #         "y": y_coordinate,
                #         "v": game_field[x_coordinate][y_coordinate]
                #     }
                # )
        return coordinates_list

    def dump_open_tile(self, open_tile_list):
        open_list = ''
        for x_coordinate, value in open_tile_list.items():
            for y_coordinate in value:
                open_list += f'{x_coordinate},{y_coordinate};'

        return open_list

    def create_game_field(self, size=10, mines=30):
        game_field = []
        for i in range(0, size):
            for j in range(0, size):
                if j == 0:
                    game_field.append([0])
                else:
                    game_field[i].append(0)

        mines_left = mines

        while mines_left > 0:
            row = random.randint(0, size - 1)
            col = random.randint(0, size - 1)

            if game_field[row][col] == 9:
                continue

            mines_left -= 1

            for x in range(max(0, row - 1), min(row + 1, size - 1) + 1):
                for y in range(max(0, col - 1), min(col + 1, size - 1) + 1):
                    if x == row and y == col:
                        game_field[x][y] = 9
                    elif game_field[x][y] != 9:
                        game_field[x][y] += 1

        return game_field
