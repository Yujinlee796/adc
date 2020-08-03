// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA_B4Wm6dNTS4RLkHDBVovPWR3vdeqIrMU",
    authDomain: "social-home-training.firebaseapp.com",
    databaseURL: "https://social-home-training.firebaseio.com",
    projectId: "social-home-training",
    storageBucket: "social-home-training.appspot.com",
    messagingSenderId: "913009377780",
    appId: "1:913009377780:web:2842e0e52d1bf703ca39a1",
    measurementId: "G-RHCFJCEBZ1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  firebase.auth.Auth.Persistence.LOCAL;


// signin
$("#btn-login").click(function()
{
    var email = $("#email").val();
    var password = $("#password").val();

    if(email != "" && password != "")
    {
         var result = firebase.auth().signInWithEmailAndPassword(email, password);

        result.catch(function(error)
        {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            onsole.log(errorMessage);

            window.alert("Message: " + errorMessage);
        });
    }
    else
    {
        window.alert("Form is incomplete. Please fill out all fields.");

    }
});

// signup
$("#btn-signup").click(function()
{
    var email = $("#email").val();
    var password = $("#password").val();
    var cPassword = $("#confirmPassword").val();
    

    if(email != "" && password != "" && cPassword != "")
    {
        if(password == cPassword)
        {
            var result = firebase.auth().createUserWithEmailAndPassword(email, password);

            result.catch(function(error)
            {
                var errorCode = error.code;
                var errorMessage = error.message;
    
                console.log(errorCode);
                onsole.log(errorMessage);
    
                window.alert("Message: " + errorMessage);
            });
        }
        else
        {
            window.alert("Password do not match with the Confirm Password.");

        }
    }
    else
    {
        window.alert("Form is incomplete. Please fill out all fields.");
    }
});

// reset password
$("#btn-resetPassword").click(function()
{
   var auth = firebase.auth();
   var email = $("#email").val();

   if(email != "")
   {
       auth.sendPasswordResetEmail(email).then(function()
       {
        window.alert("Email has been sent to you, Please check and verify.");
       })
       .catch(function(error)
       {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        onsole.log(errorMessage);

        window.alert("Message: " + errorMessage);
       });
   }
   else
   {
        window.alert("Please write your email first.");
   }
});

// logout
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});
