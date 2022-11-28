<template>
    <div class="text-white text-center">
    <div v-if="this.players">
        <div v-if="this.players[0].score == this.players[1].score">
            <h2>Egalité</h2>
        </div>
        <div v-else>
            <img :src="this.players[0].avatar" id="confetti" style="max-width:30%" alt="">
            <h6>Avec un score de {{this.players[0].score}}...</h6>
            <h2 class="my-5">{{this.players[0].username}} a gagné 👏</h2>
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


        this.players = this.players.sort((a, b) => {
            return b['score'] - a['score'];
        });

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

<style>

</style>