<template>
    <v-sheet :elevation="elevation" class="mt-3 white--text" :class="addClasses" :color="color">
        <v-icon class="white--text mr-3">{{icon}}</v-icon>
        <span class="headline font-weight-light">{{message}}</span>
    </v-sheet>
</template>

<script>
export default {
    props:{
        elevation: {
            type: Number,
            default: 6
        },
        color: {
            type: String,
            default: "amber"
        },
        padding:{
            type: String,
            default: 'pa-2'
        },
        luminozity: {
            type: String,
            default: 'lighten-1'
        },
        icon: {
            type: String,
            default: "info"
        },
        message: {
            type: String,
            required: true
        }
    },
    computed: {
        addClasses(){
            return `${this.luminozity} ${this.padding}`;
        }
    },
}
</script>