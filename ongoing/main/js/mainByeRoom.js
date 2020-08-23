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
var database = firebase.database();

firebase.auth.Auth.Persistence.LOCAL;

var roomName = '';
var roomUsers = [];

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 페이지 로드시 필요한 정보 가져오고, 출력하는 모든 코드 부분
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
window.onload = function(){

    roomName = getURLParameter();  //방 이름 받아오기

   //============================================================================//
   //(다은코드) 현재 방 정보 받아오고 띄우기
   //============================================================================//
   if (roomName != '') {
     firebase.database().ref('Rooms/' + roomName).once('value')
     .then(function(snapshot) {
      var printGoals = snapshot.child("goals").val();
      var printBetting = snapshot.child("betting").val();
      var printTitle = snapshot.child("name").val();
      var endDate = snapshot.child("endDate").val();
      startDate = snapshot.child("startDate").val();
      if(startDate != '' && endDate != '') {
        period = calculatePeriod(startDate, endDate);
      }

      document.getElementById("goalText").innerHTML = printGoals;
      document.getElementById("bettingText").innerHTML = printBetting;
      document.getElementById("titleData").innerHTML = printTitle;
      document.getElementById("endDate").innerHTML = revisePrintEndDate(endDate) + '종료';
    });
   } else { alert('방 이름을 불러오지 못했습니다.');}

  firebase.auth().onAuthStateChanged(function(user)
  {
    if(user && roomName != ''){
     currentUserID = firebase.auth().currentUser.uid;
     console.log(currentUserID);

     firebase.database().ref('Rooms/' + roomName + '/Users').once('value')
     .then(function(snapshot)
     {
      //방에 참여 중인 멤버의 uid 받아오기
      snapshot.forEach(function(childSnapshot) {
       var roomUsersUid = childSnapshot.key;
       roomUsers.push(roomUsersUid);


       //닉네임과 스코어&상태를 가져오면, 출력하기
       $.when(getRoomUsersNname(roomUsersUid, currentUserID), getRoomUsersScore(roomUsersUid, currentUserID))
       .done(function(Nname, scoreAndstate = []){
         displayScoreBar(Nname, scoreAndstate[0]); //스코어바 출력하기
       });
     });
     });

      delUsersRoom(roomName,currentUserID); //usersRoom에서 data 삭제 //
      makeUserHistory(roomName);
    }
   else if (!user) { window.location.href = "../index.html";} //signout 상태이면 쫓겨나는 코드
   else if (roomName == '') { alert('방 이름을 불러오지 못했습니다.');}
  });
}

//===========================================================================//
//UsersRoom에서 data 삭제
//==========================================================================//
function delUsersRoom(rName,currentUserID) {
  firebase.database().ref('Usersroom/' + currentUserID +'/' + rName).remove();
  console.log("delete");
}

//===========================================================================//
//Userhistory에 data 업데이트 //
//==========================================================================//
function makeUserHistory(name) {
  firebase.database().ref('Userhistory/' + currentUserID +'/'+roomName).set("0", function(error)
  {
   if(error){
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);

    window.alert("Message: " + errorMessage);
   }
 });
}
//============================================================================//
//각 uid에 대해 닉네임 가져오기
//============================================================================//
function getRoomUsersNname(roomUsersUid, currentUserID) {

    var deferred = $.Deferred();

    firebase.database().ref('Users/' + roomUsersUid).once('value')
        .then(function(snapshot) {
          Nname = snapshot.child('nickName').val();
          //roomUsersNname.push(Nname);
          console.log(Nname);

          //만약 이 uid가 현재 접속중인 uid와 같다면, 해당 닉네임을 출력해줘라
          if(roomUsersUid == currentUserID){
            document.getElementById('nicknameData').innerHTML = Nname;
            document.getElementById("nickName").innerHTML = Nname;
          }

          deferred.resolve(Nname);
        });
    return deferred.promise();
  }


  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //(다은코드) (공통JS로 뺄것) 현재 url에서 방이름 가져오는 함수
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  function getURLParameter() {
    return decodeURI(
     (RegExp(roomName + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
  }


  //============================================================================//
  //닉네임과 점수를 입력하면 스코어바를 화면에 출력하고 모션을 추가하는 함수 선언하기
  //============================================================================//
  const scoreBar = document.getElementById('scoreBar');

  //--------------------------------------------------------------------------//
  //스코어와 인덱스 번호(->현재 닉네임 값으로 수정됨)를 입력하면,
  //각 스코어를 출력할 수 있는 css를 생성하여 스코어바를 만드는 함수
  //-------------------------------------------------------------------------//
  function createScore(score, i) {

    //일단 각각의 score 값을 출력할 수 있는 css 코드를 각각 만들어서 html의 head 부분에 작성
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.progress-done-' + i + ' { background: linear-gradient(to left, #0093f5, #fcfa7a); box-shadow: 0 3px 3px -5px #7c7c7c, 0 2px 5px #7c7c7c; border-radius: 20px; color: #fff; display: flex; align-items: center; justify-content: center; height: 100%; width: 0%; opacity: 0; transition: 1s ease 0.3s;}';
    document.getElementsByTagName('head')[0].appendChild(style);

    //태그를 생성하여 클래스 속성 및 텍스트를 넣어줌
    const divElem = document.createElement('div');
    const divElem2 = document.createElement('div');
    divElem.classList.add('progress');
    divElem2.classList.add('progress-done-' + i);

    const elemTxt = document.createTextNode(score +"점");
    divElem2.appendChild(elemTxt);

    divElem.appendChild(divElem2);

    return divElem;
  }

  //----------------------------------------------------------------------------//
  //닉네임을 입력하면 닉네임을 출력하는 함수
  //----------------------------------------------------------------------------//
  function createNname(Nname) {
    const spanElem = document.createElement('span');
    const elemTxt = document.createTextNode(Nname);
    spanElem.appendChild(elemTxt);

    return spanElem;
  }


  //=============================================================================//
  //period 계산해주는 함수
  //=============================================================================//
  function calculatePeriod(sDate, eDate) {
    var start = new Date(sDate);
    var end = new Date(eDate);

    var distance = end - start;
    var d = Math.floor(distance / (1000 * 60 * 60 * 24));

    return d; //기간이 총 몇일인지 리턴
  }



  //============================================================================//
  //(채영코드 수정) 날짜 데이터 string으로 받으면 가공해서 출력 형식으로 바꿔주는 함수
  //============================================================================//
  function revisePrintEndDate(printEndDate) {
    var d = new Date(printEndDate);

    var currentYear = d.getFullYear();
    if (d.getMonth()+1 >= 10) {
      var currentMonth = (d.getMonth()+1);
    }
    else {
      var currentMonth = '0'+(d.getMonth()+1);
    };

    if (d.getDate() >= 10) {
      var currentDate = d.getDate();
    }
    else {
      var currentDate = '0'+d.getDate();
    }

    return currentYear + '년 ' + currentMonth + '월 ' + currentDate + '일 ';
  }


  //=============================================================================//
  //변경된 정보들 데이터베이스에 업데이트하는 함수
  //=============================================================================//
  function usersroomUpdate() {
    if (currentUserID != ''){
      firebase.database().ref('Usersroom/' + currentUserID + '/' + roomName).set({
          fitcnt : fitcnt,
          recentcnt : recentcnt,
          lastClick : lastClick,
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
    }
  }


  //============================================================================//
  //각 uid에 대해 score(fitcnt)와 state(recentcnt) 가져오기
  //============================================================================//
  function getRoomUsersScore(roomUsersUid, currentUserID) {

    var deferred = $.Deferred();

    firebase.database().ref('Usersroom/' + roomUsersUid + '/' + roomName).once('value')
        .then(function(snapshot) {
          score = snapshot.child('fitcnt').val();

          deferred.resolve(score, state);
        });
    return deferred.promise();
  }

//=================히스토리 버튼 누르면 개인 history page로 이동 ===============================//
function goHistory(){
  window.location.href = "history.html";
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//logout
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$("#btn-logout").click(function()
{
    firebase.auth().signOut();
});
