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



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 모든 전역변수 선언
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var roomName = '';
var startDate = '';
var period = 0;

var roomUsers = [];
var fitcnt = 0;
var recentcnt = 0;
var lastClick = '';
var currentUserID = '';


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 페이지 로드시 필요한 정보 가져오고, 출력하는 모든 코드 부분
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
window.onload = function(){

  roomName = getURLParameter();  //방 이름 받아오기

  //============================================================================//
  //(다은코드) 현재 방 정보 받아오고 띄우기
  //============================================================================//
  if (roomName != '') {
    firebase.database().ref('Rooms/' + roomName).once('value').then(function(snapshot) {
      var printGoals = snapshot.child("goals").val();
      var printBetting = snapshot.child("betting").val();
      var printTitle = snapshot.child("name").val();
      var endDate = snapshot.child("endDate").val();
      var certifyType = snapshot.child("certifyType").val();
      startDate = snapshot.child("startDate").val();
      if(startDate != '' && endDate != '') {
        period = calculatePeriod(startDate, endDate);
        //방 터트리는 코드 추가
        endGame(endDate);
      }

      document.getElementById("goalText").innerHTML = printGoals;
      document.getElementById("bettingText").innerHTML = printBetting;
      document.getElementById("titleData").innerHTML = printTitle;
      document.title = printTitle + ' ｜ 핏투게더';
      document.getElementById("endDate").innerHTML = revisePrintEndDate(endDate) + '종료';

      //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%o
      //certifyType에 따라 버튼 바뀌는 함수
      //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      console.log(certifyType);
      var successBtn = document.getElementById('successBtn');
      var goCertifyBtn = document.getElementById('goCertifyBtn');

      if (certifyType === 'conscience') {
        successBtn.style.display = "block";
        goCertifyBtn.style.display = "none";
        console.log("요기는 양심방");
      }

      else if (certifyType === 'dumbel' || certifyType === 'phone') {
        successBtn.style.display = "none";
        goCertifyBtn.style.display = "block";
        console.log("요기는 아령방");
      }
    });
  } else { alert('방 이름을 불러오지 못했습니다.');}

  //============================================================================//
  //(다은코드) 현재 접속 중인 유저의 방과 관련된 정보 받아오고 띄우기
  //(추가된 기능)
  //(1) 접속중인 유저 닉네임 띄우기
  //(2) 해당 유저의 현재 fitcnt, recentcnt, lastClick 전역변수에 저장
  //(3) recentcnt 상태 새벽 5시 기준으로 리셋하기
  //(4) recentcnt 값에 따라 동물 그림 로드하기
  //============================================================================//
  firebase.auth().onAuthStateChanged(function(user)
  {
    if(user && roomName != ''){
      currentUserID = firebase.auth().currentUser.uid;
      console.log(currentUserID);

      firebase.database().ref('Rooms/' + roomName + '/Users').once('value').then(function(snapshot)
      {
        snapshot.forEach(function(childSnapshot) {
          //방에 참여 중인 멤버의 uid 받아오기
          var roomUsersUid = childSnapshot.key;
          roomUsers.push(roomUsersUid);

          //각 uid에 대해 fitcnt 가져오기
          var score = childSnapshot.child("fitcnt").val();
          //접속 중인 유저의 fitcnt값은 전역변수에 저장
          if(roomUsersUid == currentUserID){
            fitcnt = score;
          }

          //닉네임과 스코어&상태를 가져오면, 출력하기
          $.when(getRoomUsersNname(roomUsersUid, currentUserID), getRoomUsersState(roomUsersUid, currentUserID)).done(function(Nname, state){
            recentcntUpdate();  //얘 순서를 display 전, getRoomUsersState 후로 바꿔야함
            displayScoreBar(Nname, score); //스코어바 출력하기
            displayState(Nname, state); //모달에 친구들의 달성 상태 출력하기
          }).done(function(){
            //현재 접속자의 오늘의 운동 달성 여부도 출력하자
            displayTodayState();
            //동물 그림 출력하기(이게 forEach에 걸려있는거 안좋을듯. 추후 수정)
            displayImg();
          });
        });
          //console.log(roomUsers);
      });
    } else if (!user) { window.location.href = "../index.html"; //signout 상태이면 쫓겨나는 코드
    } else if (roomName == '') { alert('방 이름을 불러오지 못했습니다.');}
  });


  //settings 버튼 만드는 코드 ★모바일추가★
  var addBtn = '<button type="button" id="settings" onclick="setRoomNameAndMove(\'roomSettings.html\',\'' + roomName + '\');"><img id="settingsIcon" src="assets/img/settings.png"></button>'

  $("#btnPlace").append(addBtn);
}




//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 타이머
// (1) 운동기록까지 남은 시간 1초마다 계산하여 띄우기(기준 새벽 5시 - 변수 가능일듯)
// (2) startDate로 부터 몇일차인지 출력하는 코드. startDate를 가져온 다음부터 출력하도록 해놓음
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var x = setInterval(function() {
var now = new Date();
var base = new Date();  //기준이 되는 새벽 5시 시각 설정
var startBase = new Date(startDate); //시작한 날의 오전 00시 시각 설정

  //현재 시간 데이터 이용하여 기준이 되는 새벽 5시 base 시각 설정(추후에 함수화하기)
  if (0 <= now.getHours() && now.getHours() <= 4) {
    //날짜 변경없이 시간만 5시로 설정
    base.setHours(5);
    base.setMinutes(0);
    base.setSeconds(0);
  }
  else if (5 <= now.getHours() && now.getHours() <= 23) {
    //날짜 하루 추가 후 시간 5시로 설정
    base.setDate(base.getDate() + 1);
    base.setHours(5);
    base.setMinutes(0);
    base.setSeconds(0);
  }

//base시간까지 얼마나 남았는지 출력
var distance = base - now;
var h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var s = Math.floor((distance % (1000 * 60)) / 1000);
document.getElementById("todayTimer").innerHTML = h + "시간 " + m + "분 " + s + "초";

//새벽 5시 되면, 페이지 reload 하기
if (h == 0 && m == 0 && s == 0) {
  window.location.reload();
}


//startDate가 로드되었다면, 몇일차 출력 (12시 기준으로 몇일차 출력 / 5시기준으로 바꿀라면 startBase->base로 할것)
if (startDate != '') {

  //현재 시간 데이터 이용하여 기준이 되는 startBase 오전 00 시의 시각 설정(추후에 함수화하기)
  startBase.setHours(0);
  startBase.setMinutes(0);
  startBase.setSeconds(0);

  var fromStartDate = now - startBase;
  var d = 1 + Math.floor(fromStartDate / (1000 * 60 * 60 * 24));
  document.getElementById("fromStartDate").innerHTML = d + "일차";
}
});



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드)<현재 접속 중인 유저의 방과 관련된 정보 받아오고 띄우기와 관련된 모든 함수 선언>
//(수정된 부분)
///for문을 아예 없애고, css이름도 닉네임으로 차별화를 둠
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//============================================================================//
//각 uid에 대해 닉네임 가져오기
//============================================================================//
function getRoomUsersNname(roomUsersUid, currentUserID) {

var deferred = $.Deferred();

firebase.database().ref('Users/' + roomUsersUid).once('value')
    .then(function(snapshot) {
      Nname = snapshot.child('nickName').val();
      //roomUsersNname.push(Nname);
      //console.log(Nname);
      if (Nname != null) {

        //만약 이 uid가 현재 접속중인 uid와 같다면, 해당 닉네임을 출력해줘라
        if(roomUsersUid == currentUserID){
          document.getElementById('nicknameData').innerHTML = Nname;
          document.getElementById("nickName").innerHTML = Nname;
        }

        deferred.resolve(Nname);

      } else {
        //닉네임 설정을 건너뛰었다면 닉네임 설정부터 하고 와라
        window.location.href = "../login/accountSettings.html"; //room에서는 닉네임 정보가 없이 방을 만들 수 없어서 이 코드가 작동하는진 확인불가
      }
    });
return deferred.promise();
}

//============================================================================//
//각 uid에 대해 score(fitcnt)와 state(recentcnt) 가져오기
//============================================================================//
function getRoomUsersState(roomUsersUid, currentUserID) {

var deferred = $.Deferred();

firebase.database().ref('Usersroom/' + roomUsersUid + '/' + roomName).once('value')
    .then(function(snapshot) {
      state = snapshot.child('recentcnt').val();
      //roomUsersState.push(state);
      //console.log(score);

      //만약 이 uid가 현재 접속중인 uid와 같다면, recentcnt와 lastClick값도 저장해둬라
      if(roomUsersUid == currentUserID){
        recentcnt = state;
        lastClick = snapshot.child('lastClick').val();
      }

      deferred.resolve(state);
    });
return deferred.promise();
}

//============================================================================//
//각 uid에 대해 스코어바와 점수 출력하기
//============================================================================//
function displayScoreBar(Nname, score) {
scoreBar.appendChild(createNname(Nname));
scoreBar.appendChild(createScore(score, Nname));
//console.log('display');
createMotion(score, Nname)
}

//============================================================================//
//페이지 새로 로그할때, 최종 클릭 시간 이용하여 recentcnt 리셋하기
//============================================================================//
function recentcntUpdate() {
var lastBaseMinusNow = judgement();
if (lastBaseMinusNow < 0) {
  //새로운 기회 획득 가능
  recentcnt = 0;

  //데이터베이스에 업데이트하기
  if (currentUserID != ''){
    firebase.database().ref('Usersroom/' + currentUserID + '/' + roomName).update({
      recentcnt: 0
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
else if (lastBaseMinusNow >= 0) {
  //오늘은 이미 버튼이 눌러져있는 상태임
}
}

//============================================================================//
//(채영코드수정) recentcnt에 따라 이미지 로그
//============================================================================//
function displayImg() {
var imgSrc = '';
if (recentcnt == 1) {
  imgSrc = 'assets/img/charCatSuccess.png';
}
else if (recentcnt == 0) {
  imgSrc = 'assets/img/charCat.png';
}
else if (recentcnt == -1) {
  imgSrc = 'assets/img/charCatFail.png';
}

document.getElementById('profileImg').src = imgSrc;
}

//============================================================================//
//(다은코드) 현재 접속중인 유저의 recentcnt에 따라 완료/-/포기 여부 출력
//============================================================================//
function displayTodayState() {
switch(recentcnt) {
  case 1:
    document.getElementById("todayState").innerHTML = '완료';
    break;
  case 0:
    document.getElementById("todayState").innerHTML = '-';
    break;
  case -1:
    document.getElementById("todayState").innerHTML = '포기';
    break;
}
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
style.innerHTML = '.progress-done-' + i + ' { background: linear-gradient(to left, #0093f5, #fcfa7a); box-shadow: 0 3px 3px -5px #fff, 0 2px 5px #fff; border-radius: 20px; color: #fff; display: flex; align-items: center; justify-content: center; height: 100%; opacity: 0; transition: 1s ease 0.3s;}';
document.getElementsByTagName('head')[0].appendChild(style);

//태그를 생성하여 클래스 속성 및 텍스트를 넣어줌
const divElem = document.createElement('div');
const divElem2 = document.createElement('div');
const divElem3 = document.createElement('div');
divElem.classList.add("progressBox");
divElem2.classList.add('progress');
divElem3.classList.add('progress-done-' + i);
/*
const elemTxt = document.createTextNode(score +"점");
divElem2.appendChild(elemTxt);*/
var elemTxt = score + '점';
$(divElem).append(elemTxt);


divElem2.appendChild(divElem3);
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

//---------------------------------------------------------------------------//
//모션 넣어주는 함수(스코어 넣으면 그만큼 width 키우는 것)
//---------------------------------------------------------------------------//
function createMotion(score, i) {
var progress = document.querySelector('.progress-done-' + i);

if(period != 0) {
  progress.style.width = (score/period)*100 + '%';
  progress.style.opacity = 1;
} else {
  alert('방 정보가 로드되기 전에 스코어 바를 출력하려는 오류가 발생했습니다.');
}
}

//=============================================================================//
//period 계산해주는 함수
//=============================================================================//
function calculatePeriod(sDate, eDate) {
var start = new Date(sDate);
var end = new Date(eDate);

var distance = end - start;
var d = Math.floor(distance / (1000 * 60 * 60 * 24));

return d+1; //기간이 총 몇일인지 리턴
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



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드)친구들의 달성 현황 보여주는 modal 띄우기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/*
document.getElementById('btn-showState').addEventListener('click',
function() {
document.querySelector('.bg-modal').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click',
function() {
document.querySelector('.bg-modal').style.display = 'none';
});
*/




//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//logout
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$("#btn-logout").click(function()
{
 firebase.auth().signOut();
});

/*
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//팝업창
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function openGoalPopup() {
var goalPopupUrl = "roomGoalPopup.html?val=" + roomName;
var goalPopupOption = "width=570, height=250, resizable = no, scrollbars = no";
window.open(goalPopupUrl, '', goalPopupOption, '');
}

function openPunishmentPopup() {
var punishmentPopupUrl = "roomPunishmentPopup.html?val=" + roomName;
var punishmentPopupOption = "width=570, height=250, resizable = no, scrollbars = no";
window.open(punishmentPopupUrl, '', punishmentPopupOption, '');
}*/

//===========================================================================================//
//(채영코드추가) 친구들의 달성 현황 보여주는 팝업창
//(추가해야할 기능)
//(1) 팝업창 위치 조정 or Modal로 변경
//(2) 가져올 정보들 어떻게 처리할지 (팝업창: 방이름 보낼때 전부 보내기 vs modal: 전역변수 값 이용)
//============================================================================================//
/*
function openStatePopup() {
var statePopupUrl = "roomStatePopup.html?val=" + roomName;
var statePopupOption = "width=300, height=400, resizable = no, scrollbars = auto";
window.open(statePopupUrl, '', statePopupOption, '');
}*/


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 성공 or 포기 or 리셋 버튼 누를때
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//=============================================================================//
//성공 버튼
//=============================================================================//
function plusOne() {
//lastBase(인정가능한시각)을 현재시각이 넘겼다면 recentcnt를 0으로 설정
if (lastClick != '') {

  var lastBaseMinusNow = judgement();
  if (lastBaseMinusNow < 0) {
    //새로운 기회 획득 가능인데, 성공 버튼 눌렀으니까 점수 추가 후 recentcnt도 변경
    fitcnt += 1;
    recentcnt = 1;
    lastClick = getTimeStamp(); //현재 시각 입력

    //위에서 변경된 값으로 데이터베이스 업데이트
    usersroomUpdate();

    alert("축하합니다. 오늘의 운동을 완료하셨습니다.");
  }
  else if (lastBaseMinusNow >= 0) {
    if (recentcnt == 1) {
      alert("오늘은 이미 완료 버튼을 누르셨습니다.");
    }
    else if (recentcnt == -1) {
      alert("오늘은 이미 포기 버튼을 누르셨습니다.");
    }
    else if (recentcnt == 0) {
      //오늘 이미 버튼을 눌렀지만, 그것이 리셋버튼이었던 경우
      fitcnt += 1;
      recentcnt = 1;
      lastClick = getTimeStamp(); //현재 시각 입력

      //위에서 변경된 값으로 데이터베이스 업데이트
      usersroomUpdate();

      alert("축하합니다. 오늘의 운동을 완료하셨습니다.");
    }
  }
} else {
  alert("잠시 후 다시 시도해 주세요.");
}
}

//=============================================================================//
//성공 버튼 기능이 완료된 후에, 페이지 새로고침하기
//=============================================================================//
function plusOneAndReload() {
$.when(plusOne()).done(function(){
  window.location.reload();
});
}

//=============================================================================//
//포기 버튼
//=============================================================================//
function giveUp() {
//lastBase(인정가능한시각)을 현재시각이 넘겼다면 recentcnt를 0으로 설정
if (lastClick != '') {

  var lastBaseMinusNow = judgement();
  if (lastBaseMinusNow < 0) {
    //새로운 기회 획득 가능인데, 포기 버튼 눌렀으니까 점수 추가 후 recentcnt도 변경
    recentcnt = -1;
    lastClick = getTimeStamp(); //현재 시각 입력

    //위에서 변경된 값으로 데이터베이스 업데이트
    usersroomUpdate();

    alert("오늘의 운동을 포기하셨습니다.");
  }
  else if (lastBaseMinusNow >= 0) {
    if (recentcnt == 1) {
      alert("오늘은 이미 완료 버튼을 누르셨습니다.");
    }
    else if (recentcnt == -1) {
      alert("오늘은 이미 포기 버튼을 누르셨습니다.");
    }
    else if (recentcnt == 0) {
      //오늘 이미 버튼을 눌렀지만, 그것이 리셋버튼이었던 경우
      recentcnt = -1;
      lastClick = getTimeStamp(); //현재 시각 입력

      //위에서 변경된 값으로 데이터베이스 업데이트
      usersroomUpdate();

      alert("오늘의 운동을 포기하셨습니다.");
    }
  }
} else {
  alert("잠시 후 다시 시도해 주세요.");
}
}

//=============================================================================//
//포기 버튼 기능이 완료된 후에, 페이지 새로고침하기
//=============================================================================//
function giveUpAndReload() {
$.when(giveUp()).done(function(){
  window.location.reload();
});
}

//=============================================================================//
//리셋 버튼
//=============================================================================//
function resetScore() {
//lastBase(인정가능한시각)을 현재시각이 넘겼다면 recentcnt를 0으로 설정
if (lastClick != '') {

  var lastBaseMinusNow = judgement();
  if (lastBaseMinusNow < 0) {
    //이미 다음날로 넘어가버림
    alert("어제의 운동 기록이 이미 종료되었습니다.");
  }
  else if (lastBaseMinusNow >= 0) {
    //아직 다음날로 안넘어가서 리셋해준다.
    if (recentcnt == 1) {
      //성공 눌러져있던 경우
      fitcnt -= 1;
      recentcnt = 0;
      lastClick = getTimeStamp(); //현재 시각 입력

      //위에서 변경된 값으로 데이터베이스 업데이트
      usersroomUpdate();

      alert("오늘의 운동 기록이 리셋되었습니다.");
    }
    else if (recentcnt == -1) {
      //포기 눌러져있던 경우
      recentcnt = 0;
      lastClick = getTimeStamp(); //현재 시각 입력

      //위에서 변경된 값으로 데이터베이스 업데이트
      usersroomUpdate();

      alert("오늘의 운동 기록이 리셋되었습니다.");
    }
    else if (recentcnt == 0) {
      //리셋 눌러져있던 경우
      //아무일도일어나지않음
    }
  }
} else {
  alert("잠시 후 다시 시도해 주세요.");
}
}

//=============================================================================//
//포기 버튼 기능이 완료된 후에, 페이지 새로고침하기
//=============================================================================//
function resetScoreAndReload() {
$.when(resetScore()).done(function(){
  window.location.reload();
});
}

//=============================================================================//
//마지막클릭시각에 대한 base시간과 현재 시간을 비교하는 함수
//=============================================================================//
function judgement() {
var now = new Date();
var last = new Date(lastClick);
var lastBase = new Date(lastClick);  //lastClick에 해당하는 기준 시간 설정

//lastClick 시간에 대한 lastBase 시간 설정(추후에 함수화하기)
if (0 <= last.getHours() && last.getHours() <= 4) {
  //날짜 변경없이 시간만 5시로 설정
  lastBase.setHours(5);
  lastBase.setMinutes(0);
  lastBase.setSeconds(0);
}
else if (5 <= last.getHours() && last.getHours() <= 23) {
  //날짜 하루 추가 후 시간 5시로 설정
  lastBase.setDate(lastBase.getDate() + 1);
  lastBase.setHours(5);
  lastBase.setMinutes(0);
  lastBase.setSeconds(0);
}

return (lastBase - now);
}

//=============================================================================//
//변경된 정보들 데이터베이스에 업데이트하는 함수
//현재 이름은 usersroomUpdate이지만, 실제 기능은 Usersroom의 recentcnt, lastClick과
//Rooms의 해당 유저의 fitcnt 업데이트를 수행함. (추후에 이름 변경 필요)
//=============================================================================//
function usersroomUpdate() {
if (currentUserID != ''){
  firebase.database().ref('Usersroom/' + currentUserID + '/' + roomName).set({
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

  firebase.database().ref('Rooms/' + roomName + '/Users/'+ currentUserID + '/').set({
      fitcnt : fitcnt,
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


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) (공통JS로 뺄것) 현재 url에서 방이름 가져오는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function getURLParameter() {
return decodeURI(
 (RegExp('roomName' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
);
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(유진코드) 방 터트리는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function endGame(eDate) {
var now = new Date()
var end = new Date(eDate)

var distance = end - now;

if( distance < 0 ) {
  setRoomNameAndMove("byeRoom.html",roomName);
}
else { return 0; }
}


//유진코드(공통 js로 뺄것)
function setRoomNameAndMove(url,rName) {
window.location.href = url + "?roomName=" + rName;
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%o
//certifyType = dumbel 일때 인증창 가는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function goCertify() {
  //lastBase(인정가능한시각)을 현재시각이 넘겼다면 recentcnt를 0으로 설정
  if (lastClick != '') {

    var lastBaseMinusNow = judgement();
    if (lastBaseMinusNow < 0) {
      //새로운 기회 획득 가능인데, 성공 버튼 눌렀으니까 점수 추가 후 recentcnt도 변경
      ReactNativeWebView.postMessage(roomName);
    }
    else if (lastBaseMinusNow >= 0) {
      if (recentcnt == 1) {
        alert("오늘은 이미 완료 버튼을 누르셨습니다.");
      }
      else if (recentcnt == -1) {
        alert("오늘은 이미 포기 버튼을 누르셨습니다.");
      }
      else if (recentcnt == 0) {
        //오늘 이미 버튼을 눌렀지만, 그것이 리셋버튼이었던 경우
        ReactNativeWebView.postMessage(roomName);
      }
    }
  } else {
    alert("잠시 후 다시 시도해 주세요.");
  }
}

/*
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
window.location.reload();
}
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
  window.location.reload();
}
};
*/


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//자라나라 모달모달 - 친구들의 달성 상황(채영코드에 다은 코드 추가)
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalState = document.getElementById('myModal-state');

// Get the button that opens the modal
var btnState = document.getElementById("openStatePopup");

// Get the <span> element that closes the modal
var spanState = document.getElementsByClassName("closeState")[0];

// When the user clicks on the button, open the modal
btnState.onclick = function() {
  modalState.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanState.onclick = function() {
  modalState.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalState) {
      modalState.style.display = "none";
  }
}



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

//=============================================================================//
//(다은코드) 친구들의 달성 상황 - 각 넥네임 별 표 한칸씩 생성
//=============================================================================//
function displayState(Nname, state) {
const stateTable = document.getElementById('stateTable');
const trElem = document.createElement('tr');
const tdElemLeft = document.createElement('td');
const tdElemRight = document.createElement('td');
const elemTxtLeft = document.createTextNode(Nname);
var elemTxtRight = document.createTextNode('');

tdElemLeft.classList.add('Nname');
tdElemLeft.appendChild(elemTxtLeft);

switch(state) {
  case 1:
    tdElemRight.classList.add('stateTrue');
    elemTxtRight = document.createTextNode('완료');
    tdElemRight.appendChild(elemTxtRight);
    break;
  case -1:
    tdElemRight.classList.add('stateFalse');
    elemTxtRight = document.createTextNode('포기');
    tdElemRight.appendChild(elemTxtRight);
    break;
  case 0:
    tdElemRight.classList.add('stateYet');
    elemTxtRight = document.createTextNode('-');
    tdElemRight.appendChild(elemTxtRight);
    break;
}

trElem.appendChild(tdElemLeft);
trElem.appendChild(tdElemRight);

stateTable.appendChild(trElem);
return trElem;
}
