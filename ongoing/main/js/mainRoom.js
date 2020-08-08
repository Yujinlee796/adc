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
function successImg() {
  document.getElementById("profileImg").src = "assets/img/charCatSuccess.png";
}
function failImg() {
  document.getElementById("profileImg").src = "assets/img/charCatFail.png"
}
function reset() {
  document.getElementById("profileImg").src = "assets/img/charCat.png"
}
                      
//성공 버튼 누르면 점수가 올라가는 함수
var todayScore = 0;

function plusOne() {
  if (todayScore===0) {
    todayScore = todayScore + 1;
  }
  else if (todayScore>0) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===null) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };
};

//포기 버튼 누르면 값이 null로 바뀌는 함수

function giveUp() {
  if (todayScore===0) {
    todayScore = null;
  }
  else if (todayScore===1) {
    alert("오늘은 이미 성공 버튼을 누르셨습니다.");
  }
  else if (todayScore===null) {
    alert("오늘은 이미 포기 버튼을 누르셨습니다.");
  };
};

//리셋 버튼 누르면 값이 0으로 변하는 함수

function resetScore() {
  todayScore = 0;
};

console.log(todayScore);