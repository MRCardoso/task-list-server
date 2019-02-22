<template>
    <div>
        <task-app-modal :dialog="dialog" v-on:confirmDialog="deleteItem" title="Deletar Tarefa" content="Deseja realmente remover este registro?" />

        <v-card-title>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details />
            <v-spacer></v-spacer>
            
            <v-btn fab slot="activator" color="#6E9FDD" dark class="mb-2" to="/tasks/new">
                <v-icon dark>add</v-icon>
            </v-btn>
        </v-card-title>

        <v-data-table :headers="headers" :items="tasks" :search="search" class="elevation-1">
            <template slot="items" slot-scope="task">
                <td>{{ task.item.name }}</td>
                <td class="text-xs-right">{{ task.item.title }}</td>
                <td class="text-xs-right">{{ task.item.startDate |  moment("DD/MM/YYYY") }}</td>
                <td class="text-xs-right">
                    <span v-if="task.item.endDate">{{ task.item.endDate |  moment("DD/MM/YYYY") }}</span>
                </td>
                <td class="text-xs-right">
                    <task-app-formatter-value title="Situação" :value="task.item.situation" :data="situationData" />
                </td>
                <td class="text-xs-right">
                    <task-app-formatter-value title="Prioridade" :value="task.item.priority" :data="priorityData" />
                </td>
                <td class="text-xs-right">
                    <task-app-formatter-value title="Prioridade" :value="task.item.status" :data="statusData" />
                </td>
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(task.item)">edit</v-icon>
                    <v-icon small @click="openConfirmation(task.item.id)">delete</v-icon>
                </td>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import TaskAppModal from '@/components/Modal.vue'
import { situationData, priorityData, statusData, prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormatterValue, TaskAppModal},
    data() {
        return {
            headers: [
                { text: 'Usuário', align: 'left', sortable: true, value: 'name' },
                { text: 'Titulo', align: 'left', sortable: true, value: 'title' },
                { text: 'Inicio', align: 'left', sortable: true, value: 'startDate' },
                { text: 'Fim', align: 'left', sortable: true, value: 'endDate' },
                { text: 'Situação', align: 'left', sortable: true, value: 'situation' },
                { text: 'Prioridade', align: 'left', sortable: true, value: 'priority' },
                { text: 'Status', align: 'left', sortable: true, value: 'status' },
                { text: 'Actions', value: 'name', sortable: false }
            ],
            search: '',
            tasks: [],
            dialog: false,
            deletedId: null,
            situationData,
            statusData,
            priorityData
        }
    },
    methods: {
        editItem(task){
            this.$router.push(`tasks/${task.id}/edit`)
        },
        openConfirmation(id){
            this.dialog = true
            this.deletedId = id
        },
        deleteItem(remove){
            if(remove && this.deletedId)
            {
                this.$http.delete(`tasks/${this.deletedId}`)
                .then(
                    res => this.$toasted.global.defaultSuccess({message: "Tarefa removida com sucesso"}), 
                    err => this.$toasted.global.defaultError({message: prepareError(err)})
                ).finally(() => {
                    this.dialog = false
                    this.find()
                })
            } else{
                this.dialog = false
            }
        },
        find(){
            this.$http.get(`tasks`)
            .then(
                res => this.tasks = res.data,
                err => this.$toasted.global.defaultError({message: prepareError(err)})
            )
        }
    },
    created() {
        this.find()
    },
}
</script>