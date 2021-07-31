<template>
  <div v-if="merchantData && Object.keys(itemData).length !== 0">
    <div v-for="(item, index) in merchantData.items" :key="item.id" class="container d-flex h-100 mt-2">
        <ItemIcon :data="itemData[item.id]" class="mr-3" :id="item.id + index.toString()" :key="item.id + index.toString()"/>
        <font-awesome-icon v-if="!item.condition" class="mt-2" icon="angle-double-left" size="4x"></font-awesome-icon>
        <div v-else>
          <font-awesome-icon class="mt-0" icon="angle-double-left" size="4x" />
          <span>{{item.condition}}</span>
        </div>
        <ItemIcon :data="currencyData[itemData[item.id].currency]" :cost="itemData[item.id].cost" class="ml-3" :id="itemData[item.id].currency + index.toString()" :key="itemData[item.id].currency + index.toString()"/>
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
      itemData: null,
      currencyData: null
    }
  },
  async created() {
    try {
      this.merchantData = await import("@/assets/data/merchants/" + this.merchantId + ".json");
      this.itemData = {};
      this.currencyData = {}
      for (const item of this.merchantData.items) {
        let itemData = await import("@/assets/data/items/" + item.id + ".json");
        this.itemData[item.id] = itemData;
        if (itemData.currency && !this.currencyData[itemData.currency]) {
          this.currencyData[itemData.currency] = await import("@/assets/data/items/" + itemData.currency + ".json");
        }
      }

      this.$forceUpdate()
    } catch (e) {
      this.merchantData = null;
      this.itemData = null;
      this.currencyData = null;
    }
  }
}
</script>

<style scoped>

</style>