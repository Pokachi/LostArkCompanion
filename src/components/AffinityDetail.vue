<template>
  <div v-if="affinityData && Object.keys(itemData).length !== 0">
    <div class="d-flex">
      <b-carousel v-model="slide"
                  :interval="10000"
                  controls
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
    <b-tabs content-class="mt-1" active-nav-item-class="bg-dark text-light" fill>
      <b-tab title="Reward" active>
        <div class="d-flex flex-column">
          <div v-for="(rewardStage, index) of Object.keys(affinityData.rewards)"
               :key="rewardStage"
               :class="['d-flex', 'flex-row', 'align-items-center', index===0 ? '' : 'border-top', Object.keys(affinityData.rewards).length -1 === index ? '' : 'border-bottom']">
            <h4 :class="['affinity-' + rewardStage, 'flex-grow-0', 'flex-shrink-0', 'text-left']"> {{rewardStage}} </h4>
            <div v-for="item of affinityData.rewards[rewardStage]" :key="item.id" class="mt-1 mb-1 ml-1">
              <item-icon :data="itemData[item.id]" :count="item.count"  :id="item.id + index.toString() + disambiguator" :key="item.id + index.toString() + disambiguator" :size="0.75"></item-icon>
            </div>
          </div>
        </div>
      </b-tab>
      <b-tab title="Likes">
        <div class="d-flex flex-column">
          <h4 class="affinity-header-name">Songs</h4>
          <div v-for="song of affinityData.likes.songs" :key="song.id">
            <song-detail :song-id="song.id" :points="song.points" class="mb-2"/>
          </div>
        </div>
      </b-tab>
      <b-tab title="Stage" :set="totalExp = 0">
        <div class="d-flex flex-column flex-wrap">
          <div class="d-flex flex-row">
            <h6 class="border m-0 p-1 affinity-level-header"> Stage </h6>
            <h6 class="border m-0 p-1 affinity-level-header"> Points </h6>
            <h6 class="border m-0 p-1 affinity-level-header"> Total Points </h6>
          </div>
          <div v-for="level of affinityData.levels" :key="level.name" class="d-flex flex-row" :set="totalExp= totalExp + level.expRequired">
            <p :class="['border m-0 p-1', 'affinity-' + level.stage]">{{ level.name }}</p>
            <p :class="['border m-0 p-1', 'affinity-' + level.stage]">{{ level.expRequired }}</p>
            <p :class="['border m-0 p-1', 'affinity-' + level.stage]">{{ totalExp }}</p>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ItemIcon from "@/components/ItemIcon";
import SongDetail from "@/components/SongDetail";
export default {
  name: "AffinityDetail",
  components: {SongDetail, ItemIcon},
  props: ['affinityId', 'disambiguator'],
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
  }
}
</script>

<style scoped>

.affinity-level-header {
  width: 120px;
}

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
  width: 120px;
  height: fit-content;
  text-transform: capitalize;
}

.affinity-interested {
  color: #7ec543;
  width: 120px;
  height: fit-content;
  text-transform: capitalize;
}

.affinity-friendly {
  color: #51c5b8;
  width: 120px;
  height: fit-content;
  text-transform: capitalize;
}

.affinity-trust {
  color: #3d91d1;
  width: 120px;
  height: fit-content;
  text-transform: capitalize;
}

</style>