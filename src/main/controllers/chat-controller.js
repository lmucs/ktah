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
  
  //Handle requests from users:
  app.get('/chat/:room', function(req, res)
  {
    var room = req.params.room;
    var since = req.query.since;
    var messageResponse = [];
    var nick = req.session.userInfo.accountName;
    
    //Check to see whether this user is currently logged into the chat
    //If yes, send pending messages to the user
    //If not, tell user they need to [re]join
    if (typeof inbox[room][nick] !== undefined)
    {
      res.send( JSON.stringify({messages: inbox[room][nick], success: true}) );
      inbox[room][nick] = [];
    }
    else
    {
      res.send( JSON.stringify({success: false}) );
    }
  });
  
  //handle messages, joining, and parting:
  app.post('/chat/:room', function(req, res)
  {
    var nick = req.session.userInfo.accountName;
    var time = new Date().getTime();
    var room = req.params.room;
    var type = req.body.type;
    var body = req.body.body;
    
    switch (type)
    {
      case 'join':
        //place in each inbox:
        addMessage(nick, 'join', null, time, room);
        //create inbox for this user:
        inbox[room][nick] = [];
        //give this user their nick:
        res.send( JSON.stringify({nick: nick}) );
        break;
      case 'msg':
        addMessage(nick, 'msg', body, time, room);
        res.send({"success": true});
        break;
      case 'part':
        delete inbox[room][nick];
        addMessage(nick, 'part', null, time, room);
        res.send({"success": true});
        break;
    }
  });
  
  function addMessage(nick, type, body, time, room)
  {
    for (user in inbox[room])
    {
      inbox[room][user].push({ nick: nick, type: type, body: body, time: time });
    }
  }
  
}

