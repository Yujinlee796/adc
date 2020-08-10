// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCqHKmX1adJ9qCPMnSWyP1p5JRzEruoe1E",
    authDomain: "fittogether-d628a.firebaseapp.com",
    databaseURL: "https://fittogether-d628a.firebaseio.com",
    projectId: "fittogether-d628a",
    storageBucket: "fittogether-d628a.appspot.com",
    messagingSenderId: "169218684132",
    appId: "1:169218684132:web:3134f8df18470da201a8f1",
    measurementId: "G-2MK17W9C5C"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  firebase.auth.Auth.Persistence.LOCAL;

/*현재 존재하는 방목록 업로드*/
function existRoom() {
  //사용자의 profile 로드
  var userID = firebase.auth().currentUser.uid;
  console.log(userID);

  firebase.database().ref('Users/' + userID).once('value').then(function(snapshot) {
    var userNickname = snapshot.child("nickName").val();
    console.log(userNickname);
    document.getElementById("nickName").innerHTML = userNickname;
  });

  var childData = " ";

  firebase.database().ref('Usersroom/' + userID).once('value')
  .then(function(snapshot) {
    var roomListHtml = [];
    var cbDisplayRoomList = function(data) {
      var val = data.val();
      roomListHtml.push( _.template(this.roomTemplate)({
        roomName : data.name,
        fitcnt : data.fitcnt
      }));
    }
    snapshot.forEach(cbDisplayRoomList.bind(this));
    console.log(roomListHtml);
    document.getElementById("i_roomName").innerHTML = roomListHtml;

    /*
     function ( childSnapshot ) {
      var key = childSnapshot.key;
      var roomData = snapshot.child("name").val();
      roomList
      console.log(childData);
    });*/
    //var room = snapshot.val();
    //console.log(room);
    //document.getElementById("i_roomName").innerHTML = room.name;
  });
}

  //makingRoom.html로 연결
function newRoom() {
  var link ='makingRoom.html';
  location.href = link;
}


// logout
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});
