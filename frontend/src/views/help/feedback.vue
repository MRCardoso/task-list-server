<template>
    <task-app-form-item title="Enviar um Feedback" :inlineButtons="false">
        <template slot="inputs">
            <v-text-field label="Nome" type="text" v-model="feed.name" :error-messages="rules.name" />
            <v-text-field label="E-mail" type="text" v-model="feed.email" :error-messages="rules.email" />
            <v-combobox color="blue" v-model="feed.type" :items="kinds" item-text="name" label="Razão" :error-messages="rules.type"></v-combobox>
            <vue-editor :editorToolbar="customToolbar" v-model="feed.message" placeholder="Descrição..." />
            <small class="red--text">{{rules.message}}</small>
        </template>
        <template slot="buttons">
            <a @click.prevent="feedback" class="mbtn mbtn-blue">Enviar</a>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import { VueEditor } from "vue2-editor"
import { prepareError, defaultToolbar } from '@/utils/index'

export default {
    components: {TaskAppFormItem, VueEditor},
    data(){
        return {
            kinds: ['Bug no sistema', 'Dúvida', 'Sujestão', 'Outros'],
            customToolbar: defaultToolbar,
            feed: {},
            rules: {}
        }
    },
    methods: {
        feedback(){
            this.rules = {}
            let user = this.$store.state.auth.user;
            let params = {user, ...this.feed}
            this.$store.dispatch('busNotifyLoading', true)
            this.$http.post(`api/feedback`, params).then(res => {
                this.$toasted.global.defaultSuccess({message: "Sucesso ao enviar sua mensagem"})
                this.$router.push("/")
            }).catch(err => prepareError(err,this))
            .finally(() => this.$store.dispatch('busNotifyLoading', false))
        }
    },
}
</script>