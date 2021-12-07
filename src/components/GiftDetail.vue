<template>
  <div v-if="itemData">
    <div class="d-flex">
      <item-icon :data="itemData" :id="giftId + uuidv4()" :key="itemData.id" size="0.7"/>
      <div class="d-flex flex-column ml-2 text-left">
        <p v-if="points"  class="m-0 points"> {{points}} Affinity</p>
        <div v-if="conditions" class="d-flex">
          <div class="mt-1">
            Rq:
          </div>
          <div v-if="conditions.charisma" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
            <b-img style="width: 18px; height: 18px" :src="'./images/other/charisma.png'" alt="Charisma" class="mt-1"/>
            <span class="stats-number"> {{conditions.charisma}} </span>
          </div>
          <div v-if="conditions.wisdom" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
            <b-img style="width: 18px; height: 18px" :src="'./images/other/wisdom.png'" alt="Wisdom" class="mt-1"/>
            <span class="stats-number"> {{conditions.wisdom}} </span>
          </div>
          <div v-if="conditions.courage" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
            <b-img style="width: 18px; height: 18px" :src="'./images/other/courage.png'" alt="Courage" class="mt-1"/>
            <span class="stats-number"> {{conditions.courage}} </span>
          </div>
          <div  v-if="conditions.kindness" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
            <b-img style="width: 18px; height: 18px" :src="'./images/other/kindness.png'" alt="Kindness" class="mt-1"/>
            <span class="stats-number"> {{conditions.kindness}} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemIcon from "@/components/ItemIcon";
import '@/assets/css/main.css';

export default {
  name: "GiftDetail",
  props: ["giftId", "points", "conditions"],
  components: {ItemIcon},
  data: function() {
    return {
      itemData: null
    }
  },
  async created() {
    this.itemData = await import("@/assets/data/items/" + this.giftId + ".json");
    this.$forceUpdate()
  }
}
</script>

<style scoped>
.stats-number {
  position: absolute;
  display: inline-block;
  width: auto;
  height: auto;
  bottom: 0;
  right: 0;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  font-size: smaller;
  font-weight: bold;
}

.points {
  color: #19a7e5;
}
</style>