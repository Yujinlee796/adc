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
                console.log(errorMessage);
    
                if ( errorMessage == "The email address is already in use by another account." ) {
                    document.getElementById("confirmEmailResult").innerHTML = "이미 사용중인 이메일입니다."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
                    document.getElementById("confirmEmailResult").style.color = "red"
                    document.getElementById("confirmPasswordResult").innerHTML = ""
                    document.getElementById("confirmPasswordResultAgain").innerHTML = ""
                    document.getElementById("plzFillin").innerHTML = ""
                }

                else if ( errorMessage == "Password should be at least 6 characters" ) {
                    document.getElementById("confirmPasswordResult").innerHTML = "비밀번호는 6자 이상 입력해 주세요."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
                    document.getElementById("confirmPasswordResult").style.color = "red"
                    document.getElementById("confirmEmailResult").innerHTML = ""
                    document.getElementById("confirmPasswordResultAgain").innerHTML = ""
                    document.getElementById("plzFillin").innerHTML = ""
                }

                else if ( errorMessage == "The email address is badly formatted." ) {
                    document.getElementById("confirmEmailResult").innerHTML = "올바른 형식의 이메일을 입력해 주세요."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
                    document.getElementById("confirmEmailResult").style.color = "red"
                    document.getElementById("confirmPasswordResult").innerHTML = ""
                    document.getElementById("confirmPasswordResultAgain").innerHTML = ""
                    document.getElementById("plzFillin").innerHTML = ""
                }


            });
        }
        else
        {
            document.getElementById("confirmPasswordResultAgain").innerHTML = "비밀번호가 일치하지 않습니다."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
            document.getElementById("confirmPasswordResultAgain").style.color = "red"
            document.getElementById("confirmEmailResult").innerHTML = ""
            document.getElementById("confirmPasswordResult").innerHTML = ""
            document.getElementById("plzFillin").innerHTML = ""
        }
    }
    else
    {
        document.getElementById("plzFillin").innerHTML = "입력되지 않은 정보가 있습니다."; //추후에, 이경우엔 style 속성에 color 빨간색 넣고
        document.getElementById("plzFillin").style.color = "red"
        document.getElementById("confirmPasswordResult").innerHTML = ""
        document.getElementById("confirmPasswordResultAgain").innerHTML = ""
        document.getElementById("confirmEmailResult").innerHTML = ""
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
/*
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});
*/

// update(account settings) 원래 있던것
/*
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
*/

// nickname settings
$("#btn-update").click(function()
{
    var nickName = $("#nickName").val();

    //닉네임 10자 이내 인지 확인하기
    if (0 < nickName.length && nickName.length <= 10) {

        var rootRef = firebase.database().ref().child("Users");
        var userID = firebase.auth().currentUser.uid;
        var usersRef = rootRef.child(userID);
        
        rootRef.orderByChild('nickName').equalTo(nickName).once('value', function(snapshot){
            if (snapshot.val() === null) {
                // 중복되지않은 닉네임
                var userData =
                {
                    "nickName": nickName,
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
                        window.location.href = "../main/mainPage.html";
                    }
                });
            }
            else
            {
                // 중복된 닉네임
                //class를 추가해서 경고 문구가 뜨도록 하는 코드
                $("#nickName").addClass("is-invalid");   //♥이부분에 오류 메시지 추가해주세용♥
            }  
        }); 
    } else if (nickName.length == 0) {
        //닉네임을 입력하지 않음
        alert("닉네임을 입력하세요");   //♥이부분에 오류 메시지 추가해주세용♥
    } else if (nickName.length > 10) {
        //닉네임이 10자를 초과함
        alert("초과");   //♥이부분에 오류 메시지 추가해주세용♥
    }
});