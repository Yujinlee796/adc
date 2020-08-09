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
  //var rootRef = firebase.database().ref().child("Users");
  var userID = firebase.auth().currentUser.uid;
  var usersRef = rootRef.child(userID);

  firebase.database().ref('Users' + userID + '/nickName').once('value').then(function(snapshot) {
    var userNickname = snapshot.val
    console.log(userNickname);
  })

  firebase.database().ref('Usersroom/' + userNickname).once('value').then(function(snapshot) {
    var roomName = snapshot.val();
    console.log(roomName);
    document.getElementById("i_roomName").innerHTML = roomName;
  })
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
