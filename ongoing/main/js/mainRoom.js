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

//★변수 분류★ 유저룸/스냅샷
var todayScore;
var yesterdayScore;
var totalScore;


firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
  todayScore = snapshot.child("recentcnt/").val();
  yesterdayScore = snapshot.child("fitcnt/").val();
  console.log("todayScore: "+todayScore);
  console.log("totalScore: "+yesterdayScore);
  console.log('cntOne: '+localStorage.getItem('areUDone'));
});

//todayScore에 맞춰 이미지 로드
window.onload = setTimeout(function() {
  if (todayScore === 1) {
    var imgSrc = 'assets/img/charCatSuccess.png';
  }
  
  else if (todayScore === 0) {
    var imgSrc = 'assets/img/charCat.png';
  }

  else if (todayScore === -1) {
    var imgSrc = 'assets/img/charCatFail.png';
  }
  
  document.getElementById('profileImg').src = imgSrc;

  console.log(imgSrc);
}, 1100);





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
  if (todayScore===0) {
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: 1
    });
    localStorage.clear();
    localStorage.setItem('areUDone', 1);
  }
  else if (todayScore===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===-1) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };

  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    todayScore = snapshot.child("recentcnt/").val();
  });
  console.log("todayScore: "+todayScore);
  console.log('cntOne: '+localStorage.getItem('areUDone'));
};

//실패버튼 -1 ★변수 분류★ 유저룸/업데이트, 스냅샷
function giveUp() {
  if (todayScore===0) {
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: -1
    });
  }
  else if (todayScore===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===-1) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };

  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    todayScore = snapshot.child("recentcnt/").val();
  });
  console.log("todayScore: "+todayScore);
  console.log('cntOne: '+localStorage.getItem('areUDone'));
};

//리셋버튼 0 ★변수 분류★ 유저룸/업데이트, 스냅샷
function resetScore() {
  firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
    recentcnt: 0
  });
  firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
    todayScore = snapshot.child("recentcnt/").val();
  });
  console.log("todayScore: "+todayScore);

  localStorage.clear();
  localStorage.setItem('areUDone', 0);
  console.log('cntOne: '+localStorage.getItem('areUDone'));
};

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

var d = new Date();
var currentHours = d.getHours();
var currentMinutes = d.getMinutes();

if (currentHours === 5 && currentMinutes === 0) {
    totalScore = localStorage.getItem('areUDone') + yesterdayScore
    firebase.database().ref("Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/").update({
      recentcnt: 0,
      fitcnt: totalScore
    });
    firebase.database().ref('Usersroom/luvchaeng/-MELb6PrN68B_-3X0lyS/').once('value').then(function(snapshot) {
      todayScore = snapshot.child("recentcnt/").val();
    });
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