<script setup>
import { Button } from 'ant-design-vue';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons-vue'
import {ref, computed} from "vue"
import BlockSelectionItem from './BlockSelectionItem.vue';
const interfaceControl = ref({
    expanding: false,
    currActiveID: "io",
    currActiveTitle: "Input and Output"
})

const tabsInfo = ref([
    {"id": "io", "name":"Input and Output"},
    {"id": "cf", "name":"Control Flow"},
    {"id": "var", "name":"Variables"},
])

const mainBoxBottomMargin = computed(()=>{
    if (interfaceControl.value.expanding) {
        return {marginBottom: "10px"}
    }
    else {

    }return {marginBottom: "0px"}
})

function updateActiveID(id, title) {
    interfaceControl.value.currActiveID = id
    interfaceControl.value.currActiveTitle = title
    console.log("Updated")
}
</script>
<template>
    <div class="selectBox">
        <div class="row" :style="mainBoxBottomMargin">
            <Button shape="circle" size="small" @click="interfaceControl.expanding = !interfaceControl.expanding">
                <ArrowDownOutlined v-if="!interfaceControl.expanding"/>
                <ArrowUpOutlined v-if="interfaceControl.expanding"/>
            </Button>
            <div style="margin-left: 7px; font-size: small;">{{ interfaceControl.currActiveTitle }}</div>
        </div>
        <BlockSelectionItem v-if="interfaceControl.expanding" v-for="i in tabsInfo" :is-active="i.id == interfaceControl.currActiveID" @click="updateActiveID(i.id, i.name)">
            {{ i.name }}
        </BlockSelectionItem>
    </div>
</template>
<style>
.selectBox {
    margin: 10px;
    padding: 10px;
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}
.row {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    align-items: center;
}
</style>