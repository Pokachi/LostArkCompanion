<template>
  <div class="appContent" v-if="mokokoCollectionData && dataReady">
    <h1 class="text-center pt-3 text-white">
      Mokoko Beans Tracker
    </h1>
    <div class="text-center">
      <b-img src="./images/collectibles/mokoko.png" style="width: 32px"/>
      <h3 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ selectedRegion ? mokokoCollectionData[selectedRegion] ? mokokoCollectionData[selectedRegion].c : 0 : mokokoCollectionData.c }}/{{ selectedRegion ? mokokoData.regions[selectedRegion].mokoko_total : mokokoData.mokoko_total }}</h3>
      <b-dropdown id="dropdown-1" :text="selectedRegion ? mokokoData.regions[selectedRegion].name : 'Select Region'" class="m-md-2">
        <b-dropdown-item @click="selectRegion(null)">All</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'rethramis', name: 'Rethramis'})">Rethramis</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'yudia', name: 'Yudia'})">Yudia</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr class="generalhr">

    <div v-if="!selectedRegion" class="text-white d-flex flex-grow-0 flex-wrap justify-content-center">
        <div v-for="region of mokokoData.regions" :key="region.id" class="d-inline-block ml-5 mr-5 mt-4  flex-width-mokoko text-center">
          <b-link @click="selectRegion({id:region.id, name:region.name})">
            <h4 class="m-0 p-0 text-white"> {{ region.name }} </h4>
          </b-link>
          <hr class="tooltiphr">
          <b-img src="./images/collectibles/mokoko.png" style="width: 16px"/>
          <h6 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ mokokoCollectionData[region.id] ? mokokoCollectionData[region.id].c : 0 }}/{{ region.mokoko_total }}</h6>
        </div>
    </div>

    <div v-else class="text-white d-flex flex-grow-0 flex-wrap justify-content-center">
      <div v-for="zone of mokokoData.regions[selectedRegion].zones" :key="zone" class="d-inline-block ml-5 mr-5 mt-4  flex-width-mokoko text-center">
        <b-link @click="changeMap(zone)">
          <h4 class="m-0 p-0 text-white"> {{ zone }} </h4>
        </b-link>
        <hr class="tooltiphr">
        <b-img src="./images/collectibles/mokoko.png" style="width: 16px"/>
      </div>
    </div>
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
      dataReady: false
    }
  },
  methods: {
    selectRegion(region) {
      if (region) {
        this.$router.push({query: {r: region.id}})
      } else {
        this.$router.push({query: {}})
      }
    },
    async importData() {
      this.mokokoData = await import("@/assets/data/collectibles/collectibleData.json");
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
      this.dataReady=true;
      this.$forceUpdate()
    }
  },
  watch: {
    $route () {
      if(this.$route.query.r) {
        this.dataReady = false;
        this.selectedRegion = this.$route.query.r;
      } else {
        this.selectedRegion = null;
      }
      this.importData();
    }
  },
  async created() {
    await this.importData();
  }
}
</script>

<style scoped>

a:hover {
  text-decoration: none;
}

div {
  background: #2d2d2d !important;
}

.flex-width-mokoko {
  flex-basis: 10em;
}

.appContent {
  height: calc(100vh - 56px);
  width: 100%;
}
</style>