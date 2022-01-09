<template>
  <div v-if="taskData && dataReady" class="app-content">
    <h1 class="text-center pt-3 pb-2 text-white m-0">
      Daily & Weekly Tracker
    </h1>

    <div class="text-center mb-3">
      <div class="d-inline mr-2">
        <b-dropdown id="dropdown-1" :text="selectedRegion ? serverRegionData.regions[selectedRegion].name : 'Select Region'" class="m-md-2">
          <b-dropdown-item v-for="region of Object.keys(serverRegionData.regions)" :key="region" @click="changeRegion(region);">{{serverRegionData.regions[region].name}}</b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="d-inline">
        <b-dropdown id="dropdown-1" :text="displayMode===1 ? 'Show Characters with Tasks' : 'Show All Characters'" class="m-md-2">
          <b-dropdown-item @click="setDisplayMode(0);"> Show All Characters </b-dropdown-item>
          <b-dropdown-item @click="setDisplayMode(1);"> Show Characters with Tasks </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-content-center">
      <!-- Daily -->
      <div class="text-white p-2">
        <h3 class="text-center pl-4 pr-4 pt-2 pb-2 m-0 bg-secondary">Daily</h3>
        <div class="d-flex" style="max-width: 95vw">
          <b-container class="bg-task-row text-nowrap" style="width: auto">
            <b-row class="pt-2 pb-2 border-bottom flex-nowrap" style="height: 41px">
              <b-col> </b-col>
            </b-row>
            <draggable v-model="dailyTaskDraggable" @start="drag=true" @end="drag=false" @change="saveData">
              <b-row v-for="task in dailyTaskDraggable" :key="task.id" class="pt-2 pb-2">
                <b-col>
                  <b-img :src="'./images/tasks/' + task.image_id + '.png'" class="d-inline mr-1" style="width: 24px;"/>
                  {{task.name}}
                </b-col>
              </b-row>
            </draggable>
          </b-container>

          <div class="bg-task-row daily-container flex-grow-1">
            <div style="min-width: 100%" class="d-flex flex-nowrap flex-nowrap">
              <div v-for="character in getCharacters" :key="character.id" style="width: fit-content">
                <div class="text-center border-bottom pt-2 pl-2 pr-2" style="height: 41px; width: max-content" v-b-modal="'character-editor'" v-on:click="editCharacter(character.id)">
                  <b-img :src="'./images/classes/' + character.characterClass + '.png'" class="d-inline mr-1" style="width: 24px;"/>
                  <div class="d-inline"> {{character.name}} </div>
                </div>
                <div v-for="task in dailyTaskDraggable" :key="task.id" class="daily-marker m-auto pt-2" style="height: 41px; width: fit-content;">
                  <b-form-checkbox v-if="showCheckBox('daily', task.id, character.id)" v-model="character.daily[task.id].completed" @change="toggleTask('daily', task.id, character.id, $event)"/>
                  <div class="mr-1" v-if="showHourglass('daily', task.id, character.id)">
                    <font-awesome-icon icon="hourglass"/>
                    {{ calcRemainingDate('daily', task.id, character.id) }}
                  </div>
                </div>
              </div>
              <!-- plus button -->
              <div class="text-center border-bottom pt-1 pl-3 pr-4 flex-grow-1" style="height: 41px">
                <b-button pill variant="outline-light" style="height: fit-content" size="sm" v-b-modal="'character-editor'" v-on:click="editCharacter(null)">
                  <font-awesome-icon icon="plus" />
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly -->
      <div class="text-white p-2">
        <h3 class="text-center pl-4 pr-4 pt-2 pb-2 m-0 bg-secondary">Weekly</h3>
        <div class="d-flex" style="max-width: 95vw">
          <b-container class="bg-task-row text-nowrap" style="width: auto">
            <b-row class="pt-2 pb-2 border-bottom flex-nowrap" style="height: 41px">
              <b-col> </b-col>
            </b-row>
            <draggable v-model="weeklyTaskDraggable" @start="drag=true" @end="drag=false" @change="saveData">
              <b-row v-for="task in weeklyTaskDraggable" :key="task.id" class="pt-2 pb-2">
                <b-col>
                  <b-img :src="'./images/tasks/' + task.image_id + '.png'" class="d-inline mr-1" style="width: 24px;"/>
                  {{task.name}}
                </b-col>
              </b-row>
            </draggable>
          </b-container>

          <div class="bg-task-row daily-container flex-grow-1">
            <div style="min-width: 100%" class="d-flex flex-nowrap flex-nowrap">
              <div v-for="character in getCharacters" :key="character.id" style="width: fit-content">
                <div class="text-center border-bottom pt-2 pl-2 pr-2" style="height: 41px; width: max-content" v-b-modal="'character-editor'" v-on:click="editCharacter(character.id)">
                  <b-img :src="'./images/classes/' + character.characterClass + '.png'" class="d-inline mr-1" style="width: 24px;"/>
                  <div class="d-inline"> {{character.name}} </div>
                </div>
                <div v-for="task in weeklyTaskDraggable" :key="task.id" class="daily-marker m-auto pt-2" style="height: 41px; width: fit-content;">
                  <b-form-checkbox v-if="showCheckBox('weekly', task.id, character.id)" v-model="character.weekly[task.id].completed" @change="toggleTask('weekly', task.id, character.id, $event)"/>
                  <div class="mr-1" v-if="showHourglass('weekly', task.id, character.id)">
                    <font-awesome-icon icon="hourglass"/>
                    {{ calcRemainingDate('weekly', task.id, character.id) }}
                  </div>
                </div>
              </div>
              <!-- plus button -->
              <div class="text-center border-bottom pt-1 pl-3 pr-4 flex-grow-1" style="height: 41px">
                <b-button pill variant="outline-light" style="height: fit-content" size="sm" v-b-modal="'character-editor'" v-on:click="editCharacter(null)">
                  <font-awesome-icon icon="plus" />
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Character editor -->
      <b-modal scrollable id="character-editor" content-class="character-editor" :hide-footer="true" :hide-header="true" body-bg-variant="dark">
        <b-form @submit="submitCharacter" @reset="$bvModal.hide('character-editor')">
          <!-- Character Portrait -->
          <b-img :src="'./images/classes/' + characterEditor.characterClass + '.png'" class="d-inline" style="width: 48px;" v-b-modal="'character-portrait'"/>
          <!-- Character Name -->
          <b-form-input aria-describedby="character-name-feedback" :state="characterNameValidation" v-model="characterEditor.newName" placeholder="Character Name" class="d-inline ml-3" style="width: fit-content;"/>
          <b-form-invalid-feedback id="character-name-feedback">
            Please enter a valid name.
          </b-form-invalid-feedback>
          <b-button v-b-modal="'delete-character-' + characterEditor.characterId" v-if="characters[characterEditor.characterId]" class="float-right text-white mt-auto mb-auto" pill variant="danger">
            <font-awesome-icon icon="trash" />
          </b-button>

          <!-- Delete Character -->
          <b-modal v-if="characters[characterEditor.characterId]" :id="'delete-character-' + characterEditor.characterId" hide-footer size="sm" hide-header body-bg-variant="dark">
            <h5 class="text-white"> Delete {{characterEditor.newName}} </h5>
            <hr class="generalhr">
            <div class="text-white m-2"> Are you sure you want to delete this character?</div>                <div class="mt-2">
            <b-button class="float-right m-2" v-on:click="deleteCharacter(characterEditor.characterId)" variant="danger">Confirm</b-button>
            <b-button class="float-right m-2" v-on:click="$bvModal.hide('delete-character-' + characterEditor.characterId)" >Cancel</b-button>
          </div>
          </b-modal>

          <!-- daily -->
          <b-tabs class="mt-3" content-class="mt-1" active-nav-item-class="bg-dark text-light" justified>
            <b-tab title="Daily">
              <div v-for="task of taskData.daily" :key="task.id" class="mt-2">
                <div v-if="!task.multi">
                  <b-img class="ml-2" :src="'./images/tasks/' + task.image_id + '.png'" style="width: 24px"/>
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
                <div v-else>
                  <b-button block v-b-toggle="task.id + '-toggle'" variant="outline-info"> {{task.name}}</b-button>
                  <b-collapse :id="task.id + '-toggle'">
                    <div v-for="actualTask of task.content" :key="actualTask.id" class="mt-2">
                      <b-img class="ml-2" :src="'./images/tasks/' + actualTask.image_id + '.png'" style="width: 24px"/>
                      <div class="text-white d-inline align-middle"> {{actualTask.name}}</div>
                      <b-button v-b-modal="'additional-config-' + actualTask.id" size="sm" pill class="float-right mr-2" v-on:click="taskConfig('daily', actualTask.id)">
                        <font-awesome-icon icon="cog" />
                      </b-button>
                      <b-form-checkbox v-model="characterEditor.daily[actualTask.id].checked" class="pt-1 float-right mr-2"></b-form-checkbox>

                      <!-- Additional Config -->
                      <b-modal :id="'additional-config-' + actualTask.id" hide-footer size="sm" hide-header body-bg-variant="dark">
                        <h5 class="text-white"> {{actualTask.name}} Config </h5>
                        <hr class="generalhr">
                        <p class="text-white font-weight-bold mt-2"> Interval: </p>
                        <b-form-spinbutton v-model="characterEditor.daily[actualTask.id].newInterval" />
                        <p class="text-white font-weight-bold  mt-2"> Start Date: </p>
                        <b-form-datepicker v-model="characterEditor.daily[actualTask.id].newDate" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"/>
                        <div class="mt-2">
                          <b-button class="float-right m-2" v-on:click="submitConfig($event, 'daily', actualTask.id)" variant="primary">Confirm</b-button>
                          <b-button class="float-right m-2" v-on:click="$bvModal.hide('additional-config-' + actualTask.id)" >Cancel</b-button>
                        </div>
                      </b-modal>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </b-tab>
            <!-- weekly -->
            <b-tab title="Weekly">
              <div v-for="task of taskData.weekly" :key="task.id" class="mt-2">
                <div v-if="!task.multi">
                  <b-img class="ml-2" :src="'./images/tasks/' + task.image_id + '.png'" style="width: 24px"/>
                  <div class="text-white d-inline align-middle"> {{task.name}}</div>
                  <b-button v-b-modal="'additional-config-' + task.id" size="sm" pill class="float-right mr-2" v-on:click="taskConfig('weekly', task.id)">
                    <font-awesome-icon icon="cog" />
                  </b-button>
                  <b-form-checkbox v-model="characterEditor.weekly[task.id].checked" class="pt-1 float-right mr-2"></b-form-checkbox>

                  <!-- Additional Config -->
                  <b-modal :id="'additional-config-' + task.id" hide-footer size="sm" hide-header body-bg-variant="dark">
                    <h5 class="text-white"> {{task.name}} Config </h5>
                    <hr class="generalhr">
                    <p class="text-white font-weight-bold mt-2"> Interval: </p>
                    <b-form-spinbutton v-model="characterEditor.weekly[task.id].newInterval" />
                    <p class="text-white font-weight-bold  mt-2"> Start Date: </p>
                    <b-form-datepicker v-model="characterEditor.weekly[task.id].newDate" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"/>
                    <div class="mt-2">
                      <b-button class="float-right m-2" v-on:click="submitConfig($event, 'weekly', task.id)" variant="primary">Confirm</b-button>
                      <b-button class="float-right m-2" v-on:click="$bvModal.hide('additional-config-' + task.id)" >Cancel</b-button>
                    </div>
                  </b-modal>
                </div>
                <div v-else>
                  <b-button block v-b-toggle="task.id + '-toggle'" variant="outline-info"> {{task.name}}</b-button>
                  <b-collapse :id="task.id + '-toggle'">
                    <div v-for="actualTask of task.content" :key="actualTask.id" class="mt-2">
                      <b-img class="ml-2" :src="'./images/tasks/' + actualTask.image_id + '.png'" style="width: 24px"/>
                      <div class="text-white d-inline align-middle"> {{actualTask.name}}</div>
                      <b-button v-b-modal="'additional-config-' + actualTask.id" size="sm" pill class="float-right mr-2" v-on:click="taskConfig('weekly', actualTask.id)">
                        <font-awesome-icon icon="cog" />
                      </b-button>
                      <b-form-checkbox v-model="characterEditor.weekly[actualTask.id].checked" class="pt-1 float-right mr-2"></b-form-checkbox>

                      <!-- Additional Config -->
                      <b-modal :id="'additional-config-' + actualTask.id" hide-footer size="sm" hide-header body-bg-variant="dark">
                        <h5 class="text-white"> {{actualTask.name}} Config </h5>
                        <hr class="generalhr">
                        <p class="text-white font-weight-bold mt-2"> Interval: </p>
                        <b-form-spinbutton v-model="characterEditor.weekly[actualTask.id].newInterval" />
                        <p class="text-white font-weight-bold  mt-2"> Start Date: </p>
                        <b-form-datepicker v-model="characterEditor.weekly[actualTask.id].newDate" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"/>
                        <div class="mt-2">
                          <b-button class="float-right m-2" v-on:click="submitConfig($event, 'weekly', actualTask.id)" variant="primary">Confirm</b-button>
                          <b-button class="float-right m-2" v-on:click="$bvModal.hide('additional-config-' + actualTask.id)" >Cancel</b-button>
                        </div>
                      </b-modal>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </b-tab>
          </b-tabs>
          <div class="mt-2">
            <b-button class="float-right m-2" type="submit" variant="primary">Confirm</b-button>
            <b-button class="float-right m-2" type="reset" >Cancel</b-button>
          </div>
        </b-form>

      </b-modal>

      <!-- Character Portrait -->
      <b-modal id="character-portrait" hide-footer hide-header body-bg-variant="dark">
        <h4 class="text-white"> Select Character Class </h4>
        <hr class="generalhr">
        <div v-for="charClass of Object.keys(characterData.classes)" :key="charClass" class="m-2 text-white">
          <h5 class="text-center">
            {{characterData.classes[charClass].name}}
          </h5>
          <div class="d-flex flex-grow-0 flex-wrap justify-content-center">
            <b-link v-for="charSubclass of Object.keys(characterData.classes[charClass].subclass)" :key="charSubclass" class="m-2" v-on:click="submitPortrait($event, charSubclass)">
              <div class="m-auto" style="width: fit-content">
                <b-img :src="'./images/classes/' + charSubclass + '.png'" width="48px" class="m-auto"/>
              </div>
              <div class="m-auto" style="width: fit-content"> {{ characterData.classes[charClass].subclass[charSubclass].name }}</div>
            </b-link>
          </div>
        </div>
      </b-modal>
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
      displayMode: 0,
      taskData: null,
      characterData: null,
      serverRegionData: null,
      selectedRegion: "na-west",
      characterEditor: {
        characterId: '',
        characterClass: '',
        newName: '',
        daily: {
          chaos_dungeon: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          guardian_raid: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          una_daily: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          guild_support: {
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          rapport_actions: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          world_boss: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          chaos_gate: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          adventure_island: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          voyage_co_op_mission: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          trade_skill: {
            parent: "miscellaneous",
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
          },
          demon_beast_canyon: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          necromancers_origin: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          hall_of_the_twisted_warlord: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          hildebrandt_palace: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          road_of_sorrow: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          forgotten_forge: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          oblivion_sea: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          perilous_abyss: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          underwater_sanctuary: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          distraught_forest: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          rotting_glade: {
            parent: "abyss_dungeon",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          valtan: {
            parent: "legion_raid",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          vykas: {
            parent: "legion_raid",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          kakul_saydon: {
            parent: "legion_raid",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          brelshaza: {
            parent: "legion_raid",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          argos: {
            parent: "abyss_raid",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          gvg: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          guild_boss: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          merchant_ship_exchange: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          silmael_bloodstone_exchange: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          pvp_token_exchange: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          ghost_ship: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          pvp_island: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          },
          guardian_challenge: {
            parent: "miscellaneous",
            interval: 1,
            checked: false,
            date: "2022-01-05",
            newInterval: 1,
            newDate: "2022-01-05"
          }
        }
      },
      dailyTasks: {},
      dailyTaskDraggable: [],
      weeklyTasks: {},
      weeklyTaskDraggable: [],
      characters: {}
    }
  },
  computed: {
    getCharacters() {
      if ( this.displayMode===0 ) {
        return this.characters;
      } else {
        return Object.values(this.characters).filter( character => {
          for (const daily of Object.values(character.daily)) {
            const taskDate = new Date(daily.date);
            const todayDate = new Date;
            if (daily.completed !== true && taskDate < todayDate) {
              return true;
            }
          }
          return false;
        })
      }
    },
    characterNameValidation() {
      var re = /^[A-Za-z0-9']{3,12}$/;
      if (!re.test(this.characterEditor.newName)) {
        return false;
      }
      return true;
    }
  },
  methods: {
    setDisplayMode(newMode) {
      this.displayMode = newMode;
      localStorage.setItem('task_DisplayMode', JSON.stringify(this.displayMode));
      this.$forceUpdate();
    },
    deleteCharacter(characterId) {
      for(const daily of Object.keys(this.characters[characterId].daily)) {
        const index = this.dailyTasks[daily].characters.indexOf(characterId);
        this.dailyTasks[daily].characters.splice(index, 1);
        if (this.dailyTasks[daily].characters.length === 0) {
          delete this.dailyTasks[daily];
          for (let i = 0; i < this.dailyTaskDraggable.length; i++) {
            if (this.dailyTaskDraggable[i].id === daily) {
              this.dailyTaskDraggable.splice(i, 1);
              break;
            }
          }
        }
      }
      for(const weekly of Object.keys(this.characters[characterId].weekly)) {
        const index = this.weeklyTasks[weekly].characters.indexOf(characterId);
        this.weeklyTasks[weekly].characters.splice(index, 1);
        if (this.weeklyTasks[weekly].characters.length === 0) {
          delete this.weeklyTasks[weekly];
          for (let i = 0; i < this.weeklyTaskDraggable.length; i++) {
            if (this.weeklyTaskDraggable[i].id === weekly) {
              this.weeklyTaskDraggable.splice(i, 1);
              break;
            }
          }
        }
      }
      delete this.characters[characterId];
      this.saveData();
      this.$bvModal.hide('delete-character-' + characterId);
      this.$bvModal.hide('character-editor');
      this.$forceUpdate();
    },
    toggleTask(taskType, taskId, characterId, event) {
      if (this.characters[characterId]) {
        const character = this.characters[characterId];
        character[taskType][taskId].completed = event;
        if (event) {
          const nextDate = new Date();
          nextDate.setHours(0);
          nextDate.setMinutes(0);
          nextDate.setSeconds(0);
          nextDate.setMilliseconds(0);
          taskType === 'daily' ? nextDate.setDate(nextDate.getDate() + character[taskType][taskId].interval) : nextDate.setDate(nextDate.getDate() + 7 * character[taskType][taskId].interval);
          let hoursToSet = 6 + this.serverRegionData.regions[this.selectedRegion].timeZoneOffset - nextDate.getTimezoneOffset()/60;
          if (hoursToSet >= 24) {
            nextDate.setDate(nextDate.getDate() + 1);
            hoursToSet -= 24;
          } else if (hoursToSet < 0) {
            nextDate.setDate(nextDate.getDate() - 1);
            hoursToSet += 24;
          }

          nextDate.setHours(hoursToSet);
          character[taskType][taskId].nextDate = nextDate.toJSON();
        } else {
          character[taskType][taskId].nextDate = character[taskType][taskId].date;
        }
      }
      this.saveData();
    },
    calcRemainingDate(taskType, taskId, characterId) {
      if (this.characters[characterId]) {
        const character = this.characters[characterId];
        if (character[taskType][taskId] && character[taskType][taskId].checked) {
          let taskDate = new Date(character[taskType][taskId].date);
          const date = new Date();

          return taskDate.getDate() - date.getDate();
        }
      }
      return 1;
    },
    showHourglass(taskType, taskId, characterId) {
      if (this.characters[characterId]) {
        const character = this.characters[characterId];
        if (character[taskType][taskId] && character[taskType][taskId].checked) {
          let taskDate = new Date(character[taskType][taskId].date);
          const date = new Date();

          if (taskDate > date) {
            return true;
          }
        }
      }
      return false;
    },
    showCheckBox(taskType, taskId, characterId) {
      if (this.characters[characterId]) {
        const character = this.characters[characterId];
        if (character[taskType][taskId] && character[taskType][taskId].checked) {
          let taskDate = new Date(character[taskType][taskId].date);
          const date = new Date();

          const minTaskTime = 86400000;

          if (date - taskDate >= minTaskTime && character[taskType][taskId].completed && character[taskType][taskId].nextDate && character[taskType][taskId].date !== character[taskType][taskId].nextDate) {
            character[taskType][taskId].date = character[taskType][taskId].nextDate;
            character[taskType][taskId].completed = false;
            taskDate = new Date(character[taskType][taskId].date);
            this.saveData();
          }

          if (date - taskDate >= 0) {
            return true;
          }
        }
      }
      return false;
    },
    editCharacter(characterId) {
      this.characterEditor.characterClass = "unknown";
      for(const daily of Object.values(this.characterEditor.daily)) {
        daily.interval = 1;
        daily.newInterval = 1;
        daily.date = new Date();
        daily.date.setHours(0);
        daily.date.setMinutes(0);
        daily.date.setSeconds(0);
        daily.date.setMilliseconds(0);
        daily.newDate = new Date();
        daily.newDate.setHours(0);
        daily.newDate.setMinutes(0);
        daily.newDate.setSeconds(0);
        daily.newDate.setMilliseconds(0);
        let hoursToSet = 6 + this.serverRegionData.regions[this.selectedRegion].timeZoneOffset - daily.date.getTimezoneOffset()/60;
        if (hoursToSet >= 24) {
          hoursToSet -=24;
        } else if (hoursToSet < 0) {
          hoursToSet += 24;
        }
        daily.date.setHours(hoursToSet);
        daily.date = daily.date.toJSON();
        daily.newDate.setHours(hoursToSet)
        daily.newDate = daily.newDate.toJSON();
        daily.checked = false;
      }
      for(const weekly of Object.values(this.characterEditor.weekly)) {
        weekly.interval = 1;
        weekly.newInterval = 1;
        weekly.date = new Date();
        weekly.date.setHours(0);
        weekly.date.setMinutes(0);
        weekly.date.setSeconds(0);
        weekly.date.setMilliseconds(0);
        weekly.newDate = new Date();
        weekly.newDate.setHours(0);
        weekly.newDate.setMinutes(0);
        weekly.newDate.setSeconds(0);
        weekly.newDate.setMilliseconds(0);
        let hoursToSet = 6 + this.serverRegionData.regions[this.selectedRegion].timeZoneOffset - weekly.date.getTimezoneOffset()/60;
        if (hoursToSet >= 24) {
          hoursToSet -=24;
        } else if (hoursToSet < 0) {
          hoursToSet += 24;
        }
        weekly.date.setHours(hoursToSet);
        weekly.date = weekly.date.toJSON();
        weekly.newDate.setHours(hoursToSet)
        weekly.newDate = weekly.newDate.toJSON();
        weekly.checked = false;
      }

      if (characterId) {
        this.characterEditor.characterId = this.characters[characterId].id;
        this.characterEditor.newName = this.characters[characterId].name;
        this.characterEditor.characterClass = this.characters[characterId].characterClass;
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
        for (const weeklyId of Object.keys(this.characters[characterId].weekly)) {
          const weekly = this.characters[characterId].weekly[weeklyId];
          if (weekly.checked) {
            this.characterEditor.weekly[weeklyId].interval = weekly.interval;
            this.characterEditor.weekly[weeklyId].newInterval = weekly.interval;
            this.characterEditor.weekly[weeklyId].date = weekly.date;
            this.characterEditor.weekly[weeklyId].newDate = weekly.date;
            this.characterEditor.weekly[weeklyId].checked = true;
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
      if (this.characterEditor[type][taskId].date !== this.characterEditor[type][taskId].newDate) {
        const tempDate = new Date(this.characterEditor[type][taskId].newDate);
        let extraHour = tempDate.getHours() + 6 + this.serverRegionData.regions[this.selectedRegion].timeZoneOffset;
        if (extraHour >= 24) {
          tempDate.setDate(tempDate.getDate() + 1);
          extraHour -= 24;
        }
        tempDate.setHours(extraHour);
        this.characterEditor[type][taskId].date = tempDate.toJSON();
      }
      this.$bvModal.hide('additional-config-' + taskId)
    },
    submitPortrait(event, portrait) {
      event.preventDefault();
      this.characterEditor.characterClass = portrait;
      this.$bvModal.hide('character-portrait')
    },
    submitCharacter(event) {
      var re = /^[A-Za-z0-9']{3,12}$/;
      if (!re.test(this.characterEditor.newName)) {
        return;
      }

      event.preventDefault();

      const charData = {};
      charData.name = JSON.parse(JSON.stringify(this.characterEditor.newName));
      charData.characterClass = JSON.parse(JSON.stringify(this.characterEditor.characterClass));
      charData.id = JSON.parse(JSON.stringify(this.characterEditor.characterId));
      const daily = {}
      for (const ceDaily of Object.keys(this.characterEditor.daily)) {
        if (this.characterEditor.daily[ceDaily].checked) {
          const cDaily = {}
          cDaily.interval = this.characterEditor.daily[ceDaily].interval;
          cDaily.date = this.characterEditor.daily[ceDaily].date;
          cDaily.checked = this.characterEditor.daily[ceDaily].checked;
          cDaily.completed = this.characters[charData.id] && this.characters[charData.id].daily[ceDaily] && this.characters[charData.id].daily[ceDaily].completed;
          daily[ceDaily] = cDaily;

          //add to task data
          if (!this.dailyTasks[ceDaily]) {
            this.dailyTasks[ceDaily] = {};
            this.dailyTasks[ceDaily].characters = [];
            if (this.characterEditor.daily[ceDaily].parent) {
              this.dailyTaskDraggable.push(JSON.parse(JSON.stringify(this.taskData.daily[this.characterEditor.daily[ceDaily].parent].content[ceDaily])))
            } else {
              this.dailyTaskDraggable.push(JSON.parse(JSON.stringify(this.taskData.daily[ceDaily])))
            }
          }

          if (!this.dailyTasks[ceDaily].characters.includes(charData.id)) {
            this.dailyTasks[ceDaily].characters.push(charData.id);
          }
        } else {
          if (this.characters[charData.id] && this.characters[charData.id].daily[ceDaily]) {
            const index = this.dailyTasks[ceDaily].characters.indexOf(charData.id);
            this.dailyTasks[ceDaily].characters.splice(index, 1);
            if (this.dailyTasks[ceDaily].characters.length === 0) {
              delete this.dailyTasks[ceDaily];
              for (let i = 0; i < this.dailyTaskDraggable.length; i++) {
                if (this.dailyTaskDraggable[i].id === ceDaily) {
                  this.dailyTaskDraggable.splice(i, 1);
                  break;
                }
              }
            }
          }
        }
      }
      const weekly = {}
      for (const ceWeekly of Object.keys(this.characterEditor.weekly)) {
        if (this.characterEditor.weekly[ceWeekly].checked) {
          const cWeekly = {}
          cWeekly.interval = this.characterEditor.weekly[ceWeekly].interval;
          cWeekly.date = this.characterEditor.weekly[ceWeekly].date;
          cWeekly.checked = this.characterEditor.weekly[ceWeekly].checked;
          cWeekly.completed = this.characters[charData.id] && this.characters[charData.id].weekly[ceWeekly] && this.characters[charData.id].weekly[ceWeekly].completed;
          weekly[ceWeekly] = cWeekly;

          //add to task data
          if (!this.weeklyTasks[ceWeekly]) {
            this.weeklyTasks[ceWeekly] = {};
            this.weeklyTasks[ceWeekly].characters = [];
            if (this.characterEditor.weekly[ceWeekly].parent) {
              this.weeklyTaskDraggable.push(JSON.parse(JSON.stringify(this.taskData.weekly[this.characterEditor.weekly[ceWeekly].parent].content[ceWeekly])))
            } else {
              this.weeklyTaskDraggable.push(JSON.parse(JSON.stringify(this.taskData.weekly[ceWeekly])))
            }
          }

          if (!this.weeklyTasks[ceWeekly].characters.includes(charData.id)) {
            this.weeklyTasks[ceWeekly].characters.push(charData.id);
          }
        } else {
          if (this.characters[charData.id] && this.characters[charData.id].weekly[ceWeekly]) {
            const index = this.weeklyTasks[ceWeekly].characters.indexOf(charData.id);
            this.weeklyTasks[ceWeekly].characters.splice(index, 1);
            if (this.weeklyTasks[ceWeekly].characters.length === 0) {
              delete this.weeklyTasks[ceWeekly];
              for (let i = 0; i < this.weeklyTaskDraggable.length; i++) {
                if (this.weeklyTaskDraggable[i].id === ceWeekly) {
                  this.weeklyTaskDraggable.splice(i, 1);
                  break;
                }
              }
            }
          }
        }
      }
      charData.daily = JSON.parse(JSON.stringify(daily));
      charData.weekly = JSON.parse(JSON.stringify(weekly));
      this.characters[charData.id] = charData;
      this.$bvModal.hide('character-editor');
      this.saveData();
      this.$forceUpdate();
    },
    changeRegion(region) {
      for (const character of Object.values(this.characters)) {
        for (const daily of Object.values(character.daily)) {

          const temp = new Date(daily.date);
          let tempHours = temp.getHours() + this.serverRegionData.regions[region].timeZoneOffset - this.serverRegionData.regions[this.selectedRegion].timeZoneOffset;
          if (tempHours >= 24) {
            temp.setDate(temp.getDate() + 1);
            tempHours -=24;
          } else if (tempHours < 0) {
            temp.setDate(temp.getDate() - 1);

            tempHours += 24;
          }
          temp.setHours(tempHours);
          daily.date = temp.toJSON();
        }

        for (const weekly of Object.values(character.weekly)) {

          const temp = new Date(weekly.date);
          let tempHours = temp.getHours() + this.serverRegionData.regions[region].timeZoneOffset - this.serverRegionData.regions[this.selectedRegion].timeZoneOffset;
          if (tempHours >= 24) {
            temp.setDate(temp.getDate() + 1);
            tempHours -=24;
          } else if (tempHours < 0) {
            temp.setDate(temp.getDate() - 1);

            tempHours += 24;
          }
          temp.setHours(tempHours);
          weekly.date = temp.toJSON();
        }
      }
      this.selectedRegion = region;
      this.saveData();
    },
    saveData() {
      localStorage.setItem('task_Characters', JSON.stringify(this.characters));
      localStorage.setItem('selectedRegion', JSON.stringify(this.selectedRegion));
      localStorage.setItem('task_DailyTasks', JSON.stringify(this.dailyTasks));
      localStorage.setItem('task_WeeklyTasks', JSON.stringify(this.weeklyTasks));
      localStorage.setItem('task_DailyTaskDraggable', JSON.stringify(this.dailyTaskDraggable));
      localStorage.setItem('task_WeeklyTaskDraggable', JSON.stringify(this.weeklyTaskDraggable));
    },
    async importData() {
      this.taskData = JSON.parse(JSON.stringify(await import("@/assets/data/tasks/tasks.json")));
      this.characterData = JSON.parse(JSON.stringify(await import("@/assets/data/characters/characterInfo.json")));
      this.serverRegionData = JSON.parse(JSON.stringify(await import("@/assets/data/regions/regions.json")));
      this.dataReady = true;
      this.characters = JSON.parse(localStorage.getItem('task_Characters')) || {};
      this.selectedRegion = JSON.parse(localStorage.getItem('selectedRegion')) || 'na-west';
      this.dailyTasks = JSON.parse(localStorage.getItem('task_DailyTasks')) || {};
      this.dailyTaskDraggable = JSON.parse(localStorage.getItem('task_DailyTaskDraggable')) || [];
      this.weeklyTaskDraggable = JSON.parse(localStorage.getItem('task_WeeklyTaskDraggable')) || [];
      this.weeklyTasks = JSON.parse(localStorage.getItem('task_WeeklyTasks')) || {};
      this.displayMode = JSON.parse(localStorage.getItem('task_DisplayMode')) || 0;
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
/* unvisited link */
a:link {
  color: white;
}

/* visited link */
a:visited {
  color: white;
}

/* mouse over link */
a:hover {
  color: white;
}

/* selected link */
a:active {
  color: white;
}

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