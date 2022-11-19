<template>
  <div id="countdown">
  <div id="countdown-number"></div>
  <svg>
    <circle r="18" cx="20" cy="20"></circle>
  </svg>
</div>
</template>

<script>
export default {
mounted() {
    var countdownNumberEl = document.getElementById('countdown-number');
    var countdown = 10;

    countdownNumberEl.textContent = countdown;

    setInterval(function() {
    countdown = --countdown <= 0 ? 10 : countdown;

    countdownNumberEl.textContent = countdown;
    }, 1000);
    }
}
</script>

<style scoped lang="scss">

#countdown {
  position: relative;
  margin: auto;
  margin-top: 14px;
  height: 40px;
  width: 40px;
  text-align: center;
}

#countdown-number {
  color: white;
  display: inline-block;
  line-height: 40px;
}

svg {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  transform: rotateY(-180deg) rotateZ(-90deg);
}

svg circle {
  stroke-dasharray: 113px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 2px;
  stroke: white;
  fill: none;
  animation: countdown 10s linear infinite forwards;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 113px;
  }
}
</style>