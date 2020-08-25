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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 전역변수 선언 - 방 이름 중복 확인했는지 확인
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//var confirmCount = 0;
var tempRoomName = '';


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 접속중인 유저 닉네임 먼저 리스트에 넣기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
firebase.auth().onAuthStateChanged(function(user)
    {
        if(user)
        {
            var userID = firebase.auth().currentUser.uid;
            console.log(userID);

            firebase.database().ref('Users/' + userID).once('value').then(function(snapshot)
            {
                if(snapshot.val())
                {
                  var userNname = snapshot.child('nickName').val();

                  var listNode = document.getElementById('invitedList');
                  var liNode = document.createElement("LI");
                  var txtNode = document.createTextNode(userNname);
                  
                  liNode.appendChild(txtNode);
                  listNode.appendChild(liNode);
                  document.getElementById("nickName").innerHTML = userNname;

                } else 
                {
                  //닉네임 설정을 건너뛰었다면 닉네임 설정부터 하고 와라
                  window.location.href = "../login/accountSettings.html";
                }
            });
        } else if (!user) {
          //signout 상태이면 쫓겨나는 코드
          window.location.href = "../index.html";
        }
    });


/**********************
 <makingRoom 함수의 기능
 * 각 칸에 저장된 정보들 Rooms에 방이름 밑에 저장,
   이때 users 밑에는, list에 있는 닉네임값들을 가져와서,
   해당 닉네임에 대한 uid 값을 저장한다.
 * 그리고 각 uid에 대해, 현재 생성된 방이름을 각각 저장하고,
   각각 방마다 유저가 가진 정보인 cnt 등의 정보를 저장한다.
 * ****************** */
function makingRoom() {
  var userID = firebase.auth().currentUser.uid;
  var roomName = document.getElementById("room_name").value;
  var roomGoal = document.getElementById("room_goal").value;
  var roomBet = document.getElementById("room_bet").value;
  var invitedList = document.querySelectorAll("#invitedList li");
  var roomDate = document.getElementById("room_date").value;
  //방 개설 날짜 기록
  var startDate = getTimeStamp();

  //입렵칸을 모두 채웠는지 확인
  if(roomName != "" && roomGoal != "" && roomBet != "" && roomDate != "")
  {
    //방이름 중복 확인을 완료하였는지 확인
    if(tempRoomName != '') {
      //중복 확인했던 이름과 동일한 이름인지 확인
      if(tempRoomName == roomName) {
        var rootRoomRef = firebase.database().ref().child("Rooms");
        var roomRef = rootRoomRef.child(roomName);
        var roomUsersRef = roomRef.child("Users");

        var rootUsersRef = firebase.database().ref().child("Users");  //닉네임에 해당하는 uid 찾기용 경로
        
        var roomUsersUidRef = roomUsersRef.child(userID);  //먼저 현재 접속 유저부터 Room/roomName/Users넣기
        roomUsersUidRef.set({fitcnt : 0});

        //먼저 Users에 넣고
        var tempNname = "";
        for(var i = 0; i < invitedList.length; i++)
        {
          tempNname = invitedList[i].innerHTML;
          rootUsersRef.orderByChild('nickName').equalTo(tempNname).once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
              
              //유저가 초대한 닉네임을 가진 사용자의 uid 가져오기
              var invitedUid = childSnapshot.key;
              
              //그 uid를 Room/roomName/Users에 입력
              var roomUsersUidRef = roomUsersRef.child(invitedUid);
              roomUsersUidRef.set({fitcnt : 0});

              //Usersroom에 유저별 room data 업뎃
              firebase.database().ref('Usersroom/' + invitedUid + '/' + roomName).set({
                  //name : roomName,
                  //fitcnt : 0,
                  recentcnt : 0,
                  lastClick : startDate,
              },
              function(error) {
                if(error)
                {
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  console.log(errorCode);
                  onsole.log(errorMessage);

                  window.alert("Message: " + errorMessage);
                }
              });
            });
          });
        }

        //후에 나머지 정보들도 Rooms/roomName에다가 넣기
        var roomData =
        {
          name : roomName,
          betting : roomBet,
          goals : roomGoal,
          endDate : roomDate,
          startDate : startDate,
        };
        firebase.database().ref('Rooms/' + roomName).set(roomData, function(error)
        {
          if(error)
          {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            onsole.log(errorMessage);

            window.alert("Message: " + errorMessage);
          }
          else{
            var result = confirm("방이 성공적으로 만들어졌습니다. 지금 바로 새로 만든 방으로 이동할까요?");
            if(result) {
              setRoomNameAndMove("room.html", roomName);
            } else {
              window.location.href = "mainPage.html";
            }
          }
        });
      } else {
        //중복확인을 한 방 이름과 다른 이름이 입력되어있는 경우
        alert("방 이름 중복확인을 다시 진행해주세요.")
      }
      
    } else {
      //중복확인 버튼을 아직 안눌렀거나, 반려된 경우
      alert("방 이름 중복확인을 완료해주세요.");
    }
  }
  else{
    alert("정보를 모두 입력해주세요."); //정보를 모두 입력해주세요, 칸을 모두 채워주세요, 칸을 모두 입력해주세요
    //document.getElementById("plzFillin").innerHTML = "입력되지 않은 정보가 있습니다.";
    //document.getElementById("break").innerHTML = "<br>";
    //document.getElementById("plzFillin").style.color = "red"
  }

}


/*(유진코드)수정 전
function makingRoom() {

  //===== 사용자가 입력한 정보 변수에 저장 =====
  var roomName = document.getElementById("room_name").value;
  var roomGoal = document.getElementById("room_goal").value;
  var roomBet = document.getElementById("room_bet").value;
  //(유진코드)var userId = document.getElementById("room_users").value;
  var roomDate = document.getElementById("room_date").value;


  // 칸이 모두 채워졌는지 확인 후 database>Rooms에 data 업로드
  if(roomName != "" && roomGoal != "" && roomDate != "")  //(다은코드)userID 관련된거 전부 삭제
  {
      var rootRef = firebase.database().ref().child("Rooms");

     rootRef.orderByChild('name').equalTo(roomName).once('value', function(snapshot){
        if (snapshot.val() === null) {
            // 중복되지않은 방이름
            var roomData =
            {
              name : roomName,
              //(다은코드) users : userId,
              betting : roomBet,
              goals : roomGoal,
              startDate : roomDate
            };

            firebase.database().ref('Rooms/' + roomName).set(roomData, function(error)
            {
                if(error)
                {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorCode);
                    onsole.log(errorMessage);

                    window.alert("Message: " + errorMessage);
                }
            });

            //Usersroom에 유저별 room data 업뎃
            firebase.database().ref('Usersroom/' + userId).push({
                name : roomName,
                fitcnt : 0,
                recentcnt : false
            },
            function(error) {
              if(error)
              {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode);
                onsole.log(errorMessage);

                window.alert("Message: " + errorMessage);
              }
              else
              {
                window.alert("방이 만들어졌습니다.");
                window.location.href = "../main/mainPage.html";
              }});


        }
        else
        {
            // 중복된 방이름
            window.alert("중복된 방이름입니다.");
        }
    });
  }

  else
  {
      window.alert("칸을 모두 채워주세요.");
  }

  //var database = firebase.database();

}
*/

//(다은코드)입력한 닉네임이 존재하는지 확인 후, html의 li 태그에 초대한 인원들 추가하여 출력
function addLi(){

  var rootUsersRef = firebase.database().ref().child("Users");

  var invitedNname = document.getElementById('invitedNname').value;
  var listNode = document.getElementById('invitedList');
  var liNode = document.createElement("LI");
  var txtNode = document.createTextNode(invitedNname);

  if(invitedNname != "")
  {
    rootUsersRef.orderByChild('nickName').equalTo(invitedNname).once('value', function(snapshot){
              
      if (snapshot.val() === null) {
        //존재하지 않는 닉네임일때
        document.getElementById("confirmNickResult").innerHTML = (invitedNname + "은(는) 존재하지 않는 닉네임입니다.");
        document.getElementById("confirmNickResult").style.color = "red"
        document.getElementById("plzFillin").innerHTML = "";
        document.getElementById("break").innerHTML = "";
      }
      else {
        //존재하는 닉네임일때
        liNode.appendChild(txtNode);
        listNode.appendChild(liNode);
        document.getElementById("confirmNickResult").innerHTML = "";
        document.getElementById("plzFillin").innerHTML = "";
        document.getElementById("break").innerHTML = "";
          
        $('#invitedNname').val("");   //초대 성공하면 기존에 input부분에 써놓은거 지우는 코드
        //나중에 이걸로 변경
        //document.getElementById("invitedNname").value = "";
      }
    });
  }
  else{
    document.getElementById("confirmNickResult").innerHTML = "닉네임을 입력해 주세요.";
    document.getElementById("confirmNickResult").style.color = "red"
    document.getElementById("plzFillin").innerHTML = "";
    document.getElementById("break").innerHTML = "";
  }
}


//(다은코드)방 이름 confirm
function confirmName(){
  var roomName = document.getElementById('room_name').value;

  //방 이름 10자 이내 인지 확인하기
  if (0 < roomName.length && roomName.length <= 10) {

    var rootRef = firebase.database().ref().child("Rooms");

    rootRef.orderByChild('name').equalTo(roomName).once('value', function(snapshot){
      if (snapshot.val() === null) {
        // 중복되지않은 방이름
        //alert("사용가능한 방이름입니다.");
        document.getElementById("confirmNameResult").innerHTML = "사용 가능한 방 이름입니다.";
        document.getElementById("confirmNameResult").style.color = "greenyellow"
        document.getElementById("plzFillin").innerHTML = "";
        document.getElementById("break").innerHTML = "";

        tempRoomName = roomName; //중복확인 승인됨
      }
      else
      {
        // 중복된 방이름
        //alert("중복된 방이름입니다.");
        document.getElementById("confirmNameResult").innerHTML = "이미 사용중인 방 이름입니다.";
        document.getElementById("confirmNameResult").style.color = "red"
        document.getElementById("plzFillin").innerHTML = "";
        document.getElementById("break").innerHTML = "";

        tempRoomName = ''; //중복확인 반려됨
      }
    });
  } else if (roomName.length == 0) {
    //방 이름을 입력하지 않음
    document.getElementById("confirmNameResult").innerHTML = "방 이름을 입력해 주세요.";
    document.getElementById("confirmNameResult").style.color = "red"
    document.getElementById("plzFillin").innerHTML = "";
    document.getElementById("break").innerHTML = "";

    tempRoomName = ''; //중복확인 반려됨
  } else if (roomName.length > 10) {
    //방 이름이 10자를 초과함
    document.getElementById("confirmNameResult").innerHTML = "10자 이내의 방 이름을 입력해 주세요.";
    document.getElementById("confirmNameResult").style.color = "red"
    document.getElementById("plzFillin").innerHTML = "";
    document.getElementById("break").innerHTML = "";

    tempRoomName = ''; //중복확인 반려됨
  }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) (공통JS로 뺄것) 현재 시간 표준 포맷을 뽑는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) (공통JS로 뺄것) url에 방이름 담아서 보내는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function setRoomNameAndMove(url, rName) {
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