import Vue from 'vue'

Vue.mixin({
    methods: {
        changeMap(mapId, markerId) {
            let closeButton = document.getElementsByClassName("leaflet-popup-close-button")[0];
            if (closeButton) {
                closeButton.click()
            }
            this.$router.push({query: {m: mapId, c: markerId}}).catch(()=>{});
        }
    }
})