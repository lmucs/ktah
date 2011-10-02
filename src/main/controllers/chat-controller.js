/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function(app) {

  //the array that holds all of the messages:
  //first dimension is the room, second d is the time
  //
  //Since there can theoretically be multiple messages with the same timestamp,
  //time is an array of json objects with the following attributes:
  //id: the id of the user that sent the message originally
  //time: the unix timestamp of the message
  //type: the type of message, either msg, join, or part
  //body: if type msg, the actual content of the message
  var messages = [];
    //test:
    messages[0] = [];
    messages[0][100] = [];
    messages[0][200] = [];
    messages[0][100][0] = { id: 654321, type: "msg", body: "This is the first message", time: 100 };
    messages[0][200][1] = { id: 765432, type: "msg", body: "This is the second message", time: 200 };
     
  //app.get('chat', function(req, res) {
    // TODO: just a stub for the chat controller
  //})
  
  app.post('/chatjoin', function(req, res) {
    /*
    for (i in req['body'])
    {
      console.log(i + ": " + req[i]);
    }
    */
    
    var id = req.body.id;
    var room = req.body.room;
    var time = new Date().getTime();
    console.log("New User Joining chat: " + id + " in room " + room + " at " + time);
    //res.send("Welcome to chat. Your user ID is " + userID + ".");
  });
  
  app.get('/chatwho', function(req, res) {
    //TODO: get a list of everyone in the requested room
  });
  
  app.get('/chatrecv', function(req, res) {
    var id = req.query.id;
    var room = req.query.room;
    var since = req.query.since;
    console.log("longpoll: id: " + id + " room: " + room + " last message: " + since);
    
    //Search through the messages Array and grab all of the messages since since
    //and put them in res under key messages and send back
    //TODO^
    
    /*
    for (i in req.query)
    {
      console.log(i);
    }
    */
  });

}
