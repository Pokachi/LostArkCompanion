<template>
  <div v-if="songData && itemData">
    <div :class="['d-flex', 'flex-column']">
      <div class="d-flex">
        <item-icon :data="itemData" :id="songId + uuidv4()" :key="itemData.id" :hide_popover="songData.acquisitionType === 'default'" size="0.9"/>
        <div class="d-flex flex-column ml-2 text-left flex-fill">
          <div class="d-flex">
            <h6 class="m-0">{{songData.name}}</h6>
            <p class="mt-0 mb-0 ml-auto"> Cooldown: {{songData.cooldown}} </p>
          </div>
          <p v-if="points"  class="m-0 points"> {{points}} Affinity Points</p>
          <p class="mb-1 mt-auto"> {{songData.description}}</p>
        </div>
      </div>
      <hr class="tooltiphr">
      <div class="text-left mt-1 d-flex align-items-center">
        <h6 class="m-0"> Acquisition Method </h6>
        <div class="ml-auto mr-4 subtitle-name-text acquired-font">
          <b-form-checkbox v-if="songData.acquisitionType !== 'default'" v-model="playerSongData[songId]" name="check-button" switch v-on:input="updateCollectible('song', songId, $event, songData.acquisitionContinentId, songData.acquisitionLocation);">Acquired: </b-form-checkbox>
        </div>
      </div>
      <div  v-if="songData.acquisitionLink" >
        <b-link class="d-inline-block" :href="songData.acquisitionLink">
          <b-img v-if="songData.acquisitionType && songData.acquisitionType!=='exchange'" :src="'./images/icons/' + songData.acquisitionType + '.png'" class="pb-1"/>
          <span :class="['d-inline-block', 'acquisition-text', songData.acquisitionType ? songData.acquisitionType : '', 'ml-1']">
            {{songData.acquisition}}
          </span>
        </b-link>
        <div class="text-white" v-if="songData.additionalInfo">
          {{ songData.additionalInfo }}
        </div>
      </div>
      <div v-else>
        <b-img v-if="songData.acquisitionType !== 'default'" :src="'./images/icons/' + songData.acquisitionType + '.png'" class="pb-1"/>
        <span :class="['d-inline-block', 'acquisition-text', songData.acquisitionType ? songData.acquisitionType : '', 'ml-1']">
          {{songData.acquisition}}
        </span>
        <div class="text-white" v-if="songData.additionalInfo">
          {{ songData.additionalInfo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemIcon from "@/components/ItemIcon";
import '@/assets/css/main.css';

export default {
  name: "SongDetail",
  props: ["songId", "points"],
  components: {ItemIcon},
  data: function() {
    return {
      found: false,
      songData: null,
      itemData: null,
      playerSongData: null
    }
  },
  async created() {
    this.songData = await import("@/assets/data/songs/" + this.songId + ".json");
    this.itemData = await import("@/assets/data/items/" + this.songId + ".json");

    this.playerSongData = {};
    if (localStorage.getItem('song_collectibles')) {
      try {
        let playerCollectibles = JSON.parse(localStorage.getItem('song_collectibles'));

        if (playerCollectibles[this.songData.acquisitionContinentId]) {
          this.playerSongData = playerCollectibles[this.songData.acquisitionContinentId];
        }
      } catch (e) {
        localStorage.removeItem('song_collectibles');
      }
    }

    this.$forceUpdate()
  }
}
</script>

<style>

/* Acquire Switch */
.custom-control-label::before {
  left: 4.5rem !important;
}
.custom-control-label::after {
  left: calc(4.5rem + 2px) !important;
}
</style>

<style scoped>
.acquisition-method {
  height: 18px;
}

.acquired-font {
  font-size: 1rem !important;
}

.points {
  color: #19a7e5;
}
</style>