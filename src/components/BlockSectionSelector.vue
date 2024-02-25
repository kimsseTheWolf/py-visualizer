<script setup>
import { Button } from 'ant-design-vue';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons-vue'
import {ref, computed} from "vue"
import BlockSelectionItem from './BlockSelectionItem.vue';
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"

const emits = defineEmits(["onTabChange"])

const interfaceControl = ref({
    expanding: false,
    currActiveID: "io",
    currActiveTitle: getBlockInfo()[0]["name"][getCurrentLanguage()]
})

/**
 * Get all tabs info. In future embedding in apps, will also add support to load local third party language extensions
 */
const tabsInfo = computed(()=>{
    let list = getBlockInfo()
    console.log(list[0]["name"][getCurrentLanguage()])
    let result = []
    for (let i = 0; i < list.length; i++) {
        result.push({
            "id": list[i]["id"],
            "name": list[i]["name"][getCurrentLanguage()],
            "blocks": list[i]["blocks"]
        })
    }
    return result
})

/**
 * Dyamically change bottom margin of the box to save space
 */
const mainBoxBottomMargin = computed(()=>{
    if (interfaceControl.value.expanding) {
        return {marginBottom: "10px"}
    }
    else {

    }return {marginBottom: "0px"}
})

/**
 * Handle switch ID, also emit onClick event to syncronize data with father and brother components
 * @param {String} id String
 * @param {String} title the friendly name of the tab
 */
function updateActiveID(id, title) {
    interfaceControl.value.currActiveID = id
    interfaceControl.value.currActiveTitle = title
    interfaceControl.value.expanding = false
    console.log("Updated")
    emits("onTabChange", id)
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