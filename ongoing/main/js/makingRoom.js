
function makingRoom() {

  //===== 사용자가 입력한 정보 변수에 저장 =====
  var roomName = document.getElementById("room_name").value;
  var roomGoal = document.getElementById("room_goal").value;
  var roomBet = document.getElementById("room_bet").value;
  var userId = document.getElementById("room_users").value;
  var roomDate = document.getElementById("room_date").value;


  // 칸이 모두 채워졌는지 확인 후 database>Rooms에 data 업로드
  if(roomName != "" && roomGoal != "" && userId != "" && roomDate != "")
  {
      var rootRef = firebase.database().ref().child("Rooms");

     rootRef.orderByChild('name').equalTo(roomName).once('value', function(snapshot){
        if (snapshot.val() === null) {
            // 중복되지않은 방이름
            var roomData =
            {
              name : roomName,
              users : userId,
              betting : roomBet,
              goals : roomGoal,
              startDate : roomDate
            };

            firebase.database().ref('Rooms/' + roomName).set(roomData, function(error)
            {
                if(error)
                {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorCode);
                    onsole.log(errorMessage);

                    window.alert("Message: " + errorMessage);
                }
            });

            //Usersroom에 유저별 room data 업뎃
            firebase.database().ref('Usersroom/' + userId).push({
                name : roomName,
                fitcnt : 0,
                recentcnt : false
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
              else
              {
                window.alert("방이 만들어졌습니다.");
                window.location.href = "../main/mainPage.html";
              }});


        }
        else
        {
            // 중복된 방이름
            window.alert("중복된 방이름입니다.")
        }
    });
  }

  else
  {
      window.alert("칸을 모두 채워주세요.");
  }

  //var database = firebase.database();

}
