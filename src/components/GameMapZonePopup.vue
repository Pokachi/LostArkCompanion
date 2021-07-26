<template>
  <div>
    <h3 class="mb-0">{{ data.name }}</h3>
    <h5 class="subtitle-name-text">{{ markerData.name }}</h5>
    <div class="found-toggle subtitle-name-text ">
      <b-form-checkbox v-model="found" name="check-button" switch v-on:input="updateMarker(type, id, $event)">Complete: </b-form-checkbox>
    </div>
    <hr class="bg-light mb-2 mt-0"/>
    <div class="popup-content pl-3 mt-2 text-center">
      <p class="mt-0 mb-2" v-html="data.content" />
    </div>
    <div class="d-flex flex-wrap mt-3 mb-2" :set="playerData = getPlayerData(data.mapId)">
      <div v-for="(marker, index) in data.markers" :key="marker.type" class="zone-markers ml-3">
        <b-img width="18px" class="mb-1" :src="iconData[marker.type].icon" /> {{ iconData[marker.type].name }} ({{ playerData && playerData[index]? playerData[index].c : 0}}/{{marker.count}})
      </div>
    </div>
    <div class="text-center mb-2">
      <b-button size="sm" v-on:click="changeMap(data.mapId)"> Enter </b-button>
    </div>
  </div>
</template>

<script>
import iconData from "@/assets/data/icon.json";

export default {
  name: "GameMapZonePopup",
  props: ['data', 'markerData', 'type', 'id', 'isFound'],
  data: function () {
    return {
      found: this.isFound,
      iconData: iconData
    }
  },
  methods: {
    updateMarker: function(type, id, newState) {
      this.$emit('updateMarker', type, id, newState);
    },
    getPlayerData: function(mapId) {
      if (localStorage.getItem(mapId + 'map')) {
        try {
          return JSON.parse(localStorage.getItem(mapId + 'map'));
        } catch (e) {
          localStorage.removeItem(mapId + 'map');
          return {};
        }
      }
    }
  }
}
</script>

<style>
.float-bottom {
  position: absolute !important;
  width: calc(100% - 30px);
  bottom: 0;
}

.media {
  display: flex
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

</style>