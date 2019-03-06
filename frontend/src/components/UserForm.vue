<template>
    <task-app-form-item :title="title" :path="indexRouteMode" :inlineButtons="isChangesMode()" inputClass>
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
                        <task-app-file-uploader :image="user.image" @detachImage="removeImage" />
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </template>
        <template slot="buttons">
            <template v-if="isChangesMode()">
                <v-spacer></v-spacer>
                <v-btn :to="indexRoute">Voltar</v-btn>
                <v-btn v-if="id" class="blue lighten-3 white--text" :to="`${indexRoute}/${id}/detail`">Visualizar</v-btn>
            </template>
                
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
    props: [
        'id', 
        'mode' /* logged, changes */
    ],
    data() {
        return {
            user: {},
            rules: {},
            indexRoute: '/users'
        }
    },
    computed: {
        indexRouteMode(){
            return this.mode == 'changes' ? this.indexRoute : null
        },
        title(){
            if(this.isLoggedMode())
                return "Alterar Dados"
            return this.id ? 'Atualizar Usuário' : 'Criar Usuário'
        },
        logged(){
            return this.$store.state.auth.user;
        },
    },
    methods: {
        isLoggedMode(){
            return this.mode == 'logged'
        },
        isChangesMode(){
            return this.mode == 'changes'
        },
        removeImage(){
            if(this.user.image){
                this.$store.commit('removeUploadedFile', [this.user.image])
                this.user.image = false
            }
        },
        save(){
            let method = this.id ? 'put' : 'post'
            let endpoint = `users`+(this.id ? `/${this.id}` : '')

            this.$store.dispatch('busNotifyLoading', true)
            
            this.$http[method](endpoint, this.user)
            .then(res => {
                let savedId = (this.id ? this.id : res.data.id)
                this.$store.dispatch('sendFile', savedId)
                .then(image => {
                    this.$toasted.global.defaultSuccess({message: `Usuário ao ${this.id ? 'atualizada' : 'criada'} com sucesso`})
                    this.$store.dispatch('busNotifyLoading', false)
                    
                    if(image != null){
                        this.user.image = image
                        this.$store.commit('refrashImage', {id: savedId, image})
                    }
                    
                    if(this.isChangesMode()){
                        this.$router.push(`/users/${savedId}/detail`)
                    }
                })
                .catch(err => {
                    prepareError(err, this)
                    this.$store.dispatch('busNotifyLoading', false)
                })
            })
            .catch(err => {
                prepareError(err, this)
                this.$store.dispatch('busNotifyLoading', false)
            });
        },
        find(){
            if(this.id){
                this.$http.get(`users/${this.id}`)
                    .then(res => this.user = res.data)
                    .catch(err => prepareError(err, this))
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