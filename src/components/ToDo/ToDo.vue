<template>
  <div v-if="taskData && dataReady" class="app-content">
    <h1 class="text-center p-3 text-white">
      Daily & Weekly Tracker
    </h1>

    <!-- Character Daily -->
    <div class="d-flex flex-wrap justify-content-center">
      <div class="text-white p-2">
        <h3 class="text-center pl-4 pr-4 pt-2 pb-2 m-0 bg-secondary">Character Daily</h3>
        <div class="d-flex" style="max-width: 95vw">
          <b-container class="bg-task-row text-nowrap" style="width: auto">
            <b-row class="pt-2 pb-2 border-bottom flex-nowrap" style="height: 41px">
              <b-col> </b-col>
            </b-row>
            <draggable v-model="dailyTasks" @start="drag=true" @end="drag=false" >
              <b-row v-for="task in dailyTasks" :key="task.id" class="pt-2 pb-2">
                <b-col>{{task.name}}</b-col>
              </b-row>
            </draggable>
          </b-container>

          <div class="bg-task-row daily-container flex-grow-1">
            <div style="min-width: 100%" class="d-flex flex-nowrap justify-content-center flex-nowrap">
              <div v-for="character in characters" :key="character.id" style="width: fit-content">
                <div class="text-center border-bottom pt-2 pl-2 pr-2" style="height: 41px" v-b-modal="'character-editor'" v-on:click="editCharacter(character.id)"> {{character.name}} </div>
                <div v-for="task in dailyTasks" :key="task.id" class="daily-marker m-auto pt-2" style="height: 41px; width: fit-content;">
                  <b-form-checkbox v-if="showCheckBox('daily', task.id, character.id)" />
                </div>
              </div>
              <!-- plus button -->
              <div class="text-center border-bottom pt-1 pl-3 pr-4" style="height: 41px;">
                <b-button pill variant="outline-light" style="height: fit-content" size="sm" v-b-modal="'character-editor'" v-on:click="editCharacter(null)">
                  <font-awesome-icon icon="plus" />
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Character editor -->
      <b-modal scrollable id="character-editor" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
        <b-form @submit="submitCharacter" @reset="$bvModal.hide('character-editor')">
          <!-- Character Name -->
          <b-form-input v-model="characterEditor.newName" placeholder="Character Name" />

          <!-- daily -->
          <b-tabs class="mt-3" content-class="mt-1" active-nav-item-class="bg-dark text-light" justified>
            <b-tab title="Daily">
              <div v-for="task of taskData.daily" :key="task.id" class="mt-2">
                <b-img class="ml-2" :src="'./images/tasks/' + task.id + '.png'" style="width: 24px"/>
                <div class="text-white d-inline align-middle"> {{task.name}}</div>
                <b-button v-b-modal="'additional-config-' + task.id" size="sm" pill class="float-right mr-2" v-on:click="taskConfig('daily', task.id)">
                  <font-awesome-icon icon="cog" />
                </b-button>
                <b-form-checkbox v-model="characterEditor.daily[task.id].checked" class="pt-1 float-right mr-2"></b-form-checkbox>

                <!-- Additional Config -->
                <b-modal :id="'additional-config-' + task.id" hide-footer size="sm" hide-header body-bg-variant="dark">
                  <h5 class="text-white"> {{task.name}} Config </h5>
                  <hr class="generalhr">
                  <p class="text-white font-weight-bold mt-2"> Interval: </p>
                  <b-form-spinbutton v-model="characterEditor.daily[task.id].newInterval" />
                  <p class="text-white font-weight-bold  mt-2"> Start Date: </p>
                  <b-form-datepicker v-model="characterEditor.daily[task.id].newDate" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"/>
                  <div class="mt-2">
                    <b-button class="float-right m-2" v-on:click="submitConfig($event, 'daily', task.id)" variant="primary">Confirm</b-button>
                    <b-button class="float-right m-2" v-on:click="$bvModal.hide('additional-config-' + task.id)" >Cancel</b-button>
                  </div>
                </b-modal>
              </div>
            </b-tab>
            <!-- weekly -->
            <b-tab title="Weekly">
              <div v-for="task of taskData.weekly" :key="task.id" class="mt-2">
                <b-img class="ml-2" :src="'./images/tasks/' + task.id + '.png'" style="width: 24px"/>
                <div class="text-white d-inline align-middle"> {{task.name}}</div>
                <b-form-checkbox v-model="characterEditor.weekly[task.id]" class="float-right mr-2"></b-form-checkbox>
              </div>
            </b-tab>
          </b-tabs>
          <div class="mt-2">
            <b-button class="float-right m-2" type="submit" variant="primary">Confirm</b-button>
            <b-button class="float-right m-2" type="reset" >Cancel</b-button>
          </div>
        </b-form>

      </b-modal>

      <div class="text-white p-2">
        <h3 class="text-center pl-4 pr-4 pt-2 pb-2 m-0 bg-secondary">Character Weekly</h3>
        <draggable v-model="weeklyTasks" group="people" @start="drag=true" @end="drag=false" class="bg-task-row">
          <div v-for="task in weeklyTasks" :key="task.id" class="text-white p-2">{{task.name}}</div>
        </draggable>
      </div>

    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import '@/assets/css/main.css';

export default {
  name: "ToDo",
  components: {
    draggable
  },
  data: function () {
    return {
      dataReady: false,
      taskData: null,
      characterEditor: {
        characterId: '',
        newName: '',
        daily: {
          chaos_dungeon: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          }
        },
        weekly: {
          una_weekly: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          }
        }
      },
      dailyTasks: [
        {
          name: "Chaos Dungeon",
          id: "chaos_dungeon",
        },
        {
          name: "Guardian Raid",
          id: "guardian_raid",
        },
        {
          name: "Una Tasks",
          id: "una_tasks",
        },
        {
          name: "Guild Support",
          id: "guild_support",
        },
        {
          name: "Other",
          id: "other",
        }
      ],
      weeklyTasks: [],
      characters: {
        pokachi: {
          name: "Pokachi",
          id: "pokachi",
          daily: {
            chaos_dungeon: {
              id: "chaos_dungeon",
              interval: 1,
              date: "2022-01-15"
            },
            guild_support: {
              id: "guild_support",
              interval: 1,
              date: "2022-01-05"
            }
          }
        },
        chipoka: {
          name: "Chipoka",
          id: "chipoka",
          daily: {
            chaos_dungeon: {
              id: "chaos_dungeon",
              interval: 1,
              date: "2022-01-15"
            },
            guild_support: {
              id: "guild_support",
              interval: 1,
              date: "2022-01-05"
            }
          }
        }
      }
    }
  },
  methods: {
    showCheckBox(taskType, taskId, characterId) {
      if (this.characters[characterId]) {
        const character = this.characters[characterId];
        if (character[taskType][taskId] && character[taskType][taskId].checked) {
          const taskDate = new Date(character[taskType][taskId].date);
          const date = new Date();

          while (date.getTime() - taskDate.getTime() > 86400000 ) {
            taskDate.setDate(taskDate.getDate() + character[taskType][taskId].interval);
          }
          character[taskType][taskId].date = taskDate.toJSON();

          if (0 <= date - taskDate && date - taskDate < 86400000) {
            return true;
          }
        }
      }
      return false;
    },
    editCharacter(characterId) {
      for(const daily of Object.values(this.characterEditor.daily)) {
        daily.interval = 1;
        daily.newInterval = 1;
        daily.date = new Date(new Date().toJSON().slice(0,10));
        daily.date.setHours(6)
        daily.date = daily.date.toJSON();
        daily.newDate = new Date(new Date().toJSON().slice(0,10));
        daily.newDate.setHours(6)
        daily.newDate = daily.newDate.toJSON();
        daily.checked = false;
      }

      if (characterId) {
        this.characterEditor.characterId = this.characters[characterId].id;
        this.characterEditor.newName = this.characters[characterId].name;
        for (const dailyId of Object.keys(this.characters[characterId].daily)) {
          const daily = this.characters[characterId].daily[dailyId];
          if (daily.checked) {
            this.characterEditor.daily[dailyId].interval = daily.interval;
            this.characterEditor.daily[dailyId].newInterval = daily.interval;
            this.characterEditor.daily[dailyId].date = daily.date;
            this.characterEditor.daily[dailyId].newDate = daily.date;
            this.characterEditor.daily[dailyId].checked = true;
          }
        }
      } else {
        this.characterEditor.characterId = this.uuidv4();
        this.characterEditor.newName = ""
      }
    },
    taskConfig(type, taskId) {
      this.characterEditor[type][taskId].newInterval = this.characterEditor[type][taskId].interval;
      this.characterEditor[type][taskId].newDate = this.characterEditor[type][taskId].date;
    },
    submitConfig(event, type, taskId) {
      event.preventDefault();
      this.characterEditor[type][taskId].interval = this.characterEditor[type][taskId].newInterval;
      this.characterEditor[type][taskId].date = this.characterEditor[type][taskId].newDate;
      const tempDate = new Date(this.characterEditor[type][taskId].newDate);
      let extraHour = tempDate.getHours() + 6 + tempDate.getTimezoneOffset()/60;
      if (extraHour >= 24) {
        tempDate.setDate(tempDate.getDate() + 1);
        extraHour -= 24;
      }
      tempDate.setHours(extraHour);
      this.characterEditor[type][taskId].date = tempDate.toJSON();
      this.$bvModal.hide('additional-config-' + taskId)
    },
    submitCharacter(event) {
      event.preventDefault();

      const charData = {};
      charData.name = JSON.parse(JSON.stringify(this.characterEditor.newName));
      charData.id = JSON.parse(JSON.stringify(this.characterEditor.characterId));
      charData.daily = JSON.parse(JSON.stringify(this.characterEditor.daily));
      charData.weekly = JSON.parse(JSON.stringify(this.characterEditor.weekly));
      this.characters[charData.id] = charData;
      this.$bvModal.hide('character-editor')
      console.log(JSON.stringify(this.characters));
      this.$forceUpdate();
    },

    async importData() {
      this.taskData = JSON.parse(JSON.stringify(await import("@/assets/data/tasks/tasks.json")));

      this.dataReady = true;
      this.$forceUpdate();
    }
  },
  async created() {
    this.dataReady = false;
    await this.importData();
  }
}
</script>

<style scoped>

.bg-task-row {
  background-color: #424242;
}
.daily-container {
  overflow-x: auto;
}

/* width */
::-webkit-scrollbar {
  height: 0.5em;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<style>
.daily-marker .custom-control .custom-control-label::before,
.daily-marker .custom-control .custom-control-label::after {
  left: -1.5rem !important;
}
</style>