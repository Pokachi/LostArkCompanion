<template>
  <div id="nav">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">
        <router-link to="/map"><img :src="logoURL" width="100px" alt="Innovator Island"></router-link>
      </b-navbar-brand>
      <!-- Right aligned nav items -->
      <!-- Photo Gallery icon -->
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data: function () {
    return {
      logoURL: this.$appConfig.images.logoURL,
      lang: 'EN',
      languageCount: 1
    }
  }
}
</script>

<style scoped>

</style>