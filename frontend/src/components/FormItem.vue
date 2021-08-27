<template>
    <div class="content my-container">
        <task-app-breadground :title="title" :path="path"></task-app-breadground>
        <div :class="inputClass">
            <slot name="inputs" />
        </div>
        
        <v-divider></v-divider>

        <div class="content-buttons" :class="{'buttons-colls': !inlineButtons}">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>

<script>
import TaskAppBreadground from '@/components/Breadground.vue'
export default {
    props: {
        title: String,
        path: String,
        inputClass: {
            type: String,
            default: "ma-4"
        },
        inlineButtons: {
            type: Boolean,
            default: true
        }
    },
    components: {TaskAppBreadground}
}
</script>
<style>
    .content{
        width: 60%;
        background-color: #FFF;
        box-shadow: 0 4px 16px #adadad;
        border-radius: 4px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .content-buttons{
        display: flex;
        padding: 12px; 
    }
    .buttons-colls{
        flex-direction: column;
    }
</style>