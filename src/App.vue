<template>
  <div id="app">
    <navBar/>
    <router-view/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar,
  }
}
</script>

<style>

.opacity3 {
  opacity: 0.3;
}

.opacity5 {
  opacity: 0.5;
}
</style>
