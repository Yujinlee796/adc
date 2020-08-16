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

function setRoomNameAndMove(url,rName) {
  window.location.href = url + "?roomName=" + rName;
}

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
        var roomList = new Array;
        var roomState = '';
        var html = '';
        var link = '';

        //firebase database에서 정보 받아오기
        snapshot.forEach(function(childSnapshot) {
         var roomName = childSnapshot.key;
         var roomCnt = childSnapshot.child("recentcnt").val();

         //현황 text화 
         if (roomCnt == 0) {
           roomState = '-'
         } else if (roomCnt == -1) {
           roomStae = '미달성'
         } else if(roomCnt == 1) {
           roomState = '달성'
         }
         roomList.push({name : roomName , state : roomState });
        });

        //방목록 html에 띄우기
        for (key in roomList) {
          html += '<tr>';
          html += '<td>' + roomList[key].name + '</td>';
          html += '<td>' + roomList[key].count + '</td>';
          html += '<td> <button onclick ="setRoomNameAndMove(\'room.html\',\'' + roomList[key].name + '\')">입장</button> </td>'
          html += '</tr>';
        }
        $("#dynamicTbody").empty();
        $("#dynamicTbody").append(html);
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
