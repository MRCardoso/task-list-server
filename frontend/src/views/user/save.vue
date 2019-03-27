<template>
    <task-app-user-form :id="id" mode="changes" />
</template>

<script>
import TaskAppUserForm from '@/components/UserForm.vue'

export default {
    props: ['id'],
    components: { TaskAppUserForm }
}
</script>