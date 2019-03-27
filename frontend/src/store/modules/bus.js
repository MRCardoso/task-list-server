import Vue from 'vue'
const bus = new Vue()

export default {
    actions: {
        busNotifyLoading(state, payload) {
            bus.$emit("AppLoading", payload)
        },
        busListenLoading(state, payload) {
            bus.$on("AppLoading", payload)
        },
        busNotifyDialog(state, payload) {
            bus.$emit("AppDialog", payload)
        },
        busListenDialog(state, payload) {
            bus.$on("AppDialog", payload)
        },
    }
}