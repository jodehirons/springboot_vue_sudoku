<template>
  <!-- <router-link to ='/'>首页</router-link> -->

  <div id="app">
    <img alt="Vue logo" src="./assets/数独游戏.png" style="height: 150px;">
    <router-view></router-view>
  
  </div>

</template>

<script>

export default {
  name:'App'
  }
</script>

<style scoped>
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }
@keyframes rubberBand {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.25);
  }
  40% {
    transform: scale(0.75);
  }
  50% {
    transform: scale(1.15);
  }
  65% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

img {
  animation: rubberBand 2s infinite;
}
</style>
