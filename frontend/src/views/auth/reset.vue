<template>
    <task-app-form-item title="Restaurar Senha" path="/signin" :inlineButtons="false" inputClass="ml-4 mr-4 mt-1">
        <template slot="inputs">
            <task-app-sheeting v-if="expiredToken" :elevation="6" color="red" class="mb-3" :message="expiresMessage"/>
            <template v-else>
                <v-text-field prepend-icon="lock" label="Password" type="password" v-model="user.password" :error-messages="rules.password"/>
                <v-text-field prepend-icon="lock" label="confirmation" type="password" v-model="user.confirmation" :error-messages="rules.confirmation"/>
            </template>
        </template>
        <template slot="buttons">
            <v-btn @click="reset" v-if="!expiredToken" class="my-blue darken-1 white--text">Restaurar Senha</v-btn>
        </template>
    </task-app-form-item>
</template>

<script>
import TaskAppFormItem from '@/components/FormItem.vue'
import TaskAppSheeting from '@/components/Sheeting.vue'
import { prepareError } from '@/utils/index'

export default {
    components: {TaskAppFormItem, TaskAppSheeting},
    props: ['token'],
    data(){
        return {
            user: {},
            rules: {},
            tokenData: {}
        }
    },
    computed: {
        expiredToken(){
            if(this.tokenData.resetExpires)
                return new Date(this.tokenData.resetExpires) < new Date()
            return false
        },
        expiresMessage(){
            if(this.tokenData.resetExpires){
                return "Token expirado as: "+this.$moment(this.tokenData.resetExpires).format('DD/MM/YYYY HH:mm:ss')
            }
            return '';
        }
    },
    methods: {
        reset(){
            this.rules = {}
            this.$store.dispatch('busNotifyLoading', true)
            this.$http
                .post(`reset/${this.token}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess({message: "Senha atualizada com sucesso"})
                    this.$router.push("/")
                })
                .catch(err => prepareError(err,this))
                .finally(() => this.$store.dispatch('busNotifyLoading', false))
        },
        find(){
            this.$store.dispatch('busNotifyLoading', true)
            this.$http(`reset/${this.token}`, this.user)
                .then(res => this.tokenData = res.data)
                .catch(err => {
                    prepareError(err,this)
                    this.$router.push("/")
                })
                .finally(() => this.$store.dispatch('busNotifyLoading', false))
        }
    },
    created(){
        this.find()
    }
}
</script>