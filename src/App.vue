<template>
  <div id="app">
    <navBar/>
    <router-view/>
    <notifications group="copy" position="bottom left" :speed="500" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar'

export default {
  name: 'App',
  components: {
    NavBar,
  }
}
</script>

<style>
.app-content {
  height: calc(100vh - 56px);
  width: 100%;
  background: #2d2d2d !important;
  overflow: auto;
}

.opacity3 {
  opacity: 0.3;
}

.opacity5 {
  opacity: 0.5;
}
</style>
