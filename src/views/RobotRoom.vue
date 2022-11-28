<template>
    <div>
        <div class="container">
            <h2 class="text-center text-light">Choisis le 🤖 que tu affronteras</h2>
            <h5 class="text-light d-flex justify-content-center align-items-center">en 
                <select v-model="selectNbOfMusics" class="form-select form-select-sm mx-2" aria-label=".form-select-sm">
                    <template v-for="index in this.maxMusicsToPlay" :key="index">   
                        <option v-if="index%5 == 0 || index == 1 || index == 3" :value="index">{{index}}</option>
                    </template> 
                </select>
                morceaux</h5>
            <div class="row position-relative mt-5">
                <img src="../assets/vs.webp" class="vs" alt="">
                <div class="col-6 position-relative">
                    <div class="avatar-section position-relative">
                        <img :src="avatar" alt="Avatar" class="img-fluid avatar player1-avatar d-block m-auto">
                        <h3 class="text-center text-light player1-name">{{ username }}</h3>
                    </div>
                </div>
                <div class="col-6 d-flex align-items-center justify-content-center flex-column">
                    <div class="bot-section">
                        <div class="position-relative">
                            <img :src="getImg(this.bots[indexBotSelected].img)" alt="Avatar"
                            class="img-fluid avatar bot-avatar rounded-circle d-block m-auto p-3">
                            <span class="emoji-big">{{this.bots[indexBotSelected].emoji}}</span>
                        </div>
                        <div class="text-light d-flex align-items-center justify-content-center flex-column">
                            <h3 class="text-center mt-2 mt-md-0">{{this.bots[indexBotSelected].name}}</h3>
                            <em class="ms-2">{{this.bots[indexBotSelected].phrase}}</em>
                        </div>
                    </div>
                    <div id="chose_bot" class="d-flex mt-2 justify-content-center flex-wrap">
                        <div class="mx-2 my-1 position-relative" v-for="bot in this.bots" :key="bot.id">
                            <img @click="selectBot(bot.id, $event)" :src="getImg(bot.img)" class="rounded" :class="{'selected': bot.id === 1}" :alt="bot.name">
                            <span class="emoji">{{bot.emoji}}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="mb-3 text-center">
            <router-link :to="{
          name: 'RobotGame', 
          params: { bot:JSON.stringify(this.bots[this.indexBotSelected]), selectNbOfMusics : this.selectNbOfMusics }
          }" class="
            btn btn-light btn-lg
            shadow-sm
            font-weight-bold
            mt-3
            px-3
            submit
            text-primary
          ">
          Let's gooo 
            </router-link>   
            

        </div>
    </div>

</template>

<script>
import { Howl, Howler } from 'howler';
export default {
    props: ["username", "avatar"],
    data() {
        return {
            indexBotSelected : 0,
            maxMusicsToPlay: 100,
            selectNbOfMusics:10,
            allSongs:[],
            bots: this.getBotsJson(),
        }
    },
    methods: {
        getBotsJson() {
            return require('@/assets/bots/bots.json');
        },
        selectBot(id, e) {
            const selectSound = new Howl({
                src: [require('../assets/sounds/select.wav')],
                html5: true
            }).play();
            this.indexBotSelected = this.bots.findIndex(item => item.id === id);
            let allBots = document.querySelectorAll("#chose_bot img");
            allBots.forEach(bot => {
                bot.classList.remove("selected");
            });
            e.target.classList.add("selected")
        },
        getImg(img) {
            return require('@/assets/bots/' + img)
        },

    
        async loadSongs() {

            let rep = await fetch(`https://crud.nekjeu.fr/api/get/10/songs`, { method: 'GET' });
            let response = await rep.json();
            this.allSongs = response;
        }


    },
    beforeMount() {

    },
    mounted() {
        this.loadSongs();
        // set sound
        const pop = new Howl({
            src: [require('../assets/sounds/pop.wav')],
            html5: true
        }).play();

     

        // Set local variables 
        if (this.username != undefined && this.avatar != undefined) {
            localStorage.setItem('username', this.username);
            localStorage.setItem('avatar', this.avatar);
        }




        // 
        let pseudo_1 = document.querySelector('.player1-name');
        let avatar_1 = document.querySelector('.player1-avatar');

        avatar_1.src = localStorage.getItem('avatar');
        pseudo_1.innerText = localStorage.getItem('username');





    }

}

</script>

<style scoped lang="scss">

.form-select-sm {
    display: inline-block;
    width: 70px;
}
.vs {
    max-width: 120px;
    width: 13vw;
    padding: 0;
    opacity: 60%;
    position: absolute;
    top: 40%;
    right: 50%;
    margin: 0;
    transform: translate(50%);
}
.player1-avatar {
}

.emoji {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.3rem;
    opacity: 75%;
    z-index: 5;
    transition: all .3s ease;
    pointer-events: none;
}

.emoji-big {
    position: absolute;
    bottom: 1vw;
    right: 1vw;
    font-size: 3rem;
    z-index: 5;
    transition: all 0.3s ease;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(-15px);
	}
	100% {
		transform: translatey(0px);
	}
}

#chose_bot {
    img {
        & ~.emoji {
            transform-origin: 0% 10%;
        }
        width: 50px;
        cursor: pointer;
        filter: brightness(40%);
        &:hover {
            & ~.emoji {
                scale:1.2
            }
        }

        &.selected {
        filter: brightness(1);
        
        & ~.emoji {
            opacity: 0;
            
        }

        }
    }

}
.selected {
    outline: 3px solid #3AC3CE;
    transform: scale(1.1);
transition: all .2s ease-out;
}
.avatar {
    max-height: 300px;
}



.img-pending {
    background: #bddce9;
    border: 3px dashed grey;
    border-radius: 50%;

    -webkit-animation: rotate 100s linear infinite;
    -moz-animation: rotate 100s linear infinite;
    animation: rotate 100s linear infinite;
}
</style>