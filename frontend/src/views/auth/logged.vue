<template>
    <task-app-form-item title="Alterar Dados" :inlineButtons="false">
        <template slot="inputs">
            <task-app-toggle-status :item="user" :rule="rules" />
            <v-text-field prepend-icon="fa fa-user" label="name" type="text" v-model="user.name" :counter="80" :error-messages="rules.name"/>
            <v-text-field prepend-icon="fa fa-user" label="username" type="text" v-model="user.username" :counter="80" :error-messages="rules.username"/>
            <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :counter="120" :error-messages="rules.email"/>
            <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
            <v-text-field prepend-icon="lock" label="confirmation" type="password" v-model="user.confirmation" :error-messages="rules.confirmation"/>
        </template>
        <template slot="buttons">
            <v-btn class="my-blue darken-1 white--text" @click.prevent="save">Salvar</v-btn>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppToggleStatus from '@/components/ToggleStatus.vue'
import TaskAppFormItem from '@/components/FormItem.vue'
export default {
    components: {TaskAppToggleStatus, TaskAppFormItem},
    data(){
        return {
            user: {},
            rules: {}
        }
    },
    methods: {
        save(){
            this.$http.put(`users/${this.user.id}`, this.user).then(
                id => this.$toasted.global.defaultSuccess({message: "Dados atualizados com sucesso"}),
                err => this.rules = prepareError(err)
            );
        },
        loadUser(){
            let user = this.$store.state.auth.user;
            if(user){
                this.$http.get(`users/${user.id}`).then(
                    res => this.user = res.data, 
                    err => this.$toasted.global.defaultError({message: prepareError(err)})
                )

            }
        }
    },
    created(){
        this.loadUser()
    }
}
</script>