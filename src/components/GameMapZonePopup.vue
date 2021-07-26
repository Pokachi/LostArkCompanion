<template>
  <div>
    <h5 class="text-center mb-0 continent-name-text">{{ data.continent }}</h5>
    <h3 class="text-center mt-0 zone-name-text">{{ data.name }}</h3>
    <hr class="bg-light mb-2 mt-0"/>
    <b-container fluid class="mb-2">
      <b-row>
        <b-col>
          <div v-for="(marker, index) in data.markers" :key="marker.type" :set="playerData = getPlayerData(data.mapId)">
            <b-img width="18px" class="mb-1" :src="iconData[marker.type].icon" /> {{ iconData[marker.type].name }} ({{ playerData && playerData[index]? playerData[index].c : 0}}/{{marker.count}})
          </div>
        </b-col>
        <b-col>
          <p class="mt-0" v-html="data.content" />
          <div class="text-center">
            <b-button size="sm" v-on:click="updateQuery(data.mapId)"> Enter </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div>
      <b-form-checkbox v-model="found" name="check-button" switch size="lg" v-on:input="updateMarker(type, id, $event)">Hide: </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import iconData from "@/assets/data/icon.json";

export default {
  name: "GameMapZonePopup",
  props: ['data', 'type', 'id', 'isFound'],
  data: function () {
    return {
      found: this.isFound,
      iconData: iconData,
    }
  },
  methods: {
    updateMarker: function(type, id, newState) {
      this.$emit('updateMarker', type, id, newState);
    },
    getPlayerData: function(mapId) {
      if (localStorage.getItem(mapId + 'map')) {
        try {
          this.playerData = JSON.parse(localStorage.getItem(mapId + 'map'));
        } catch (e) {
          localStorage.removeItem(mapId + 'map');
        }
      }
    },
    updateQuery: function (mapId) {
      let closeButton = document.getElementsByClassName("leaflet-popup-close-button")[0];
      if (closeButton) {
        closeButton.click()
      }
      this.$router.push({ query: { m: mapId}});
    }
  }
}
</script>

<style>

.media {
  display: flex
}
.mb-4dot5 {
  margin-bottom: 2rem !important;;
}

footer {
  position: absolute;
  bottom:10px;
}

h5 {
  font-size: 1rem !important;
}

.modal-content {
  border: 0 !important;
}

.continent-name-text {
  color: rgba(255, 255, 255, 0.3);
}

</style>