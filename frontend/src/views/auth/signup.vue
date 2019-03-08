<template>
    <task-app-form-item title="Criar Conta" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field prepend-icon="fa fa-user" label="name" type="text" v-model="user.name" :error-messages="rules.name"/>
            <v-text-field prepend-icon="fa fa-user" label="username" type="text" v-model="user.username" :error-messages="rules.username"/>
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :error-messages="rules.email"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-text-field prepend-icon="lock" label="confirmation" type="password" v-model="user.confirmation" :error-messages="rules.confirmation"/>
        </template>
        <template slot="buttons">
            <v-btn class="my-blue darken-1 white--text" @click.prevent="signup">Criar Conta</v-btn>
            <v-btn to="/signin">Fazer Login</v-btn>
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
            user: {},
            rules: {}
        }
    },
    methods: {
        signup(){
            this.$store.dispatch('createAccount', this.user).then(() => {
                this.$toasted.global.defaultSuccess({message: "Conta criada com sucesso"})
                this.$router.push("/")
            }).catch(err => prepareError(err, this));
        }
    },
}
</script>