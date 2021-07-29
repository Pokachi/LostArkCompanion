<template>
  <div>
    <h3 class="mb-0">{{ data.name }}</h3>
    <h5 class="subtitle-name-text">{{ markerData.name }}</h5>
    <div class="found-toggle subtitle-name-text ">
      <b-form-checkbox v-model="found" name="check-button" switch v-on:input="updateMarker(markerData.type, data.id, $event, data.locations)">Complete: </b-form-checkbox>
    </div>
    <hr class="bg-light mb-2 mt-0"/>
    <div class="d-flex">
      <!-- add a side bar for quest chain if there's multiple parts -->
      <div v-if="data.markerLink" class="popup-sidebar pr-3 text-center">
        <h5> Quest Chain </h5>
        <div v-for="link in data.markerLink" :key="link.label">
          <b-link v-on:click="changeMap(link.zone, link.marker)"> {{ link.label }} </b-link>
        </div>
      </div>
      <!-- Check if there is image, and determine what to display -->
      <div class="popup-content pl-3 pr-3 mt-2 text-center">
        <p v-if="data.content" class="mt-0 mb-2" v-html="data.content" />
        <p v-if="locationData && locationData.content" class="mt-0 mb-2" v-html="locationData.content" />
        <b-button v-if="data.image" v-b-modal="markerData.type.toString()+data.id.toString()" variant="link" size="sm">
          <b-img width="128" :src="data.image"></b-img>
        </b-button>
        <b-modal v-if="data.image" :id="markerData.type.toString()+data.id.toString()" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
          <b-img fluid :src="data.image"></b-img>
        </b-modal>
        <b-button v-if="locationData && locationData.image" v-b-modal="markerData.type.toString()+data.id.toString()+locationData.index.toString()" variant="link" size="sm">
          <b-img width="128" :src="locationData.image"></b-img>
        </b-button>
        <b-modal v-if="locationData && locationData.image" :id="markerData.type.toString()+data.id.toString()+locationData.index.toString()" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
          <b-img fluid :src="locationData.image"></b-img>
        </b-modal>
      </div>
      <!-- add a side bar for other location if this can be done somewhere else -->
      <div v-if="data.locations" class="popup-sidebar-right pl-3 text-center">
        <h5> Other Location </h5>
        <div v-for="(location, lIndex) in data.locations" :key="lIndex">
          <b-link v-on:click="changeMap(location.zone, data.id, location.index)"> {{ 'Location ' + (lIndex + 1) }} </b-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameMapPopup",
  props: ['data', 'markerData', 'locationData', 'isFound'],
  data: function () {
    return {
      found: this.isFound
    }
  },
  methods: {
    updateMarker: function(type, id, newState, locations) {
      this.$emit('updateMarker', type, id, newState, locations);
    }
  }
}
</script>

<style>

</style>