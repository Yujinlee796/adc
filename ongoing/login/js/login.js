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

// update
$("#btn-update").click(function()
{
    var phone = $("#phone").val();
    var address = $("#address").val();
    var bio = $("#bio").val();
    var fName = $("#firstName").val();
    var sName = $("#secondName").val();
    var country = $("#country").val();
    var gender = $("#gender").val();

    var rootRef = firebase.database().ref().child("Users");
    var userID = firebase.auth().currentUser.uid;
    var usersRef = rootRef.child(userID);

    if(fName != "" && sName != "" && phone != "" && country != "" && gender != "" && bio != "" && address != "")
    {
        var userData =
        {
            "phone": phone,
            "address": address,
            "bio": bio,
            "firstName": fName,
            "secondName": sName,
            "country": country,
            "gender": gender,
        };

        usersRef.set(userData, function(error)
        {
            if(error)
            {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode);
                onsole.log(errorMessage);

                window.alert("Message: " + errorMessage);
            }
            else
            {
                window.location.href = "MainPage.html";
            }
        });
    }
    else
    {
        window.alert("Form is incomplete. Please fill out all fields.");
    }
});
