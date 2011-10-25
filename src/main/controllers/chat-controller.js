/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function(app) {
  var chatlog = {};
  
  
  //See whether this room has exceeded its limit of message history.
  //If so, shift off the oldest message:
  function oldShift(room)
  {
    var backlog = 10;
    
    while (chatlog[room].length > backlog)
    {
      chatlog[room].shift();
    }
  }
  
  function createRoom(room)
  {
    chatlog[room] = [];
  }
    //test
    createRoom(100);
  
  //Handle an incoming message:
  app.post('/chatsend/:room', function(req, res)
  {
    var outgoing = req.body;
    var time = new Date().getTime();
    var room = req.params.room;
    var nick = req.session.userInfo.accountName;
    var body = req.body.body;
    
      //test:
      console.log("message from " + nick + ": " + body);
    
    chatlog[room].push({ nick: nick, type: "msg", body: body, time: time });
    
    oldShift(room);
  });
  
  //Handle requests from users:
  app.get('/chatrecv/:room', function(req, res)
  {
    var room = req.params.room;
    var since = req.query.since;
    var messageResponse = [];
    
      //test:
      console.log("request in " + room);
    
    for (var i = 0; i < chatlog[room].length; i++) //probably should flip the array first so you don't have to start with the old ones
    {
      if ( since < chatlog[room][i].time)
      {
        messageResponse.push(chatlog[room][i]);
      }
    }
    
    res.send(JSON.stringify( {messages: messageResponse} ));
  });
  
  //Handle a new person joining
  app.post('/chatjoin/:room', function(req, res)
  {
    var nick = req.session.userInfo.accountName;
    var time = new Date().getTime();
    var room = req.params.room;
    
    chatlog[room].push({ nick: nick, type: "join", body: null, time: time });
  });
  
  app.post('/chatpart/:room', function(req, res)
  {
    var nick = req.session.userInfo.accountName;
    var time = new Date().getTime();
    var room = req.params.room;
    
    chatlog[room].push({ nick: nick, type: "part", body: null, time: time });
  });
}
