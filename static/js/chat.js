var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('message', function(datamsg) {
    var messageDiv = document.getElementById('messages');
    
    if (datamsg.msg !== lastSentMessage) {  
        var luarMessageElement = document.createElement('div');
        luarMessageElement.innerHTML = "<img class='review-foto' src='static/uploads/fotoprofile/" + datamsg.foto+ "'>" + datamsg.name;
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', 'other');
        messageElement.innerHTML = datamsg.msg;
        luarMessageElement.appendChild(messageElement);
        messageDiv.appendChild(luarMessageElement);
        messageDiv.scrollTop = messageDiv.scrollHeight;
    }
});

let lastSentMessage = '';

function sendMessage() {
    var namayangmengirim = document.getElementById('namayangmengirim').value;
    var fotoyangmengirim = document.getElementById('fotoyangmengirim').value;
    var msg = document.getElementById('message').value;
    if (msg.trim() !== '') {
        var messageDiv = document.getElementById('messages');
        var userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user');
        userMessageElement.innerHTML = msg;
        messageDiv.appendChild(userMessageElement);

        lastSentMessage = msg;
        socket.send({ name: namayangmengirim, foto: fotoyangmengirim, msg: msg });
        
        document.getElementById('message').value = '';
        
        messageDiv.scrollTop = messageDiv.scrollHeight;
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}