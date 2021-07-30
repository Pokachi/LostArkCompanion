<template>
  <div v-if="merchantData && itemData">
    <div v-for="item in itemData" :key="item.id" class="container d-flex h-100">
        <ItemIcon :icon="item.image" :grade="item.grade" :sub-icon="item.subIcon" class="mr-3"/>
        <font-awesome-icon class="mt-2" icon="angle-double-left" size="4x"></font-awesome-icon>
        <ItemIcon :icon="item.currencyImage" :grade="0" :cost="item.cost" class="ml-3"/>
    </div>
  </div>
</template>

<script>

import ItemIcon from "@/components/ItemIcon";
export default {
  name: "WanderingMerchantDetail",
  components: {ItemIcon},
  props: ['merchantId'],
  data: function () {
    return {
      merchantData: null,
      itemData: null
    }
  },
  async created() {
    try {
      this.merchantData = await import("@/assets/data/merchants/" + this.merchantId + ".json");
      this.itemData = {};
      for (const item of this.merchantData.items) {
        this.itemData[item.itemId] = await import("@/assets/data/items/" + item.itemId + ".json");
      }
      this.$forceUpdate()
    } catch (e) {
      this.merchantData = null;
      this.itemData = null;
    }
  }
}
</script>

<style scoped>

</style>