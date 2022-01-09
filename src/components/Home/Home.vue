<template>
  <div class="app-content">
    <h1 class="text-center pt-3 pb-2 text-white m-0">
      Lost Ark Companion
    </h1>
    <p class="text-center text-white"> Welcome to Lost Ark Companion. A collection of tools for Lost Ark.</p>

    <h3 class="text-center text-white mt-5"> This app is currently WIP. Below are a list of completed and planned features</h3>

    <div class="d-flex flex-grow-1 mt-5 text-white flex-wrap">
      <b-card title="Completed Features" class="ml-auto" bg-variant="dark">
        <hr class="generalhr mb-2">
        <b-card-text>
          • Map Framework
        </b-card-text>
        <b-card-text>
          • Collectible Framework
        </b-card-text>
        <b-card-text>
          • Daily/Weekly Task Tracker
        </b-card-text>
      </b-card>
      <b-card title="WIP Features" class="ml-3 mr-3" bg-variant="dark">
        <hr class="generalhr mb-2">
        <b-card-text>
          • Map Data
        </b-card-text>
        <b-card-text>
          • Collectible Data
        </b-card-text>
      </b-card>
      <b-card title="Planned Features" class="mr-auto" bg-variant="dark">
        <hr class="generalhr mb-2">
        <b-card-text>
          • Import/Export Data
        </b-card-text>
        <b-card-text>
          • Island/Event Timer
        </b-card-text>
        <b-card-text>
          • Ship/Sailor Calculator
        </b-card-text>
        <b-card-text>
          • Engraving Calculator (maybe)
        </b-card-text>
        <b-card-text>
          • Raid Tools (e.g. bingo solver)
        </b-card-text>
      </b-card>
    </div>

    <p class="text-center text-white"> Additional features may be available pending Lost Ark API availability</p>
  </div>
</template>

<script>
import '@/assets/css/main.css';

export default {
  name: "Home",
  data: function () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>

<style>
</style>