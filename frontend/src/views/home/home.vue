<template>
    <div class="home">
        <task-app-authenticate v-if="user" />
        <task-app-visitant v-else />
    </div>
</template>

<script>
import TaskAppVisitant from '@/views/home/visitant.vue'
import TaskAppAuthenticate from '@/views/home/authenticate.vue'
export default {
    components: { TaskAppVisitant, TaskAppAuthenticate },
    computed: {
        user(){
            return this.$store.getters.leggeding
        }
    },
}
</script>

<style>
</style>