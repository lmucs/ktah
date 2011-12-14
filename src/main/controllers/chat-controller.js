/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function (app) {
  var inbox = {};
  
  function createRoom (room) {
    inbox[room] = {};
  }
  
  //Handle requests from users:
  app.get('/chat/:room', function (req, res) {
    var room = req.params.room;
    var time = new Date().getTime();
    var messageResponse = [];
    var nick = req.session.userInfo.accountName;
    
    //Check to see whether this user is currently logged into the chat
    //If yes, send pending messages to the user
    //If not, tell user they need to [re]join
    if (typeof inbox[room] === 'undefined') {
      res.send( JSON.stringify({success: false}) );
    } else if (typeof inbox[room][nick] === 'undefined') {
      res.send( JSON.stringify({success: false}) );
    } else {
      res.send( JSON.stringify({messages: inbox[room][nick].messages, success: true}) );
      inbox[room][nick].messages = [];
      inbox[room][nick].lastPing = time;
    }
  });
  
  //handle messages, joining, and parting:
  app.post('/chat/:room', function (req, res) {
    var nick = req.session.userInfo.accountName;
    var otherNicks = [];
    var time = new Date().getTime();
    var room = req.params.room;
    var type = req.body.type;
    var body = req.body.body;
    
    switch (type) {
      case 'join':
        //create the room if it doesn't exist yet:
        if (typeof inbox[room] === 'undefined') {
          createRoom(room);
        }
        
        //place in each inbox:
        addMessage(nick, 'join', null, time, room);
        
        //build list of other nicks:
        for (var user in inbox[room]) {
          otherNicks.push(user);
        }
        
        //create inbox for this user:
        inbox[room][nick] = {};
        inbox[room][nick].messages = [];
        inbox[room][nick].lastPing = time;
        
        //give this user their nick and list of other nicks:
        res.send( JSON.stringify({nick: nick, otherNicks: otherNicks}) );
        break;
        
      case 'msg':
        addMessage(nick, 'msg', body, time, room);
        res.send({"success": true});
        break;
        
      case 'part':
        deleteUser(nick, room);
        res.send({"success": true});
        break;
    }
  });
  
  //Distribute a message to the appropriate users
  function addMessage(nick, type, body, time, room) {
    for (user in inbox[room]) {
      inbox[room][user].messages.push({ nick: nick, type: type, body: body, time: time });
    }
  }
  
  //Delete user with the given nick in the given room and notify
  //the other users in that room
  function deleteUser(nick, room) {
    var time = new Date().getTime();
    
    delete inbox[room][nick];
    addMessage(nick, 'part', null, time, room);
  }
  
  //Kick users that haven't made a request in the last 30s:
  setInterval(function ()
  {
    var time = new Date().getTime();
    
    for (var room in inbox) {
      for (var nick in inbox[room]) {
        if (time - inbox[room][nick].lastPing > 30*1000) {
          deleteUser(nick, room);
        }
      }
    } 
  }, 5*1000);
}

