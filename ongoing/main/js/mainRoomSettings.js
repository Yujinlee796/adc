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
  
  
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(공통JS로 뺄것) 왼쪽 위에 현재 접속 중인 유저 닉네임 출력하기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 모든 전역변수 선언
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  var roomName = '';



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 페이지 로드시 필요한 정보 가져오고, 출력하는 모든 코드 부분
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
window.onload = function(){

    roomName = getURLParameter();  //방 이름 받아오기
    console.log("요기의 방 이름은 " + roomName);

    //============================================================================//
    //(다은코드) 현재 방 정보 받아오고 띄우기
    //============================================================================//
    if (roomName != '') {

    }
    
    else {
         alert('방 이름을 불러오지 못했습니다.');
    }

    //방 돌아가는 버튼 만드는 코드 ★모바일추가★
    var addBtn = '<button id="return" onclick="setRoomNameAndMoveToRoom(\'room.html\',\'' + roomName + '\');">방으로 돌아가기</button>'

    $("#returnPlace").append(addBtn);
  }

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//방으로 돌아가기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function setRoomNameAndMoveToRoom(url,rName) {
  window.location.href = url + "?roomName=" + rName;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//방 나가기에서 호출할 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function setRoomNameAndMove(url,rName) {
    window.location.href = url + "?roomName=" + rName;
  }

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//방 조기종료 버튼
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function roomQuit() {
    if(confirm("정말 방에서 나가시겠습니까?") == true){
      setRoomNameAndMove("byeRoom.html",roomName);
    }
    else{
      return;
    }
  }

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) (공통JS로 뺄것) 현재 url에서 방이름 가져오는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function getURLParameter() {
    return decodeURI(
     (RegExp('roomName' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
  }

  //===========================================================================//
//방 삭제하기
//==========================================================================//
function deleteRoom() {

  if(confirm("정말 방을 삭제하시겠습니까?") == true){
    setRoomNameAndMove("byeRoom.html",roomName);
  }
  else{
    return;
  }
}//방삭제는 byeRoom.html에서 이루어짐


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(공통JS로 뺄것) logout
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%o
//자라나라 모달모달 - 목표수정
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalGoal = document.getElementById('myModal-goal');

// Get the button that opens the modal
var btnGoal = document.getElementById("editGoals");

// Get the <span> element that closes the modal
var spanGoal = document.getElementsByClassName("closeGoal")[0];

// When the user clicks on the button, open the modal
btnGoal.onclick = function() {
    modalGoal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanGoal.onclick = function() {
    modalGoal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalGoal) {
        modalGoal.style.display = "none";
    }
}


function editGoals() {
  var newGoal = document.getElementById("edittedGoals").value;

  if (newGoal == "") {
    document.getElementById("plzFillinGoal").innerHTML = "목표를 입력하지 않으셨습니다.";
    document.getElementById("breakGoal").innerHTML = "<br>";
    document.getElementById("plzFillinGoal").style.color = "red"
  }

  else {
    firebase.database().ref("Rooms/" + roomName).update({
      goals: newGoal
  });
  alert("목표가 새로 설정되었습니다.");
  modalGoal.style.display = "none";  }
};



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%o
//자라나라 모달모달 - 내기수정
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalPun = document.getElementById('myModal-punishment');

// Get the button that opens the modal
var btnPun = document.getElementById("editPunishment");

// Get the <span> element that closes the modal
var spanPun = document.getElementsByClassName("closePun")[0];

// When the user clicks on the button, open the modal
btnPun.onclick = function() {
    modalPun.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanPun.onclick = function() {
    modalPun.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalPun) {
        modalPun.style.display = "none";
    }
}


function editPunishment() {
  var newBetting = document.getElementById("edittedPunishment").value;

  if (newBetting == "") {
    document.getElementById("plzFillinPun").innerHTML = "내기를 입력하지 않으셨습니다.";
    document.getElementById("breakPun").innerHTML = "<br>";
    document.getElementById("plzFillinPun").style.color = "red"
  }

  else {
    firebase.database().ref("Rooms/" + roomName).update({
      betting: newBetting
    });
    alert("내기가 새로 설정되었습니다.");
    modalPun.style.display = "none";
  }
};


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%o
//자라나라 모달모달 - 종료날짜
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalDate = document.getElementById('myModal-date');

// Get the button that opens the modal
var btnDate = document.getElementById("editDate");

// Get the <span> element that closes the modal
var spanDate = document.getElementsByClassName("closeDate")[0];

// When the user clicks on the button, open the modal
btnDate.onclick = function() {
    modalDate.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanDate.onclick = function() {
    modalDate.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalDate) {
        modalDate.style.display = "none";
    }
}


function editDate() {
  var newDate = document.getElementById("edittedDate").value;

  if (newDate == "") {
    document.getElementById("plzFillinDate").innerHTML = "종료 날짜를 입력해 주세요.";
    document.getElementById("breakDate").innerHTML = "<br>";
    document.getElementById("plzFillinDate").style.color = "red"
  }

  else {
    firebase.database().ref("Rooms/" + roomName).update({
      endDate: newDate
    });
    alert("종료 날짜가 새로 설정되었습니다.");
    modalDate.style.display = "none";
  }
};

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