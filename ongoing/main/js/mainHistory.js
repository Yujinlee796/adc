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

        if (userNickname != null) {
          document.getElementById("nickName").innerHTML = userNickname;
        } else {
          //닉네임 설정을 건너뛰었다면 닉네임 설정부터 하고 와라
          window.location.href = "../login/accountSettings.html";
        }
      });

      //히스토리 출력
      firebase.database().ref('Userhistory/' + userID).once('value')
      .then(function(snapshot) {
        var roomList = new Array;
        var htmlTh = '';
        var html = '';
        //var link = '';

        //firebase database에서 정보 받아오기
        snapshot.forEach(function(childSnapshot) {
         var roomName = childSnapshot.key;
         roomList.push({name : roomName});
       });

        if (roomList.length != 0) {
          //방목록 표 제목 html에 띄우기
          htmlTh += '<th>방 이름</th>';
          htmlTh += '<th>상세보기</th>';
          $("#dynamicThead").empty();
          $("#dynamicThead").append(htmlTh);

          //방목록 html에 띄우기
          for (key in roomList) {
            html += '<tr>';
            html += '<td>' + roomList[key].name + '</td>';
            html += '<td> <button onclick ="setRoomNameAndMove(\'roomHistory.html\',\'' + roomList[key].name + '\')">상세보기</button> </td>'
            html += '</tr>';
          }
          $("#dynamicTbody").empty();
          $("#dynamicTbody").append(html);
        }
        else if (roomList.length == 0) {
          document.getElementById("noHistory").innerHTML = "히스토리에 방이 없습니다."; //css 넣어줘염,,
          console.log("히스토리 없음");
        }
      });
    } else if(!user)
    {
      //signout 상태이면 쫓겨나는 코드
      window.location.href = "../index.html";
    }
});


//URL 이동 함수
function setRoomNameAndMove(url,rName) {
  window.location.href = url + "?roomName=" + rName;
}

// logout
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//자라나라 모달모달 - 더 알아보기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalManual = document.getElementById('myModal-manual');
 
// Get the button that opens the modal
var btnManual = document.getElementById("openManual");

// Get the <span> element that closes the modal
var spanManual = document.getElementsByClassName("closeManual")[0];                                         

// When the user clicks on the button, open the modal 
btnManual.onclick = function() {
    modalManual.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanManual.onclick = function() {
    modalManual.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalManual) {
        modalManual.style.display = "none";
    }
}