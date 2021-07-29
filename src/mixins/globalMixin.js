import Vue from 'vue'

Vue.mixin({
    methods: {
        changeMap(mapId, markerId, indexId) {
            this.$router.push({query: {m: mapId, c: markerId, i: indexId}}).catch(()=>{});
        }
    }
})