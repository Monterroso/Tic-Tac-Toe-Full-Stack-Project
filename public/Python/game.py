from board import Board
from player import Player
from random_player import RandomPlayer
from user_player import UserPlayer
from zero_player import ZeroPlayer
import json
import unittest


class Game:
  """Class that holds all information about a tic-tac-toe game

  Members: 
    players {list of (Player)} -- The list of Player objects in order to play the game
    x_dist {integer} -- The number of tiles in the X direction for the Board
    y_dist {integer} -- The number of tiles in the Y direction for the Board
    turn_number {integer} -- The turn number of the game, starts at 0
    board {Board} -- The current Board in the game
    board_history {list of (Board)} -- The list of Board objects representing the game's history
    num_to_win {integer} -- The number of tiles horizontally or vertically a player needs to win

  Methods: 
    __init__(list of (Player), integer, integer) -- Sets up basing game information
    play_game() -- Plays the game to completion
    resume_game() -- Resumes the game, starting 
    _turn_cycle({integer}) -- plays a single turn
    _increment_turn() -- Increments the turn counter
    _end_game() -- Does additional work when the game reaches an end state
    is_game_over() -- Returns true if the game is finished, false if the game is not
    get_current_player() -- Gets the id of the current player
    get_current_board() -- Gets the current board
    get_player({integer}) -- Gets the player object given the id of the player
    to_json() -- Returns the game encoded as a json object

  """

  def __init__(self, players, x_dist, y_dist, num_to_win, turn_start=0, max_turns=1000,\
     winner=0, brd=None, board_history=None):
    """Creates a game that can be started from start to finish

    Creates the game board and sets turn counter to 0

    Optional parameters can be given to recreate any given game

    Arguments: 
      players {list of (Player)} -- The players given in order to play the tic-tac-toe game
      x_dist {integer} -- The number of tiles in the X direction
      y_dist {integer} -- The number of tiles in the Y direction
      num_to_win {integer} -- The number of tiles in a row or horizontally one needs to win
      turn_start {integer} -- Which turn the game is considered to have started on, default 0
      max_turns {integer} -- The maximum number of turns this game can go on for, default 1000
      winner {integer} -- If the game is already considered to be finished, default -1
      brd {Board} -- The current of the game, default new board
      board_history {list of (Board)} -- List of the histories of the board

    """
    self.players = players
    self.x_dist = x_dist
    self.y_dist = y_dist

    self.turn_number = turn_start
    if brd == None:
      self.board = Board(x_dist, y_dist)
    else:
      self.board = brd
    if board_history == None:
      self.board_history = [self.board]
    else: 
      self.board_history = board_history
    self.num_to_win = num_to_win

    self.max_turns = max_turns

    self.winner = winner

  def __eq__(self, obj):
    """Games are equivalent if all of it's parameters are equal.

    Arguments:
      obj {object} -- The object we are comparing to self

    """

    #Types must be the same
    if type(self) != type(obj):
      return False

    #The number of players must be the same
    if len(self.players) != len(obj.players):
      return False

    #Players must be the same
    for i in range(len(self.players)):
      if self.players[i] != obj.players[i]:
        return False

    #The number to win must be the same 
    if self.num_to_win != obj.num_to_win:
      return False

    #The turn number must be the same
    if self.turn_number != obj.turn_number:
      return False

    #The max turn numbers must be the same
    if self.max_turns != obj.max_turns:
      return False

    #The winner must be the same
    if self.winner != obj.winner:
      return False

    #The current board must be the same
    if self.board != obj.board:
      return False

    #The board histories must be the same length
    if len(self.board_history) != len(obj.board_history):
      return False

    #The histories must be the same
    for i in range(len(self.board_history)):
      if self.board_history[i] != obj.board_history[i]:
        return False

    #If all these conditions are met then we return true
    return True


  #####################         ##################### 
  #                    Play Game                    #
  #####################         ##################### 

  def play_game(self):
    """Plays the tic-tac-toe game to completion

    Returns:
      {JSON} -- JSON object representing this game

    """ 

    while True:
      #Check if we should wait
      cur_player_id = self.get_current_player()
      cur_player = self.get_player(cur_player_id)

      #Pause game execution if stumble upon a user player
      if cur_player.pause_execution():
        return self.to_json()

      turn_result = self._turn_cycle()

      #If the turn result is not 0, return it
      if turn_result != 0:
        return self.to_json()

  def resume_game(self):
    """Resumes the game from where it was left off, assuming the next player already has their action

    Returns:
      {JSON} -- JSON object representing this game

    """

    if self.is_game_over(): 
      return self.to_json()

    turn_result = self._turn_cycle()
    if turn_result != 0:
      return self.to_json()

    return self.play_game()

  def _turn_cycle(self):
    """Does a singluar turn cycle

    Returns:
      {integer} -- id of the player who won, -1 if tie, 0 if no one has won yet, >0 for player id who won

    """

    #Get current player
    cur_player = self.get_current_player()

    #Get board states for current player
    choices = self.board.get_states(cur_player)

    #Update board state
    self.board = choices[self.get_player(cur_player).choose_state(choices)]

    #Make sure you have the history, original board is added, so we can do it afterwards
    self.board_history.append(self.board)

    #Check for win or tie
    if self.board.check_win(self.num_to_win, cur_player):
      self._end_game(cur_player)
      return cur_player
    if self.board.check_tie():
      self._end_game()
      return -1
    if self.turn_number >= self.max_turns:
      self._end_game()
      return -1

    #Incriment turn counter if the game has not ended
    self._increment_turn()

    return 0

  def _increment_turn(self):
    """Increments the turn counter 
    
    """

    self.turn_number += 1

  def _end_game(self, winner_id=0): 
    """Called when the game has reached a terminal state

    Arguments:
      winner_id {integer} -- The id of the winning player, None if game is a tie

    """
    if winner_id == 0:
      # print("The game was a tie!")
      pass
    else:
      # print("{0} has won the game!".format(winner_id))
      pass
    self.winner = winner_id

  #####################         ##################### 
  #                    Utilities                    #
  #####################         ##################### 

  def is_game_over(self):
    """Checks if the game has been played to completion

    Returns:
      {Boolean} -- True if game is over, False if it is not

    """

    if self.winner != 0:
      return True

    return False

  def get_current_player(self):
    """Returns the id of the current player 

    Returns:
      {integer} -- The id of the current player
    
    """

    return self.players[(self.turn_number) % len(self.players)].get_id()

  def get_player(self, player_id):
    """Returns the player given the player's id

    Arguments: 
      player_id {integer} -- The id of the Player object we want

    Returns: 
      {Player} -- The Player object we seek to return

    """

    for player in self.players:
      if player.player_id == player_id:
        return player

    raise Exception("A player with the given id {0} was not found in the player list".format(player_id))

  def get_history(self):
    """Returns the history of the board currently

    Returns:
      {list of (Board)} -- The history of the board

    """

    return self.board_history

  def to_json(self):
    """Returns the game in json format

    What needs to be encoded are the current game state, the board history
    the players, the size of the board, the number of turns, number of turns total
    and the winner

    Returns:
      {JSON} -- The JSON encoded version of this current game

    """

    object_json = dict()
    object_json["Type"] = self.__class__.__name__
    game_json = dict()
    game_json["x_dist"] = self.x_dist
    game_json["y_dist"] = self.y_dist
    game_json["turn_number"] = self.turn_number
    game_json["max_turns"] = self.max_turns
    game_json["num_to_win"] = self.num_to_win
    game_json["winner"] = self.winner
    game_json["board"] = self.board.to_json()
    game_json["board_history"] = [board.to_json() for board in self.board_history]
    game_json["players"] = [player.to_json() for player in self.players]
    object_json["Object"] = game_json

    return json.dumps(object_json)
    


class GameTests(unittest.TestCase):
  """Suite to test the functionality of the game

  """

  def test_init(self):
    """Suite to test the init method

    """

    a_players = [Player(1), Player(2)]
    a_x_dist = 10
    a_y_dist = 3
    a_num_to_win = 3
    a_game = Game(a_players, a_x_dist, a_y_dist, a_num_to_win)

    #Check to be sure the board is properly set up
    self.assertEqual(a_game.board, Board(grid=[[0 for _ in range(a_y_dist)] for _ in range(a_x_dist)]))

  def test_equal(self):
    """Suite to test that equal boards can be compared

    """

    a_players = [ZeroPlayer(1), ZeroPlayer(2)]
    a_x_dist = 3
    a_y_dist = 3
    a_num_to_win = 1
    a_game = Game(a_players, a_x_dist, a_y_dist, a_num_to_win)

    b_players = [ZeroPlayer(1), ZeroPlayer(2)]
    b_x_dist = 3
    b_y_dist = 3
    b_num_to_win = 1
    b_game = Game(b_players, b_x_dist, b_y_dist, b_num_to_win)

    c_players = [ZeroPlayer(1), ZeroPlayer(2)]
    c_x_dist = 3
    c_y_dist = 3
    c_num_to_win = 1
    c_game = Game(c_players, c_x_dist, c_y_dist, c_num_to_win)

    self.assertTrue(b_game == a_game == c_game)

    a_game.play_game()
    b_game.play_game()

    self.assertTrue(a_game == b_game)
    self.assertFalse(c_game == a_game)

    c_game.play_game()

    self.assertTrue(b_game == a_game == c_game)



  def test_play_game(self):
    """Suite to test the play game method

    Runs the game, making sure no exceptions occur

    Then, checks the history, going through each move and checking each move is valid
    
    """

    
    a_players = [RandomPlayer(1), RandomPlayer(2)]
    a_x_dist = 3
    a_y_dist = 3
    a_num_to_win = 1
    a_game = Game(a_players, a_x_dist, a_y_dist, a_num_to_win)

    #Game is played to competion
    a_game.play_game()

    a_history = a_game.get_history()

    #Go through each move and check to be sure it's valid
    for i in range(1,len(a_history)):
      #Get copy of the board
      prev_board = a_history[i-1]
      cur_board = a_history[i]

      #Check if the board chosen is in valid states
      self.assertTrue(cur_board in prev_board.get_states(a_players[0].get_id()) or cur_board in prev_board.get_states(a_players[1].get_id()),\
        "An invalid board state was added to the history")

      if i == len(a_history) - 1:
        self.assertTrue(cur_board.check_win(a_num_to_win, a_players[0].get_id()) or cur_board.check_win(a_num_to_win, a_players[1].get_id()) or cur_board.check_tie())
      else: 
        self.assertFalse(cur_board.check_win(a_num_to_win, a_players[0].get_id()) or cur_board.check_win(a_num_to_win, a_players[1].get_id()) or cur_board.check_tie())

  def test_play_game_hard(self):
    """Test the game, pushing it to its limits

    """
    wins = [0,0,0]

    for i in range(1,10):
      a_player_1_id = 1
      a_player_2_id = 2
      a_players = [RandomPlayer(a_player_1_id), RandomPlayer(a_player_2_id)]
      a_x_dist = i
      a_y_dist = i
      a_num_to_win = 3
      a_game = Game(a_players,a_x_dist,a_y_dist,a_num_to_win)
      a_game.play_game()

      wins[a_game.winner] += 1

    print(wins)

  def test_resume_game(self):
    """Suite testing that the game itself can be properly stopped and started

    """

    a_player_1 = RandomPlayer(1)
    a_player_2 = UserPlayer(2)
    a_player_2.set_choice(0)
    a_players = [a_player_1, a_player_2]
    a_x_dist = 5
    a_y_dist = 5
    a_num_to_win = 3
    a_game = Game(a_players,a_x_dist,a_y_dist,a_num_to_win)

    #game will pause
    a_game.play_game()

    while a_game.winner != -1:
      a_player_2.set_choice(0)
      a_game.resume_game()






  def test_to_json(self):
    """Suite testing that the json values are properly created for this game object

    """
    self.maxDiff = None

    a_player_1_id = 1
    a_player_2_id = 2
    a_players = [RandomPlayer(a_player_1_id), RandomPlayer(a_player_2_id)]
    a_x_dist = 3
    a_y_dist = 3
    a_num_to_win = 2
    a_game = Game(a_players,a_x_dist,a_y_dist,a_num_to_win)
    a_game_json = a_game.play_game()

    #Make sure that the game itself is valid
    #Create dictionary, convert to json 
    

    object_json = dict()
    object_json["Type"] = "Game"
    game_json = dict()
    game_json["x_dist"] = a_game.x_dist
    game_json["y_dist"] = a_game.y_dist
    game_json["turn_number"] = a_game.turn_number
    game_json["max_turns"] = a_game.max_turns
    game_json["num_to_win"] = a_game.num_to_win
    game_json["winner"] = a_game.winner
    game_json["board"] = a_game.board.to_json()
    game_json["board_history"] = [board.to_json() for board in a_game.board_history]
    game_json["players"] = [player.to_json() for player in a_players]
    object_json["Object"] = game_json

    self.assertEqual(json.dumps(object_json), a_game_json)

    

  
if __name__ == '__main__':
  unittest.main()