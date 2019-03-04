<template>
    <task-app-form-item title="Acessar Conta" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :error-messages="rules.email"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-switch v-model="user.keepLogin" label="Manter Login"></v-switch>
        </template>
        <template slot="buttons">
            <v-btn @click="signin" class="my-blue darken-1 white--text">Acessar</v-btn>

            <div class="mr-2 ml-2">
                <div class="signin-item">
                    <router-link to="/forgot" class="blue--text darken-5">Esqueceu a senha?</router-link>
                </div>
                <div class="signin-item">
                    Novo por aqui?
                    <router-link to="/signup" class="pl-1 blue--text darken-5">Crie uma conta</router-link>
                </div>
            </div>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import { prepareError, browserData } from '@/utils/index'

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
            let { name, version } = browserData()
            this.$http
                .post(`signin?PlatformName=${name}&PlatformVersion=${version}`, this.user)
                .then(res => {
                    this.$store.commit("addUser", res.data)
                    this.$toasted.global.defaultSuccess({message: "Login realizado com sucesso"})
                    this.$router.push("/")
                })
                .catch(err => prepareError(err,this))
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
