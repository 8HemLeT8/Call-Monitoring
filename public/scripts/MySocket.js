
alert("MySocket.js is linked");

function initSocket() {
    //socket is global
    socket = io.connect();
    alert("connected to the socket");
}

function sendMessage(total) {
    
    console.log(total);

    socket.emit("totalWaitingCalls", { totalWaiting: total });
}
