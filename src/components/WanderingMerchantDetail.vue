<template>
  <div v-if="merchantData && itemData">
    <div v-for="item in merchantData.items" :key="item.id" class="container d-flex h-100">
        <ItemIcon :icon="itemData[item.id].image" :grade="itemData[item.id].grade" :sub-icon="itemData[item.id].subIcon" class="mr-3"/>
        <font-awesome-icon v-if="!item.condition" class="mt-2" icon="angle-double-left" size="4x"></font-awesome-icon>
        <div v-else>
          <font-awesome-icon class="mt-0" icon="angle-double-left" size="4x" />
          <span>{{item.condition}}</span>
        </div>
        <ItemIcon :icon="itemData[item.id].currencyImage" :grade="0" :cost="itemData[item.id].cost" class="ml-3"/>
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
        this.itemData[item.id] = await import("@/assets/data/items/" + item.id + ".json");
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