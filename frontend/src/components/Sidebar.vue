<template>
    <v-toolbar dark color="#6E9FDD" app height="45px">
        <v-toolbar-title class="headline text-uppercase mr-4">
            <router-link to="/">
                <img v-bind:src="logoApp" alt="Banner" width="80" />
            </router-link>
        </v-toolbar-title>
        
        <v-toolbar-items v-if="user">
            <v-btn flat to="/users" v-if="user.admin">Usuário</v-btn>
            <v-btn flat to="/tasks">Tarefa</v-btn>
        </v-toolbar-items>

        <v-toolbar-items v-else>
            <v-btn flat to="/signup">Criar Conta</v-btn>
            <v-btn flat to="/signin">Login</v-btn>
        </v-toolbar-items>
        
        <v-spacer></v-spacer>

        <v-menu transition="slide-x-transition" v-if="user">
            <v-toolbar-title slot="activator">
                <div class="auth-box">
                    <img v-if="logo" :src="logo" alt="User logo" />
                    <img v-else src="@/assets/profile.png" alt="Logo" />
                    <i class="fa fa-caret-down"></i>
                </div>
            </v-toolbar-title>
            <v-list>
                <div class="auth-box-detail">
                    <strong>{{user.username}}</strong>
                    <i>
                        Sessão expira em:
                        {{new Date(user.authToken.exp*1000) | moment('DD/MM/YY HH:mm')}}
                    </i>
                </div>
                <v-divider></v-divider>
                <v-list-tile to="/logged">
                    <v-list-tile-title>Meus Dados</v-list-tile-title>
                </v-list-tile>
                
                <v-list-tile @click.prevent="logout">
                    <v-list-tile-title>Sair</v-list-tile-title>
                </v-list-tile>
            </v-list>
      </v-menu>
    </v-toolbar>
</template>

<script>
import { prepareError } from '@/utils/index'

export default {
    computed: {
		user(){
            return this.$store.state.auth.user;
        },
        logo(){
            let user = this.$store.state.auth.user
            if(user.image){
                return user.image.url
            }
            return null
        },
        logoApp(){
            return require("@/assets/logo-banner-3.gif")+`?hashTime=${this.$store.state.hashTime}`
        }
    },
    methods: {
        logout(){
            this.$store.dispatch("logout").then(() => {
                this.$store.commit('addUser', null)
                this.$router.push("/")
            }).catch(err => prepareError(err,this))
        }
    },
}
</script>
<style>
.auth-box{
    display: flex;
    justify-content: center;
    justify-items: center;
}
.auth-box img{
    margin: 0 !important;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(85, 85, 85, 0.6);
    border-radius: 20px;
}
.auth-box-detail{
    display: flex;
    padding: 0 8px 8px 8px;
    flex-direction: column;
    justify-content: center;
    justify-items: flex-start;
}
.auth-box-detail span{
    display: flex;
    justify-content: flex-end;
    justify-self: flex-start;
}
.auth-box-detail i{
    display: flex;
    align-self: flex-end;
    justify-self: flex-end;
    font-size: 10px;
}
</style>
