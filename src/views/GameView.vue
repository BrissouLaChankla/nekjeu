<template>
    <div class="container game d-flex flex-column justify-content-center flex-grow-1">
        <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
                <div class="d-flex align-items-center text-white" style="width:150px">
                    <div class="flex-grow-1 text-center">
                        
                        <img :src="players[0].avatar" alt="Avatar" class="img-fluid avatar">
                        <h6 class="text-center mt-1">{{players[0].username}}</h6>
                    </div>
                    <h5 class="font-weight-bold ms-3">
                        {{players[0].score}}pt 
                    </h5>
                </div>
            </div>
            <div class="align-self-start">
            <Countdown v-if="showCountdown" />

            </div>
            <div>
                <div class="d-flex flex-row-reverse align-items-center text-white" style="width:150px">
                    <div class="flex-grow-1 text-center">
                        <img :src="players[1].avatar" alt="Avatar" class="img-fluid avatar">
                        <h6 class="text-center mt-1">{{players[1].username}}</h6>
                    </div>
                    <h5 class="font-weight-bold me-3">
                        {{players[1].score}}pt 
                    </h5>
                </div>
            </div>
        </div>

        <div class="col text-white bg-game text-center pt-4 px-3 d-flex flex-column justify-content-around">
                <div class="theme-title text-center">
                    <span class="indexOfSong">{{this.indexOfSong}}/10</span>
                    <h3 class="text-primary bg-light shadow-sm px-3">Les classiques</h3>
                </div>

                <div>
                    <h3 class="lyrics text-uppercase"></h3>
                </div>

                <h5 class="question-question mb-3 mt-2">
                    <span class="bg-light text-dark px-3 py-1 rounded shadow-sm">
                        De quel album provient ces lyrics ? 
                    </span>
                </h5>

                <div class="row justify-content-center align-self-center">
                        <div v-for="album in this.albums" :key="album" class="col-6 mb-3 text-center">
                            <div class="d-flex align-items-center justify-content-center tilt-album rounded shadow-sm overlay2" :data-album_id=album.id :style="{'background-image':'url('+album.src+')'}" @click="selectAlbum" data-tilt data-tilt-scale="1.1">
                                <h2 style="pointer-events: none" class="titre-album">{{album.title}}</h2>
                            </div>
                        </div>
                </div>
        </div>
    </div>
</template>

<script>
import VanillaTilt from 'vanilla-tilt';
import Countdown from "@/components/Countdown.vue";
import Swal from 'sweetalert2' 

export default {
    props:["allMembers"],
    components: {
        Countdown,
    },
    data() {
        return {
            players:undefined,
            showCountdown:false,
            timeSelected:0,
            indexOfSong:0,
            albums: [
                {
                    id:1,
                    title:"Feu",
                    src: require('../assets/albums/feu.webp')
                },
                  {
                    id:3,
                    title:"L.E.V",
                    src: require('../assets/albums/lev.webp')
                },
                  {
                    id:2,
                    title:"Cyborg",
                    src: require('../assets/albums/cyborg.webp')
                },
                  {
                    id:4,
                    title:"Autre",
                    src: require('../assets/albums/feat.webp')
                },
            ]
        }
    },
    methods: {
        selectAlbum(event) {
            // 
            let albumSelected = event.target;
            let allAlbums = document.querySelectorAll('.tilt-album');
            allAlbums.forEach(album => {
                album.classList.remove('selected-album')
            });
            albumSelected.classList.add('selected-album');
            this.timeSelected = Date.now();
        }
    },
  
    beforeMount() {
        this.players = JSON.parse(this.allMembers);
        },
    mounted() {
         let lyrics = document.querySelector('.lyrics')


        this.socket.on("sendMusic", (song) => {
            console.log(song);
            this.indexOfSong = song.indexOfSong;

            let allAlbums = document.querySelectorAll('.tilt-album');
            allAlbums.forEach(album => {
                album.classList.remove('selected-album')
            });


            lyrics.innerText = song.song.lyrics
            this.showCountdown = true;
            var audio = new Audio('https://crud.nekjeu.fr/storage/albums/'+ song.song.album.name +'/'+song.song.audio_src); // path to file

            const fadeAudio = setInterval(() => {
            const fadePoint = audio.duration - 1;
            if ((audio.currentTime >= fadePoint) && (audio.volume !== 0)) {
                audio.volume -= 0.1
            }

            if (audio.volume < 0.003) {
                clearInterval(fadeAudio);
            }
            }, 100);


            audio.play();

            setTimeout(() => {
                audio.pause();
                    Swal.fire({
                        title: 'Préparez-vous',
                        text: 'La prochaine musique va démarrer',
                        icon: 'info',
                         showCloseButton: false,
                          showConfirmButton: false,
                        timer:3000,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        timerProgressBar:true,
                    })
                this.showCountdown = false
            },10000)
         })

// Le serveur demande qu'on lui envoie les réponses

        this.socket.on('updatePlayers', (players) => {
           this.players = players
        });

         this.socket.on("checkAnswers", () => {

            let albumChosed = document.querySelector('.selected-album');
            let albumIdChosed = null;

            if(albumChosed !== null) {
                albumIdChosed = albumChosed.dataset.album_id
            } 
            
            let bonusSpeed = Math.floor((Date.now() - this.timeSelected)/100); 

                console.log("timer terminé !")

            // Envoie la réponse avec le score
            let answerInfos = {
                roomId: localStorage.getItem("roomId"),
                player: localStorage.getItem("player"),
                score: localStorage.getItem("score"),
                bonusSpeed:bonusSpeed,
                albumIdChosed: albumIdChosed,
            }
            console.log(answerInfos);

                this.showCountdown = false;

            this.socket.emit('receiveAnswerFromPlayer', (answerInfos));

         })

        this.socket.on("endGame", (players) => {
            this.$router.push({ name: 'End', params: {"allMembers":JSON.stringify(players)} });
        })

    	VanillaTilt.init(document.querySelectorAll(".tilt-album"));
    }
}
</script>

<style scoped lang="scss">
.indexOfSong {
    position: absolute;
    transform:translateX(-50%);
    top:-30px;
}
.selected-album {
    border: 5px solid green;
}
.game {

    .tilt-album {
        height: 20vh;
        cursor: pointer;
        background-position: center !important;
        background-size: cover !important;
        transform-style: preserve-3d;

        &:hover {
            .titre-album {
                opacity: 1;
            }
        }
        .titre-album {
            transform: translateZ(30px);
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: 20;
            font-size: 3em;
            letter-spacing: 6px;
        }
    }

    .overlay2 {
        position: relative;
        transition: opacity 0.5s ease;
    }

    .overlay2:after {
        content: "\A";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        opacity: 0;
    }
    .overlay2:hover:after {
        opacity: 1;
    }

    svg {
        display: block;
        transform: scaleX(-1);
    }

    #loader {
        fill: white;
    }

    #border {
        fill: white;
    }
}

.bg-game {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 30px;
    position: relative;
    max-height: 800px;

    .theme-title {
        position: absolute;
        transform: translate(-50%, -50%);
        top: 3px;
        left: 50%;
        min-width: 188px;

        h3 {
            // border: 3px solid $primary;
            border-radius: 20px;
        }
    }
        .question-question {
            font-size:1rem;
            // @media (min-width: $breakpoint-tablet) {
            //     font-size: 1.2rem;
            // }
        }

    .question-title {
        font-size:1.5rem;
        // @media (min-width: $breakpoint-tablet) {
        //     font-size: 2.7rem;
        //   }
    }
}
</style>