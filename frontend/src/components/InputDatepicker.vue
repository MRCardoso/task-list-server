<template>
    <v-menu
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y>
        <v-text-field 
            slot="activator" 
            :label="title" 
            prepend-icon="event" 
            clearable
            readonly
            v-model="formated"
            @blur="verifyFormater()"
            :error-messages="rule[field]">
        </v-text-field>
        <v-date-picker v-model="date" no-title scrollable></v-date-picker>
    </v-menu>
</template>

<script>

export default {
    props: {
        item: Object,
        rule: Object,
        field: String,
        title: String,
    },
    data(){
        return {
            date: null,
            formated: null
        }
    },
    watch: {
        date () {
            this.item[this.field] = this.date
            this.formated = (this.date ? this.$moment(this.date).format('DD/MM/YYYY') : null)
        },
        item(){
            if(this.item[this.field]){
                this.date = this.$moment(this.item[this.field]).format("YYYY-MM-DD")
            }
        }
    },
    methods: {
        verifyFormater(){
            if(!this.formated){
                this.item[this.field] = null
                this.date = null
            }
        }
    }
}
</script>