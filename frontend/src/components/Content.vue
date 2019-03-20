<template>
    <transition name="fade" mode="out-in">
        <router-view />
    </transition>
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
