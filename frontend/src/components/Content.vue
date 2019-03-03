<template>
    <v-content>
        <v-container>
            <transition name="fade" mode="out-in">
                <router-view />
            </transition>
        </v-container>
    </v-content>
</template>

<script>

export default {
    name: "Content",
    computed: {
        user(){
            return this.$store.getters.leggeding
        }
    },
}
</script>
