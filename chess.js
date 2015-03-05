/** 
  * CHESS.JS v0.0.6
  * AUTHOR: Frrakn
  * 
  * PREV VERSION - Functions complete
  * 
  * ISSUES
  * 1) Should probably make coordinates a class
  *    and convert to regular [1,8][1,8] coordinates
  * 2) Should make Board.addCoordinates method return a coordinate
  *    instead of modifying the first coordinates... confusing
  *    b/c seems like mixing function programming with OOP
  * 3) Object property declaration for coordinates do not use
  *    rank and file in quotes, as is with other object property
  *    declarations
  * 
  * Simple text-based chess game
  * Parses using algebraic chess notation
  * 
  * Uses UNDERSCORE.JS v1.8.0
  * 
  */

var _ = require('underscore');
var readline = require('readline-sync');

/** 
  * PLAYER 
  * 
  * Keeps track of pieces a player owns 
  * and used for methods involving pieces of
  * a specific color.
  * 
  * Player color is determined as
  *   true - white
  *   false - black
  * 
  */

var Player = function Player(color){
  //  boolean: true if white, false if black
  this.color = color;
  
  //  Pieces this player currently owns
  this.pieces = [];

  //  Gets all positionally correct moves (does 
  //  not check for moves that put king in check)
  this.getPosCorrectMoves = function getPosCorrectMoves(){
  };
  
  //  Called by a piece when taken
  this.remove = function remove(piece){
  };

  //  Detemines eligibility for en passant
  this.doublePush = false;
  this.doublePushPawn = null;
};



/** 
  * GAME
  * 
  * Keeps track of game 
  *  
  * A game contains 2 players, flags for 
  * special positions (gameEnd, check, etc.),
  * a Board and a log of previous Moves.
  *  
  */

var Game = function Game(){
  this.blackPlayer = new Player(false);
  this.whitePlayer = new Player(true);
  this.chessBoard = new Board();
  this.moveLog = [];
  this.interface = new Interface(this);

  //  boolean keeps track of game state
  this.turn = true;
  this.validatedMove = false;
  this.gameOver = false;

  //  Initializing a game will place pieces in players and boards
  this.init = function init(){
    //  Creating every piece... wish there was a better way
    //  White pieces
    var whitePieces =   [ new Piece('Rook', this.whitePlayer, {file: 2, rank: 2}, this.chessBoard),
                          new Piece('Rook', this.whitePlayer, {file: 9, rank: 2}, this.chessBoard),
                          new Piece('Knight', this.whitePlayer, {file: 3, rank: 2}, this.chessBoard),
                          new Piece('Knight', this.whitePlayer, {file: 8, rank: 2}, this.chessBoard),
                          new Piece('Bishop', this.whitePlayer, {file: 4, rank: 2}, this.chessBoard),
                          new Piece('Bishop', this.whitePlayer, {file: 7, rank: 2}, this.chessBoard),
                          new Piece('Queen', this.whitePlayer, {file: 5, rank: 2}, this.chessBoard),
                          new Piece('King', this.whitePlayer, {file: 6, rank: 2}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 2, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 3, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 4, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 5, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 6, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 7, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 8, rank: 3}, this.chessBoard),
                          new Piece('Pawn', this.whitePlayer, {file: 9, rank: 3}, this.chessBoard)
                        ];

    //  Black pieces
    var blackPieces =   [ new Piece('Rook', this.blackPlayer, {file: 2, rank: 9}, this.chessBoard),
                          new Piece('Rook', this.blackPlayer, {file: 9, rank: 9}, this.chessBoard),
                          new Piece('Knight', this.blackPlayer, {file: 3, rank: 9}, this.chessBoard),
                          new Piece('Knight', this.blackPlayer, {file: 8, rank: 9}, this.chessBoard),
                          new Piece('Bishop', this.blackPlayer, {file: 4, rank: 9}, this.chessBoard),
                          new Piece('Bishop', this.blackPlayer, {file: 7, rank: 9}, this.chessBoard),
                          new Piece('Queen', this.blackPlayer, {file: 5, rank: 9}, this.chessBoard),
                          new Piece('King', this.blackPlayer, {file: 6, rank: 9}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 2, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 3, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 4, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 5, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 6, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 7, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 8, rank: 8}, this.chessBoard),
                          new Piece('Pawn', this.blackPlayer, {file: 9, rank: 8}, this.chessBoard)
                        ];

    this.chessBoard.addPieces(whitePieces);
    this.chessBoard.addPieces(blackPieces);
    Array.prototype.push.apply(this.whitePlayer.pieces, whitePieces);
    Array.prototype.push.apply(this.blackPlayer.pieces, blackPieces);

    //  Sentinel pieces
    for(var i = 0; i < this.chessBoard.contents.length; i++){
      for(var j = 0; j < this.chessBoard.contents[0].length; j++){
        if(this.chessBoard.FILES - i  <= 2 || this.chessBoard.RANKS - j <= 2 || i < 2 || j < 2){
          this.chessBoard.addPiece(new Piece('INVALID', null, {file: i, rank: j}, this.chessBoard));
        }
      }
    }
  }

  this.displayState = function displayState(){
    console.log(this.chessBoard.toString());
    console.log((this.turn ? 'White' : 'Black') + '\'s turn to move:');
  };

  this.run = function run(){
    this.init();
    
    //  Loops for each turn while gameOver flag is false
    while(!this.gameOver){
      this.displayState();

      //  Returns to retry getting Move as long as current Move is invalid
      while(!this.validatedMove){
        this.interface.getMove();
      }
    }
  };
};



/** 
  * PIECE
  * 
  * Represents single chess piece 
  *  
  * Lookups on piece type will be handled by
  * PIECE_TYPE lookup.
  * 
  */
//  For use with toString
var PIECE_ABBREV = ['K', 'Q', 'R', 'B', 'N', 'P'];
var PIECE_TYPE = ['King', 'Queen', 'Rook', 'Bishop', 'Knight', 'Pawn', 'INVALID'];
//  Augments the regular lookup with inverse
var INVERSE_PIECE = {
  'King': 0,
  'K': 0,
  'Queen': 1,
  'Q': 1,
  'Rook': 2,
  'R': 2,
  'Bishop': 3,
  'B': 3,
  'Knight': 4,
  'N': 4,
  'Pawn': 5,
  'P': 5,
  'INVALID': 6
};
_.extend(PIECE_TYPE, INVERSE_PIECE);

var Piece = function Piece(type, owner, coordinates, board){
  this.type = PIECE_TYPE[type];
  this.owner = owner;
  this.coordinates = coordinates;
  this.board = board;
  this.hasMoved = false;

  //  Gets all valid moves by current piece
  this.getValidMoves = function getValidMoves(){
    var validMoves = [];

    switch(PIECE_TYPE[this.type]){
      case 'King':
        //  Check that this piece has not moved
        if(!this.hasMoved){
          //  Get player color
          var color = this.owner.color;

          var regions = this.board.castlingRegions[color]['King'];
          var rook = this.board.getPiece(regions[0])
          //  Check King's rook for moves
          if(!rook.hasMoved){
            //  Checking that way is unobstructed
            if(_.every(regions, function(element, index, list){
              //  if the Piece is the King or the Rook, or undefined
              var piece = this.board.getPiece(element)
              return (piece === this) || (piece === rook) || (piece === undefined);
            }, this)){
              //  Checking for any castling regions under attack
              if(!_.some(regions, function(element, index, list){
                return this.board.getAttackers(element, !color);
              }, this)){
                validMoves.push(new Move('CastleKing'));
              }
            }
          }

          regions = this.board.castlingRegions[color]['Queen'];
          rook = this.board.getPiece(regions[0])
          //  Check King's rook for moves
          if(!rook.hasMoved){
            //  Checking that way is unobstructed
            if(_.every(regions, function(element, index, list){
              //  if the Piece is the King or the Rook, or undefined
              var piece = this.board.getPiece(element)
              return (piece === this) || (piece === rook) || (piece === undefined);
            }, this)){
              //  Checking for any castling regions under attack
              if(!_.some(regions, function(element, index, list){
                return this.board.getAttackers(element, !color);
              }, this)){
                validMoves.push(new Move('CastleQueen'));
              }
            }
          }
        }
      case 'Knight':
        var directions = PIECE_DIRECTIONS[PIECE_TYPE[this.type]];
        _.each(directions, function(element, index, list){
          var newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
          newMove.coordinates_new = _.clone(this.coordinates);
          this.board.addCoordinates(newMove.coordinates_new, element);

          //  If the space is empty, new move available
          if(!this.board.getPiece(newMove.coordinates_new)){
            validMoves.push(newMove);
          }
          //  Otherwise, check piece type to see if capture is available
          else{
            var adjacentPiece = this.board.getPiece(newMove.coordinates_new);
            //  First part short circuit should be unneeded, but making sure not null
            if(adjacentPiece && adjacentPiece.owner && (adjacentPiece.owner.color !== this.owner.color)){
              newMove.captureFlag = true;
              newMove.capturePiece = adjacentPiece;
              validMoves.push(newMove);
            }
          }
        }, this);
        break;
      case 'Rook':
      case 'Bishop':
      case 'Queen':
        var directions = PIECE_DIRECTIONS[PIECE_TYPE[this.type]];
        var extents = this.board.crawl(this.coordinates, directions);
        _.each(extents, function(element, index, list){
          var newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
          newMove.coordinates_new = _.clone(this.coordinates);
          this.board.addCoordinates(newMove.coordinates_new, directions[index]);
          //  Loop (element - 1) times: non-capturing move is valid, keep incrementing by direction
          for(var i = 1; i < element; i++){
            validMoves.push(newMove.clone());
            this.board.addCoordinates(newMove.coordinates_new, directions[index]);
          }
          //  Afterwards, check piece type to see if capture is available
          var adjacentPiece = this.board.getPiece(newMove.coordinates_new);
          //  First part short circuit should be unneeded, but making sure not null
          if(adjacentPiece && adjacentPiece.owner && (adjacentPiece.owner.color !== this.owner.color)){
            newMove.captureFlag = true;
            newMove.capturePiece = adjacentPiece;
            validMoves.push(newMove);
          }
        }, this);
        break;
      case 'Pawn':
        //  NOTE: OPPOSITE OF DIRECTION DEFINITION FOR BOARD.GETATTACKERS. GETATTACKERS
        //  USES DIRECTION IN CONTEXT OF ATTACKED PIECE, THIS USES DIRECTION IN CONTEXT
        //  OF SELECTED PIECE.
        var direction = this.owner.color ? 1 : -1;

        //  DIAGONAL CAPTURES
        var diagonals = [{file: 1, rank: direction}, {file: -1, rank: direction}];

        _.each(diagonals, function(element, index, list){
          var newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
          newMove.coordinates_new = _.clone(this.coordinates);
          this.board.addCoordinates(newMove.coordinates_new, element);

          var adjacentPiece = this.board.getPiece(newMove.coordinates_new);
          //  First part short circuit should be unneeded, but making sure not null
          if(adjacentPiece && adjacentPiece.owner && (adjacentPiece.owner.color !== this.owner.color)){
            newMove.captureFlag = true;
            newMove.capturePiece = adjacentPiece;
            validMoves.push(newMove);
          }
        }, this);

        //  FORWARD MOVES
        var newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
        newMove.coordinates_new = _.clone(this.coordinates);
        
        //  SINGLE PUSH
        newMove.coordinates_new.rank += direction;
        if(!this.board.getPiece(newMove.coordinates_new)){
          validMoves.push(newMove);

          //  DOUBLE PUSH
          newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
          newMove.coordinates_new = _.clone(this.coordinates);
          newMove.coordinates_new.rank += direction * 2;
          if(!this.board.getPiece(newMove.coordinates_new) && !this.hasMoved){
            newMove.doublePush = true;
            validMoves.push(newMove);
          }
        }

        //  EN PASSANT
        var EPTargets = _.map(diagonals, function(element, index, list){
          var element_new = _.clone(element);
          element_new.rank = 0;
          this.board.addCoordinates(element_new, this.coordinates);
          return element_new;
        }, this);

        _.each(EPTargets, function(element, index, list){
          newMove = new Move('Move', this, this.coordinates, undefined, false, undefined, false, undefined);
          newMove.coordinates_new = _.clone(this.coordinates);
          this.board.addCoordinates(newMove.coordinates_new, diagonals[index]);
          var EPPiece = this.board.getPiece(element);
          if(EPPiece && EPPiece.owner && (EPPiece.owner.color !== this.owner.color) && EPPiece.owner.doublePush && (EPPiece.owner.doublePushPawn === EPPiece)){
            newMove.captureFlag = true;
            newMove.capturePiece = EPPiece;
            validMoves.push(newMove);
          }
        }, this);

        break;
    }
    return (validMoves.length > 0) ? validMoves : null;
  };
};

//  Utility for checking different directions / possible relative moves
//  for pieces. Used together with Board.crawl
var PIECE_DIRECTIONS = {
  'King':   [ {file: 1,rank: 1},
              {file: 1,rank: 0},
              {file: 1,rank: -1},
              {file: 0,rank: 1},
              {file: 0,rank: -1},
              {file: -1,rank: 1},
              {file: -1,rank: 0},
              {file: -1,rank: -1}
            ],
  'Queen':  [ {file: 1,rank: 1},
              {file: 1,rank: 0},
              {file: 1,rank: -1},
              {file: 0,rank: 1},
              {file: 0,rank: -1},
              {file: -1,rank: 1},
              {file: -1,rank: 0},
              {file: -1,rank: -1}
            ],
  'Rook':   [ {file: 1,rank: 0},
              {file: 0,rank: 1},
              {file: 0,rank: -1},
              {file: -1,rank: 0}
            ],
  'Bishop': [ {file: 1,rank: 1},
              {file: 1,rank: -1},
              {file: -1,rank: 1},
              {file: -1,rank: -1}
            ],
  'Knight': [ {file: 2,rank: 1},
              {file: 2,rank: -1},
              {file: 1,rank: 2},
              {file: 1,rank: -2},
              {file: -2,rank: 1},
              {file: -2,rank: -1},
              {file: -1,rank: 2},
              {file: -1,rank: -2}
            ]
};

//  Overriding toString() for a piece to help print out entire board
Piece.prototype.toString = function toString(){
  return (this.type === 6) ? 'X' : (this.owner.color ? (PIECE_ABBREV[this.type]).toUpperCase() : (PIECE_ABBREV[this.type]).toLowerCase());
};



/** 
  * BOARD
  * 
  * Extended 12x12 array of pieces with additional
  * functionality, i.e. checking for piece location,
  * move validity, and determining check. 2 extra spaces
  * of padding on all 4 sides with sentinel pieces to ease
  * determination of move validity.
  * 
  */

var Board = function Board(){
  this.FILES_BOARD = 8;
  this.RANKS_BOARD = 8;
  this.SENTINEL_PADDING = 2;
  this.FILES = this.FILES_BOARD + this.SENTINEL_PADDING * 2;
  this.RANKS = this.RANKS_BOARD + this.SENTINEL_PADDING * 2;
  this.contents = new Array(this.FILES);
  for(var i = 0; i < this.RANKS; i++)
  {
    this.contents[i] = new Array(this.RANKS);
  }

  //  Castling regions (need to check for any attackers
  //  on these spaces)
  this.castlingRegions = {
    true:   {
              'King':   [
                          {file: 9, rank: 2},   // <------ ROOK POSITION
                          {file: 8, rank: 2},
                          {file: 7, rank: 2},
                          {file: 6, rank: 2}
                        ],
              'Queen':  [
                          {file: 2, rank: 2},   // <------ ROOK POSITION
                          {file: 3, rank: 2},
                          {file: 4, rank: 2},
                          {file: 5, rank: 2},
                          {file: 6, rank: 2}
                        ]
            },
    false:  {
              'King':   [
                          {file: 9, rank: 9},   // <------ ROOK POSITION
                          {file: 8, rank: 9},
                          {file: 7, rank: 9},
                          {file: 6, rank: 9}
                        ],
              'Queen':  [
                          {file: 2, rank: 9},   // <------ ROOK POSITION
                          {file: 3, rank: 9},
                          {file: 4, rank: 9},
                          {file: 5, rank: 9},
                          {file: 6, rank: 9}
                        ]
            }
  };

  //  Used to initialize board
  this.addPiece = function addPiece(piece){
    this.contents[piece.coordinates.file][piece.coordinates.rank] = piece;
  };

  this.addPieces = function addPieces(array){
    _.each(array, function(element, index, list){
      this.addPiece(element);
    }, this);
  };

  //  Gets all attackers of a Player on a single square
  //  Returns an array of Pieces
  //  ONLY DETERMINES ATTACKERS IN CONTEXT OF CHECK
  //  DOES NOT INCORPORATE EN PASSANT
  this.getAttackers = function(coordinates, color){
    var attackers = [];

    //  Getting direction of player
    var playerDirection = color ? -1 : 1;

    //  Crawl in all directions and check knight squares
    var directionVectors;

    //  Crawling in STRAIGHT directions
    var directionVectors = ATTACK_DIRECTIONS['Straight'];
    var extents = this.crawl(coordinates, directionVectors);
    _.each(extents, function(element, index, list){
      var coordinates_temp = _.clone(coordinates);
      var directions_temp = _.clone(directionVectors[index]);
      directions_temp.file *= element;
      directions_temp.rank *= element;
      this.addCoordinates(coordinates_temp, directions_temp);
      var adjacentPiece = this.getPiece(coordinates_temp);
      //  After getting adjacent Piece
      //  If piece exists 
      //  Has an owner
      //  Owner matches Player
      //  Piece type is King, Queen or Rook
      if(adjacentPiece && adjacentPiece.owner && adjacentPiece.owner.color === color && ((PIECE_TYPE[adjacentPiece.type] === 'King' && element === 1) || PIECE_TYPE[adjacentPiece.type] === 'Queen' || PIECE_TYPE[adjacentPiece.type] === 'Rook')){
        attackers.push(adjacentPiece);
      }
    }, this);

    //  Crawling in DIAGONAL directions
    directionVectors = ATTACK_DIRECTIONS['Diagonal'];
    extents = this.crawl(coordinates, directionVectors);
    _.each(extents, function(element, index, list){
      coordinates_temp = _.clone(coordinates);
      directions_temp = _.clone(directionVectors[index]);
      directions_temp.file *= element;
      directions_temp.rank *= element;
      this.addCoordinates(coordinates_temp, directions_temp);
      adjacentPiece = this.getPiece(coordinates_temp);
      //  After getting adjacent Piece
      //  If piece exists 
      //  Has an owner
      //  Owner matches Player
      //  Piece type is King, Pawn, Queen, or Bishop
      if(adjacentPiece && adjacentPiece.owner && adjacentPiece.owner.color === color && ((PIECE_TYPE[adjacentPiece.type] === 'Pawn' && directionVectors[index].rank === playerDirection && element === 1) || (PIECE_TYPE[adjacentPiece.type] === 'King' && element === 1) || PIECE_TYPE[adjacentPiece.type] === 'Queen' || PIECE_TYPE[adjacentPiece.type] === 'Bishop')){
        attackers.push(adjacentPiece);
      }
    }, this);

    //  No Crawl for Knight directions
    directionVectors = ATTACK_DIRECTIONS['Knight'];
    _.each(directionVectors, function(element, index, list){
      coordinates_temp = _.clone(coordinates);
      this.addCoordinates(coordinates_temp, element);
      adjacentPiece = this.getPiece(coordinates_temp);
      //  After getting adjacent Piece
      //  If piece exists 
      //  Has an owner
      //  Owner matches Player
      //  Piece type is Knight
      if(adjacentPiece && adjacentPiece.owner && adjacentPiece.owner.color === color && PIECE_TYPE[adjacentPiece.type] === 'Knight'){
        attackers.push(adjacentPiece);
      }
    }, this);
    return (attackers.length > 0) ? attackers : null;
  };

  //  Crawls board from point of origin in given directions (coordinate-set deltas)
  //  and returns the extent of open board room in that direction (number of deltas
  //  applied to origin before hitting another piece or running off of board) for 
  //  each direction
  this.crawl = function crawl(coordinates_origin, directions){
    var extents = new Array(directions.length);
    _.each(directions, function(element, index, list){
      //  Min number before piece collision is 1
      var count = 1;
      var coordinates_temp = _.clone(coordinates_origin);
      this.addCoordinates(coordinates_temp, element);
      while(this.getPiece(coordinates_temp) == undefined){
        count++;
        this.addCoordinates(coordinates_temp, element);
      }
      //  Store in extents array
      extents[index] = count;
    }, this);
    return extents;
  };

  //  Adds second set of coordinates to the first set. DOES NOT RETURN NEW SET
  //  AND ONLY MODIFIES THE FIRST SET. Should put this in coordinates class if 
  //  there ever were one to be made...
  this.addCoordinates = function addCoordinates(coordinates_1, coordinates_2){
    coordinates_1.file += coordinates_2.file;
    coordinates_1.rank += coordinates_2.rank;
  };

  //  Simpler piece retrieval
  this.getPiece = function getPiece(coordinates){
    return this.contents[coordinates.file][coordinates.rank];
  };
};

//  Overriding toString to print out Board contents
Board.prototype.toString = function toString(){
  var output = '\n';
  for(var rank = 0; rank < this.contents[0].length; rank++){
    var tempString = '';
    for(var file = 0; file < this.contents.length; file++){
      tempString += (this.contents[file][rank] ? this.contents[file][rank].toString() : '-')+ ' '; 
    }
    output += tempString + '\n';
  }
  return output;
}

var ATTACK_DIRECTIONS = {
  'Straight': PIECE_DIRECTIONS['Rook'],
  'Diagonal': PIECE_DIRECTIONS['Bishop'],
  'Knight':   PIECE_DIRECTIONS['Knight']

};

/** 
  * Interface
  * 
  * Public interface that exposes certain objects and 
  * methods used to play game.
  * 
  */

var Interface = function Interface(game){
  this.chessGame = game;

  this.getMove = function getMove(){
    return this.parseMove(readline.prompt());
  };

  //  Parses all moves as incoming text
  this.parseMove = function parseMove(string){
    var output = new Move();
    output.chessPiece = new Piece();
    output.coordinates_new = {file: -1, rank: -1};
    output.coordinates_old = {file: -1, rank: -1};
    //  ASCII character before 'a'
    var FILE_ZERO = '`';
    //  Setting flags, default to false
    output.captureFlag = output.promoteFlag = false;
    //  By default move is INVALID
    output.moveType = MOVE_TYPE['INVALID'];
    //  Iterate over all possible move formats
    for(var i in MOVE_REGEX){
      //  Try to match regex to input string
      var res = MOVE_REGEX[i].exec(string);
      // if match, populate output Move to extent possible
      if(res !== null){
        switch(i){
          case 'PAWN_MOVE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE['Pawn'];
            output.coordinates_old.file = output.coordinates_new.file = res[1].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[2] + this.chessGame.chessBoard.SENTINEL_PADDING;
            break;
          case 'PAWN_PROMOTE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE['Pawn'];
            output.coordinates_old.file = output.coordinates_new.file = res[1].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[2] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.promoteFlag = true;
            output.promoteType = PIECE_TYPE[res[3]];
            break;
          case 'PAWN_CAPTURE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE['Pawn'];
            output.coordinates_old.file = res[1].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[3] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.captureFlag = true;
            break;
          case 'PAWN_CAPTURE_PROMOTE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE['Pawn'];
            output.coordinates_old.file = res[1].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[3] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.captureFlag = true;
            output.promoteFlag = true;
            output.promoteType = PIECE_TYPE[res[4]];
            break;
          case 'PIECE_MOVE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_new.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[3] + this.chessGame.chessBoard.SENTINEL_PADDING;
            break;
          case 'PIECE_CAPTURE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_new.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[3] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.captureFlag = true;
            break;
          case 'PIECE_MOVE_DISAMBIG_FILE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_old.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[3].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[4] + this.chessGame.chessBoard.SENTINEL_PADDING;
            break;
          case 'PIECE_CAPTURE_DISAMBIG_FILE':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_old.file = res[2].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[3].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[4] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.captureFlag = true;
            break;
          case 'PIECE_MOVE_DISAMBIG_RANK':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_old.rank = +res[2] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[3].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[4] + this.chessGame.chessBoard.SENTINEL_PADDING;
            break;
          case 'PIECE_CAPTURE_DISAMBIG_RANK':
            output.moveType = MOVE_TYPE['Move'];
            output.chessPiece.type = PIECE_TYPE[res[1]];
            output.coordinates_old.rank = +res[2] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.file = res[3].charCodeAt() - FILE_ZERO.charCodeAt() + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.coordinates_new.rank = +res[4] + this.chessGame.chessBoard.SENTINEL_PADDING;
            output.captureFlag = true;
            break;
          case 'CASTLE_KING':
            output.moveType = MOVE_TYPE['CastleKing'];
            break;
          case 'CASTLE_QUEEN':
            output.moveType = MOVE_TYPE['CastleQueen'];
            break;
        }
      }
    }
  return output;
  };  
};

//  Regex definitions of different types of moves
var MOVE_REGEX = {
  /**
    * Regular expressions to match different types of 
    * algebraic chess notation.
    *
    */
  
  //  Yes, there are capturing parentheses around non-capturing parentheses.
  //  Left them in there JIC for simplicity of reading, IMO.
  PAWN_MOVE: /(?:^|^\s*)([a-h])([1-7])\+?\#?(?:$|\s*$)/,
  PAWN_PROMOTE: /(?:^|^\s*)([a-h])(8)\=((?:Q|B|N|R))\+?\#?(?:$|\s*$)/,
  PAWN_CAPTURE: /(?:^|^\s*)([a-h])x([a-h])([1-7])\+?\#?(?:$|\s*$)/,
  PAWN_CAPTURE_PROMOTE: /(?:^|^\s*)([a-h])x([a-h])(8)\=((?:Q|B|N|R))\+?\#?(?:$|\s*$)/,
  PIECE_MOVE: /(?:^|^\s*)((?:K|Q|B|N|R))([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  PIECE_CAPTURE: /(?:^|^\s*)((?:K|Q|B|N|R))x([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  PIECE_MOVE_DISAMBIG_FILE: /(?:^|^\s*)((?:K|Q|B|N|R))([a-h])([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  PIECE_CAPTURE_DISAMBIG_FILE: /(?:^|^\s*)((?:K|Q|B|N|R))([a-h])x([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  PIECE_MOVE_DISAMBIG_RANK: /(?:^|^\s*)((?:K|Q|B|N|R))([1-8])([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  PIECE_CAPTURE_DISAMBIG_RANK: /(?:^|^\s*)((?:K|Q|B|N|R))([1-8])x([a-h])([1-8])\+?\#?(?:$|\s*$)/,
  CASTLE_KING: /(?:^|^\s*)(?:O|0)\-(?:O|0)\+?\#?(?:$|\s*$)/,
  CASTLE_QUEEN: /(?:^|^\s*)(?:O|0)\-(?:O|0)\-(?:O|0)\+?\#?(?:$|\s*$)/
};



/** 
  * MOVE
  * 
  * Text moves are parsed into Moves.
  *
  * Different types of moves will be handled by
  * MOVE_TYPE lookup.
  * 
  */

var MOVE_TYPE = ['Move', 'CastleKing', 'CastleQueen', 'INVALID'];
//  Augments the regular lookup with inverse
var INVERSE_MOVE = {
  'Move': 0,
  'CastleKing': 1,
  'CastleQueen': 2,
  'INVALID': 3
};
_.extend(MOVE_TYPE, INVERSE_MOVE);

var Move = function Move(moveType, chessPiece, coordinates_old, coordinates_new, captureFlag, capturePiece, promoteFlag, promoteType){
  this.moveType = MOVE_TYPE[moveType];
  this.chessPiece = chessPiece;
  this.coordinates_old = coordinates_old;
  this.coordinates_new = coordinates_new;
  this.captureFlag = captureFlag;
  this.capturePiece = capturePiece;
  this.promoteFlag = promoteFlag;
  this.promoteType = promoteType;
  this.doublePush = false;

  this.clone = function clone(){
    //  Leave chessPiece and capturedPiece as pointers,
    //  'deep'-clone the coordinates
    return new Move(this.moveType, this.chessPiece, _.clone(this.coordinates_old), _.clone(this.coordinates_new), this.captureFlag, this.capturePiece, this.promoteFlag, this.promoteType);
  };
};



/**
  * MAIN FUNCTION
  *
  * Runs when node shell is initialized
  *
  */

var main = function main(){
  var game = new Game();
  game.run();
};

main();
