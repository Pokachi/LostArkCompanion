<template>
  <div v-if="affinityData && Object.keys(itemData).length !== 0">
    <div class="d-flex">
      <b-img v-if="affinityData.imageCount === 1" :src="'./images/affinity/' + affinityId + '_1.png'" class="affinity-portrait" />
      <b-carousel v-model="slide"
                  :interval="10000"
                  controls
                  no-animation
                  v-if="affinityData.imageCount >= 2"
                  class="affinity-portrait">
        <b-carousel-slide
            :img-src="'./images/affinity/' + affinityId + '_1.png'"
        ></b-carousel-slide>
        <b-carousel-slide
            :img-src="'./images/affinity/' + affinityId + '_2.png'"
        ></b-carousel-slide>
        <b-carousel-slide v-if="affinityData.imageCount >= 3"
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

    <b-tabs content-class="mt-1" active-nav-item-class="bg-dark text-light" justified>
      <b-tab title="Requirements" active>
        <div class="d-flex flex-column">
          <h4 v-if="affinityData.condition.quest" class="mt-2">
            Quest
          </h4>
          <b-link v-if="affinityData.condition.quest" :href="affinityData.condition.questLink" target="_blank" rel="noopener noreferrer">
            <b-img :src="'./images/icons/' + affinityData.condition.questType + '.png'" class="pb-1"/>
            <span :class="['d-inline-block', 'acquisition-text', affinityData.condition.questType, 'ml-1']">
              {{affinityData.condition.quest}}
            </span>
          </b-link>
        </div>
      </b-tab>
      <b-tab title="Rewards">
        <div class="d-flex flex-column">
          <div v-for="(rewardStage, index) of Object.keys(affinityData.rewards)"
               :key="rewardStage"
               :class="['d-flex', 'flex-row', 'align-items-center', index===0 ? '' : 'border-top', Object.keys(affinityData.rewards).length -1 === index ? '' : 'border-bottom']">
            <h4 :class="['affinity-' + rewardStage, 'flex-grow-0', 'flex-shrink-0', 'text-left']" style="width: 123px"> {{rewardStage}} </h4>
            <div v-for="item of affinityData.rewards[rewardStage]" :key="item.id" class="mt-1 mb-1 ml-1">
              <item-icon :data="itemData[item.id]" :count="item.count"  :id="item.id + index.toString() + disambiguator" :key="item.id + index.toString() + disambiguator" :size="0.75"></item-icon>
            </div>
          </div>
        </div>
      </b-tab>
      <b-tab title="Stages" :set="totalExp = 0">
        <div class="d-flex flex-column flex-wrap">
          <div class="d-flex flex-row">
            <h6 class="border m-0 p-1 affinity-level-header"> Stage </h6>
            <h6 class="border m-0 p-1 affinity-level-header"> Points </h6>
            <h6 class="border m-0 p-1 affinity-level-header"> Total Points </h6>
          </div>
          <div v-for="level of affinityData.levels" :key="level.name" class="d-flex flex-row" :set="totalExp= totalExp + level.expRequired">
            <p :class="['border m-0 p-1', 'affinity-level-header', 'affinity-' + level.stage]">{{ level.name }}</p>
            <p :class="['border m-0 p-1', 'affinity-level-header', 'affinity-' + level.stage]">{{ level.expRequired }}</p>
            <p :class="['border m-0 p-1', 'affinity-level-header', 'affinity-' + level.stage]">{{ totalExp }}</p>
          </div>
        </div>
      </b-tab>
      <b-tab title="Quests">
        <div v-if="affinityData.quests" class="d-flex flex-column flex-wrap">
          <div class="d-flex flex-row">
            <h6 class="border m-0 p-1 quest-header"> Quest </h6>
            <h6 class="border m-0 p-1 stage-header"> Stage </h6>
            <h6 class="border m-0 p-1 stats-header"> Stats Rq.</h6>
          </div>
          <div v-for="quest of affinityData.quests" :key="quest.name" class="d-flex flex-row">
            <b-link v-if="quest.link" :href="quest.link" target="_blank" rel="noopener noreferrer" class="border m-0 p-1 quest-header">
              <b-img :src="'./images/icons/' + quest.type + '.png'" class="pb-1"/>
              <span :class="['d-inline-block', quest.type, 'ml-1']">
                {{quest.name}}
              </span>
            </b-link>
            <div v-else class="border m-0 quest-header" style="padding-top: 0.4rem">
              <b-img :src="'./images/icons/' + quest.type + '.png'" class="pb-1"/>
              <span :class="['d-inline-block', 'ml-1']">
                {{quest.name}}
              </span>
            </div>
            <div style="padding-top: 0.4rem" v-if="quest.conditions && quest.conditions.stage" :class="['border', 'm-0', 'stage-header', 'affinity-' + quest.conditions.stageId]">
              {{quest.conditions.stage}}
            </div>
            <div class="border stats-header d-flex">
              <div v-if="quest.conditions.charisma" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
                <b-img style="width: 18px; height: 18px" :src="'./images/other/charisma.png'" alt="Charisma" class="mt-1"/>
                <span class="stats-number"> {{quest.conditions.charisma}} </span>
              </div>
              <div v-if="quest.conditions.wisdom" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
                <b-img style="width: 18px; height: 18px" :src="'./images/other/wisdom.png'" alt="Wisdom" class="mt-1"/>
                <span class="stats-number"> {{quest.conditions.wisdom}} </span>
              </div>
              <div v-if="quest.conditions.courage" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
                <b-img style="width: 18px; height: 18px" :src="'./images/other/courage.png'" alt="Courage" class="mt-1"/>
                <span class="stats-number"> {{quest.conditions.courage}} </span>
              </div>
              <div  v-if="quest.conditions.kindness" class="position-relative ml-auto mr-auto" style="width: 25px; height: 25px">
                <b-img style="width: 18px; height: 18px" :src="'./images/other/kindness.png'" alt="Kindness" class="mt-1"/>
                <span class="stats-number"> {{quest.conditions.kindness}} </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <span :class="['d-inline-block', 'acquisition-text', 'ml-1']">
            No Quests or Dialogue Available
          </span>
        </div>
      </b-tab>
      <b-tab title="Songs">
        <div class="d-flex flex-column mt-2">
          <div v-for="song of affinityData.likes.songs" :key="song.id" class="darker-bg mb-2 pl-3 pr-3 pt-1">
            <song-detail :song-id="song.id" :points="song.points" class="mb-2 mt-2"/>
          </div>
        </div>
      </b-tab>
      <b-tab title="Emotes">
        <div class="d-flex flex-column mt-2">
          <div v-for="emote of affinityData.likes.emotes" :key="emote.id" class="darker-bg mb-2 pl-3 pr-3 pt-1">
            <emote-detail :emote-id="emote.id" :points="emote.points" class="mb-2 mt-2"/>
          </div>
        </div>
      </b-tab>
      <b-tab title="Gifts">
        <div class="d-flex flex-wrap">
          <div v-for="gift of affinityData.likes.gifts" :key="gift.id" class="m-1">
            <gift-detail :gift-id="gift.id" :points="gift.points" :conditions="gift.conditions"/>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ItemIcon from "@/components/ItemIcon";
import SongDetail from "@/components/SongDetail";
import EmoteDetail from "@/components/EmoteDetail";
import GiftDetail from "@/components/GiftDetail";

export default {
  name: "AffinityDetail",
  components: {SongDetail, EmoteDetail, GiftDetail, ItemIcon},
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

.quest-header {
  width: 160px;
  height: 32px;
}

.stage-header {
  width: 100px;
  height: 32px;
}

.stats-header {
  width: 109px;
  height: 32px;
}

.affinity-level-header {
  width: 123px;
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
  text-transform: capitalize;
}

.affinity-interested {
  color: #7ec543;
  text-transform: capitalize;
}

.affinity-friendly {
  color: #51c5b8;
  text-transform: capitalize;
}

.affinity-trust {
  color: #3d91d1;
  text-transform: capitalize;
}

</style>