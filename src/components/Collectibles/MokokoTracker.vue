<template>
  <div class="appContent" v-if="mokokoCollectionData">
    <h1 class="text-center pt-3 text-white">
      Mokoko Beans Tracker
    </h1>
    <div class="text-center">
      <b-img src="./images/collectibles/mokoko.png" style="width: 32px"/>
      <h3 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ selectedRegion ? mokokoCollectionData[selectedRegion.id] ? mokokoCollectionData[selectedRegion.id].c : 0 : mokokoCollectionData.c }}/{{ mokokoData.total }}</h3>
      <b-dropdown id="dropdown-1" :text="selectedRegion ? selectedRegion.name : 'Select Region'" class="m-md-2">
        <b-dropdown-item @click="selectRegion(null)">All</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'rethramis', name: 'Rethramis'})">Rethramis</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'yudia', name: 'Yudia'})">Yudia</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr class="generalhr">

    <div v-if="!selectedRegion">

    </div>
    <!--<mokoko-tracker-all v-if="!selectedRegion" />
    <mokoko-tracker-region v-else :region="selectedRegion" />-->
  </div>
</template>

<script>

export default {
  name: "MokokoTracker",
  data: function () {
    return {
      selectedRegion: null,
      mokokoData: null,
      mokokoCollectionData: null,
    }
  },
  methods: {
    selectRegion(region) {
      this.selectedRegion = region;
    }
  },
  async created() {
    this.mokokoData = await import("@/assets/data/collectibles/mokokos.json");
    this.mokokoCollectionData = {
      c: 0
    };
    if (localStorage.getItem('mokoko_collectibles')) {
      try {
        this.mokokoCollectionData = JSON.parse(localStorage.getItem('mokoko_collectibles'));
      } catch (e) {
        localStorage.removeItem('mokoko_collectibles');
      }
    }
    this.$forceUpdate()
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