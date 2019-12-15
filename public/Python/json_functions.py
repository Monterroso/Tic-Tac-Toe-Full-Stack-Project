import json
from game import Game
from player import Player
from user_player import UserPlayer
from random_player import RandomPlayer
from board import Board

import unittest

"""Utilizes functions for reading and writing from a JSON file

  Functions: 
      game_from_json({JSON}) -- Given a JSON object of a game, converts into game object
      player_from_json({JSON}) -- Given a dictionary of a player, converts into appropriate player
      board_from_json({JSON}) -- Given a JSON object of a board, converts into appropriate board

"""

def game_from_json(json_obj):
  """Converts the game object encoded as a json into a game object and returns it

  Arguments:
    json_obj {JSON} -- encoded Game object we want to decode

  Returns:
    {Game} -- The decoded Game object

  """

  object_json = json.loads(json_obj)


  if "Type" not in object_json or object_json["Type"] != "Game":
    raise AttributeError("The json object is not a Game object, it is a {0}".format(object_json.keys()))

  #Otherwise we know it is a json object
  game_obj = object_json["Object"] 
  x_dist = game_obj["x_dist"]
  y_dist = game_obj["y_dist"]
  turn_number = game_obj["turn_number"]
  max_turns = game_obj["max_turns"]
  num_to_win = game_obj["num_to_win"]
  winner = game_obj["winner"]
  board = board_from_json(game_obj["board"])
  board_history = [board_from_json(brd) for brd in game_obj["board_history"]]
  players = [player_from_json(plr) for plr in game_obj["players"]]

  return Game(players, x_dist, y_dist, num_to_win, turn_start=turn_number,\
     max_turns=max_turns, winner=winner, brd=board, board_history=board_history)


def player_from_json(json_obj):
  """Given a player JSON, converts it into a player object

  Arguments: 
    dic_obj {JSON} -- The JSON representing the player object

  Returns:
    {Player} -- The decoded player object

  """
  dic_obj = json_obj

  if not isinstance(json_obj,dict):
    dic_obj = json.loads(json_obj)

  if not issubclass(eval(dic_obj["Type"]), Player):
    raise AttributeError("This is not a player dictionary object, it is a {0}".format(dic_obj["Type"]))

  player_obj = dic_obj["Object"]

  player_id = player_obj["player_id"]
  
  return eval(dic_obj["Type"])(player_id)

def board_from_json(json_obj):
  """Given a board JSON, converts it into a Board object

  Arguments:
    dic_obj {JSON} -- The dictionary representing the Board object

  Returns:
    {Board} -- The decoded Board object

  """
  dic_obj = json_obj

  if not isinstance(json_obj,dict):
    dic_obj = json.loads(json_obj)

  

  if dic_obj["Type"] != "Board":
    raise AttributeError("This is not a Board dictionary object, it is a {0}".format(dic_obj["Type"]))

  #   object_json = dict()
  #   object_json["Type"] = self.__class__.__name__
  #   board_obj = dict()
  #   board_obj["x"] = self.x_dist
  #   board_obj["y"] = self.y_dist
  #   board_obj["grid"] = self.grid
  #   object_json["Object"] = board_obj

  board_obj = dic_obj["Object"]
  x = board_obj["x"]
  y = board_obj["y"]
  grid = board_obj["grid"] 

  return Board(grid=grid)


class DecoderTests(unittest.TestCase):
  """Tests all of the functionality for decoding json objects

  """

  def test_game_from_json(self):
    """Suite testing that json objects are properly decoded and the games are created

    Depends upon player_from and board_from to work properly

    """

    a_player_1_id = 1
    a_player_2_id = 2
    a_players = [RandomPlayer(a_player_1_id), RandomPlayer(a_player_2_id)]
    a_x_dist = 3
    a_y_dist = 3
    a_num_to_win = 2
    a_game = Game(a_players,a_x_dist,a_y_dist,a_num_to_win)
    a_game_json = a_game.play_game()

    a_game_recreated = game_from_json(a_game_json)
    self.assertTrue(a_game == a_game_recreated)

    b_player_1_id = 1
    b_player_2_id = 2
    b_players = [RandomPlayer(b_player_1_id), RandomPlayer(b_player_2_id)]
    b_x_dist = 3
    b_y_dist = 3
    b_num_to_win = 3
    b_game = Game(b_players,b_x_dist,b_y_dist,b_num_to_win)
    b_game_json = b_game.play_game()

    b_game_recreated = game_from_json(b_game_json)
    self.assertTrue(b_game == b_game_recreated)

    self.assertFalse(b_game == a_game)

  def test_player_from_json(self):
    """Suite testing that a player object is properly created from a properly formatted dictionary

    """

    a_player = Player(1)
    a_player_json = a_player.to_json()

    a_player_recreated = player_from_json(a_player_json)

    self.assertTrue(a_player == a_player_recreated)

    b_player = RandomPlayer(2)
    b_player_json = b_player.to_json()

    b_player_recreated = player_from_json(b_player_json)

    self.assertTrue(b_player == b_player_recreated)

    c_player = UserPlayer(3)
    c_player_json = c_player.to_json()

    c_player_recreated = player_from_json(c_player_json)

    self.assertTrue(c_player == c_player_recreated)

  def test_board_from_json(self):
    """Suite testing that a board object is properly created from a properly formatted dictionary 
    
    """

    a_board = Board(5,5)
    a_board_json = a_board.to_json()

    a_board_recreated = board_from_json(a_board_json)

    self.assertTrue(a_board_recreated == a_board)

    b_grid = [[1,2,0,0,2,1],[1,1,1,1,1,1],[2,2,2,2,2,2],[0,1,2,3,4,5]]
    b_board = Board(grid=b_grid)

    b_board_json = b_board.to_json()
    b_board_recreated = board_from_json(b_board_json)

    self.assertTrue(b_board_recreated == b_board)


if __name__ == "__main__":
  unittest.main()