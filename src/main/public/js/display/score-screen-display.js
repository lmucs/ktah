/**
 * score-screen-display.js
 * 
 * Manages display elements on the Score Screen view.
 */

$(function () {
  var userName = $("#userName").attr("data"),
      scoreList = $("#room-options"),
      round = $("#round").attr("data"),
      pluralAttachment = "s";
  
  if (round <= 1) {
    pluralAttachment = "";
  }
  
  // First, clear the score report space
  scoreList.html("");
  
  // Add the round that the team got to
  scoreList.append(
    '<div class="room-player-list round-report">You survived through '
    + $("#round").attr("data") + ' round' + pluralAttachment + '!</div>'
  );
  
  // Next, populate the scores
  for (var i = 0; i < data.length; i++) {
    var currentPlayer = data[i],
        playerAccent = "",
        playerStatus = "room-player-list";
    
    // Accent the current player in the lobby
    if (currentPlayer.name === userName) {
      playerAccent = 'class="currentPlayer"';
    }
    
    // Add the HTML to the list area
    scoreList.append(
      '<div class="' + playerStatus + '"><strong ' + playerAccent + '>'
      + currentPlayer.name + ':</strong> ' + currentPlayer.pointsEarned 
      + '<span class="class-selection"><img class="class-icon class-selected" src="../assets/icons/'
      + currentPlayer.character + 'Icon.png"></img></span></div>'
    );
  }
  
  // Buttonize the lobby button
  $("#lobby-button")
    .button()
    .click(function () {
      window.location = "../../lobby";
    });
});
