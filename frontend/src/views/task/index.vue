<template>
    <div class="my-container">
        <task-app-breadground title="Lista de Tarefas"></task-app-breadground>

        <task-app-modal :dialog="dialog" @confirmDialog="deleteItem" title="Deletar Tarefa" content="Deseja realmente remover este registro?" />

        <v-card-title>
            <input type="text" v-model="search" class="circle-search" placeholder="Buscar Tarefa" />
            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon class="amber accent-2 white--text" :class="{'rotation': updating}" v-on="on" @click="find()">
                        <v-icon>refresh</v-icon>
                    </v-btn>
                </template>
                <span>Atualizar</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon slot="activator" color="#2E9FEE" dark class="mb-2" v-on="on" to="/tasks/new">
                        <v-icon dark>add</v-icon>
                    </v-btn>
                </template>
                <span>Novo</span>
            </v-tooltip>
        </v-card-title>

        <v-data-table :headers="headers" :items="tasks" :no-results-text="emptyFilter" :search="search" class="elevation-1">
            <template slot="items" slot-scope="task">
                <td class="text-xs-left">{{ task.item.id }}</td>
                <td class="text-xs-left">{{ task.item.name }}</td>
                <td class="text-xs-left">{{ task.item.title }}</td>
                <td class="text-xs-left">{{ task.item.startDate |  moment("DD/MM/YYYY") }}</td>
                <td class="text-xs-left">
                    <span v-if="task.item.endDate">{{ task.item.endDate |  moment("DD/MM/YYYY") }}</span>
                </td>
                <td class="text-xs-center">
                    <task-app-formatter-value title="Situação" :value="task.item.situation" :data="situationData" />
                </td>
                <td class="text-xs-center">
                    <task-app-formatter-value title="Prioridade" :value="task.item.priority" :data="priorityData" />
                </td>
                <td class="text-xs-center">
                    <task-app-formatter-value title="Prioridade" :value="task.item.status" :data="statusData" />
                </td>
                <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="viewItem(task.item.id)">fa fa-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(task.item.id)">edit</v-icon>
                    <v-icon small @click="openConfirmation(task.item.id)">delete</v-icon>
                </td>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import TaskAppBreadground from '@/components/Breadground.vue'
import TaskAppModal from '@/components/Modal.vue'
import { situationData, priorityData, statusData, prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormatterValue, TaskAppModal, TaskAppBreadground},
    data() {
        return {
            headers: [
                { text: 'ID', align: 'left', sortable: true, value: 'id' },
                { text: 'Usuário', align: 'left', sortable: true, value: 'name' },
                { text: 'Titulo', align: 'left', sortable: true, value: 'title' },
                { text: 'Inicio', align: 'left', sortable: true, value: 'startDate' },
                { text: 'Fim', align: 'left', sortable: true, value: 'endDate' },
                { text: 'Situação', align: 'center', sortable: true, value: 'situation' },
                { text: 'Prioridade', align: 'center', sortable: true, value: 'priority' },
                { text: 'Status', align: 'center', sortable: true, value: 'status' },
                { text: 'Actions', align: 'right', value: 'name', sortable: false }
            ],
            emptyFilter: 'Nenhum resultado encontrado',
            search: '',
            tasks: [],
            dialog: false,
            updating: false,
            deletedId: null,
            situationData,
            statusData,
            priorityData
        }
    },
    methods: {
        editItem(id){
            this.$router.push(`tasks/${id}/edit`)
        },
        viewItem(id){
            this.$router.push(`tasks/${id}/detail`)
        },
        openConfirmation(id){
            this.dialog = true
            this.deletedId = id
        },
        deleteItem(remove){
            if(remove && this.deletedId)
            {
                this.$http.delete(`tasks/${this.deletedId}`)
                .then(() => this.$toasted.global.defaultSuccess({message: "Tarefa removida com sucesso"}))
                .catch(err => prepareError(err, this))
                .finally(() => {
                    this.dialog = false
                    this.find()
                })
            } else{
                this.dialog = false
            }
        },
        find(){
            this.updating = true
            this.$store.dispatch('busNotifyLoading', true)
            this.$http.get(`tasks`)
            .then(res => this.tasks = res.data)
            .catch(err => prepareError(err, this))
            .finally(() => {
                this.updating = false
                this.$store.dispatch('busNotifyLoading', false)
            })
        }
    },
    created() {
        this.find()
    },
}
</script>