<template>
        <div class="container">
          <Loader v-if="loading" />
        <div class="row">
            <div class="col-5">
                <div class="avatar-section">
                    <img :src="avatar" alt="Avatar" class="img-fluid avatar player1-avatar">
                    <h3 class="text-center text-light player1-name">{{username}}</h3>
                </div>
            </div>
            <div class="col-2 d-flex align-items-center p-0">
                <div class="vs p-5"><img src="../assets/vs.webp" class="img-fluid" alt=""></div>
            </div>
            <div class="col-5 d-flex align-items-center justify-content-center colp2">
                <div class="avatar-section">
                    <img src="../assets/pending.webp" alt="Avatar" class="img-fluid avatar player2-avatar img-pending">
                    <h3 class="text-center text-light player2-name">...</h3>
                </div>
            </div>
            <div v-if="!this.isInvited">
                <div  class="col-12 mt-5 text-center">
                    <button class="btn btn-lg btn-light shadow-sm font-weight-bold mt-3 px-3 mx-2 submit text-primary" @click="copyToClipboard()" id="copybtn"
                    >
                    <div class="d-flex align-items-center">
                    <span class="me-2 material-symbols-rounded">
                        content_copy
                        </span> 
                        Copier l'url
                    </div>
                    </button>
                    <button @click="startGame()"
                    
                        class="btn btn-light btn-lg shadow-sm font-weight-bold mt-3 px-3 mx-2 launch-game text-primary disabled">
                    <div class="d-flex align-items-center">
                        <span class="me-2 material-symbols-rounded">play_arrow</span> 
                        Démarrer
                    </div>
                    </button>
                </div>
                    <small class="text-light d-block text-center mt-2">Il te suffit d'envoyer l'url à ton ami et d'attendre qu'il arrive !</small>
            </div>
                <h6 v-else class="text-center text-white mt-3">On attend que <span class="player1-namee"></span> lance la partie...</h6>

        </div>
    </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
    props:["username", "avatar"],
    data() {
        return {
            loading:true,
            isInvited: false,
            userInformations:{},
            allMembers:[]
        }
    },
    components: {
        Loader,
    },
methods: {
       createOrJoinRoom() {
            let url = window.location.href.split("/").pop().split('?')[0];
            let userInformations = {
              'idOfGame': url,
              'username': this.username,
              'avatar': this.avatar
            }
            this.userInformations = userInformations;
        this.socket.emit('createOrJoinRoom', userInformations)
    },
    startGame() {
        this.loading = true;
        console.log("loading vrai");
        this.socket.emit('askStartGame', this.userInformations.idOfGame);
    },
     // Clipboard
     copyToClipboard() {
            navigator.clipboard.writeText(window.location.href);
            document.querySelector('#copybtn').innerText ="Copié !";
        }
                
},
beforeMount() {
  
},
mounted() {
    // Set local variables 
   
    localStorage.setItem('username', this.username);
    localStorage.setItem('score', 0);
    localStorage.setItem('avatar', this.avatar);
    localStorage.setItem('roomId', window.location.href.split("/").pop());

    if(localStorage.getItem('player') == 1 && localStorage.getItem('username') != undefined) {
        this.loading = false;
    }


    // 
    let pseudo_1 = document.querySelector('.player1-name');
    let avatar_1 = document.querySelector('.player1-avatar');
    let pseudo_2 = document.querySelector('.player2-name');
    let avatar_2 = document.querySelector('.player2-avatar');


    this.socket.on("isInvited", (roomId) => {
         
        if(this.username === undefined) {
            // The guest doesn't have nick so redirect him to home with roomId to join 
            this.socket.off('isInvited');
            this.$router.push({ name: 'Home', params: {idOfGameInvited: roomId, isInvited: true} })
            console.log("Il te faut rentrer un pseudo avant")
        } else {
            // Ready to join the room 
            // this.loading = false;
            this.isInvited = true;
            this.socket.emit('joinRoomAsInvited');
            
            console.log("Parfait tu rejoins la partie");
        }
    })
    this.createOrJoinRoom();
    
 
    this.socket.on("roomIsReady", (allMembers) => {
        // On attend que namee1 lance la partie...
        let namee1 = document.querySelector('.player1-namee');
        let launchbtn = document.querySelector('.launch-game');
        let colp2 = document.querySelector('.colp2');
        let copyBtn = document.querySelector('#copybtn');


        // For both of them
        if(colp2) {
            colp2.classList.remove("d-flex","align-items-center", "justify-content-center", "colp2",);
            document.querySelector(".img-pending").classList.remove("img-pending");
        }

        // FOR Player 1 
            pseudo_1.innerText = allMembers[0].username
            avatar_1.src = allMembers[0].avatar
            if(launchbtn) {
                copyBtn.classList.add('d-none');
                document.querySelector('small').classList.add('d-none');
                launchbtn.classList.remove('disabled');
            }
        
        // FOR Player 2 
            pseudo_2.innerText = allMembers[1].username
            avatar_2.src = allMembers[1].avatar
            if(namee1) {
                namee1.innerText = allMembers[0].username
                this.loading = false;

            }

        // Set local variables
        this.allMembers = JSON.stringify(allMembers);

      
    });

    this.socket.on("startGame", (players) => {

        
        this.$router.push({ name: 'Game', params: {id: players[0].roomAttached, "allMembers":this.allMembers} });
        
        console.log("Partie lancée");

    })
}

}

</script>

<style scoped lang="scss">

.img-pending {
        background: #bddce9;
        border: 3px dashed grey;
        border-radius: 50%;

        -webkit-animation: rotate 100s linear infinite;
        -moz-animation: rotate 100s linear infinite;
        animation: rotate 100s linear infinite;
    }

@-moz-keyframes rotate {
    100% {
        -moz-transform: rotate(360deg);
    }
}
@-webkit-keyframes rotate {
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@keyframes rotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

</style>