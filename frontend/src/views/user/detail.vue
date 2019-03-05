<template>
    <div>
        <task-app-modal :dialog="dialog" @confirmDialog="deleteItem" title="Deletar Usuário" content="Deseja realmente remover este registro?" />
    
        <task-app-form-item title="Detalhes do Usuário" :path="indexRoute" inputClass="mt-4 mb-2 ml-4 mr-4">
            <template slot="inputs">
                <div v-if="hasImage" class="flex-row">
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
                                <tr v-for="api in user.apis" :key="api.id">
                                    <td><strong>{{api.name}}</strong></td>
                                    <td>{{api.version}}</td>
                                    <td>{{api.platform == 1 ? "web" : (api.platform==2 ? 'mobile' : 'outros') }}</td>
                                    <td>{{new Date(api.expires) | moment('DD/MM/YY HH:mm')}}</td>
                                    <td>{{api.created_at}}</td>
                                    <td align="center"><v-icon class="red--text" small @click="openConfirmation(api.id)">delete</v-icon></td>
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
                <v-btn class="blue lighten-3 white--text" :to="`${indexRoute}/${id}/edit`">Editar</v-btn>
                <v-btn class="my-blue darken-1 white--text" :to="`${indexRoute}/new`">Novo </v-btn>
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
        hasApis(){
            return Array.isArray(this.user.apis) && this.user.apis.length > 0
        },
        openConfirmation(id){
            this.dialog = true
            this.deletedId = id
        },
        deleteItem(remove){
            if(remove && this.deletedId){
                this.$http.delete(`users/${this.user.id}/tokens/${this.deletedId}`)
                    .then(() => {
                        let record = this.user.apis.find(r => r.id == this.deletedId)
                        if(record){
                            if(record.token == this.$store.state.auth.user.token){
                                this.$router.push('/')
                            }
                        }
                        this.user.apis = this.user.apis.filter(r => r.id == this.deletedId)
                    })
                    .catch(err => prepareError(err,this))
                    .finally(() => {
                        this.dialog = false
                        this.deletedId = null
                    })
            } else{
                this.dialog = false
                this.deletedId = null
            }
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