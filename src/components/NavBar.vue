<template>
  <div id="nav">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">
        <router-link to="/map" class="ml-4">Map</router-link>
        <!--<router-link to="/dailyTracker" class="ml-4">Daily Tracker</router-link>-->
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
      lang: 'EN',
      languageCount: 1
    }
  }
}
</script>

<style scoped>

</style>