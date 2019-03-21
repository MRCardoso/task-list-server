<template>
    <div>
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
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        path: {
            type: String,
            default: null
        }
    }
}
</script>

<style>
.content-header{
    background-color: #5EBFFF;
    color: #FFF;
    padding: 8px;
    text-align: center;
    display: flex;
    justify-content: space-between;
}
.goto-link, .goto-link i{
    color: #FDFDFD !important;
    text-decoration: none;
    display: flex;
    align-items: center;
}
</style>
