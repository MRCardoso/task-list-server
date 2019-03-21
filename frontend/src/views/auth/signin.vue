<template>
    <task-app-form-item title="Acessar Conta" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field prepend-icon="person" label="Usuário" type="text" v-model="user.username" :error-messages="rules.username"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-switch v-model="user.keepLogin" label="Manter Login"></v-switch>
        </template>
        <template slot="buttons">
            <a @click.prevent="signin" class="mbtn mbtn-blue">Acessar</a>

            <div class="mt-2 signin-item">
                <router-link to="/forgot" class="blue--text darken-5">Esqueceu a senha?</router-link>
            </div>
            <div class="signin-item">
                Novo por aqui?
                <router-link to="/signup" class="pl-1 blue--text darken-5">Crie uma conta</router-link>
            </div>
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
            this.rules = {}
            this.$store.dispatch('login', this.user).then(res => {
                this.$store.commit("addUser", res.data)
                this.$toasted.global.defaultSuccess({message: "Login realizado com sucesso"})
                this.$router.push("/")
            }).catch(err => prepareError(err,this))
        }
    },
}
</script>
<style>
.signin-item{
    display: flex;
    justify-content: center;
    padding: 8px;
    border:1px solid #E2E2E2;
    margin-bottom: 6px;
    border-radius: 4px;
    text-align: center
}
.signin-item:hover{
    background: #F4F4F4
}
</style>
