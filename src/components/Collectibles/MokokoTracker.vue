<template>
  <div class="appContent">
    <h1 class="text-center pt-3 text-white">
      Mokoko Beans Tracker
    </h1>
    <div class="text-center">
      <b-dropdown id="dropdown-1" :text="selectedRegion ? selectedRegion.name : 'Select Region'" class="m-md-2">
        <b-dropdown-item>All</b-dropdown-item>
        <b-dropdown-item>Rethramis</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr class="generalhr">

    <mokoko-tracker-all v-if="!selectedRegion" />
    <mokoko-tracker-region v-else :region="selectedRegion" />
  </div>
</template>

<script>

export default {
  name: "MokokoTracker",
  data: function () {
    return {
      selectedRegion: null
    }
  }
}
</script>

<style scoped>
div {
  background: #2d2d2d !important;
}
.appContent {
  height: calc(100vh - 56px);
  width: 100%;
}
</style>