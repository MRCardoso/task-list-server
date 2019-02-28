<template>
    <v-content>
        <v-container>
            <router-view />
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
