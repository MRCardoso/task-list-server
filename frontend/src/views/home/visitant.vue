<template>
    <div class="visitant-container">
        <div class="visitant-text">
            <img src="@/assets/logo-label.png" width="360">
            <h1>Controle as tarefas do dia-a-dia</h1>
            <span>Gerencie suas atividades e organize-as conforme suas prioridades</span>
            <span>crie uma conta e mantenha sincronizados suas tarefas</span>
            <span>seja pelo aplicativo mobile ou web</span>
            <span>Trabalhe offline pelo applicativo e sincronize quando for conveniente</span>
        </div>
        <div class="visitant-login">
            <v-text-field label="Usuário" type="text" v-model="user.username" :error-messages="rules.username"/>
            <v-text-field label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-switch v-model="user.keepLogin" label="Manter Login"></v-switch>
            <v-btn @click="signin" class="my-blue darken-1 white--text">Fazer login</v-btn>
            <div class="visitant-links">
                <router-link to="/forgot" class="blue--text darken-5">Esqueceu a senha?</router-link>
                <router-link to="/signup" class="pl-1 blue--text darken-5">Crie uma conta</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import { prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormItem},
    data() {
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
.visitant-container{
    padding-top: 70px;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    justify-content: center;
    background: #2D2D2F url('../../assets/logo-floor-40.png'); 
    /* 1990FF */
    background-repeat: no-repeat;
    background-size: 40%;
    background-position-y: bottom;
    height: 450px;
}
.visitant-text{
    display: flex;
    flex-direction: column;
    align-self: center;
    padding-right: 5%;
    color: rgb(212, 224, 228);
}
.visitant-text h1{
    font-size: 36px;
}
.visitant-text span{
    font-size: 18px;
}
.visitant-login{
    display: flex;
    flex-direction: column;
    background: #FFF;
    padding: 1%;
    width: 30%;
    height: 340px;
    box-shadow: 0 0 6px #000;
}
.visitant-links{
    display: flex;
    justify-content: space-between;
}
</style>
