<template>
    <v-content>
        <v-container>
            <task-app-notify />
            <router-view />
        </v-container>
    </v-content>
</template>

<script>
import TaskAppNotify from '@/components/Notification/Notify.vue'
export default {
    name: "Content",
    components: { TaskAppNotify },
    computed: {
        user(){
            return this.$store.getters.leggeding
        }
    },
}
</script>
