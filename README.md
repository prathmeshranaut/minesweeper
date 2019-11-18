# Minesweeper Game 

Built using Python, React, GraphQL.

Navigate to the user directory then run the following commands in your terminal.

```
cd app
pipenv install
pipenv shell
python manage.py migrate
python manage.py runserver
```

Open another terminal and navigate to project directory.
```
cd minesweeper-client
yarn install
yarn start
```

Navigate to http://localhost:3000/ and register for a new user account.

Once you've registered, login using the same credential and create a new game.

Start playing minesweeper!

Scope for improvements:
1. Currently the all the rows and columns are reloaded on a tile reveal.
2. openTile should not return the entire game object, rather it should return only a subset of tiles which were revealed in the last click.
