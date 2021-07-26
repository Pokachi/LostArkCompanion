<template>
  <div>
    <h3 class="mb-0">{{ data.name }}</h3>
    <h5 class="subtitle-name-text">{{ markerData.name }}</h5>
    <div class="found-toggle subtitle-name-text ">
      <b-form-checkbox v-model="found" name="check-button" switch v-on:input="updateMarker(type, id, $event)">Complete: </b-form-checkbox>
    </div>
    <hr class="bg-light mb-2 mt-0"/>
    <div class="d-flex">
      <!-- add a side bar for quest chain if there's multiple parts -->
      <div v-if="data.markerLink" class="popup-sidebar pr-3 text-center">
        <h5> Quest Chain </h5>
        <div v-for="link in data.markerLink" :key="link.label">
          <b-link v-if="link.marker != data.id" v-on:click="changeMap(link.zone, link.marker)"> {{ link.label }} </b-link>
          <b-link v-else> {{ link.label }} </b-link>
        </div>
      </div>
      <!-- Check if there is image, and determine what to display -->
      <div class="popup-content pl-3 mt-2 text-center">
        <p class="mt-0 mb-2" v-html="data.content" />
        <b-button v-if="data.image" v-b-modal="type.toString()+id.toString()" variant="link" size="sm">
          <b-img width="128" :src="data.image"></b-img>
        </b-button>
        <b-modal v-if="data.image" :id="type.toString()+id.toString()" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
          <b-img fluid :src="data.image"></b-img>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameMapPopup",
  props: ['data', 'markerData', 'type', 'id', 'isFound'],
  data: function () {
    return {
      found: this.isFound
    }
  },
  methods: {
    updateMarker: function(type, id, newState) {
      this.$emit('updateMarker', type, id, newState)
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

</style>