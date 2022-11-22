<template>
    <div id="loader">
        <img src="../assets/loader.svg" alt="loading">
    </div>
  </template>
  
  <script>
  export default {
  mounted() {
      }
  }
  </script>
  
  <style scoped lang="scss">
  #loader {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    width:100vw;
    height: 100vh;
    z-index: 500;
    top: 0;
    left: 0;

    img {
        width:70px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
  }
  
  </style>