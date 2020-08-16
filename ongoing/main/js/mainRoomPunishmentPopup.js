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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 이 팝업창이 띄워진 부모창의 방이름
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var roomName = "";

function _GET(search) {
  var obj = {};
  var uri = decodeURI(search);
      uri = uri.slice(1,uri.length);

  var param = uri.split('&');
    
  for (var i = 0; i < param.length; i++) {
      var devide = param[i].split('=');
      obj[devide[0]] = devide[1];
  }

  return obj;
}

window.onload = function () {
  var search = window.location.search;
  var getData =  _GET(search);

  roomName = getData.val;
  console.log(roomName);
}


function editBetting() {
        var newBetting = document.getElementById("edittedBetting").value;
        firebase.database().ref("Rooms/" + roomName).update({
            betting: newBetting
        });
      alert("내기가 새로 설정되었습니다.");
      opener.location.reload();
      window.close();
    };


