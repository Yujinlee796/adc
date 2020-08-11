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
firebase.auth().onAuthStateChanged(function(user)
{
    if(user)
    {
      userID = firebase.auth().currentUser.uid;
      console.log(userID);
      //닉네임 출력
      firebase.database().ref('Users/' + userID).once('value')
      .then(function(snapshot) {
        var userNickname = snapshot.child("nickName").val();
        console.log(userNickname);
        document.getElementById("nickName").innerHTML = userNickname;
      });

      //방목록 출력
      var roomList = " ";
      firebase.database().ref('Usersroom/' + userID).once('value')
      .then(function(snapshot) {
        var roomList = [];
        snapshot.forEach(function(childSnapshot) {
         var roomName = childSnapshot.key;
         roomList.push("<br>" + roomName);  //걍 줄바꿈하려고 <br> 넣음 바꿔도됨.
         console.log(roomName);
        });
        document.getElementById("i_roomName").innerHTML = roomList;
        console.log(roomList);
      });
    }
});

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
