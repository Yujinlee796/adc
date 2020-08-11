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

  
// logout
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});

//팝업창
function openGoalPopup() {
  var goalPopupUrl = "roomGoalPopup.html"
  var goalPopupOption = "width=570, height=250, resizable = no, scrollbars = no"
  window.open(goalPopupUrl, '', goalPopupOption, '');
}

function openPunishmentPopup() {
  var punishmentPopupUrl = "roomPunishmentPopup.html"
  var punishmentPopupOption = "width=570, height=250, resizable = no, scrollbars = no"
  window.open(punishmentPopupUrl, '', punishmentPopupOption, '');
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





//목표 출력 함수 ★변수 분류★ 룸스/스냅샷
var database = firebase.database();

firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printGoals = snapshot.child("goals").val();
  document.getElementById("goalText").innerHTML = printGoals;
});



//내기 출력 함수 ★변수 분류★ 룸스/스냅샷
firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printBetting = snapshot.child("betting").val();
  document.getElementById("bettingText").innerHTML = printBetting;
})



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




//방제 출력 ★변수 분류★ 룸스, 스냅샷
firebase.database().ref('Rooms/채영테스트/').once('value').then(function(snapshot) {
  var printTitle = snapshot.child("name").val();
  document.getElementById("titleData").innerHTML = printTitle;
})



//닉네임 출력 ★변수 분류★ 유저스, 스냅샷
firebase.database().ref('Users/rv2UkGj4xWQoAEEYiKiHHLQeY883/').once('value').then(function(snapshot) {
  var printNickname = snapshot.child("nickName").val();
  document.getElementById("nicknameData").innerHTML = printNickname;
})