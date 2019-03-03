<template>
    <task-app-form-item title="Detalhes da Tarefa" inputClass="mt-4 mb-2 ml-4 mr-4">
        <template slot="inputs">
            <div>
                <h3 class="captalized-text">{{task.title}}</h3>
                <div v-html="task.description"></div>
                <div class="flex-row">
                    <div class="flex-start">
                        <task-app-formatter-value :centered="true" :showTitle="true" title="Situação" :value="task.situation" :data="situationData" />
                        <task-app-formatter-value :centered="true" :showTitle="true" title="Prioridade" :value="task.priority" :data="priorityData" />
                        <task-app-formatter-value :centered="true" :showTitle="true" title="Status" :value="task.status" :data="statusData" />
                    </div>

                    <span class="flex-end">
                        <strong class="mr-1">Periodo</strong>
                        <v-chip>
                            {{ task.startDate | moment("DD/MM/YYYY") }}
                            <span v-if="task.endDate">
                                <small class="ma-1">a</small>
                                {{ task.endDate | moment("DD/MM/YYYY") }}
                            </span>
                        </v-chip>
                    </span>
                </div>
            </div>
        </template>
        <template slot="buttons">
            <div class="flex-down" v-if="task.created_at">
                Criado em {{ task.created_at | moment("DD(dddd), MM, YYYY") }}
            </div>
            <v-spacer></v-spacer>
            <v-btn to="/tasks">Voltar</v-btn>
            <v-btn class="blue lighten-3 white--text" :to="`/tasks/${id}/edit`">Editar</v-btn>
            <v-btn class="my-blue darken-1 white--text" to="/tasks/new">Novo </v-btn>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import { situationData, priorityData,statusData, prepareError } from '@/utils/index'
export default {
    components: {TaskAppFormItem, TaskAppFormatterValue},
    props: ['id'],
    data() {
        return {
            task: {},
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
