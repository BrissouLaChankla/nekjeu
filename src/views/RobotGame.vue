<template>
    <div class="container game d-flex flex-column justify-content-center flex-grow-1">
        <div class="volume d-flex align-items-center">
            <img class="icon" src="../assets/volume.svg" alt="Volume Icon">
            <input v-model="volumeNb" type="range" class="ms-3 form-range" step="0.02" min="0" max="0.5">
        </div>
        <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
                <div class="d-flex align-items-center text-white" style="width:130px">
                    <div class="flex-grow-1 text-center">
                        <img :src="player.avatar" alt="Avatar" class="img-fluid avatar">
                        <h6 class="text-center mt-1">{{ player.name }}</h6>
                    </div>
                    <h5 class="font-weight-bold ms-2">
                        {{ player.score }}<small>pt</small>
                    </h5>
                </div>
            </div>
            <div class="align-self-start">
                <Countdown v-if="showCountdown" />

            </div>
            <div>
                <div class="d-flex flex-row-reverse align-items-center text-white" style="width:130px">
                    <div class="flex-grow-1 text-center">
                        <img :src="getImg(botInfo.img)" alt="Avatar" class="rounded-circle img-fluid avatar p-2">
                        <h6 class="text-center mt-1">{{ botInfo.name }}</h6>
                    </div>
                    <h5 class="font-weight-bold me-2">
                        {{ botInfo.score }}<small>pt</small>
                    </h5>
                </div>
            </div>
        </div>

        <div class="col text-white bg-game text-center pt-4 px-3 d-flex flex-column justify-content-around">
            <div class="theme-title text-center">
                <span class="indexOfSong">{{ this.indexOfSong }}/{{ this.songs.length }}</span>
                <h3 class="text-primary bg-light shadow-sm px-3">Les classiques</h3>
            </div>

            <div>
                <h5 class="lyrics text-uppercase"></h5>
            </div>

            <h5 class="question-question mb-3 mt-2">
                <span class="bg-light text-dark px-3 py-1 rounded shadow-sm">
                    De quel album provient ces lyrics ?
                </span>
            </h5>

            <div class="row justify-content-center align-self-center">
                <div v-for="album in     this.albums" :key="album" class="col-6 mb-3 text-center">
                    <div class="d-flex align-items-center justify-content-center tilt-album rounded shadow-sm overlay2"
                        :data-album_id=album.id :style="{ 'background-image': 'url(' + album.src + ')' }"
                        @click="selectAlbum" data-tilt data-tilt-scale="1.1">
                        <h2 style="pointer-events: none" class="titre-album">{{ album.title }}</h2>
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
import { Howl, Howler } from 'howler';

export default {
    props: ["bot", "selectNbOfMusics"],
    components: {
        Countdown,
    },

    data() {
        return {
            player: {
                name: localStorage.getItem('username'),
                avatar: localStorage.getItem('avatar'),
                score: 0,
            },
            botInfo: null,
            audio: null,
            songs: this.getSongsJson(this.selectNbOfMusics),
            volumeNb: 0.2,
            showCountdown: false,
            timeSelected: 0,
            albumIdChosed: null,
            indexOfSong: 0,
            albums: [
                {
                    id: 1,
                    title: "Feu",
                    src: require('../assets/albums/feu.webp')
                },
                {
                    id: 2,
                    title: "Cyborg",
                    src: require('../assets/albums/cyborg.webp')
                },
                {
                    id: 3,
                    title: "L.E.V",
                    src: require('../assets/albums/lev.webp')
                },
                {
                    id: 4,
                    title: "Autre",
                    src: require('../assets/albums/feat.webp')
                },
            ]
        }
    },
    watch: {
        volumeNb: function (val) {
            Howler.volume(val);
        },
    },
    methods: {
        getSongsJson(nbOfMusics) {
            let songs = require('@/assets/extracts/extracts.json');
            songs.sort(function () {
                return Math.round(Math.random()) - 0.5
            })
            var last10 = songs.filter(function (el, index) {
                return index >= songs.length - nbOfMusics;
            });
            return last10;
        },
        getSong(album, src) {
            return require('@/assets/extracts/' + album + '/' + src)
        },
        getImg(img) {
            return require('@/assets/bots/' + img)
        },
        selectAlbum(event) {
            let albumSelected = event.target;
            let allAlbums = document.querySelectorAll('.tilt-album');
            allAlbums.forEach(album => {
                album.classList.remove('selected-album')
            });
            albumSelected.classList.add('selected-album');
            this.timeSelected = Date.now();
        },
        getRandomArbitrary(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        },
        botAnswer() {
            let rand = Math.random() * 100;
            if (rand < this.botInfo.ratioAnswers) {
                this.botInfo.score = this.botInfo.score + this.getRandomArbitrary(this.botInfo.minMaxScore[0], this.botInfo.minMaxScore[1]);
            }
        },
        launchMusic(song) {

            let allAlbums = document.querySelectorAll('.tilt-album');
            allAlbums.forEach(album => {
                album.classList.remove('selected-album')
            });


            let lyrics = document.querySelector('.lyrics');

            // Ecrit les paroles
            lyrics.innerText = song.lyrics

            // Affiche le timer 
            this.showCountdown = true;

            // Va chercher la musique
            var audio = new Howl({
                src: [this.getSong(song.album.name, song.audio_src)],
                html5: true
            });

            // Ajuste le volume
            Howler.volume(this.volumeNb);

            // Joue la musique
            audio.play();

            setTimeout(() => {
                audio.pause();
                Swal.fire({
                    imageUrl: this.albums.find(item => item.id == song.album_id).src,
                    imageHeight: 200,
                    imageAlt: 'Album de Nekfeu',
                    title: 'C\'était <em>' + song.title + '</em> de l\'album <strong>' + song.album.name + '</strong>',
                    text: 'Attention ! La prochaine musique va démarrer...',
                    showCloseButton: false,
                    showConfirmButton: false,
                    timer: 3000,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    timerProgressBar: true,
                })
                this.showCountdown = false
            }, 10000)

        }
    },

    beforeMount() {
        this.botInfo = JSON.parse(this.bot);

    },
    updated() {

    },
    mounted() {
        let allAlbums = document.querySelectorAll('.tilt-album');


        // Pour chaques musiques 
        for (let i = 0; i <= this.songs.length; i++) {
            setTimeout(() => {
                let albumChosed = document.querySelector('.selected-album');

                // Check answers si le mec a répondu 
                if (albumChosed !== null) {
                    this.albumIdChosed = albumChosed.dataset.album_id
                }

                // Si son choix est bon 
                if (this.albumIdChosed == this.songs[this.indexOfSong].album_id) {
                    let bonusSpeed = Math.floor((Date.now() - this.timeSelected) / 100);
                    this.player.score = this.player.score + 100 + bonusSpeed;
                }

                if (i > 0) {
                    this.botAnswer();
                }

                if (i == this.songs.length) {
                    // End game
                    this.$router.push({ name: 'RobotEnd', params: { "player": JSON.stringify(this.player), "bot": JSON.stringify(this.botInfo) } });
                } else {

                    //play music and stop it avec 10s 
                    this.launchMusic(this.songs[i]);

                    this.albumIdChosed = null;
                    this.indexOfSong = i;
                }


            }, 13000 * i)

        }


        VanillaTilt.init(document.querySelectorAll(".tilt-album"));
    }
}
</script>

<style scoped lang="scss">
.indexOfSong {
    position: absolute;
    transform: translateX(-50%);
    top: -30px;
}

.selected-album {
    border: 5px solid #3AC3CE;
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
            font-size: 2em;
            letter-spacing: 2px;
        }

        @media only screen and (min-width: 600px) {
            .titre-album {
                font-size: 3em;
                letter-spacing: 6px;
            }


        }

    }

    @media only screen and (min-width: 600px) {
        .lyrics {
            font-size: calc(1.5rem + 0.3vw);
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

.volume {
    position: absolute;
    top: 3rem;
    left: 50%;
    transform: translate(-50%, -50%);

    .icon {
        height: 25px;
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
        font-size: 1rem;
        // @media (min-width: $breakpoint-tablet) {
        //     font-size: 1.2rem;
        // }
    }

    .question-title {
        font-size: 1.5rem;
        // @media (min-width: $breakpoint-tablet) {
        //     font-size: 2.7rem;
        //   }
    }
}
</style>