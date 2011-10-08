/*
 * game-service.js
 * 
 * contains the ajax get and post calls to send
 * to the back end, as well as builds the gamestate
 * object
 * 
 * TODO: should this handle setting the timer that updates
 * the game state, or do we want to mix that in with the
 * graphics drawing timer?
 */

$(function(){
  var playerInfo = {
    "id": "hodavidhara",
    "class": "chemist",
    "posX": 135,
    "posZ": -43,
    "state": "idle",
    "health": "9001",
    "experience": "20482",
    "resources": [],
    "status": "jetpack"
  }
  
  var createGame = function () {
    // TODO:
    // 1. create the game state
    // 2. add player info to players array
    // 3. post gamestate to the server
  };
  
  var joinGame = function () {
    // TODO:
    // 1. get gamestate from server
    // 2. add player info to the players array
    // 3. post gamestate to the server
  }
  
  ktah.gamestate = {
    
  }
});

var postGamestate = function (gamestate){
  $.ajax({
    type: 'POST',
    url: '/gameinfo/' + gameId,
    data: JSON.stringify({game: "number", test: 'something'}),
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
};

var getGamestate = function (gamestate){
  $.ajax({
    type: 'GET',
    url: '/gameinfo/' + gameId,
    success: function (data) {
      console.log(JSON.stringify(data));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
};