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
  //id: the id of the user that sent the message originally
  //time: the unix timestamp of the message
  //type: the type of message, either msg, join, or part
  //body: if type msg, the actual content of the message
  var messages = [];
    //test:
    messages[0] = [];
    messages[0].push({ id: 654321, type: "msg", body: "This is the first message", time: 100 });
    messages[0].push({ id: 765432, type: "msg", body: "This is the second message", time: 200 });
  
  //The maximum number of messages stored in memory:
  var MESSAGECAP = 100;
  
  //This is a 2-d array to mark who is in which room(s)
  //The first dimension is indexed by room number (lobby or game no.)
  //The second dimension is indexed regularly and lists the id's of everyone
  //in that room
  var occupants = [];
  
  //Holds the timeout objects so they can be accessed and cleared as
  //necessary. First dimension is room, and second is objects.
  var timeouts = [];
    //test:
    timeouts[0] = [];
  
  /**
   * Takes the number of a room to be created, instantiates the
   * necessary resources, and starts the chat.
   */
  function createRoom(roomNumber)
  {
    messages[roomNumber] = [];
    occupants[roomNumber] = [];
    timeouts[roomNumber] = [];
    //TODO:
    //Start time for room, etc.
  }
  
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
    var id = req.body.id;
    var room = req.body.room;
    var time = new Date().getTime();
    console.log("New User Joining chat: " + id + " in room " + room + " at timestamp " + time);
  });
  
  app.get('/chatwho', function(req, res) {
    //TODO: get a list of everyone in the requested room
  });
  
  app.get('/chatrecv', function(req, res) {
    var id = req.query.id;
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
        if (messages[room][i].time > since)
        {
          messageResponse.push(messages[room][i]);
        }
      }
    }
    
    function sendMessageResponse()
    {
      res.contentType('application/JSON');
      res.send(JSON.stringify({messages: messageResponse}));
    }
    
    //Try once to see if any messages are new
    buildMessageResponse();
    
    //if there aren't, hold on to this request for another 30s
    if (messageResponse.length < 1)
    {
      var t = setTimeout(function() {buildMessageResponse(); sendMessageResponse();}, 30 * 1000);
      timeouts[room].push(t);
    }
    else
    {
      sendMessageResponse();
    }

    
  });
  
  app.get('/chatsend', function(req, res) {
    var id = req.query.id;
    var room = req.query.room;
    var body = req.query.body;
    
    //Add the new message to message history, and shift off old ones if
    //above capacity
    messages[room].push({ id: id, type: 'msg', body: body, time: new Date().getTime() });
    console.log(id + ' in room ' + room + ': ' + body);
    if (messages[room].length > MESSAGECAP)
    {
      messages[room].shift();
    }
    
    //Clear the timeouts for everyone in the room to respond to the AJAX req's
    for (i in timeouts[room])
    {
      clearTimeout(i);
    }
  });

}
