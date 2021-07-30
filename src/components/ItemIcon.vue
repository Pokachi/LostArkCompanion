<template>
  <div>
    <div class="position-relative fit-content">
      <b-img :style="'background-image: url(./images/items/background/icon_grade_' + grade + '.png)'" class="item-icon" :src="icon" />
      <b-img v-if="subIcon" class="item-sub-icon" :src="'./images/items/subicon/icon_' + subIcon + '.png'" />
      <span v-if="cost" class="item-cost"> {{cost}} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemIcon",
  props: ['grade', 'icon', 'subIcon', 'cost', 'itemName']
}
</script>

<style scoped>

.font-grade-0 {
  color:white;
}

.font-grade-1 {
  color:#8df901
}

.font-grade-2 {
  color:#00b0fa
}

.font-grade-3 {
  color:#ba00f9
}

.font-grade-4 {
   color:#f99200
 }

.font-grade-5 {
  color:#fa5d00
}

.fit-content {
  width: fit-content;
  margin: auto;
}

.item-icon {
  background-size: 100%;
  background-repeat: no-repeat;
}

.item-cost {
  position: absolute;
  display: inline-block;
  width: auto;
  height: auto;
  bottom: 0;
  right: 0;
  text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
  font-size: large;
  font-weight: bold;
}

.item-sub-icon {
  position: absolute;
  display: inline-block;
  width: 28px;
  height: 28px;
  bottom: 0;
  right: 0;
}
</style>