/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function(app) {
  var inbox = {};
  
  function createRoom(room)
  {
    inbox[room] = {};
  }
    //test
    createRoom(100);
  
  //Handle an incoming message:
  //TODO: roll this into POST /chat
  app.post('/chatsend/:room', function(req, res)
  {
    var outgoing = req.body;
    var time = new Date().getTime();
    var room = req.params.room;
    var nick = req.session.userInfo.accountName;
    var body = req.body.body;
    
      //test:
      console.log("adding message from " + nick + ": " + body);
    addMessage(nick, 'msg', body, time, room);
      console.log("message successfully added!");
    //res.send(200);
    res.send({"success": true});
  });
  
  //Handle requests from users:
  //TODO: roll this into GET /chat
  app.get('/chatrecv/:room', function(req, res)
  {
    var room = req.params.room;
    var since = req.query.since;
    var messageResponse = [];
    var nick = req.session.userInfo.accountName;
    
    res.send( JSON.stringify({messages: inbox[room][nick]}) );
    inbox[room][nick] = [];
    
  });
  
  //Handle a new person joining
  //TODO: roll this into POST /chat
  app.post('/chatjoin/:room', function(req, res)
  {
    var nick = req.session.userInfo.accountName;
    var time = new Date().getTime();
    var room = req.params.room;
    
    //place in each inbox:
    addMessage(nick, 'join', null, time, room);
    
    inbox[room][nick] = [];
    
    //res.send(200);
    res.send( JSON.stringify({nick: nick}) );
  });
  
  //TODO: roll this into POST /chat
  app.post('/chatpart/:room', function(req, res)
  {
    var nick = req.session.userInfo.accountName;
    var time = new Date().getTime();
    var room = req.params.room;
    
    delete inbox[room][nick];
    
    addMessage(nick, 'part', null, time, room);
    
    //res.send(200);
    res.send({"success": true});
  });
  
  function addMessage(nick, type, body, time, room)
  {
    for (user in inbox[room])
    {
      inbox[room][user].push({ nick: nick, type: type, body: body, time: time });
    }
  }
  
}

