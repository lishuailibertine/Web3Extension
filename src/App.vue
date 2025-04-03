<template>
  <div id="app">
    <wallet-home></wallet-home>
  </div>
</template>

<script>
import WalletHome from './components/WalletHome.vue';
export default {
  components: { WalletHome },
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 300px;
  height: 750px;
}
</style>