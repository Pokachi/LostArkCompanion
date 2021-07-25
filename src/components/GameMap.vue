<template>
  <div id="map">
    <l-map
        :zoom="minZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :crs="crs"
        :center="center"
        @click="printLocation"
    >
      <!-- This is the map -->
      <l-tile-layer
          v-if="mapUrl"
          :url="mapUrl"
          :no-wrap="true"
          :attribution="attribution"
          :options="mapOptions"
      />

      <!-- List of markers -->
      <div v-if="mapData">
        <div v-for="(marker, mIndex) in mapData.markers" :key="marker.type">
          <l-marker v-for="(data, dIndex) in marker.data" :lat-lng="data" :key="data.id">
            <l-icon :icon-anchor="marker.anchor">
              <b-img v-if="marker.icon" fluid :src="marker.icon" :class="[playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].hidden ? 'hidden' : '' ]" />
              <p :class="[marker.popup === 'zone' ? 'link-label' : 'text-light', playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].hidden ? 'hidden' : '', 'icon-display-name']">
                {{ data.display }}
              </p>
            </l-icon>
            <l-popup v-if="marker.popup==='normal'" class="text-light">
              <game-map-popup :image="data.image" :content="data.content" :is-found="playerData[mIndex] && playerData[mIndex][dIndex]" :name="data.name" :type="mIndex" :id="dIndex" @updateMarker="updateMarker"/>
            </l-popup>
          </l-marker>
        </div>
      </div>

    </l-map>

    <!-- Side bar -->
    <div v-if="mapData" id="menu-control">
      <b-button squared v-b-toggle.sidebar-right class="float-right mt-5">Menu</b-button>
      <b-sidebar id="sidebar-right" :title="this.mapData.name" right shadow bg-variant="dark" text-variant="light">
        <div class="px-3 py-2">
          <div v-for="(marker, index) in mapData.markers" :key="marker.type" :class="playerData[index] && playerData[index].hidden ? 'found' : ''">
            <b-button v-if="marker.toggleable" squared switch class="container-fluid text-left mt-1" v-on:click="toggleMarker(index)">
              <b-img width="18px" class="mr-2 mb-1" :src="marker.icon" /> {{ marker.name }} ({{playerData[index]? playerData[index].count : 0}}/{{marker.data.length}})
            </b-button>
          </div>
        </div>
      </b-sidebar>
    </div>
  </div>
</template>

<script>

import { CRS, Icon, latLngBounds } from 'leaflet'
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import GameMapPopup from "@/components/GameMapPopup";

// Leaflet/Webpack bug workaround - https://github.com/Leaflet/Leaflet/issues/4968
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: "GameMap",
  components: {
    GameMapPopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup
  },
  data: function () {
    return {
      location: this.$route.query.m,
      mapData: null,
      playerData: {},
      center: [0, 0],
      attribution: "Created By Ophelia",
      mapUrl: null,
      minZoom: 1,
      maxZoom: 3,
      mapOptions: {
        bounds: latLngBounds([[-256, 0], [0, 256]])
      },
      tooltipOptions: {
        permanent: true,
      },
      crs: CRS.Simple,
    }
  },
  created() {
    this.importMapData()
  },
  methods: {
    saveData() {
      localStorage.setItem(this.location + 'map', JSON.stringify(this.playerData));
    },
    printLocation(event) {
      var coord = event.latlng;
      var lat = coord.lat;
      var lng = coord.lng;
      console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
    },
    toggleMarker(type) {
      if (!this.playerData[type]) {
        this.playerData[type] = {};
        this.playerData[type].count = 0;
        this.playerData[type].hidden = false;
      }
      this.playerData[type].hidden = !this.playerData[type].hidden;

      this.$forceUpdate();
      this.saveData();
    },
    updateMarker(type, id, newState) {
      if (!this.playerData[type]) {
        this.playerData[type] = {};
        this.playerData[type].count = 0;
        this.playerData[type].hidden = false;
      }
      this.playerData[type][id] = newState;
      if (newState) {
        this.playerData[type].count++;
      } else {
        this.playerData[type].count--;
      }
      this.$forceUpdate();
      this.saveData();
    },
    async importMapData() {
      try {
        this.mapData = await import("@/assets/data/" + this.location + ".json");
      } catch (e) {
        this.location = "prideholme";
        this.mapData = await import("@/assets/data/prideholme.json");
      }
      this.mapUrl = './map/' + this.location + '/{z}/{x}/{y}.png';

      if (this.$route.query.c) {
        this.mapData.markers.forEach(marker => {
          marker.data.forEach(data => {
            if (data.id === this.$route.query.c) {
              this.center = [data.lat, data.lng];
            }
          });
        });
      }
    }
  },
  mounted() {
    if (localStorage.getItem(this.location + 'map')) {
      try {
        this.playerData = JSON.parse(localStorage.getItem(this.location + 'map'));
      } catch (e) {
        localStorage.removeItem(this.location + 'map');
      }
    }
  },
  watch: {
    $route () {
      this.importMapData()
      this.$forceUpdate()
    }
  }
}
</script>

<style>
@import "../../node_modules/leaflet/dist/leaflet.css";

#map {
  height: calc(100vh - 84px);
  width: 100%;
}

#sidebar-right {
  height: 50vh;
  top: 120px;
}

#menu-control-header {
  text-align: right;
}

#menu-control {
  position: absolute;
  top:6vh;
  right:0vh;
}

.not-collapsed {
  right:320px;
}

.leaflet-container {
  background: #2d2d2d !important;
}

.icon-display-name {
  width: max-content;
  font-size: 14px;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

.leaflet-popup-tip {
  background: #3f3f3f !important;
}

.leaflet-popup-content-wrapper {
  background: #3f3f3f !important;
  white-space: pre-line;
  min-width: 175px;
}

.b-sidebar-header {
  text-align: center;
}

.link-label {
  color: deepskyblue !important;
}

.found {
  opacity: 0.2;
}

.hidden {
  opacity: 0;
}
</style>