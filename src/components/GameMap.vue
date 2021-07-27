<template>
  <div id="map">
    <l-map v-if="dataReady"
        ref="map"
        :zoom="minZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :max-bounds="maxBounds"
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

      <div v-if="mapData">
        <!-- List of markers collection markers-->
        <div v-for="(marker, mIndex) in mapData.markers" :key="marker.type">
          <div v-if="iconData[marker.type] && !marker.world">
            <l-marker v-for="(data, dIndex) in marker.data" :lat-lng="data" :key="data.id" :ref="data.id">
              <l-icon :icon-anchor="iconData[marker.type].anchor">
                <b-img v-if="iconData[marker.type].icon" fluid :src="iconData[marker.type].icon" :class="[playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].h ? 'hidden' : '' ]" />
                <p :style="'color:' + iconData[marker.type].color + '!important;'" :class="[playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].h ? 'hidden' : '', 'icon-display-name']">
                  {{ data.display }}
                </p>
              </l-icon>
              <l-popup v-if="marker.type!=='zone'" class="text-light">
                <game-map-popup :data="data" :marker-data="iconData[marker.type]" :is-found="playerData[mIndex] && playerData[mIndex][dIndex]" :type="mIndex" :id="dIndex" @updateMarker="updateMarker" :key="data.id"/>
              </l-popup>
              <l-popup v-else-if="marker.type==='zone'" class="text-light" :options="popupOptions">
                <game-map-zone-popup :data="data" :marker-data="iconData[marker.type]" :is-found="playerData[mIndex] && playerData[mIndex][dIndex]" :type="mIndex" :id="dIndex" @updateMarker="updateMarker" :key="data.id"/>
              </l-popup>
            </l-marker>
          </div>

          <!-- List of world map markers-->
          <div v-if="marker.world">
            <l-marker v-for="(data, dIndex) in marker.data" :lat-lng="data" :key="data.id" :ref="data.id">
              <l-icon v-if="data.icon" :icon-anchor="data.anchor">
                <b-img fluid :src="data.icon" :class="[playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].h ? 'hidden' : '' ]" />
                <p :style="'color:' + marker.color + '!important;'" :class="[playerData[mIndex] && playerData[mIndex][dIndex] ? 'found' : '', playerData[mIndex] && playerData[mIndex].h ? 'hidden' : '', 'icon-display-name']">
                  {{ data.display }}
                </p>
              </l-icon>
              <l-popup v-if="marker.type!=='zone'" class="text-light">
                <game-map-popup :data="data" :is-found="playerData[mIndex] && playerData[mIndex][dIndex]" :type="mIndex" :id="dIndex" @updateMarker="updateMarker" :key="data.id" />
              </l-popup>
              <l-popup v-else-if="marker.type==='zone'" :marker-data="marker" class="text-light" :options="popupOptions">
                <game-map-zone-popup :data="data" :marker-data="marker" :is-found="playerData[mIndex] && playerData[mIndex][dIndex]" :type="mIndex" :id="dIndex" @updateMarker="updateMarker" :key="data.id" />
              </l-popup>
            </l-marker>
          </div>
        </div>
      </div>

    </l-map>

    <!-- Side bar -->
    <div v-if="mapData" id="menu-control">
      <b-button squared v-b-toggle.sidebar-right class="float-right mt-5">Menu</b-button>
      <b-sidebar id="sidebar-right" :title="this.mapData.name" right shadow bg-variant="dark" text-variant="light">
        <div class="px-3 py-2 mb-5">
          <div v-for="(marker, index) in mapData.markers" :key="marker.type" :class="playerData[index] && playerData[index].h ? 'found' : ''">
            <b-button v-if="iconData[marker.type].toggleable" squared switch class="container-fluid text-left mt-1" v-on:click="toggleMarker(index)">
              <b-img width="18px" class="mr-2 mb-1" :src="iconData[marker.type].icon" /> {{ iconData[marker.type].name }} ({{playerData[index]? playerData[index].c : 0}}/{{marker.data.length}})
            </b-button>
            <b-button v-if="marker.world && marker.toggleable" squared switch class="container-fluid text-left mt-1" v-on:click="toggleMarker(index)">
              <b-img width="18px" class="mr-2 mb-1" :src="marker.icon" /> {{ marker.name }} ({{playerData[index]? playerData[index].c : 0}}/{{marker.data.length}})
            </b-button>
          </div>
        </div>
        <div v-if="this.location != 'world'">
          <b-button squared class="container-fluid text-center fixed-bottom" v-on:click="changeMap('world')">
            Go to World Map
          </b-button>
        </div>
      </b-sidebar>
    </div>
  </div>
</template>

<script>

import { CRS, Icon, latLngBounds } from 'leaflet'
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import GameMapPopup from "@/components/GameMapPopup";
import GameMapZonePopup from "@/components/GameMapZonePopup";
import iconData from "@/assets/data/icon.json";

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
    GameMapZonePopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup
  },
  data: function () {
    return {
      dataReady: false,
      lastOpenedPopup: null,
      location: this.$route.query.m,
      mapData: null,
      iconData: iconData,
      playerData: {},
      center: [-128, 128],
      attribution: "Created By Ophelia",
      mapUrl: null,
      minZoom: 1,
      maxZoom: 3,
      maxBounds: latLngBounds([[64, -64], [-320, 320]]),
      mapOptions: {
        bounds: latLngBounds([[0, 0], [-256, 256]])
      },
      popupOptions: {
        maxWidth: 400
      },
      crs: CRS.Simple,
    }
  },
  created() {
    this.importData()
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
        this.playerData[type].c = 0;
        this.playerData[type].h = false;
      }
      this.playerData[type].h = !this.playerData[type].h;

      this.$forceUpdate();
      this.saveData();
    },
    updateMarker(type, id, newState) {
      if (!this.playerData[type]) {
        this.playerData[type] = {};
        this.playerData[type].c = 0;
        this.playerData[type].h = false;
      }
      this.playerData[type][id] = newState;
      if (newState) {
        this.playerData[type].c++;
      } else {
        this.playerData[type].c--;
      }
      this.$forceUpdate();
      this.saveData();
    },
    async importData() {
      try {
        this.mapData = await import("@/assets/data/" + this.location + ".json");
      } catch (e) {
        this.location = "world";
        this.mapData = await import("@/assets/data/world.json");
      }
      this.mapUrl = './images/map/' + this.location + '/{z}/{x}/{y}.png';

      this.playerData = {};
      if (localStorage.getItem(this.location + 'map')) {
        try {
          this.playerData = JSON.parse(localStorage.getItem(this.location + 'map'));
        } catch (e) {
          localStorage.removeItem(this.location + 'map');
        }
      }

      if(this.location === "world") {
        this.minZoom = 2;
        this.maxZoom = 5;
        this.maxBounds = latLngBounds([[-32, 0], [-224, 256]]);
      } else {
        this.minZoom = 1;
        this.maxZoom = 3;
        this.maxBounds = latLngBounds([[128, -128], [-384, 384]]);
      }

      if (this.$route.query.c) {
        this.mapData.markers.forEach(marker => {
          marker.data.forEach(data => {
            if (data.id === this.$route.query.c) {
              this.center = [data.lat, data.lng];
            }
          });
        });
      }
      this.dataReady = true;
    }
  },
  watch: {
    $route () {
      this.dataReady = false;
      if(this.$route.query.m) {
        this.location = this.$route.query.m;
      }
      this.importData()
      this.$forceUpdate()
    }
  },
  updated() {
    this.$nextTick(()=> {
      try {
        if(this.$route.query.c && this.lastOpenedPopup !== this.$route.query.c) {
          this.$refs[this.$route.query.c][0].mapObject.openPopup();
          this.lastOpenedPopup = this.$route.query.c;
        }
      } catch (e) {
        // it's okay
      }
    })
  }
}
</script>

<style>
@import "../../node_modules/leaflet/dist/leaflet.css";

/* Hide close button */
.leaflet-popup-close-button {
  display: none !important;
}

/* Complete Switch */
.custom-control-label::before {
  left: 5rem !important;
}
.custom-control-label::after {
  left: calc(5rem + 2px) !important;
}

/* map */
#map {
  height: calc(100vh - 84px);
  width: 100%;
}

/* Side Bar */
#sidebar-right {
  height: calc(60vh - 84px);
  top: 120px;
}

#menu-control {
  position: absolute;
  top:120px;
  right:0vh;
  z-index: 999;
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
}

.leaflet-popup-content {
  min-width: 400px;
}

.found {
  opacity: 0.4;
}

.hidden {
  opacity: 0;
}

.subtitle-name-text {
  color: rgba(255, 255, 255, 0.3);
}

.found-toggle {
  position: absolute;
  right: 3.5rem;
  top: 2.8rem;
  font-size: 1rem !important;
}

.popup-sidebar {
  border-right: 1.5px solid;
}

.popup-content {
  flex-grow: 1
}

.zone-markers {
  flex: 40%;
}
</style>
