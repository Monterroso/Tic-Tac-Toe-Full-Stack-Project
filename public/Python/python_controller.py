import sys 
import json
from game import Game
from user_player import UserPlayer
from random_player import RandomPlayer
from json_functions import game_from_json

import unittest


"""Given command line arguments, this will run a game


""" 


def _new_game(player_1="UserPlayer", player_2="RandomPlayer", x_dist=3,\
  y_dist=3, num_to_win=2):

  player_1 = eval(player_1)(1)
  player_2 = eval(player_2)(2)
  players = [player_1, player_2]

  x_dist = int(x_dist)
  y_dist = int(y_dist)
  num_to_win = int(num_to_win)

  new_game = Game(players, x_dist, y_dist, num_to_win)

  game_json = new_game.play_game()

  choices = [board.to_json() for board in new_game.board.get_states(new_game.get_current_player())]
  
  is_over = new_game.is_game_over()

  winner = new_game.winner

  return [game_json, choices, is_over, winner]

def _continue_game(game_json, choice):

  created_game = game_from_json(game_json)

  choice = int(choice)

  player = created_game.get_player(created_game.get_current_player())
  player.set_choice(choice)

  game_json = created_game.resume_game()

  choices = [board.to_json() for board in created_game.board.get_states(created_game.get_current_player())]
  
  is_over = created_game.is_game_over()

  winner = created_game.winner

  return [game_json, choices, is_over, winner]

def create_wrapper(game_json, choices, is_over, winner):
  return json.dumps(dict({"game_json": game_json, "choices": choices, "is_over": is_over, "winner": winner}))

class ControllerTests(unittest.TestCase):
  """We check to be sure that the controller behaves as we expect it to

  """

  def test_new_game(self):
    """Testing suite to start a new game

    """

    #Just check manually that the game json object is printed
    #new_game()

  def test_continue_game(self):
    """Testing suite to continue game

    """

    a_player_1_id = 1
    a_player_2_id = 2
    a_players = [UserPlayer(a_player_1_id), RandomPlayer(a_player_2_id)]
    a_x_dist = 3
    a_y_dist = 3
    a_num_to_win = 4
    a_game = Game(a_players,a_x_dist,a_y_dist,a_num_to_win)
    a_game_json = a_game.play_game()

    a_start_board = a_game.board.copy()
    a_game_1 = game_from_json(_continue_game(a_game_json, 0)[0])
    a_turn_1_board = a_game_1.board.copy()
    a_game_2 = game_from_json(_continue_game(a_game_1.to_json(), 0)[0])
    a_turn_2_board = a_game_2.board.copy()

    self.assertTrue(a_start_board != a_turn_1_board != a_turn_2_board)

    print(a_turn_2_board)
    
if __name__ == "__main__":
    # unittest.main()

    if len(sys.argv) == 6:
      #We need to create a new game
      print(create_wrapper(*_new_game(*sys.argv[1:])))
        
    if len(sys.argv) == 3:
      #A game and a player choice have been given
      print(create_wrapper(*_continue_game(sys.argv[1], sys.argv[2])))

    
