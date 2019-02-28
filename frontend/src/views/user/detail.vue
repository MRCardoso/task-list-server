<template>
    <task-app-form-item title="Detalhes do Usuário" :path="indexRoute" inputClass="mt-4 mb-2 ml-4 mr-4">
        <template slot="inputs">
            <div class="flex-row">
                <v-img v-if="hasImage" class="white--text" width="400px" :src="user.images[0].url"></v-img>
                <div class="flex-columns">
                    <v-chip class="blue lighten-2" text-color="white">
                        <v-avatar><v-icon>account_circle</v-icon></v-avatar>
                        {{user.name}}
                    </v-chip>
                    
                    <v-chip class="blue lighten-2" text-color="white">
                        <v-avatar><v-icon>account_circle</v-icon></v-avatar>
                        {{user.username}}
                    </v-chip>
                    
                    <v-chip class="blue lighten-2" text-color="white">
                        <v-avatar><v-icon>fa fa-at</v-icon></v-avatar>
                        {{user.email}}
                    </v-chip>
                    
                    <task-app-formatter-value title="Status" :value="user.status" :data="statusData"/>
                </div>
            </div>
        </template>
        <template slot="buttons">
            <div class="pl-2" v-if="user.created_at">
                Criado em {{ user.created_at | moment("DD(dddd), MM, YYYY") }}
            </div>
            <v-spacer></v-spacer>
            <v-btn class="blue lighten-3 white--text" :to="`${indexRoute}/${id}/edit`">Editar</v-btn>
            <v-btn class="my-blue darken-1 white--text" :to="`${indexRoute}/new`">Novo </v-btn>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppFormatterValue from '@/components/FormatterValue.vue'
import { statusData, prepareError } from '@/utils/index'
export default {
    components: {TaskAppFormItem, TaskAppFormatterValue},
    props: ['id'],
    computed: {
        hasImage(){
            return Array.isArray(this.user.images) && this.user.images.length > 0
        }
    },
    data() {
        return {
            user: {},
            indexRoute: '/users',
            statusData
        }
    },
    methods: {
        find(){
            this.$http.get(`users/${this.id}`).then(
                res => this.user = res.data,
                err => this.$toasted.global.defaultError({message: prepareError(err)})
            )
        }
    },
    created(){
        this.find()
    }
}
</script>