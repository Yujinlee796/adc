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


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 이 팝업창이 띄워진 부모창의 방이름
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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



  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //(다은코드) room.js 그대로 가져옴.
  //현재 방이름에 해당하는 uid를 다시 받고, 해당하는 닉네임과 recentcnt를 받음
  //★★★★★★★추후 부모창으로부터 값을 받아와서 쓰는걸로 수정하거나★★★★★
  //★★★★★★★madal을 써서 전역변수 값을 그대로 쓰는걸로 수정할 것임.★★★★
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  var roomUsers = [];
  firebase.database().ref('Rooms/' + roomName + '/Users').once('value').then(function(snapshot)
  {
    //방에 참여 중인 멤버의 uid 받아오기
    snapshot.forEach(function(childSnapshot) {
      var roomUsersUid = childSnapshot.key;
      roomUsers.push(roomUsersUid);
      console.log(roomUsersUid);
      console.log(roomUsers.length);

      $.when(getRoomUsersNname(roomUsersUid), getRoomUsersState(roomUsersUid)).done(function(Nname, recentcnt){
        console.log(Nname, recentcnt);
        createState(Nname, recentcnt);
      });
    });
    console.log(roomUsers);
  });

  //각 uid에 대해 닉네임 가져오기
  function getRoomUsersNname(roomUsersUid) {

    var deferred = $.Deferred();

    firebase.database().ref('Users/' + roomUsersUid).once('value')
        .then(function(snapshot) {
          Nname = snapshot.child('nickName').val();
          deferred.resolve(Nname);
        });
    return deferred.promise();
  }
  //각 uid에 대해 recentcnt 가져오기
  function getRoomUsersState(roomUsersUid) {

    var deferred = $.Deferred();

    firebase.database().ref('Usersroom/' + roomUsersUid + '/' + roomName).once('value')
        .then(function(snapshot) {
          recentcnt = snapshot.child('recentcnt').val();
          deferred.resolve(recentcnt);
        });
    return deferred.promise();
  }
}
  
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(다은코드) 표 한칸씩 생성
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const stateTable = document.getElementById('stateTable');

function createState(Nname, recentcnt) {
  const trElem = document.createElement('tr');
  const tdElemLeft = document.createElement('td');
  const tdElemRight = document.createElement('td');
  const elemTxtLeft = document.createTextNode(Nname);
  var elemTxtRight = document.createTextNode('');

  tdElemLeft.classList.add('Nname');
  tdElemLeft.appendChild(elemTxtLeft);
  
  switch(recentcnt) {
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


