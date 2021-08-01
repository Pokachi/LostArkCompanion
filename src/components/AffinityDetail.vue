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
      <b-tab title="Reward" active>
        <div class="d-flex">

        </div>
      </b-tab>
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
      for (const rewardStage of Object.keys(this.affinityData.rewards)) {
        for (const reward of this.affinityData.rewards[rewardStage]) {
          if (!this.itemData[reward.id]) {
            this.itemData[reward.id] = await import("@/assets/data/items/" + reward.id + ".json");
          }
        }
      }

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

.affinity-normal {
  color: #cdb344;
}

.affinity-interested {
  color: #7ec543;
}

.affinity-friendly {
  color: #51c5b8;
}

.affinity-trust {
  color: #3d91d1;
}

</style>