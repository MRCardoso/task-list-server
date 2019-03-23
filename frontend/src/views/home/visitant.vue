<template>
    <div class="visitant-container">
        <div class="visitant-text">
            <h1>Controle as tarefas do dia-a-dia</h1>
            <p>
                Gerencie suas atividades e organize-as conforme suas prioridades
                crie uma conta e mantenha sincronizados suas tarefas
                seja pelo aplicativo mobile ou web
                Trabalhe offline pelo applicativo e sincronize quando for conveniente
            </p>
            <div class="flex-row" v-if="false">
                <v-btn class="green white--text">
                    <img src="@/assets/icon.png" alt="" width="40" class="pr-2">
                    Baixe o applicativo
                </v-btn>
            </div>
        </div>
        <div class="visitant-login" v-if="showForm">
            <v-text-field label="Usuário" type="text" v-model="user.username" :error-messages="rules.username"/>
            <v-text-field label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-switch v-model="user.keepLogin" label="Manter Login"></v-switch>
            <a @click.prevent="signin" class="mbtn mbtn-blue">Fazer login</a>
            
            <div class="visitant-links">
                <router-link to="/forgot" class="blue--text darken-5">Esqueceu a senha?</router-link>
                <router-link to="/signup" class="pl-1 blue--text darken-5">Crie uma conta</router-link>
            </div>
        </div>
        <router-link v-else to="/signin" class="mbtn mbtn-blue">Fazer login</router-link>
    </div>
</template>

<script>
import { prepareError } from '@/utils/index'

export default {
    data() {
        return {
            user: {},
            rules: {},
            showForm: true,
        }
    },
    methods: {
        handleResize() {
            this.showForm = (window.innerWidth > 620);
        },
        signin(){
            this.rules = {}
            this.$store.dispatch('login', this.user).then(res => {
                this.$store.commit("addUser", res.data)
                this.$toasted.global.defaultSuccess({message: "Login realizado com sucesso"})
                this.$router.push("/")
            }).catch(err => prepareError(err,this))
        }
    },
    created() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize)
    },
}
</script>

<style>
.visitant-container{
    padding: 70px;
    display: flex;
    justify-content: center;
    background: #2D2D2D url('../../assets/logo-floor-40.png');
    /* 1990FF */
    background-repeat: no-repeat;
    background-size: 40%;
    background-position: left center;
    height: 100vh;
    /* animation: slidebg 6s ease-out infinite */
}
.visitant-text{
    display: flex;
    width: 60%;
    flex-direction: column;
    padding-right: 5%;
    color: rgb(212, 224, 228);
}
.visitant-text h1{
    font-size: 36px;
}
.visitant-text p{
    font-size: 18px;
}
.visitant-login{
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #FFF;
    padding: 2%;
    width: 40%;
    height: 340px;
    box-shadow: 0 0 6px #000;
}
.visitant-links{
    display: flex;
    justify-content: space-between;
}
@keyframes slidebg {
    40%{
        background-color: #1990FF;
        background-image: url('../../assets/logo-label.png');
    }
    80%{
        background-color: #2D2D2F;
        background-image: url('../../assets/logo-floor-40.png');
    }
}

@media (max-width: 720px) {
    .visitant-container{
        flex-direction: column;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
    }
    .visitant-login{
        width: 80%;
        padding: 4%;
        justify-content: center;
    }
    .visitant-text{
        width: 100%;
        align-items: center;
        text-align: center;
    }
}
</style>
