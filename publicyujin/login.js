
function login() {

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
          .then(function() {
            window.alert("Login Succes");
          })
          .catch(function(error) {
           // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error : " + errorMessage);
            return;
          });
}

//Sign out

/*
function logout(){
  firebase.auth().signOut();
});
*/

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
