<template>
  <div v-if="affinityData">
    <div class="d-flex">
      <b-carousel v-model="slide"
                  :interval="5000"
                  no-animation
                  class="affinity-portrait">
        <b-carousel-slide
            :img-src="'./images/affinity/' + affinityId + '_1.png'"
        ></b-carousel-slide>
        <b-carousel-slide
            :img-src="'./images/affinity/' + affinityId + '_2.png'"
        ></b-carousel-slide>
        <b-carousel-slide
            :img-src="'./images/affinity/' + affinityId + '_3.png'"
        ></b-carousel-slide>
      </b-carousel>

      <div class="affinity-header">
        <div class="d-flex mb-1">
          <h4 class="affinity-header-name text-left pl-4 mb-0"> {{ affinityData.name }} </h4>
          <h6 class="text-left pl-2 m-0 align-self-center"> ({{ affinityData.birthDate }}) </h6>
        </div>
        <h6 class="text-left pl-4 m-0"> {{affinityData.location}}{{ affinityData.subLocation ? " - " + affinityData.subLocation : ""}} </h6>
        <h6 class="text-left pl-4 m-0 opacity5"> {{affinityData.continent}} </h6>
        <p class="text-left pl-4 mt-2"> {{ affinityData.description }} </p>
      </div>
    </div>
    <b-tabs content-class="mt-3" active-nav-item-class="bg-dark text-light" fill>
      <b-tab title="Reward" active><p>WIP</p></b-tab>
      <b-tab title="Likes"><p>WIP</p></b-tab>
      <b-tab title="Level"><p>WIP</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: "AffinityDetail",
  props: ['affinityId'],
  data: function () {
    return {
      affinityData: null,
      itemData: null,
      slide: 1
    }
  },
  async created() {
    this.slide = 1;
    try {
      this.affinityData = await import("@/assets/data/affinities/" + this.affinityId + ".json");
      this.itemData = {};
      //for (const item of this.merchantData.items) {
      //  let itemData = await import("@/assets/data/items/" + item.id + ".json");
      //  this.itemData[item.id] = itemData;
      //}

      this.$forceUpdate()
    } catch (e) {
      this.affinityData = null;
      this.itemData = null;
    }
  },
}
</script>

<style scoped>

.opacity5 {
  opacity: 0.5;
}

.affinity-header {
  flex: 1
}

.affinity-header-name {
  color: #d2ba72;
}

.affinity-portrait {
  width: fit-content;
  margin-bottom: 1rem;
}

.affinity-tab {

}

</style>