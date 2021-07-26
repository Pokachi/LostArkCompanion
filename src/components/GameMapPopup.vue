<template>
  <div>
    <b-media>
      <template v-if="image" #aside>
        <b-button v-b-modal="type.toString()+id.toString()" variant="link" size="sm">
          <b-img width="128" :src="image"></b-img>
        </b-button>
        <b-modal :id="type.toString()+id.toString()" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
          <b-img fluid :src="image"></b-img>
        </b-modal>
      </template>
      <h5 class="text-center">{{ name }}</h5>
      <hr class="bg-light mb-2 mt-0"/>
      <p class="mt-0 mb-3" v-html="content">
      </p>
      <div>
        <b-form-checkbox v-model="found" name="check-button" switch size="lg" v-on:input="updateMarker(type, id, $event)">Found: </b-form-checkbox>
      </div>
    </b-media>
  </div>
</template>

<script>
export default {
  name: "GameMapPopup",
  props: ['name', 'image', 'content', 'type', 'id', 'isFound'],
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