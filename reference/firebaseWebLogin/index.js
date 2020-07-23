firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}


/* 여기서부터는 회원가입 */

// Your web app's Firebase configuration
var firebaseConfig = {
  //firebase config stuff
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    const auth = firebase.auth();
    
    
    function signUp(){
      
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      
      const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
      promise.catch(e => alert(e.message));
      
      alert("Signed Up");
    }
    
    
    
    function signIn(){
      
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      
      const promise = auth.signInWithEmailAndPassword(email.value, password.value);
      promise.catch(e => alert(e.message));
      
      
      
      
    }
    
    
    function signOut(){
      
      auth.signOut();
      alert("Signed Out");
      
    }
    
    
    
    auth.onAuthStateChanged(function(user){
      
      if(user){
        
        var email = user.email;
        alert("Active User " + email);
        
        //Take user to a different or home page
  
        //is signed in
        
      }else{
        
        alert("No Active User");
        //no user is signed in
      }
      
      
      
    });  