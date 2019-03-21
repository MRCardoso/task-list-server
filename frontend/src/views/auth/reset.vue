<template>
    <task-app-form-item title="Restaurar Senha" path="/signin" :inlineButtons="false" inputClass="ml-4 mr-4 mt-1">
        <template slot="inputs">
            <!-- <task-app-sheeting v-if="expiredToken" :elevation="6" color="red" class="mb-3" :message="expiresMessage"/> -->
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-text-field prepend-icon="lock" label="confirmation" type="password" v-model="user.confirmation" :error-messages="rules.confirmation"/>
        </template>
        <template slot="buttons">
            <a @click.prevent="reset" class="mbtn mbtn-blue">Restaurar Senha</a>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppSheeting from '@/components/Sheeting.vue'
import { prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormItem, TaskAppSheeting},
    props: ['token'],
    data(){
        return {
            user: {},
            rules: {},
        }
    },
    methods: {
        reset(){
            this.rules = {}
            this.$store.dispatch('busNotifyLoading', true)
            this.$store.dispatch('reset', {token: this.token, user: this.user})
                .then(() => {
                    this.$toasted.global.defaultSuccess({message: "Senha atualizada com sucesso"})
                    this.$router.push("/")
                })
                .catch(err => prepareError(err,this))
                .finally(() => this.$store.dispatch('busNotifyLoading', false))
        }
    }
}
</script>