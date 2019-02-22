<template>
    <v-toolbar dark color="#6E9FDD" app>
        <v-toolbar-title class="headline text-uppercase mr-4">
            <router-link to="/">
                <img src="@/assets/logo-banner-3.gif" alt="Banner" width="100" />
            </router-link>
        </v-toolbar-title>
        

        <v-toolbar-items v-if="user" class="hidden-sm-and-down">
            <v-btn flat to="/tasks">Tarefa</v-btn>
            <v-btn flat to="/users">Usuário</v-btn>
        </v-toolbar-items>

        <v-toolbar-items v-else class="hidden-sm-and-down">
            <v-btn flat to="/signup">Criar Conta</v-btn>
            <v-btn flat to="/signin">Login</v-btn>
        </v-toolbar-items>
        
        <v-spacer></v-spacer>

        <v-menu transition="slide-x-transition" v-if="user">
            <v-toolbar-title slot="activator">
                <div class="auth-box">
                    <span>{{user.username}}</span>
                    <img src="@/assets/icon.png" alt="Banner" />
                </div>
                <!-- <v-icon dark>more_vert</v-icon> -->
            </v-toolbar-title>
            <v-list>
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

export default {
    computed: {
		user(){
            return this.$store.state.auth.user;
        }
    },
    methods: {
        logout(){
            this.$store.commit('addUser', null)
            this.$router.push("/")
        }
    },
}
</script>
<style>
    .auth-box{
        display: inline;
    }
    .auth-box img{
        float: right;
        width: 40px;
        border: 1px solid rgba(85, 85, 85, 0.6);
        border-radius: 20px;
    }
</style>
