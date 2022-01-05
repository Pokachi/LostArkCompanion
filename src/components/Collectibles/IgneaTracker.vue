<template>
  <div class="app-content" v-if="collectibleCollectionData && dataReady">
    <h1 class="text-center pt-3 text-white">
      Ignea Token (Adventure Tome) Tracker
    </h1>
    <div class="text-center">
      <b-img src="./images/collectibles/ignea.png" style="width: 32px"/>
      <h3 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ selectedRegion ? igneaData[selectedRegion] ? 1 : 0 : igneaData.c }}/{{ selectedRegion ? 1 : Object.keys(collectibleData.regions).length }}</h3>
      <b-dropdown id="dropdown-1" :text="selectedRegion ? collectibleData.regions[selectedRegion].name : 'Select Region'" class="m-md-2">
        <b-dropdown-item @click="selectRegion(null)">All</b-dropdown-item>
        <b-dropdown-item v-for="region of collectibleData.regions" :key="region.id" @click="selectRegion({ id:region.id, name: region.name})">{{region.name}}</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr class="generalhr">

    <div v-if="!selectedRegion" class="text-white d-flex flex-grow-0 flex-wrap justify-content-center">
      <div v-for="region of collectibleData.regions" :key="region.id" class="d-inline-block ml-5 mr-5 mt-4  flex-width-mokoko text-center">
        <b-link @click="selectRegion({id:region.id, name:region.name})">
          <h4 class="m-0 p-0 text-white"> {{ region.name }} </h4>
        </b-link>
        <hr class="tooltiphr">
        <b-img src="./images/collectibles/ignea.png" style="width: 16px"/>
        <h6 class="mt-0 mb-0 ml-1 mr-3 text-white d-inline-block align-middle">{{ igneaData[region.id] ? 1 : 0 }}/1</h6>
      </div>
    </div>

    <div v-else class="text-white d-flex flex-grow-0 flex-wrap justify-content-center">
      <div v-for="bookData of collectibleData.regions[selectedRegion].bookData" :key="bookData.name" class="d-inline-block ml-5 mr-5 mt-4 text-center p-2 darker-bg" style="height: fit-content">
        <h4> {{bookData.name}}</h4>
        <div class="d-flex flex-wrap justify-content-center" :style="'width: 330px'">
          <div v-for="item of bookData.items" :key="item.id" :class="['border', 'border-dark', 'position-relative']">
            <b-link @click="changeMap(item.location, item.startId ? item.startId : item.id, item.index)">
              <b-img :style="[item.grade ? 'background-image: url(./images/items/background/icon_grade_' + item.grade + '.png)' : '', 'background-size: 100%', 'width: 64px']" :src="item.image" :class="[isMarkerDone(bookData, item) ? 'found' : '']"/>
            </b-link>
            <b-img v-if="isMarkerDone(bookData, item)" class="item-sub-icon" :src="'./images/other/check_mark.png'" :style="'width: 28px'"/>
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
      igneaData: {},
      collectibleData: null,
      collectibleCollectionData: null,
      dataReady: false
    }
  },
  methods: {
    isMarkerDone(bookData, item) {
      if (!item.ids && bookData.id && this.collectibleCollectionData[bookData.id] && this.collectibleCollectionData[bookData.id][this.selectedRegion] && this.collectibleCollectionData[bookData.id][this.selectedRegion][item.id]) {
        return true;
      }

      if (item.ids) {
        for (const id of item.ids) {
          if (!this.collectibleCollectionData[bookData.id] || !this.collectibleCollectionData[bookData.id][this.selectedRegion] || !this.collectibleCollectionData[bookData.id][this.selectedRegion][id]) {
            return false;
          }
        }
        return true;
      }

      return false;
    },
    selectRegion(region) {
      if (region) {
        this.$router.push({query: {r: region.id}})
      } else {
        this.$router.push({query: {}})
      }
    },
    async importData() {
      this.collectibleData = JSON.parse(JSON.stringify(await import("@/assets/data/collectibles/collectibleData.json")));
      delete this.collectibleData.regions.sea;
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

      if (localStorage.getItem('monster_collectibles')) {
        try {
          this.collectibleCollectionData['monster'] = JSON.parse(localStorage.getItem('monster_collectibles'));
        } catch (e) {
          localStorage.removeItem('monster_collectibles');
        }
      }

      if (localStorage.getItem('boss_collectibles')) {
        try {
          this.collectibleCollectionData['boss'] = JSON.parse(localStorage.getItem('boss_collectibles'));
        } catch (e) {
          localStorage.removeItem('boss_collectibles');
        }
      }

      if (localStorage.getItem('zone_collectibles')) {
        try {
          this.collectibleCollectionData['zone'] = JSON.parse(localStorage.getItem('zone_collectibles'));
        } catch (e) {
          localStorage.removeItem('zone_collectibles');
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

      this.igneaData.c = 0;
      for(const region of Object.keys(this.collectibleData.regions)) {
        if (this.collectibleData.regions[region].bookData) {
          let regionComplete = true
          for (const bookData of this.collectibleData.regions[region].bookData) {
            if (!this.collectibleCollectionData[bookData.id] || !this.collectibleCollectionData[bookData.id][region] || (bookData.count && bookData.count !== this.collectibleCollectionData[bookData.id][region].c) || (!bookData.count && this.collectibleCollectionData[bookData.id][region].c !== bookData.items.length)) {
              regionComplete = false;
              break;
            }
          }
          this.igneaData[region] = regionComplete;
          if (regionComplete) {
            this.igneaData.c++;
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
    this.dataReady = false;
    if(this.$route.query.r) {
      this.selectedRegion = this.$route.query.r;
    } else {
      this.selectedRegion = null;
    }
    await this.importData();
  }
}
</script>

<style scoped>
a:hover {
  text-decoration: none;
}

.flex-width-mokoko {
  flex-basis: 10em;
}

.item-sub-icon {
  position: absolute;
  display: inline-block;
  bottom: 0;
  right: 0;
}
</style>