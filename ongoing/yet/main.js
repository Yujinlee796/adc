
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


//방만들기 페이지로 연결
function newRoom() {
  var link ='makingRoom.html';
  location.href = link;
}
