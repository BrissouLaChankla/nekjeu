<template>
    <div class="text-white text-center">
    <div v-if="this.players">
        <div v-if="this.players[0].score == this.players[1].score">
            <h1 style="font-size:7rem">🤷‍♀️</h1>
            <span>{{this.players[0].score}} - {{this.players[1].score}}</span>
            <h1 class="my-3">Egalité</h1>
            <h4 class="mt-4 mb-5">Bravo à vous deux 👏</h4>
        </div>
        <div v-else>
            <div v-if="this.players[0].score > this.players[1].score">
                <div class="position-relative d-inline">
                    <img :src="this.players[0].avatar" id="confetti" class="me-3" style="max-width:300px" alt="">
                    <div class="loser">
                        <div class="position-relative">
                            <img :src="this.players[1].avatar" id="confetti" class="rounded-circle"  alt="">
                            <h6>{{this.players[1].score}}</h6>
                        </div>
                    </div>
                </div>
                <h6 class="mt-4">Avec un score de {{this.players[0].score}}...</h6>
                <h2 class="mt-4 mb-5">{{this.players[0].username}} a gagné 👏</h2>

            </div>
            <div v-else>
                <div class="position-relative d-inline">
                    <img :src="this.players[1].avatar" id="confetti" class="me-3" style="max-width:300px" alt="">
                    <div class="loser">
                        <div class="position-relative">
                            <img :src="this.players[0].avatar" id="confetti" class="rounded-circle"  alt="">
                            <h6>{{this.players[0].score}}</h6>
                        </div>
                    </div>
                </div>
                <h6 class="mt-4">Avec un score de {{this.players[1].score}}...</h6>
                <h2 class="mt-4 mb-5">{{this.players[1].username}} a gagné 👏</h2>
            </div>



        </div>
        <a href="/" class="btn btn-light mx-2">Retour à l'accueil</a>
        <!-- <span @click="askRevenge()" class="btn btn-outline-light mx-2">Proposer une revanche</span> -->
    </div>
  </div>
</template>
<script>
import { nextTick } from 'vue'
import Confetti from '../assets/js/confetti.min.js'

export default {
    props:["allMembers"],   
    data(){
        return {
            players:null
        }
    },
    methods:{
        askRevenge() {
            this.socket.emit('askRevenge', (this.players[0].roomAttached));
        }
    },
    mounted() {
        this.players = JSON.parse(this.allMembers);


        // this.players = this.players.sort((a, b) => {
        //     return b['score'] - a['score'];
        // });

        this.socket.on("revengeAsked", () => {
            Swal.fire({
                title:'Une revanche ?',
                text:'Tu vas pas le laisser gagner quand même..?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Okkk !',
                denyButtonText: `Non merci..`,
            }).then((result) => {
            if (result.isConfirmed) {
                this.socket.emit('revengeAccepted', (this.players));
                } 
            })
        });

 
    },
    updated() {
        if (document.getElementById('confetti')) {
            // Pass in the id of an element
            let confetti = new Confetti('confetti');

            // Edit given parameters
            confetti.setCount(75);
            confetti.setSize(1);
            confetti.setPower(25);
            confetti.setFade(false);
            confetti.destroyTarget(true);

            setTimeout(() => confetti.execute(), 200);
        }
    }
}
</script>

<style lang="scss" scoped>
.loser {
    position: absolute;
    top: -180px;
    right: -5%;
    img {
        filter: grayscale(100%) brightness(80%);
        width: 100px;
        animation: rotate linear infinite 16s;
    }
    @keyframes rotate { 100% { transform:rotate(-360deg)}};

    h6 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
    }
}
</style>