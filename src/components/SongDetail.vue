<template>
  <div v-if="songData && itemData">
    <div :class="[playerSongData.songId ? '' : '', 'd-flex']">
      <item-icon :data="itemData" :id="songId + uuidv4()" :key="itemData.id" size="0.9"/>
      <div class="d-flex flex-column ml-2 text-left flex-fill">
        <div class="d-flex">
          <h6 class="m-0">{{songData.name}}</h6>
          <p class="mt-0 mb-0 ml-auto"> Cooldown: {{songData.cooldown}} </p>
        </div>
        <p v-if="points"  class="m-0 points"> {{points}} Affinity Points</p>
        <p class="mb-1 mt-auto"> {{songData.description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ItemIcon from "@/components/ItemIcon";
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
    if (localStorage.getItem('player_songs')) {
      try {
        this.playerSongData = JSON.parse(localStorage.getItem('player_songs'));
      } catch (e) {
        localStorage.removeItem('player_songs');
      }
    }

    this.$forceUpdate()
  }
}
</script>

<style>

/* Acquire Switch */
.custom-control-label::before {
  left: 4rem !important;
}
.custom-control-label::after {
  left: calc(4rem + 2px) !important;
}
</style>

<style scoped>
.points {
  color: #19a7e5;
}
</style>