const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userList = document.getElementById("users");


const urlParams = new URLSearchParams(window.location.search);

const userName = urlParams.get('username');
const room = urlParams.get('room');

// console.log(userName, room)


const socket = io("https://baat-cheet-backend.onrender.com/", { transports: ["websocket"] });

socket.emit("joinRoom", { userName, room });

socket.on("message", (message) => {
    // console.log(message.userName);
    // console.log(message.text);
    // console.log(message.time);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputRoomusers(users);
})

// get the message and send it
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let msg = event.target.elements.msg.value;
    // console.log(msg)

    // msg = msg.trim();

    if(!msg){
        return false;
    }

    socket.emit("chatMessage", msg);

    event.target.elements.msg.value = null;
    event.target.elements.msg.focus();
})

// output messages
function outputMessage(message) {
    // console.log(message);
    const div = document.createElement("div");
    div.classList.add("message");

    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = message.userName;
    p.innerHTML += `<span> ${message.time}</span>`;
    div.appendChild(p);

    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);

    chatMessages.appendChild(div);
}


function outputRoomName(room) {
    roomname.innerText = room
}

function outputRoomusers(users) {
    userList.innerHTML = "";
    users.forEach(user => {
        const li = document.createElement("li");
        li.innerText = user.userName;
        userList.appendChild(li);
    });
}

// prompt
document.getElementById("leave-btn").addEventListener("click", () => {
    const leaveRoom = confirm("Are you sure you want to leave the room?");
    if(leaveRoom){
        window.location.href = "./index.html";
    }
})