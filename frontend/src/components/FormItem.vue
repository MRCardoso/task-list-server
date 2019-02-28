<template>
    <div class="content">
        <div class="content-header">
            <router-link to="/" class="goto-link">
                <i class="fa fa-home"></i>
            </router-link>
            <h3>{{title}}</h3>
            <router-link v-if="path" :to="path" class="goto-link">
                <i class="mr-1 fa fa-angle-left"></i>
                Voltar
            </router-link>
            <span v-else></span>
        </div>
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
    .content-header{
        background-color: #6E9FDD;
        color: #FFF;
        padding: 8px;
        text-align: center;
        display: flex;
        justify-content: space-between;
    }
    .content-buttons{
        display: flex;
    }
    .buttons-colls{
        flex-direction: column;
    }
    .goto-link, .goto-link i{
        color: #FDFDFD !important;
        text-decoration: none;
        display: flex;
        align-items: center;
    }
</style>