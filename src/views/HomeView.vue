<template>
  <div class="home">
    <div class="container mb-5">
      <div
        class="
          d-flex
          flex-column
          h-100
          align-items-center
          justify-content-center
        "
      >
        <div class="avatar-section form-group">
          <img src="" alt="Avatar" width="250" height="250" class="avatar" />
          <div
            class="btn rounded-circle shadow-sm reload-icon text-primary"
            @click="generateAvatar()"
          >
            <span class="material-symbols-rounded"> restart_alt </span>
          </div>
        </div>
        <div class="form-group">
          <input v-model="this.username"
            class="form-control input-pseudo mt-4"
            placeholder="Mon pseudo"
            maxlength="14"
            name="name"
            type="text"
          />
        </div>
           <router-link v-if="isInvited" :to="{
          name: 'Room', 
          params: { id: this.idOfGameInvited, avatar: this.avatar, username: this.username }
          }" :class="{'disabled': !this.username}" class="
            btn btn-light btn-lg
            shadow-sm
            font-weight-bold
            mt-3
            px-3
            submit
            text-primary
          ">
        Rejoindre la partie

          </router-link>
        <div v-else class="text-center mt-3
           ">

       
         <router-link :to="{
          name: 'Room', 
          params: { id: this.idOfGame, avatar: this.avatar, username: this.username }
          }" :class="{'disabled': !this.username}" class="
            btn btn-light btn-lg
            shadow-sm
            font-weight-bold
            
            submit
            text-primary
          ">
        Créer la partie

          </router-link>
          <small class="d-block text-white my-2">ou</small>
          <router-link :to="{
          name: 'Robot', 
          params: { avatar: this.avatar, username: randomName() }
          }" class="
            submit
          ">
          <div class="btn btn-outline-light d-flex align-items-center text-primary">
<small>
  Joue contre l'ordinateur

</small>
            <span class="material-symbols-rounded ms-2">
              smart_toy
            </span>
          </div>

          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["idOfGameInvited", "isInvited"],
  data() {
    return {
      idOfGame: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
      username: "",
      avatar: ""
    };
  },
  methods: {
    randomName() {
      if(this.username == "") {
        return "Moi";
      }
      return this.username;
    },
   async generateAvatar() {
      let avatar = document.querySelector(".avatar");
      var reader = new FileReader();

      const response = await fetch(`https://avatars.dicebear.com/api/adventurer/${Math.floor(
          Math.random() * 30
        )}.svg`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();

          reader.readAsDataURL(blob)
          reader.onloadend = function ()  {
            var base64data = reader.result;
            avatar.src = base64data;
            this.avatar = base64data;
          }.bind(this);

      
    },
 
  },
  beforeMount() {
    localStorage.clear();
  },

  mounted() {
    this.generateAvatar();


    // Create connection with ws server
    this.socket.on('connection');

    if(this.isInvited) {
      // l'invité
      localStorage.setItem('player', 2);
    } else {
      localStorage.setItem('player', 1);
    }
    // Pas bonne manière de faire, variable globale :/ 
    localStorage.setItem('volume', 0.2);

  }
};
</script>

<style scoped lang="scss">

.avatar {
  width:250px;
}

.avatar-section {
  position: relative;

  .reload-icon {
    width: 50px;
    height: 50px;
   
    background: white;
    border: 2px solid #c1c1c1;

    position: absolute;
    bottom: 20px;
    right: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition-property: transform;
    transition-duration: 1s;

span {
   font-size: 2.2rem;
    font-weight:bolder;
}
    &:hover {
      span {
        animation-name: rotate;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }
  }
}

@-moz-keyframes rotate {
  100% {
    -moz-transform: rotate(-360deg);
  }
}
@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes rotate {
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}

.input-pseudo {
  height: 0;
  padding-top: 25px;
  padding-bottom: 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 6px;
  font-size: 1.1rem;
  letter-spacing: 2px;
  &::placeholder {
    color: white;
  }
  &.form-control {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
}
</style>
