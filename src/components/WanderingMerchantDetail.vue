<template>
  <div>
    <div v-for="(ware, index) in merchantData[merchantName]" :key="index">

    </div>
  </div>
</template>

<script>
import merchantData from "@/assets/data/merchant.json";

export default {
  name: "WanderingMerchantDetail",
  props: ['merchantName'],
  data: function () {
    return {
      merchantData: merchantData
    }
  }
}
</script>

<style scoped>

</style>