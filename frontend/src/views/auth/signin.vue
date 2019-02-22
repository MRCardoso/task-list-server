<template>
    <task-app-form-item title="Acessar Conta" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :error-messages="rules.email"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
        </template>
        <template slot="buttons">
            <v-btn @click="signin" class="my-blue darken-1 white--text">Login</v-btn>
            <v-btn to="/signup">Criar Conta</v-btn>
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
        signin(){
            this.$http.post("signin", this.user).then(
                res => {
                    this.$store.commit("addUser", res.data)
                    this.$toasted.global.defaultSuccess({message: "Login realizado com sucesso"})
                    this.$router.push("/")
                },
                err => this.rules = prepareError(err)
            );
        }
    },
}
</script>