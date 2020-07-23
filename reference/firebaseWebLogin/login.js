(function() {

  const config = {
      apiKey: "AIzaSyCqHKmX1adJ9qCPMnSWyP1p5JRzEruoe1E",
      authDomain: "fittogether-d628a.firebaseapp.com",
      databaseURL: "https://fittogether-d628a.firebaseio.com",
      projectId: "fittogether-d628a",
      storageBucket: "fittogether-d628a.appspot.com",
      messagingSenderId: "169218684132",
      appId: "1:169218684132:web:3134f8df18470da201a8f1",
      measurementId: "G-2MK17W9C5C"
    };
    firebase.initializeApp(config);
};

firebase.auth().onAuthStateChanged(firebaseUser=> {
  if(firebaseUser) {
    console.log(firebaseUser);
  }
  else {
    console.log('not logged in');
  }
};

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  };
    
};

function logout(){
  firebase.auth().signOut();
});

/* logout 참고
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    console.log(firebaseUser);
    btnLogou.classList.remove('hide'); //logout button 숨김해제
  }
  else {
    console.log('not logged in');
    btnLogou.classList.add('hide');
  }
  }
});

*/
