<template>
  <div id="nav">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">
        <router-link to="/home" class="ml-4">Home</router-link>
      </b-navbar-brand>

      <b-navbar-nav>
        <b-nav-item to="/map">Map</b-nav-item>
        <b-nav-item-dropdown text="Collectibles" ref="dropdown">
          <b-dropdown-item href="/LostArkCompanion/#/collectibles/mokoko" >Mokoko Beans</b-dropdown-item>
          <b-dropdown-item href="/LostArkCompanion/#/collectibles/ignea">Ignea Tokens</b-dropdown-item>
          <b-dropdown-item href="#">Songs</b-dropdown-item>
          <b-dropdown-item href="#">Emotes</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item to="/tasks">Tasks</b-nav-item>
      </b-navbar-nav>
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
  },
  methods: {
    onOver() {
      this.$refs.dropdown.visible = true;
    },
    onLeave() {
      this.$refs.dropdown.visible = false;
    }
  }
}
</script>

<style scoped>

</style>