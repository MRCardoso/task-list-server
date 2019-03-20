<template>
    <div class="content-box my-container">
        <div class="content-box-header">
            <h3>
                Tarefa Agendadas
                <v-badge  v-if="tasks.length>0" overlap>
                    <span slot="badge">{{tasks.length}}</span>
                    <v-icon dark>notifications</v-icon>
                </v-badge>
            </h3>
            <span>{{date | moment('dddd - MMM DD, YYYY')}}</span>
        </div>

        <div class="content-box-body">
            
            <div class="content-calendar">
                <v-date-picker v-model="date" color="my-blue lighten-1" :no-title="true"></v-date-picker>
            </div>
            
            <div class="content-tasks">
                
                <v-expansion-panel v-if="tasks.length>0" popout>
                    <v-expansion-panel-content v-for="task in tasks" :key="task.id">
                    <div slot="header"><h3>{{task.title}}</h3></div>
                    <v-card>
                        <v-card-text class="grey lighten-3">
                            <div v-html="task.description"></div>
                            <div class="grey lighten-2 pa-2">
                                <div class="flex-row">
                                    <task-app-formatter-value title="Situação" :value="task.situation" :data="situationData" />
                                    <task-app-formatter-value title="Prioridade" :value="task.priority" :data="priorityData" />
                                    <span class="flex-end text--darken-2 grey--text bolder">
                                        Periodo {{ task.startDate | moment("DD/MM/YYYY") }}
                                        <span v-if="task.endDate">
                                            <small class="ma-1">a</small>
                                            {{ task.endDate | moment("DD/MM/YYYY") }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <task-app-sheeting v-else :elevation="6" message="Não foram encontradas tarefas nesta data" />

            </div>
        </div>
    </div>
</template>

<script>
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import TaskAppSheeting from '@/components/Sheeting.vue'
import { situationData, priorityData, prepareError } from '@/utils/index'

export default {
    components: { TaskAppFormatterValue, TaskAppSheeting },
    data () {
        return {
            tasks: [],
            date: null,
            situationData,
            priorityData
        }
    },
    watch: {
        date () {
            this.find()
        }
    },
    methods: {
        find(){ 
            this.$http.get(`dailytask/${this.date}`)
            .then(res => this.tasks = res.data)
            .catch(err => prepareError(err, this))
        }
    },
    created() {
        this.date = this.$moment(new Date()).format("YYYY-MM-DD")
        this.find()  
    },
}
</script>
<style>
    .content-box{
        box-shadow: 0 0 6px rgba(0, 0,0, 0.2);
        display: flex;
        flex-direction: column;
        border-radius: 3px;
    }
    .content-box-header{
        background-color: #6E9FDD;
        color: #FFF;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .content-tasks{
        width: 80%;
    }
    .content-box-body{
        display: flex;
        justify-items: center;
        justify-content: space-between;
        background-color: #EFEFEF;
        padding: 12px;
    }
    @media (max-width: 640px) {
        .content-tasks{
            padding-top: 16px;
            width: 100%;
        }
        .content-calendar{
            display: flex;
            justify-content: center;
            width: 100%;
        }
        .content-box-body{
            padding: 0;
            justify-content: center;
            justify-items: center;
            flex-direction: column;
        }
    }
</style>
