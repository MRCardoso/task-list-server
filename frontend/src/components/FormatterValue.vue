<template>
    <v-tooltip bottom>
        <template #activator="data">
            <div class="label-container" :class="{'justify-center': centered}">
                <strong v-if="showTitle">{{title}}</strong>
                <div :class="instanceValue.class" class="label-item darken-1" dark v-on="data.on">
                    {{instanceValue.name}}
                </div>
            </div>
        </template>
        <span>{{title}}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: "FormatterValue",
    props: ['title','value', 'data', 'showTitle', 'centered'],
    computed: {
        instanceValue(){
            let item = this.data.find(r => r.id == this.value)
            return item || {}
        }
    },
}
</script>
<style>
    .label-item{
        display: flex;
        justify-content: space-between;
        color:  #FFF;
        padding: 4px;
        margin: 4px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6)
    }
    .label-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .justify-center{
        align-items: center;
    }
</style>