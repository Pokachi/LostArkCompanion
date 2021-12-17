<template>
  <div class="app-content" v-if="collectibleCollectionData && dataReady">
    <h1 class="text-center pt-3 text-white">
      Ignea Token (Adventure Tome) Tracker
    </h1>
    <div class="text-center">
      <b-img src="./images/collectibles/ignea.png" style="width: 32px"/>
      <h3 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ 0 }}/{{ selectedRegion ? 1 : Object.keys(collectibleData.regions).length }}</h3>
      <b-dropdown id="dropdown-1" :text="selectedRegion ? collectibleData.regions[selectedRegion].name : 'Select Region'" class="m-md-2">
        <b-dropdown-item @click="selectRegion(null)">All</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'rethramis', name: 'Rethramis'})">Rethramis</b-dropdown-item>
        <b-dropdown-item @click="selectRegion({ id:'yudia', name: 'Yudia'})">Yudia</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr class="generalhr">

    <div v-if="!selectedRegion">

    </div>

    <div v-else class="text-white d-flex flex-grow-0 flex-wrap justify-content-center">
      <div v-for="bookData of collectibleData.regions[selectedRegion].bookData" :key="bookData.name" class="d-inline-block ml-5 mr-5 mt-4 text-center p-2 darker-bg">
        <h4> {{bookData.name}}</h4>
        <div class="d-flex flex-wrap" style="width: 264px">
          <div v-for="item of bookData.items" :key="item.id" :class="['border']">
            <b-link @click="changeMap(item.location, item.id)">
              <b-img :style="[item.grade ? 'background-image: url(./images/items/background/icon_grade_' + item.grade + '.png)' : '', 'background-size: 100%']" :src="item.image"/>
            </b-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IgneaTracker",
  data: function () {
    return {
      selectedRegion: null,
      zoneData: null,
      zoneCollectibleData: null,
      collectibleData: null,
      collectibleCollectionData: null,
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
      this.collectibleData = await import("@/assets/data/collectibles/collectibleData.json");
      this.collectibleCollectionData = { };

      if (localStorage.getItem('food_collectibles')) {
        try {
          this.collectibleCollectionData['food'] = JSON.parse(localStorage.getItem('food_collectibles'));
        } catch (e) {
          localStorage.removeItem('food_collectibles');
        }
      }

      if (localStorage.getItem('vista_collectibles')) {
        try {
          this.collectibleCollectionData['vista'] = JSON.parse(localStorage.getItem('vista_collectibles'));
        } catch (e) {
          localStorage.removeItem('vista_collectibles');
        }
      }

      if (localStorage.getItem('affinity_collectibles')) {
        try {
          this.collectibleCollectionData['affinity'] = JSON.parse(localStorage.getItem('affinity_collectibles'));
        } catch (e) {
          localStorage.removeItem('affinity_collectibles');
        }
      }

      if (localStorage.getItem('story_collectibles')) {
        try {
          this.collectibleCollectionData['story'] = JSON.parse(localStorage.getItem('story_collectibles'));
        } catch (e) {
          localStorage.removeItem('story_collectibles');
        }
      }

      if (localStorage.getItem('quest_collectibles')) {
        try {
          this.collectibleCollectionData['quest'] = JSON.parse(localStorage.getItem('quest_collectibles'));
        } catch (e) {
          localStorage.removeItem('quest_collectibles');
        }
      }

      if(this.selectedRegion) {
        this.zoneCollectibleData = {};
        this.zoneData = {};
        for (const zone of this.collectibleData.regions[this.selectedRegion].zones) {
          const temp = JSON.parse(localStorage.getItem(zone.id + '_map'));
          if (temp) {
            this.zoneCollectibleData[zone.id] = temp;
          }
          const temp2 = await import("@/assets/data/map/" + zone.id + ".json");
          if (temp2) {
            this.zoneData[zone.id] = temp2;
          }
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
    if(this.$route.query.r) {
      this.dataReady = false;
      this.selectedRegion = this.$route.query.r;
    } else {
      this.selectedRegion = null;
    }
    await this.importData();
  }
}
</script>

<style scoped>

</style>