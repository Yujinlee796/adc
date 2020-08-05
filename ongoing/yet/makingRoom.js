
function makingRoom(userId,goal,date) {
  var roomName = document.getElementById("room_name").value;
  var roomGoal = document.getElementById("room_goal").value;
  var userId = document.getElementByTagName("room_users").value;
  var roomDate = document.getElementById("room_date").value;

  firebase.database().ref('rooms/' + cnt).set({
    name : roomName,
    users : userId,
    goals : roomGoal,
    startDate : roomDate
  });

  cnt++;
}
