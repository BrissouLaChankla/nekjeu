<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img alt="Nekjeu logo" src="../assets/logo.webp" class="logo" />
      </a>
      <span
        @click="openInfo()"
        class="material-symbols-rounded fw-bold text-white h1 pointer"
      >
        info
      </span>
    </div>
  </nav>
</template>

<script>
import Swal from "sweetalert2";

export default {
  methods: {
    openInfo() {
      Swal.fire({
        title: "INFORMATIONS",
        // icon: 'info',
        html: `

            <div class="text-start">
            <span class="badge fw-normal bg-success my-2">Beta</span>
            <h3>Concept</h3>
            <p>Lance une partie, invite ton ami et voyez qui connait le mieux Nekfeu.</p>
            <p> Un extrait d'un morceau à lui ou d'un feat qu'il a pu faire sur un autre album va se lancer, il suffit de sélectionner l'album dont il est issu.</p>
            <div class="alert alert-warning d-flex align-items-center justify-content-center" role="alert">
            <span class="material-symbols-rounded">
warning
</span>
              <div class="mx-2">
                La vitesse compte et vous n'avez que 10s
              </div>
               <span class="material-symbols-rounded">
warning
</span>
            </div>
            <hr>
            <h3>Contact</h3>
            <p>J'espère que tu apprécies ce petit jeu, comme tu l'as vu le projet n'est aujourd'hui qu'en beta et je travaille actuellement sur de nouveaux modes.</p>
            <p>Cela dit si tu as remarqué des bugs, des erreurs ou que tu as des idées d'améliorations, je prends avec plaisir donc n'hésite pas à me le faire savoir sur    <a href="https://www.instagram.com/brice.vue/" target="_blank">
                   
                 mon Instagram</a> directement c'est le plus simple pour moi 😇 </p>
            </div>
        
            `,

        showCloseButton: true,
        showConfirmButton:false
      });
    },
  },
};
</script>

<style lang="scss">
.btn-insta {
  background-color: #fff;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #c71e7e;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  border: 1px solid #df3796;
  border-radius: 6px;

  i {
    color: #df3796;
    font-size: 20px;
    padding-right: 10px;
    transition: all 0.3s ease-in-out;
  }
  span {
    align-self: center;
    transform: translateX(0px);
    transition: all 0.1s ease-in-out;
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(to right, #ff3019 0%, #c90477 100%);
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
    border: 0;
    i {
      transform: translateX(22px);
      padding-right: 0;
      color: #fff;
    }
    span {
      transform: translateX(20px);
      opacity: 0;
    }
  }
  &:active {
    transform: scale(1);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
}

nav {
  .logo {
    width: 90px;
  }
}
</style>