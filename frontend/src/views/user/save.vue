<template>
    <task-app-form-item :title="title" :path="indexRoute" inputClass>
        <template slot="inputs">
            <v-tabs fixed-tabs>
                <v-tab ripple>Dados Iniciais</v-tab>
                <v-tab ripple>Adicionar Imagem</v-tab>
                
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <task-app-toggle-status :item="user" :rule="rules" />
                        <v-switch v-if="logged.admin" v-model="user.admin" label="Administrador"></v-switch>
                        <v-text-field prepend-icon="fa fa-user" label="name" type="text" v-model="user.name" :counter="80" :error-messages="rules.name"/>
                        <v-text-field prepend-icon="fa fa-user" label="username" type="text" v-model="user.username" :counter="80" :error-messages="rules.username"/>
                        <v-text-field prepend-icon="fa fa-at" label="E-mail" type="text" v-model="user.email" :counter="120" :error-messages="rules.email"/>
                        <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
                        <v-text-field prepend-icon="lock" label="confirmation" type="password" v-model="user.confirmation" :error-messages="rules.confirmation"/>
                    </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <task-app-file-uploader :images="user.images" @detachImage="removeImage" />
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </template>
        <template slot="buttons">
            <v-spacer></v-spacer>
            <v-btn :to="indexRoute">Voltar</v-btn>
            <v-btn v-if="id" class="blue lighten-3 white--text" :to="`${indexRoute}/${id}/detail`">Visualizar</v-btn>
            <v-btn class="my-blue darken-1 white--text" @click.prevent="save">Salvar</v-btn>
        </template>
    </task-app-form-item>
</template>
<script>

import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppFileUploader from '@/components/FileUploader.vue'
import TaskAppToggleStatus from '@/components/ToggleStatus.vue'
import { prepareError } from '@/utils/index'

export default {
    components: { TaskAppFormItem, TaskAppToggleStatus, TaskAppFileUploader },
    props: ['id'],
    data() {
        return {
            step: 0,
            user: {},
            rules: {},
            indexRoute: '/users'
        }
    },
    computed: {
        title(){
            return this.id ? 'Atualizar Usuário' : 'Criar Usuário'
        },
        logged(){
            return this.$store.state.auth.user;
        },
    },
    methods: {
        removeImage(){
            if(Array.isArray(this.user.images) && this.user.images.length > 0)
            {
                let Keys = this.user.images.map(e => e)
                this.$store.dispatch('busNotifyLoading', true)
                this.$store.dispatch('deleteFile', {id: this.id, Keys: Keys})
                .then(() => this.user.images = false)
                .catch(err => this.$toasted.global.defaultError({message: prepareError(err)}))
                .finally(() => this.$store.dispatch('busNotifyLoading', false))
            }
        },
        save(){
            let method = this.id ? 'put' : 'post'
            let endpoint = `users`+(this.id ? `/${this.id}` : '')

            this.$store.dispatch('busNotifyLoading', true)

            this.$http[method](endpoint, this.user)
            .then(
                res => {
                    this.$store.dispatch('sendFile', (this.id ? this.id : res.data.id))
                    .then(() => {
                        this.$toasted.global.defaultSuccess({message: `Usuário ao ${this.id ? 'atualizada' : 'criada'} com sucesso`})
                        this.$store.dispatch('busNotifyLoading', false)
                        this.$router.push('/users')
                    }, err => {
                        this.rules = prepareError(err)
                        this.$store.dispatch('busNotifyLoading', false)
                    })
                },
                err => {
                    this.rules = prepareError(err)
                    this.$store.dispatch('busNotifyLoading', false)
                }
            );
        },
        find(){
            if(this.id){
                this.$http.get(`users/${this.id}`).then(
                    res => this.user = res.data,
                    err => this.$toasted.global.defaultError({message: prepareError(err)})
                )
            } else{
                this.user = { status: 1 }
            }
        }
    },
    created(){
        this.find()
    }
}
</script>