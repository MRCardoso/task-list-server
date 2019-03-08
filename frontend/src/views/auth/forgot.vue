<template>
    <task-app-form-item title="E-mail para Restaurar Senha" path="/signin" :inlineButtons="false" inputClass="ml-4 mr-4 mt-1">
        <template slot="inputs">
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="email" :error-messages="rules.email"/>
        </template>
        <template slot="buttons">
            <v-btn @click="forgot" class="my-blue darken-1 white--text">Enviar token</v-btn>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import { prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormItem},
    data(){
        return {
            email: '',
            rules: {}
        }
    },
    methods: {
        forgot(){
            this.rules = {}
            this.$store.dispatch('busNotifyLoading', true)
            this.$http
                .post(`api/forgot`, {email: this.email})
                .then(() => {
                    this.$toasted.global.defaultSuccess({message: "E-mail encaminhado com sucesso"})
                    this.$router.push("/")
                })
                .catch(err => prepareError(err,this))
                .finally(() => this.$store.dispatch('busNotifyLoading', false))
        }
    },
}
</script>