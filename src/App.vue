<template>
  <Nav />
  <router-view></router-view>
  <Footer />
</template>

<script>
import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";
import Confetti from './assets/js/confetti.min.js'

export default {
  data() {
    return {
      host:false,
      idroom:"",
    }
  },
  components: {
    Nav,
    Footer,
  },
  methods: {
    createRoom() {

      
      let randomRoomId = Math.random().toString(36).slice(2);  
   
    }
  },
  mounted() {
    

  },
};
</script>
<style lang="scss">
  .pointer {
    cursor: pointer;
  }
</style>
