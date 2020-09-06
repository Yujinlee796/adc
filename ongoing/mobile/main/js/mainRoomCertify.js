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
//모든 전역변수 선언
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var roomName = '';
var fitcnt = 0;
var lastClick = '';
var loadingState = false;

window.onload = function() {
    setTimeout(function() {
        var button = document.getElementById("completeCertify");
        button.style.display = "block";
      }, 1000);

    roomName = getURLParameter();

    if (roomName != '') {
        //document.getElementById("roomname").innerHTML = roomName;

        firebase.auth().onAuthStateChanged(function(user)
        {
            if(user){
                currentUserID = firebase.auth().currentUser.uid;

                firebase.database().ref('Rooms/' + roomName + '/Users/' + currentUserID).once('value').then(function(snapshot){
                    fitcnt = snapshot.child('fitcnt').val();
                    loadingState = true;
                });
            }
        }
        );
    } else { alert('방 이름을 불러오지 못했습니다.');}
}



function completeCertify() {
    //누르면, 성공 버튼 누른거 되고, 앱에 메시지 보냄.
    if(loadingState) {
        fitcnt += 1;
        lastClick = getTimeStamp();
        usersroomUpdate();

        //ReactNativeWebView.postMessage('complete!');
        setRoomNameAndMove("room.html", roomName);
        console.log("successful");
    }
}

function getURLParameter() {
    return decodeURI(
     (RegExp('roomName' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
  }

function usersroomUpdate() {
    if (currentUserID != ''){
        firebase.database().ref('Usersroom/' + currentUserID + '/' + roomName).set({
            recentcnt : 1,
            lastClick : lastClick
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

        firebase.database().ref('Rooms/' + roomName + '/Users/'+ currentUserID).set({
            fitcnt : fitcnt
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

function setRoomNameAndMove(url, rName) {
    window.location.href = url + "?roomName=" + rName;
    }
