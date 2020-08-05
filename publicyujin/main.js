
function existRoom() {
  //사용자의 profile 로드
  var userId = firebase.auth().currentUser.uid;
  
  return firebse.database().ref('/users/' + userId).once('value'
    .then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().username);
  });

  //get a reference to the database service
  var roomCountRef = firebase.database().ref('users/' + userId +'/room');
  roomCountRef.on('value',function(snapshot) {
    snapshot.val()
  })

  #childEventListner 방식으로 database에서 방목록 읽기
  FirebaseDatabase.getInstance().getReference().addChildEventListener(newRoom)
}

function newRoom(userId,goal,date) {
  firebase.database().ref('rooms/' + cnt).set({
    users : userId,
    goals : goal,
    startDate : date
  })

}

*/회의 떄 공유할 사항
//set을 사용하면 지정된 위치에서 하위 node를 포함한 data를 덮어씀
function writeUserData(userId,name,email,imageUrl)  {
  firebase.database().ref('users/'+userId).set({
    username: name,
    email : email.
    profile_picture : imageUrl
  });
}
