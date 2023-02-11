const users = [];

// join user to the room
function userJoin(id, userName, room){
    const user = {id, userName, room};
    users.push(user);
    return user;
}

// all the user in the room
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// user leaves the room
function userLeaveRoom(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getRoomUsers,
    getCurrentUser,
    userLeaveRoom
}