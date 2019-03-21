<template>
    <task-app-form-item title="Detalhes da Tarefa" :path="indexRoute" inputClass="mt-4 mb-2 ml-4 mr-4">
        <template slot="inputs">
            <div>
                <v-expansion-panel>
                    <v-expansion-panel-content>
                        <div slot="header"><h3 class="captalized-text">{{task.title}}</h3></div>
                        <v-card>
                            <v-card-text>
                                <div v-html="task.description"></div>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <table class="table">
                    <tr>
                        <th align="right">Situação</th>
                        <td><task-app-formatter-value title="Situação" :value="task.situation" :data="situationData" /></td>
                    </tr>
                    <tr>
                        <th align="right">Prioridade</th>
                        <td><task-app-formatter-value title="Prioridade" :value="task.priority" :data="priorityData" /></td>
                    </tr>
                    <tr>
                        <th align="right">Status</th>
                        <td><task-app-formatter-value title="Status" :value="task.status" :data="statusData" /></td>
                    </tr>
                    <tr>
                        <th align="right">Periodo</th>
                        <td align="right">
                            {{ task.startDate | moment("DD/MM/YYYY") }}
                            <small class="ma-1">a</small>
                            <span v-if="task.endDate">{{ task.endDate | moment("DD/MM/YYYY") }}</span>
                            <span v-else>indefinido</span>
                        </td>
                    </tr>
                </table>
                    
                <div v-if="task.integration">
                    <task-app-sheeting :elevation="2" padding="pa-1" message="Enviado via celular" />
                    <table class="table">
                        <tr>
                            <th align="right">Descrição</th>
                            <td>{{task.integration.description}}</td>
                        </tr>
                        <tr>
                            <th align="right">Plataforma</th>
                            <td>{{task.integration.platform==2 ? 'mobile' : 'outros'}}</td>
                        </tr>
                        <tr>
                            <th align="right">Criado em:</th>
                            <td>{{task.integration.created_at | moment('DD/MM/YY HH:mm:ss')}}</td>
                        </tr>
                        <tr>
                            <th align="right">Editado em:</th>
                            <td>{{task.integration.updated_at | moment('DD/MM/YY HH:mm:ss')}}</td>
                        </tr>
                        <tr v-if="task.integration.deleted_at">
                            <th align="right">Removido em:</th>
                            <td>{{task.integration.deleted_at | moment('DD/MM/YY HH:mm:ss')}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </template>
        <template slot="buttons">
            <div class="flex-down" v-if="task.created_at">
                Criado em {{ task.created_at | moment("DD(dddd), MM, YYYY") }}
            </div>
            <v-spacer></v-spacer>
            <router-link :to="`${indexRoute}/${id}/edit`" class="mbtn mbtn-sht mbtn-blue-light mr-2">Editar</router-link>
            <router-link :to="`${indexRoute}/new`" class="mbtn mbtn-sht mbtn-blue">Novo</router-link>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import TaskAppSheeting from '@/components/Sheeting.vue'
import { situationData, priorityData,statusData, prepareError } from '@/utils/index'
export default {
    components: {TaskAppFormItem, TaskAppFormatterValue, TaskAppSheeting},
    props: ['id'],
    data() {
        return {
            task: {},
            indexRoute: '/tasks',
            situationData,
            priorityData,
            statusData
        }
    },
    methods: {
        find(){
            this.$http(`tasks/${this.id}`)
            .then(res => {
                this.task = res.data
                this.situation = situationData.find(r => r.id ==this.task.situation)
                this.priority = priorityData.find(r => r.id ==this.task.priority)
            })
            .catch(err => prepareError(err, this))
        }
    },
    created(){
        this.find()
    }
}
</script>

<style>

</style>
