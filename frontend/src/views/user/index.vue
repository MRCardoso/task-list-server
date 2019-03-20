<template>
    <div class="my-container">
        <task-app-breadground title="Lista de Usuários"></task-app-breadground>

        <task-app-modal :dialog="dialog" @confirmDialog="deleteItem" title="Deletar Usuário" content="Deseja realmente remover este registro?" />

        <v-card-title>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details />
            <v-spacer></v-spacer>
            
            <v-btn fab slot="activator" color="#6E9FDD" dark class="mb-2" to="/users/new">
                <v-icon dark>add</v-icon>
            </v-btn>
        </v-card-title>

        <v-data-table :headers="headers" :items="users" :no-results-text="emptyFilter" :search="search" class="elevation-1">
            <template slot="items" slot-scope="user">
                <td class="text-xs-left">{{user.item.id}}</td>
                <td class="text-xs-left">{{ user.item.name }}</td>
                <td class="text-xs-left">{{ user.item.username }}</td>
                <td class="text-xs-left">{{ user.item.email }}</td>
                <td class="text-xs-center">
                    <task-app-formatter-value title="Status" :value="user.item.status" :data="statusData" />
                </td>
                <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="viewItem(user.item.id)">fa fa-eye</v-icon>
                    <v-icon small class="mr-2" @click="editItem(user.item.id)">edit</v-icon>
                    <v-icon small @click="openConfirmation(user.item.id)">delete</v-icon>
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
                { text: 'Nome', align: 'left', sortable: true, value: 'name' },
                { text: 'Usuário', align: 'left', sortable: true, value: 'title' },
                { text: 'E-mail', align: 'left', sortable: true, value: 'startDate' },
                { text: 'Status', align: 'center', sortable: true, value: 'endDate' },
                { text: 'Actions', align: 'right', value: 'name', sortable: false }
            ],
            emptyFilter: 'Nenhum resultado encontrado',
            search: '',
            users: [],
            dialog: false,
            deletedId: null,
            situationData,
            statusData,
            priorityData
        }
    },
    methods: {
        editItem(id){
            this.$router.push(`users/${id}/edit`)
        },
        viewItem(id){
            this.$router.push(`users/${id}/detail`)
        },
        openConfirmation(id){
            this.dialog = true
            this.deletedId = id
        },
        deleteItem(remove){
            if(remove && this.deletedId)
            {
                this.$http.patch(`users/${this.deletedId}`)
                .then(() => this.$toasted.global.defaultSuccess({message: "Usuário removida com sucesso"}))
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
            this.$http(`users`).then(res => this.users = res.data).catch(err => prepareError(err, this))
        }
    },
    created() {
        this.find()
    },
}
</script>