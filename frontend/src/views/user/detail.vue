<template>
    <div>
        <task-app-modal :dialog="dialog" @confirmDialog="deleteItem" title="Deletar Usuário" content="Deseja realmente remover este registro?" />
    
        <task-app-form-item title="Detalhes do Usuário" :path="indexRoute" inputClass="mt-4 mb-2 ml-4 mr-4">
            <template slot="inputs">
                <div v-if="hasImage" class="flex-row" :class="classStatus">
                    <img class="image-container" :src="user.image.url" />
                </div>
                <v-expansion-panel v-model="panel" expand>
                    <v-expansion-panel-content key="user-data">
                        <div slot="header"><h3>Dados</h3></div>
                        
                        <table class="table">
                            <tr>
                                <th>Nome</th>
                                <td>{{user.name}}</td>
                            </tr>
                            <tr>
                                <th>Usuário</th>
                                <td>{{user.username}}</td>
                            </tr>
                            <tr>
                                <th>E-mail</th>
                                <td>{{user.email}}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td><task-app-formatter-value title="Status" :value="user.status" :data="statusData"/></td>
                            </tr>
                        </table>
                    </v-expansion-panel-content>

                    <v-expansion-panel-content key="api-data" v-if="hasApis()">
                        <div slot="header"><h3>Apis registradas</h3></div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Versão</th>
                                    <th>Plataforma</th>
                                    <th>Expiração</th>
                                    <th>Criado</th>
                                    <th align="center">Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="api in user.apis" :key="api.id" :class="{'green lighten-2 white--text': isLoogedApi(api.id)}">
                                    <td><strong>{{api.name}}</strong></td>
                                    <td>{{api.version}}</td>
                                    <td>{{api.platform == 1 ? "web" : (api.platform==2 ? 'mobile' : 'outros') }}</td>
                                    <td>{{new Date(api.expires) | moment('DD/MM/YY HH:mm:ss')}}</td>
                                    <td>{{api.created_at | moment('DD/MM/YY HH:mm:ss')}}</td>
                                    <td align="center">
                                        <v-icon class="red--text" small @click="openConfirmation(api.id)">delete</v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </template>
            <template slot="buttons">
                <div class="flex-down" v-if="user.created_at">
                    Criado em {{ user.created_at | moment("DD(dddd), MM, YYYY") }}
                </div>
                <v-spacer></v-spacer>
                <router-link :to="`${indexRoute}/${id}/edit`" class="mbtn mbtn-sht mbtn-blue-light mr-2">Editar</router-link>
                <router-link :to="`${indexRoute}/new`" class="mbtn mbtn-sht mbtn-blue">Novo</router-link>
            </template>
        </task-app-form-item>
    </div>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import TaskAppModal from '@/components/Modal.vue'
import { statusData, prepareError } from '@/utils/index'
export default {
    components: {TaskAppFormItem, TaskAppFormatterValue, TaskAppModal},
    props: ['id'],
    computed: {
        hasImage(){
            return this.user.image ? true : false
        },
        classStatus(){
            return {
                'green darken-2': this.user.status,
                'grey': !this.user.status,
            }
        }
    },
    data() {
        return {
            user: {},
            indexRoute: '/users',
            statusData,
            panel: [true, false],
            dialog: false,
            deletedId: null
        }
    },
    methods: {
        isLoogedApi(id){
            return this.$store.state.auth.user.authToken.apiId == id
        },
        hasApis(){
            return Array.isArray(this.user.apis) && this.user.apis.length > 0
        },
        openConfirmation(id){
            this.dialog = true
            this.deletedId = id
        },
        async deleteItem(remove){
            if(remove && this.deletedId){
                let forceLogout = await this.$store.dispatch("removedToken", {id: this.user.id, apiId: this.deletedId})
                let promise
                
                if(forceLogout)
                    promise = this.$http.get(`signout/${this.deletedId}`)
                else
                    promise = this.$http.delete(`users/${this.user.id}/tokens/${this.deletedId}`)
                
                promise
                    .then(() => {
                        if(forceLogout){
                            this.$store.commit('addUser', null)
                            this.$router.push("/")
                        }
                        this.user.apis = this.user.apis.filter(r => r.id != this.deletedId)
                    })
                    .catch(err => prepareError(err,this))
                    .finally(() => {
                        this.dialog = false
                        this.deletedId = null
                    })
                return
            }
            this.dialog = false
            this.deletedId = null
        },
        find(){
            this.$http(`users/${this.id}`)
                .then(res => this.user = res.data)
                .catch(err => prepareError(err,this))
        }
    },
    created(){
        this.find()
    }
}
</script>