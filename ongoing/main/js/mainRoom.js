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


//접속중인 유저 닉네임 출력해주는 구 코드(삭제할 것)
/*
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
  
                  document.getElementById('nicknameData').innerHTML = userNname;
                }
            });
        }
    });*/

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 방 이름 건네받는 부분
//각종 방 정보 띄우는 부분
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var roomName = "다우니 테스트방7";  //방 이름 받아오기
var startDate = '';
var period = 0;

//현재 방 정보 띄우기
firebase.database().ref('Rooms/' + roomName).once('value').then(function(snapshot) {
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(채영코드 수정) 날짜 데이터 string으로 받으면 가공해서 출력 형식으로 바꿔주는 함수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(제이쿼리 함수 이용)랭킹부분에 스코어바 띄우기
///for문을 아예 없애고, css이름도 닉네임으로 차별화를 둠
//각 uid에 대해, 해당하는 닉네임과 스코어를 받아오는 행위가 실행이 된 후에, 화면에 스코어바를 출력
//(기능추가)
//(1) 접속중인 유저 닉네임 띄우기
//(2) 해당 유저의 현재 fitcnt, recentcnt, lastClick 전역변수에 저장
//(3) recentcnt 상태 새벽 5시 기준으로 리셋하기
//(4) recentcnt 값에 따라 동물 그림 로드하기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//전역변수로 선언
var roomUsers = [];
var fitcnt = 0;
var recentcnt = 0;
var lastClick = '';
var currentUserID = '';

firebase.auth().onAuthStateChanged(function(user)
{
  if(user){
    currentUserID = firebase.auth().currentUser.uid;
    console.log(currentUserID);

    firebase.database().ref('Rooms/' + roomName + '/Users').once('value').then(function(snapshot)
    {
      //방에 참여 중인 멤버의 uid 받아오기
      snapshot.forEach(function(childSnapshot) {
        var roomUsersUid = childSnapshot.key;
        roomUsers.push(roomUsersUid);

        //닉네임과 스코어를 가져오면, 출력하기 result1: Nname, result2: score (나중에 변경)
        $.when(getRoomUsersNname(roomUsersUid, currentUserID), getRoomUsersScore(roomUsersUid, currentUserID)).done(function(result1, result2){
          //스코어바 출력하기
          displayScoreBar(result1, result2);
          recentcntUpdate();
        }).done(function(){
          //동물 그림 출력하기(이게 forEach에 걸려있는거 안좋을듯. 추후 수정)
          displayImg();
        });
      });
        //console.log(roomUsers);
    });
  }
});

//각 uid에 대해 닉네임 가져오기
function getRoomUsersNname(roomUsersUid, currentUserID) {

  var deferred = $.Deferred();

  firebase.database().ref('Users/' + roomUsersUid).once('value')
      .then(function(snapshot) {
        Nname = snapshot.child('nickName').val();
        //roomUsersNname.push(Nname);
        //console.log(Nname);

        //만약 이 uid가 현재 접속중인 uid와 같다면, 해당 닉네임을 출력해줘라
        if(roomUsersUid == currentUserID){
          document.getElementById('nicknameData').innerHTML = Nname;
        }

        deferred.resolve(Nname);
      });
  return deferred.promise();
}

//각 uid에 대해 score 가져오기
function getRoomUsersScore(roomUsersUid, currentUserID) {

  var deferred = $.Deferred();

  firebase.database().ref('Usersroom/' + roomUsersUid + '/' + roomName).once('value')
      .then(function(snapshot) {
        score = snapshot.child('fitcnt').val();
        //roomUsersScore.push(score);
        //console.log(score);

        //만약 이 uid가 현재 접속중인 uid와 같다면, recentcnt와 lastClick값도 저장해둬라
        if(roomUsersUid == currentUserID){
          recentcnt = snapshot.child('recentcnt').val();
          lastClick = snapshot.child('lastClick').val();
          fitcnt = score;
          //console.log(recentcnt);
          //console.log(lastClick);
        }

        deferred.resolve(score);
      });
  return deferred.promise();
}
  
//각 uid에 대해 스코어바와 점수 출력하기
function displayScoreBar(Nname, score) {
  scoreBar.appendChild(createNname(Nname));
  scoreBar.appendChild(createScore(score, Nname));
  //console.log('display');
  createMotion(score, Nname)
}

//페이지 새로 로그할때, 최종 클릭 시간 이용하여 recentcnt 리셋하기
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(채영코드수정) recentcnt에 따라 이미지 로그
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//닉네임과 점수를 입력하면 스코어바를 화면에 출력하고 모션을 추가하는 함수 선언하기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const scoreBar = document.getElementById('scoreBar');

//스코어와 인덱스 번호(->현재 닉네임 값으로 수정됨)를 입력하면, 각 스코어를 출력할 수 있는 css를 생성하여 스코어바를 만드는 함수
function createScore(score, i) {

  //일단 각각의 score 값을 출력할 수 있는 css 코드를 각각 만들어서 html의 head 부분에 작성
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.progress-done-' + i + ' { background: linear-gradient(to left, #F2709C, #FF9472); box-shadow: 0 3px 3px -5px #F2709C, 0 2px 5px #F2709C; border-radius: 20px; color: #fff; display: flex; align-items: center; justify-content: center; height: 100%; width: 0%; opacity: 0; transition: 1s ease 0.3s;}';
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

//닉네임을 입력하면 닉네임을 출력하는 함수
function createNname(Nname) {
  const spanElem = document.createElement('span');
  const elemTxt = document.createTextNode(Nname);
  spanElem.appendChild(elemTxt);

  return spanElem;
}

//모션 넣어주는 함수(스코어 넣으면 그만큼 width 키우는 것)
function createMotion(score, i) {
  var progress = document.querySelector('.progress-done-' + i);

  if(period != 0) {
    progress.style.width = (score/period)*100 + '%';
    progress.style.opacity = 1;
  } else {
    alert('방정보가 로드되기 전에 랭킹바를 출력하려는 오류 발생');
  }
}


//period 계산해주는 함수
function calculatePeriod(sDate, eDate) {
  var start = new Date(sDate);
  var end = new Date(eDate);

  var distance = end - start;
  var d = Math.floor(distance / (1000 * 60 * 60 * 24));

  return d; //기간이 총 몇일인지 리턴
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드)친구들의 달성 현황 보여주는 modal 띄우기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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





// logout
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});


//팝업창
function openGoalPopup() {
  var goalPopupUrl = "roomGoalPopup.html?val=" + roomName;
  var goalPopupOption = "width=570, height=250, resizable = no, scrollbars = no";
  window.open(goalPopupUrl, '', goalPopupOption, '');
}

function openPunishmentPopup() {
  var punishmentPopupUrl = "roomPunishmentPopup.html?val=" + roomName;
  var punishmentPopupOption = "width=570, height=250, resizable = no, scrollbars = no";
  window.open(punishmentPopupUrl, '', punishmentPopupOption, '');
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드)친구들의 달성 현황 보여주는 팝업창 띄우기(추후에 팝엽창 위치 조정)
//일단 전부 자식창에 url 형식으로 방이름 보내는 방식 채택. 후에 수정할수도
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function openStatePopup() {
  var statePopupUrl = "roomStatePopup.html?val=" + roomName;
  var statePopupOption = "width=300, height=400, resizable = no, scrollbars = auto";
  window.open(statePopupUrl, '', statePopupOption, '');
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 성공 or 포기 or 리셋 버튼 누를때
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//성공 버튼
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
        alert("오늘은 이미 성공 버튼을 누르셨습니다.");
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
    alert("잠시후 다시 시도해주세요.");
  }
}

//성공 버튼 기능이 완료된 후에, 페이지 새로고침하기
function plusOneAndReload() {
  $.when(plusOne()).done(function(){
    window.location.reload();
  });
}

//포기 버튼
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

      alert("저런. 오늘의 운동을 포기하셨습니다.");
    }
    else if (lastBaseMinusNow >= 0) {
      if (recentcnt == 1) {
        alert("오늘은 이미 성공 버튼을 누르셨습니다.");
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

        alert("저런. 오늘의 운동을 포기하셨습니다.");
      }
    }
  } else {
    alert("잠시후 다시 시도해주세요.");
  }
}

//포기 버튼 기능이 완료된 후에, 페이지 새로고침하기
function giveUpAndReload() {
  $.when(giveUp()).done(function(){
    window.location.reload();
  });
}

//리셋 버튼
function resetScore() {
  //lastBase(인정가능한시각)을 현재시각이 넘겼다면 recentcnt를 0으로 설정
  if (lastClick != '') {

    var lastBaseMinusNow = judgement();
    if (lastBaseMinusNow < 0) {
      //이미 다음날로 넘어가버림
      alert("이미 늦었다 임마");
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

        alert("성공 눌러있던거 리셋했다 임마");
      }
      else if (recentcnt == -1) {
        //포기 눌러져있던 경우
        recentcnt = 0;
        lastClick = getTimeStamp(); //현재 시각 입력

        //위에서 변경된 값으로 데이터베이스 업데이트
        usersroomUpdate();

        alert("포기 눌러있던거 리셋했다 임마");
      }
      else if (recentcnt == 0) {
        //리셋 눌러져있던 경우
        //아무일도일어나지않음
      }
    }
  } else {
    alert("잠시후 다시 시도해주세요.");
  }
}

//포기 버튼 기능이 완료된 후에, 페이지 새로고침하기
function resetScoreAndReload() {
  $.when(resetScore()).done(function(){
    window.location.reload();
  });
}


//마지막클릭시각에 대한 base시간과 현재 시간을 비교하는 함수
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

//변경된 정보들 데이터베이스에 업데이트하는 함수
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



//버튼

/*
//성공 버튼 누르면 점수가 올라가는 함수
function plusOne() {
  if (todayScore===0) {
    todayScore = todayScore + 1;
  }
  else if (todayScore>0) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===100) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };
};

//포기 버튼 누르면 값이 100으로 바뀌는 함수

function giveUp() {
  if (todayScore===0) {
    todayScore = 100;
  }
  else if (todayScore===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===100) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };
};

//리셋 버튼 누르면 값이 0으로 변하는 함수

function resetScore() {
  todayScore = 0;
};
*/

/*
//성공 버튼 누르면 고양이 그림 바꾸는 함수
function successImg() {
  if (todayScore === 0) {
    document.getElementById("profileImg").src = "assets/img/charCatSuccess.png";
  }
  else {

  };
};

//포기 버튼 누르면 고양이 그림 바꾸는 함수
function failImg() {
  if (todayScore === 0) {
    document.getElementById("profileImg").src = "assets/img/charCatFail.png";
  }
  else {

  };
};

//리셋 버튼 누르면 고양이 그림 바꾸는 함수
function reset() {
  document.getElementById("profileImg").src = "assets/img/charCat.png";
};

//새벽 5시가 지나면 todayScore값을 0으로 바꾸는 함수

if (currentHours === 5 && currentMinutes === 0) {
  todayScore = 0;
  if (todayScore === 1) {
    totalScore = totalScore + 1;
  }
  else {

  };
};*/









/*
//로컬스트리지 빼고 스냅샷으로 바꿀 것.
//시간 오래걸리는거 어떡하지???
//데이터베이스 내 경로 연결 수정
//고놈의 새벽 5시

//★변수 분류★ 유저룸/스냅샷
var successOrFailure;
//오늘의 성공여부 변수(1 / 0 / -1), 성공 클릭하면 올라감(정확히는 클릭 시 값이 변한 recentcnt의 값을 즉시 할당받음).

var yesterdayScore;
//어제의 fitcnt(데이터베이스 내의 총점수 key)의 값을 할당받음. 어제의 값이기 때문에 하루종일 유지.

var todayScore;
//fitcnt를 업데이트할 때 이용할 변수, 오늘 기준의 총점



//변수 초깃값
firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
  successOrFailure = snapshot.child("recentcnt/").val();
  yesterdayScore = snapshot.child("fitcnt/").val();
  console.log("successOrFailure: "+successOrFailure);
  console.log("yesterdayScore: "+yesterdayScore);
  console.log('todayCount: '+localStorage.getItem('areUDone')); //이 안에 있는 로컬스토리지 값이 오늘의 점수(1 / 0)
//yesterdayScore에 더함. 새벽 5시가 되면 fitcnt를 localStorage.getItem('areUDone') + yesterdayScore로 업데이트.
//더한 결과물이 todayScore.
//fitcnt를 그때그때 변경할 수가 없음! fitcnt의 값을 그때그때 스냅샷으로 변수로 받아서 1을 더한 후 그걸로 업데이트해야.
//successOrFailure는 리셋인 상황까지 판별해낼 수 있어야 하기 때문에(경우의 수가 3개), successOrFailure를 fitcnt에 더하기는 부적절
//그래서 더하기용 값을 설정한 것.
//fitcnt를 그대로 받는 것보다는 무조건 상수인 yesterdayScore를 두는 것이 낫다고 생각.
});


//successOrFailure에 맞춰 이미지 로드
window.onload = setTimeout(function() {
  if (successOrFailure === 1) {
    var imgSrc = 'assets/img/charCatSuccess.png';
  }
  
  else if (successOrFailure === 0) {
    var imgSrc = 'assets/img/charCat.png';
  }

  else if (successOrFailure === -1) {
    var imgSrc = 'assets/img/charCatFail.png';
  }
  
  document.getElementById('profileImg').src = imgSrc;

  console.log(imgSrc);
}, 1500);
*/




//목표 출력 함수 ★변수 분류★ 룸스/스냅샷
/*
var database = firebase.database();

firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printGoals = snapshot.child("goals").val();
  document.getElementById("goalText").innerHTML = printGoals;
});
*/


//내기 출력 함수 ★변수 분류★ 룸스/스냅샷
/*
firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printBetting = snapshot.child("betting").val();
  document.getElementById("bettingText").innerHTML = printBetting;
})
*/

/*
//성공버튼 +1 ★변수 분류★ 유저룸/업데이트, 스냅샷
function plusOne() {
  if (successOrFailure===0) {
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: 1
    });
    localStorage.clear();
    localStorage.setItem('areUDone', 1);
  }
  else if (successOrFailure===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (successOrFailure===-1) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };

  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    successOrFailure = snapshot.child("recentcnt/").val();
  });
  console.log("successOrFailure: "+successOrFailure);
  console.log('todayCount: '+localStorage.getItem('areUDone'));
};



//실패버튼 -1 ★변수 분류★ 유저룸/업데이트, 스냅샷
function giveUp() {
  if (successOrFailure===0) {
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: -1
    });
  }
  else if (successOrFailure===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (successOrFailure===-1) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };

  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    successOrFailure = snapshot.child("recentcnt/").val();
  });
  console.log("successOrFailure: "+successOrFailure);
  console.log('todayCount: '+localStorage.getItem('areUDone'));
};



//리셋버튼 0 ★변수 분류★ 유저룸/업데이트, 스냅샷
function resetScore() {
  firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
    recentcnt: 0
  });
  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    successOrFailure = snapshot.child("recentcnt/").val();
  });
  console.log("successOrFailure: "+successOrFailure);

  localStorage.clear();
  localStorage.setItem('areUDone', 0);
  console.log('todayCount: '+localStorage.getItem('areUDone'));
};
*/

/*
//성공 버튼 누르면 고양이 그림 바꾸는 함수
function successImg() {
  if (successOrFailure === 0) {
    document.getElementById("profileImg").src = "assets/img/charCatSuccess.png";
  }
  else {

  };
};



//포기 버튼 누르면 고양이 그림 바꾸는 함수
function failImg() {
  if (successOrFailure === 0) {
    document.getElementById("profileImg").src = "assets/img/charCatFail.png";
  }
  else {

  };
};



//리셋 버튼 누르면 고양이 그림 바꾸는 함수
function reset() {
  document.getElementById("profileImg").src = "assets/img/charCat.png";
};
*/


/*
//새벽 5시가 지나면 successOrFailure값을 0으로 바꾸는 함수

var d = new Date();
var currentHours = d.getHours();
var currentMinutes = d.getMinutes();

if (currentHours === 5 && currentMinutes === 0) {
  todayScore = localStorage.getItem('areUDone') + yesterdayScore //오늘로써 달성한 최종 점수
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: 0,
      fitcnt: todayScore
    });
    successOrFailure = 0;
    localStorage.clear();
};
*/




//방제 출력 ★변수 분류★ 룸스, 스냅샷
/*
firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printTitle = snapshot.child("name").val();
  document.getElementById("titleData").innerHTML = printTitle;
})
*/



//닉네임 출력 ★변수 분류★ 유저스, 스냅샷
/*
firebase.database().ref('Users/rv2UkGj4xWQoAEEYiKiHHLQeY883/').once('value').then(function(snapshot) {
  var printNickname = snapshot.child("nickName").val();
  document.getElementById("nicknameData").innerHTML = printNickname;
})
*/

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 현재 시간 표준 포맷을 뽑는 합수
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
