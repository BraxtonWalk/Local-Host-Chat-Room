window.onload = function(){
    var textareas = document.getElementsByClassName('my_textarea');
    for (textarea of textareas) {
        textarea.hidden = true;
    }
}

var socket;
var currentUser;

function join(){
    var text = document.getElementById('text').value;
    currentUser = text;
    if(text){
        document.getElementById('error').innerHTML = "";

        var initialElements = document.getElementsByClassName('initial');
        for (element of initialElements) {
            element.hidden = true;
        }

        var textareas = document.getElementsByClassName('my_textarea');
        for (textarea of textareas) {
            textarea.hidden = false;
        }
        document.getElementById('username').innerHTML = currentUser;


        socket = io();
        socket.emit('join', { username: text });

        socket.on('user_connected', function(data) {
              var users = data;
              var dropdown = document.getElementById('dropdown');
              dropdown.innerHTML = "";

              for(var i=0; i<users.length; i++){
                    if(users[i] != currentUser){
                        var option = document.createElement("option");
                        option.value = users[i];
                        option.innerHTML = users[i];
                        dropdown.add(option);
                    }
              }
        });

        socket.on('send_message', function(data){
            var message_board = document.getElementById('textarea');
            message_board.innerHTML += data;
        });

    } else {
        document.getElementById('error').innerHTML = "Must Enter a Username";
    }
}

function send(){
    if(document.getElementById('user_text').value.trim() !== ""){
        document.getElementById('error2').innerHTML = "";
        socket = io();
        var msg = currentUser + ": " + document.getElementById('user_text').value;
        var sendToUser = document.getElementById('dropdown').value;
        document.getElementById('user_text').value = "";
        socket.emit('msg_recv', { username: sendToUser, msg: msg });
    }
    else{
        document.getElementById('error2').innerHTML = "Must Enter a Message!";
    }
}