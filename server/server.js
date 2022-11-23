const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fetch = require('node-fetch');
const app = express();
const httpServer = createServer(app);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const io = new Server(httpServer, { 
  cors: {
    origin: "*"
  }
});

let rooms = {}


io.on("connection", (socket) => {


console.log(rooms);


console.log("Un user connecté")


    socket.on('createOrJoinRoom', (userInformation) => {
      // Attaches les infos au socket
      socket.data.username = userInformation.username;
      socket.data.avatar = userInformation.avatar;
      socket.data.roomAttached = userInformation.idOfGame;
      socket.data.score = 0;
      socket.data.ishost = false;

      //console.log("Cet user s'appelle : " + socket.data.username)

      if(io.sockets.adapter.rooms.has(socket.data.roomAttached)) {
        // S'il rejoint
        socket.emit("isInvited", socket.data.roomAttached);
        getHostOfGame(io, socket.data.roomAttached);

      } else {
        // S'il crée 

        socket.data.ishost = true;
        //console.log("Il crée une nouvelle partie !")
        socket.join(socket.data.roomAttached);

      }
    });

    socket.on('joinRoomAsInvited', () => {
      socket.join(socket.data.roomAttached);
      var players = getListOfPlayersInRoom(socket.data.roomAttached)

      players.then(function(players) {
        // Permet de mettre à jour le front 
        io.in(socket.data.roomAttached).emit("roomIsReady", players);

        socket.on("disconnecting", () => {
        io.in(socket.data.roomAttached).emit("error", "😅 Ton pote s'est déco, faut recréer la partie !");
          delete rooms[socket.data.roomAttached];
        });



      })
    });

    socket.on('askStartGame', (roomId) => {
      // L'host clique sur démarrer 

      var players = getListOfPlayersInRoom(roomId);
      players.then(function(players) {
        // Start game with all infos
        
      

        const songs = getSongs(10);
        let indexOfSong = 0;
        songs.then(function(songs) {

          rooms[roomId] = {
            // == songs:songs
            songs,
            indexOfSong,
            answers:0
          }

          // Musics are loaded, room generated in global rooms game can start
          io.in(roomId).emit("startGame", players);
          
          // emit sendMusic to the room
          sendMusic(roomId, songs, indexOfSong);
         
        });


      });
      

    })
    // _______________________________________________ GAME START ______________________________________________
    

    socket.on('receiveAnswerFromPlayer', (answerInfos) => {
      rooms[answerInfos.roomId].answers++;

      // Check si la réponse est bonne, fais +100 + vitesse
      if(answerInfos.albumIdChosed == rooms[answerInfos.roomId].songs[rooms[answerInfos.roomId].indexOfSong].album_id) {
        socket.data.score = socket.data.score + 100 + answerInfos.bonusSpeed;
        //console.log(socket.data.score)
      }
      
      let players = findPlayersInRoom(answerInfos.roomId);
      players.then(function (players) {
        io.in(answerInfos.roomId).emit("updatePlayers", players.map(player => player.data));

        //console.log('Nouvelle réponse', rooms[answerInfos.roomId].answers, players.length)

        if(rooms[answerInfos.roomId].answers == players.length) {
          if(rooms[answerInfos.roomId].indexOfSong < 6) {
            sendMusic(answerInfos.roomId, rooms[answerInfos.roomId].songs, ++rooms[answerInfos.roomId].indexOfSong)
          } else {
            io.in(answerInfos.roomId).emit("endGame", players.map(player => player.data));
            
          }
        }
      })
    })

    async function findPlayersInRoom(roomId) {
      const sockets = await io.in(roomId).fetchSockets();
      return sockets;
    }


// _______________________________________________  GAME END  ______________________________________________
  socket.on('disconnect', (socket) => {
    //console.log('Deconnexion');
  });
});

httpServer.listen(3000, function() {
  //console.log("serveur lancé !")
});

async function getListOfPlayersInRoom(roomId) {
  const players = [];
  const allSocketsId = await io.in(roomId).fetchSockets();

  allSocketsId.forEach(element => {
    players.push({
      username:element.data.username,
      avatar:element.data.avatar,
      roomAttached:element.data.roomAttached,
      ishost:element.data.ishost,
      score:element.data.score
    })
  });
  return players;
}

// function getListOfActiveRooms(io) {
//   const arr = Array.from(io.sockets.adapter.rooms);
//   const filtered = arr.filter(room => !room[1].has(room[0]))
//   const res = filtered.map(i => i[0]);
//   return res;
// }

const getHostOfGame = async (io, idOfRoom) => {
  const sockets = await io.in(idOfRoom).fetchSockets();
  //console.log("Il veut rejoindre la partie de " +sockets[0].data.username + " mais n'a pas de pseudo");
}


async function sendMusic(roomId, songs, indexOfSong) {
  //console.log('Envoi des musiques', roomId, indexOfSong)

  io.in(roomId).emit("sendMusic", {
    song:songs[indexOfSong],
    indexOfSong
  });

  rooms[roomId].indexOfSong = indexOfSong;
  rooms[roomId].answers = 0;
  
  await delay(13000);

  io.in(roomId).emit("checkAnswers", songs[indexOfSong]);
}



async function getSongs(nb=10) {
  const songs = [];

  let rep = await fetch(`https://crud.nekjeu.fr/api/get/${nb}/songs`, { method: 'GET' });
  let reponse = await rep.json();
  return reponse;
  
}

