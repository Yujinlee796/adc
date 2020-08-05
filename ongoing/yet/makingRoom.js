
function makingRoom(userId,goal,date) {
  var roomName = getElementById("room_name")
  var roomGoal = getElementById("room_goal")
  var userId = getElementById("room_users")
  var roomDate = getElementById("room_date")

  firebase.database().ref('rooms/' + cnt).set({
    name : roomName,
    users : userId,
    goals : room,
    startDate : roomDate
  });
}
