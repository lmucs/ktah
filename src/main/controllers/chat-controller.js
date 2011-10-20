/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function(app) {

  //the array that holds all of the messages:
  //first dimension is the room, second d is the message
  //
  //Each message is a JSON object:
  //nick: the nick of the user that sent the message originally
  //time: the unix timestamp of the message
  //type: the type of message, either msg, join, or part
  //body: if type msg, the actual content of the message
  var messages = {};
    //test:
    messages[0] = [];
    messages[0].push({ nick: 654321, type: "msg", body: "This is the first message", time: 100 });
    messages[0].push({ nick: 765432, type: "msg", body: "This is the second message", time: 200 });
  
  //The maximum number of messages stored in memory:
  var MESSAGECAP = 100;
  
  //This is a 2-d array to mark who is in which room(s)
  //The first dimension is indexed by room number (lobby or game no.)
  //The second dimension is indexed regularly and lists the id's of everyone
  //in that room
  var occupants = {};
    //test:
    occupants[0] = [];
  
  //Holds the timeout objects so they can be accessed and cleared as
  //necessary. First dimension is room, and second is objects.
  var timeouts = {};
    //test:
    timeouts[0] = {};
    
  var ajaxCallbacks = {};
    //test:
    ajaxCallbacks[0] = {};
  
  /**
   * Takes the number of a room to be created, instantiates the
   * necessary resources, and starts the chat.
   */
  function createRoom(roomNumber)
  {
    messages[roomNumber] = [];
    occupants[roomNumber] = [];
    timeouts[roomNumber] = {};
    ajaxCallbacks[roomNumber] = {};
    //TODO:
    //Start time for room, etc.
  }
  
    //test:
    createRoom(100); //creating this for testing
  
  /**
   * Ends the chat with the given room number.
   */
  function destroyRoom(roomNumber)
  {
    messages[roomNumber] = undefined;
    occupants[roomNumber] = undefined;
    timeouts[roomNumber] = undefined;
    
    //TODO:
    //Other stuff necessary to destroying a chat room
  }
  
  //app.get('chat', function(req, res) {
    // TODO: just a stub for the chat controller
  //})
  
  app.post('/chatjoin', function(req, res) {
    //var id = req.body.id;
    var nick = req.session.userInfo.accountName;
    var id   = req.session.userInfo.accountId;
    var room = req.body.room;
    var time = new Date().getTime();
    
    //add the new user to the list of occupants:
    occupants[room].push(id);
    console.log("New User Joining chat: " + nick + "(" + id + ")" + " in room " + room + " at timestamp " + time);
    
    //Notify other users:
    send(nick, 'join', null, time, room);
    
    //Sending the client their name and id for now, until a global solution is available:
    res.send(JSON.stringify({nick: nick, id: id}));
  });
  
  app.post('/chatpart', function(req, res) {
    var nick = req.session.userInfo.accountName;
    var id = req.session.userInfo.accountId;
    var room = req.body.room;
    var time = new Date().getTime();
    
    //remove this user from the list of occupants:
    for (var i = 0; i < occupants[room].length; i++)
    {
      if (occupants[room][i] === id)
      {
        occupants[room].splice(i, i);
        console.log("User leaving chat: " + nick + "(" + id + ")" + " in room " + room + " at timestamp " + time);
        break;
      }
    }
    
    //Notify other users:
    send(nick, 'part', null, time, room);
  });
  
  app.get('/chatwho', function(req, res) {
    room = req.query.room;
    //TODO: get a list of everyone in the requested room
    res.send(JSON.stringify({nicks: occupants[room]}));
  });
  
  app.get('/chatrecv', function(req, res) {
    var nick = req.session.userInfo.accountName;
    var id   = req.session.userInfo.accountId;
    var room = req.query.room;
    if (typeof room === 'undefined') //TODO: turn these validators into a function
    {
      res.simpleJSON(400, {error: 'Missing room parameter'});
      return;
    }
    var since = req.query.since;
    if (typeof since === 'undefined')
    {
      res.simpleJSON(400, {error: 'Missing since parameter'});
      return;
    }
    //console.log("longpoll: id: " + id + " room: " + room + " last message: " + since);
    
    //Search through the messages Array and grab all of the messages since since
    //and put them in res under key messages and send back
    messageResponse = [];
    
    function buildMessageResponse()
    {
      for (var i = 0; i < messages[room].length; i++)
      {
        //if ((messages[room][i].time > since) && (messages[room][i].nick !== nick))
                                                //since one's own messages are printed automatically
        {
          messageResponse.push(messages[room][i]);
            //test:
            //console.log('building message response for ' + nick);
        }
      }
    }
    
    function sendMessageResponse()
    {
      //res.contentType('application/JSON');
        //test:
        //console.log("sending response for " + nick);
      res.send(JSON.stringify({messages: messageResponse}));
      
    }
    
    //ajaxCallbacks[room][id] = function() {/*test*//*console.log("sending response for " + nick);*/ buildMessageResponse(); sendMessageResponse();};
    ajaxCallbacks[room][id] = res;
  });
  
  app.get('/chatsend', function(req, res) {
    var nick = req.session.userInfo.accountName;
    var id   = req.session.userInfo.accountId;
    var room = req.query.room;
    var body = req.query.body;
    var time = parseInt(req.query.time);
    
      //test:
      //for (i in ajaxCallbacks[room])
      //  console.log(ajaxCallbacks[room][i]);
    send(nick, 'msg', body, time, room);
    
    //Add the new message to message history
    //messages[room].push({ nick: nick, type: 'msg', body: body, time: time });
    //console.log(nick + "(" + id + ")" + ' in room ' + room + ': ' + body);
    //console.log(id + ' in room ' + room + ': ' + body);
    //if (messages[room].length > MESSAGECAP)
    //{
    //  messages[room].shift();
    //}
    
    //fire all of the ajax callbacks to send the new message to everyone
    //and clear the message history
    //for (i in ajaxCallbacks[room])
    //{
    //  ajaxCallbacks[room][i]();
    //}
    //messages[room] = [];
  });
  
  function send(nick, type, body, time, room)
  {
    
    //messages[room].push({ nick: nick, type: type, body: body, time: time });
      //test:
      //console.log('pushing: ' + nick + ' ' + type + ' ' + body + ' ' + time);
    
    //fire all of the ajax callbacks to send the new message to everyone
    //and clear the message history
    for (i in ajaxCallbacks[room])
    {
        //test:
        //console.log('ajaxCallbacks[room].length: ' + ajaxCallbacks[room].length);
        //console.log(nick + ' ' + ajaxCallbacks[room][i]);
        //for (j in i)
        //  console.log(nick + ' ' + i[j]);
        
      //ajaxCallbacks[room][i]();
      ajaxCallbacks[room][i].send(JSON.stringify({messages: [{ nick: nick, type: type, body: body, time: time }]}));
    }
    //messages[room] = [];
  }

}
