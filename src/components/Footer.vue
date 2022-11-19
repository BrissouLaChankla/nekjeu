<template>
<footer class="text-muted text-center py-2">
    <span v-if="$route.path == '/'" >
        Ce jeu vous est offert par <a target="_blank" href="https://brice-eliasse.com">Brice Eliasse</a>
    </span>
</footer>
</template>


<script>

</script>

<style scoped lang="scss">
    span {
        font-size: .8rem;
    }
</style>