<template>
    <task-app-form-item :title="title" :path="indexRoute">
        <template slot="inputs">

            <v-tabs fixed-tabs>
                <v-tab ripple>Dados Iniciais</v-tab>
                <v-tab ripple>Conteúdo</v-tab>
                
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <task-app-toggle-status :item="task" :rule="rules" />
                        <v-text-field label="Titulo" type="text" v-model="task.title" :error-messages="rules.title"/>
                        
                        <v-combobox v-model="situation" :items="situationData" item-text="name" label="Situação" :error-messages="rules.situation"></v-combobox>
                        <v-combobox color="blue" v-model="priority" :items="priorityData" item-text="name" label="Prioridade" :error-messages="rules.priority"></v-combobox>
                        
                        <task-app-input-datepicker :item="task" field="startDate" title="Data Inicio" :rule="rules" />
                        <task-app-input-datepicker :item="task" field="endDate" title="Data Final" :rule="rules" />
                    </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <vue-editor v-model="task.description" placeholder="Descrição..." />
                        <small class="red--text">{{rules.description}}</small>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </template>
        <template slot="buttons">
            <v-spacer></v-spacer>
            <v-btn v-if="id" class="blue lighten-3 white--text" :to="`${indexRoute}/${id}/detail`">Visualizar</v-btn>
            <v-btn class="my-blue darken-1 white--text" @click.prevent="save">Salvar</v-btn>
        </template>
    </task-app-form-item>
</template>
<script>

import { VueEditor } from "vue2-editor"
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppToggleStatus from '@/components/ToggleStatus.vue'
import TaskAppInputDatepicker from '@/components/InputDatepicker.vue'
import { situationData, priorityData, prepareError } from '@/utils/index'

export default {
    components: { TaskAppFormItem, TaskAppToggleStatus, TaskAppInputDatepicker, VueEditor },
    props: ['id'],
    data() {
        return {
            task: {},
            rules: {},
            indexRoute: '/tasks',
            situation: null,
            priority: null
        }
    },
    computed: {
        title(){
            return this.id ? 'Atualizar Tarefa' : 'Criar Tarefa'
        },
        situationData(){
            return [{id: '', name: 'Selecione'}].concat(situationData);
        },
        priorityData(){
            return [{id: '', name: 'Selecione'}].concat(priorityData);
        }
    },
    methods: {
        save(){
            this.task.situation = (this.situation ? this.situation.id : null);
            this.task.priority = (this.priority ? this.priority.id : null);

            let method = this.id ? 'put' : 'post'
            let endpoint = `tasks`+(this.id ? `/${this.id}` : '')

            this.$http[method](endpoint, this.task)
            .then(() => {
                this.$toasted.global.defaultSuccess({message: `Tarefa ao ${this.id ? 'atualizada' : 'criada'} com sucesso`})
                this.$router.push('/tasks')
            })
            .catch(err => prepareError(err, this));
        },
        find(){
            if(this.id){
                this.$http(`tasks/${this.id}`)
                    .then(res => {
                        this.task = res.data
                        this.situation = situationData.find(r => r.id ==this.task.situation)
                        this.priority = priorityData.find(r => r.id ==this.task.priority)
                    })
                    .catch(err => prepareError(err,this))
            } else{
                this.task = { status: 1, startDate: new Date()}
            }
        }
    },
    created(){
        this.find()
    }
}
</script>

<style>

</style>
