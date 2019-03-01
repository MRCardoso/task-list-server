<template>
    <task-app-form-item title="Acessar Conta" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :error-messages="rules.email"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-switch v-model="user.keepLogin" label="Manter Login"></v-switch>
        </template>
        <template slot="buttons">
            <v-btn @click="signin" class="my-blue darken-1 white--text">Login</v-btn>
            <v-btn to="/signup">Criar Conta</v-btn>
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
            let { name, version } = browserData()
            this.$http.post(`signin?PlatformName=${name}&PlatformVersion=${version}`, this.user).then(
                res => {
                    this.$store.commit("addUser", res.data)
                    this.$toasted.global.defaultSuccess({message: "Login realizado com sucesso"})
                    this.$router.push("/")
                },
                err => {
                    let e = prepareError(err)
                    if(typeof e === "string")
                        this.$toasted.global.defaultError({message: e})
                    else
                        this.rules = e
                }
            );
        }
    },
}
</script>