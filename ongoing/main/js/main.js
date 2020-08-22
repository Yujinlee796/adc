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
  
  
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(공통JS로 뺄것) 왼쪽 위에 현재 접속 중인 유저 닉네임 출력하기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  firebase.auth().onAuthStateChanged(function(user)
      {
          if(user)
          {
              var userID = firebase.auth().currentUser.uid;
              console.log(userID);
  
              firebase.database().ref('Users/' + userID).once('value').then(function(snapshot)
              {
                  if(snapshot.val())
                  {
                    var userNname = snapshot.child('nickName').val();
                    document.getElementById("nickName").innerHTML = userNname;
  
                  } else 
                  {
                    //닉네임 설정을 건너뛰었다면 닉네임 설정부터 하고 와라
                    window.location.href = "../login/accountSettings.html";
                  }
              });
          } else if (!user) {
            //signout 상태이면 쫓겨나는 코드
            window.location.href = "../index.html";
          }
      });


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//(공통JS로 뺄것) logout
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$("#btn-logout").click(function()
{
   firebase.auth().signOut();
});



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//자라나라 모달모달 - 더 알아보기
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get the modal
var modalManual = document.getElementById('myModal-manual');
 
// Get the button that opens the modal
var btnManual = document.getElementById("openManual");

// Get the <span> element that closes the modal
var spanManual = document.getElementsByClassName("closeManual")[0];                                         

// When the user clicks on the button, open the modal 
btnManual.onclick = function() {
    modalManual.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanManual.onclick = function() {
    modalManual.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalManual) {
        modalManual.style.display = "none";
    }
}