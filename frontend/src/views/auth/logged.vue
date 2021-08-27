<template>
    <task-app-user-form :id="user.id" mode="logged" />
</template>

<script>
import TaskAppUserForm from '@/components/UserForm.vue'

export default {
    components: { TaskAppUserForm },
    computed: {
        user(){
            return this.$store.state.auth.user;
        }
    }
}
</script>