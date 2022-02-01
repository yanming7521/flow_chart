<!-- @format -->

<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/FlowView.vue";
import { consoleLog } from "@/utils/log";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
  mounted() {
    consoleLog();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
