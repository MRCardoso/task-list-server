<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="390">
            <v-card>
                <v-card-title class="headline">{{title}}</v-card-title>
                <v-card-text>{{content}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="grey lighten-3" flat @click="$emit('confirmDialog', false)">Cancelar</v-btn>
                    <v-btn class="my-blue darken-1 white--text" flat @click="$emit('confirmDialog', true)">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        props: {
            dialog: Boolean,
            title: String,
            content: String,
            confirm: Function,
        },
    }
</script>