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

  var userList = [];
  var roomList = new Array;
  var updates = {};

//===========================================================================//
//main 함수 //
//==========================================================================//
firebase.auth().onAuthStateChanged(function(user)
{
  $.when(getUserID())
  .done(function(){
    console.log(updates);
    firebase.database().ref().update(updates, function(error) {
      if(error) {
        console.log("Error!");
      }
      else {
        console.log("Updates!");
      }
    });
  });
});

function update() {
  userList.forEach(user => {
    //Usersroom으로 방목록 가져오기
    firebase.database().ref('Usersroom/' + user).once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var roomName = childSnapshot.key;
          updates["Usersroom/" + user + "/" + roomName + "/recentcnt"] = 0;
          roomList.push({ user : user , name : roomName});
        });
    });
  });
}

//===========================================================================//
//userID List로 만들기 //
//==========================================================================//
function getUserID() {
  firebase.database().ref('Users/').once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var user = childSnapshot.key;
      userList.push(user);
    })
    update();
  });

  console.log(userList);
}



//===========================================================================//
//userID로 방목록 불러오고 recentcnt 0으로 update하는 함수 //
//==========================================================================//
//function updateRecentcnt(userID) {

  //console.log("recentcnt = 0");

//}


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
