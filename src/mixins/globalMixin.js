import Vue from 'vue'

Vue.mixin({
    methods: {
        changeMap(mapId, markerId) {
            this.$router.push({query: {m: mapId, c: markerId}}).catch(()=>{});
        }
    }
})