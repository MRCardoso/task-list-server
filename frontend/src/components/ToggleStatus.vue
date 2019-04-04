<template>
    <div class="input-custom">
        <div class="input-label">
            <label>Status</label>
        </div>
        <div class="input-options">
            <label 
                class="input-custom-radio text-center" 
                v-for="row in statusData"
                :key="row.id" 
                :class="{'radio-blue': item.status == row.id}">
                <input type="radio" name="status" v-model="item.status" :value="row.id">
                {{row.name}}
            </label>
            <small class="red--text">{{rule.status}}</small>
        </div>
    </div>
</template>

<script>
import { statusData } from '@/utils/index'

export default {
    name: 'ToggleStatus',
    props: {
        item: Object,
        rule: Object,
    },
    data(){
        return {
            statusData
        }
    }
}
</script>

<style>
    .input-custom{
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        padding: 0 6px;
    }
    .input-custom input[type=text],
    .input-custom input[type=password]{
        padding-left: 6px;
        padding-bottom: 6px;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #ADAEAF;
        color: #5F5D5e;
        opacity: 0.6;
        width: 100%;
        border-radius: 0 0 0 3px;
    }
    .input-custom .input-options > label:not(.input-custom-radio) input[type=radio]{
        margin: 2%;
        font-size: 22px;
    }
    .input-custom .input-options > label:not(.input-custom-radio){
        width: 100%;
        margin-bottom: 0;
        text-transform: capitalize;
        font-size: 12px;
        letter-spacing: 1px;
        font-family: 'Oswald', sans-serif;
    }
    .input-custom input:focus{
        outline: none;
        border-bottom: 2px solid #6E9FDD;
        padding-bottom: 5px;
        opacity: 1;
    }
    /**
    * Custom radio active inactive
    */
    .input-options > .input-custom-radio{
        float: left;
        background: #E8E8E8;
        padding: 5px 10px;
        width: 50%;
        font-weight: bolder;
    }
    .input-options > label:first-of-type{
        border-radius: 5px 0 0 5px;
        border: 1px solid #bEbEbE;
        border-right: none;
    }
    .input-options > label:last-of-type{
        border-radius: 0 5px 5px 0;
        border: 1px solid #bEbEbE;
        border-left: none;
    }
    .input-options > .input-custom-radio input[type=radio]{
        display: none;
    }
    .input-options > .radio-blue{
        background: #3DAF3D;
        color: #FEFEFE;
    }
</style>
