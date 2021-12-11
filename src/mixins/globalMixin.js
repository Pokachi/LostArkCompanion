import Vue from 'vue'

Vue.mixin({
    methods: {
        changeMap(mapId, markerId, indexId) {
            this.$router.push({query: {m: mapId, c: markerId, i: indexId}}).catch(()=>{});
        },
        uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        //collectibles
        updateCollectible(type, id, state, continentId, location) {
            let playerCollectibles = JSON.parse(localStorage.getItem(type + '_collectibles'));

            if (!playerCollectibles) {
                playerCollectibles = {};
                playerCollectibles.c = 0;
            }

            if (continentId && !playerCollectibles[continentId]) {
                playerCollectibles[continentId] = {};
                playerCollectibles[continentId].c = 0;
            }

            playerCollectibles[continentId][id] = state;

            if (state) {
                playerCollectibles.c++;
                if (continentId) {
                    playerCollectibles[continentId].c++;
                }
            } else {
                playerCollectibles.c--;
                if (continentId) {
                    playerCollectibles[continentId].c--;
                }
            }

            localStorage.setItem(type + '_collectibles', JSON.stringify(playerCollectibles));

            if (location) {
               this.updateMap(location, type, id, state);
            }
        },

        //map
        updateMap(location, type, id, state) {
            let mapData = JSON.parse(localStorage.getItem(location + '_map'));

            if (!mapData) {
                mapData = {};
            }

            if (!mapData[type]) {
                mapData[type] = {};
                mapData[type].c = 0;
                mapData[type].h = false;
            }
            mapData[type][id] = state;
            if (state) {
                mapData[type].c++;
            } else {
                mapData[type].c--;
            }

            this.$forceUpdate();
            localStorage.setItem(location + '_map', JSON.stringify(mapData));
        }
    }
})