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


 //접속중인 유저 닉네임 먼저 리스트에 넣기
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
                }
            });
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
  var startDate = getTimeStamp()

  if(roomName != "" && roomGoal != "" && roomBet != "" && roomDate != "")
  {
    var rootRoomRef = firebase.database().ref().child("Rooms");
    var roomRef = rootRoomRef.child(roomName);
    var roomUsersRef = roomRef.child("Users");

    var rootUsersRef = firebase.database().ref().child("Users");  //닉네임에 해당하는 uid 찾기용 경로
    
    var roomUsersUidRef = roomUsersRef.child(userID);  //먼저 현재 접속 유저부터 Room/roomName/Users넣기
    roomUsersUidRef.set({"state":true});

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
          roomUsersUidRef.set({"state":true});

          //Usersroom에 유저별 room data 업뎃
          firebase.database().ref('Usersroom/' + invitedUid + '/' + roomName).set({
              //name : roomName,
              fitcnt : 0,
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
        var result = confirm("방이 성공적으로 만들어졌습니다. 지금 바로 새로 만든 방으로 이동할까요?")
        if(result) {
          setRoomNameAndMove("room.html", roomName);
        } else {
          window.location.href = "mainPage.html";
        }
      }
    });

    //
  }
  else{
    window.alert("칸을 모두 채워주세요.");
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
        alert(invitedNname + "은(는) 존재하지 않는 닉네임입니다.");  //닉네임 설정과 마찬가지로 밑에 빨간줄 생기는 걸로 수정.
      }
      else {
        //존재하는 닉네임일때
        liNode.appendChild(txtNode);
        listNode.appendChild(liNode);
          
        $('#invitedNname').val("");   //초대 성공하면 기존에 input부분에 써놓은거 지우는 코드
        //나중에 이걸로 변경
        //document.getElementById("invitedNname").value = "";
      }
    });
  }
  else{
    alert("아무것도 안적었잖아요");
  }
}


//(다은코드)방 이름 confirm
function confirmName(){
  var roomName = document.getElementById('room_name').value;

  if(roomName != "")
  {
    var rootRef = firebase.database().ref().child("Rooms");

    rootRef.orderByChild('name').equalTo(roomName).once('value', function(snapshot){
      if (snapshot.val() === null) {
        // 중복되지않은 방이름
        //alert("사용가능한 방이름입니다.");
        document.getElementById("confirmNameResult").innerHTML = "사용 가능한 방 이름입니다."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
        document.getElementById("confirmNameResult").style.color = "greenyellow"
      }
      else
      {
        // 중복된 방이름
        //alert("중복된 방이름입니다.");
        document.getElementById("confirmNameResult").innerHTML = "이미 사용중인 방 이름입니다.";  //추후에, 이경우엔 style 속성에 color 초록색 넣기
        document.getElementById("confirmNameResult").style.color = "red"
      }
    });
  }
  else
  {
    alert("방 이름을 입력해 주세요.");
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

