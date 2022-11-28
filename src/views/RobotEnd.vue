<template>
    <div class="text-white text-center">
    <div v-if="this.playerInfo">
        <div v-if="this.playerInfo.score == this.botInfo.score">
            <h2>Egalité</h2>
        </div>
        <div v-else>
            <div v-if="this.playerInfo.score > this.botInfo.score">
                <div class="position-relative d-inline">
                    <img :src="this.playerInfo.avatar" id="confetti" class="me-3" style="max-width:300px" alt="">
                    <div class="loser">
                        <div class="position-relative">
                            <img :src="getImg(botInfo.img)" id="confetti" class="rounded-circle"  alt="">
                            <h6>{{this.botInfo.score}}</h6>
                        </div>
                    </div>
                </div>
                <h6 class="mt-4">Avec un score de {{this.playerInfo.score}}...</h6>
                <h2 class="mt-4 mb-5">Tu as gagné 👏</h2>

            </div>
            <!-- Bot gagne -->
            <div v-else>
                <div class="position-relative d-inline">
                    <img :src="this.botInfo.avatar" id="confetti" class="me-3" style="max-width:300px" alt="">
                    <div class="loser">
                        <div class="position-relative">
                            <img :src="this.playerInfo.avatar" id="confetti" class="rounded-circle"  alt="">
                            <h6>{{this.playerInfo.score}}</h6>
                        </div>
                    </div>
                    <img :src="getImg(botInfo.img)" id="confetti" class="rounded-circle" style="max-width:240px" alt="">
                </div>
                <h6 class="mt-4">Avec un score de {{this.botInfo.score}}...</h6>
                <h2 class="mt-4 mb-5">{{this.botInfo.name}} a gagné 👏</h2>
            </div>
           
        </div>
        <a href="/" class="btn btn-light">Retour à l'accueil</a>
    </div>
  </div>
</template>
<script>
import { nextTick } from 'vue'
import Confetti from '../assets/js/confetti.min.js'

export default {
    props:["player", "bot"],   
    data(){
        return {
            playerInfo:null,
            botInfo:null,
            winner:null,
            loser:null
        }
    },
    methods: {
        getImg(img) {
            return require('@/assets/bots/' + img)
        },
    },
    beforeMount() {
        this.playerInfo = JSON.parse(this.player);
        this.botInfo = JSON.parse(this.bot);
    },
    mounted() {

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

<style scoped lang="scss">
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
        font-size: 2rem;
    }
}
</style>