/**
 * chat-controller.js
 *
 * Controller for the chat.
 */
module.exports = function(app) {
  
  var userID = "123456"; //I'm just using this right now
  
  //app.get('chat', function(req, res) {
    // TODO: just a stub for the chat controller
  //})
  
  app.post('/chatjoin', function(req, res) {
    
    console.log("New User Joining: " + req.id); 
    //res.send("Welcome to chat. Your user ID is " + userID + ".");
  });

}
