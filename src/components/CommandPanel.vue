<script setup>
import draggable from "vuedraggable"
import {ref, computed} from "vue"
import {v4 as uuidv4} from "uuid"
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import Block from "./Block.vue"
import { Dropdown, Menu, MenuItem } from "ant-design-vue"

const currentBlocks = ref([])

/**
 * This element will contains full information and unite them into a map for quick rendering
 */
const fullBlockInfoList = computed(()=>{
    let fullBlockInfo = {}
    const blocks = getBlockInfo()
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < Object.keys(blocks[i]["blocks"]).length; j++) {
            const currKeyName = Object.keys(blocks[i]["blocks"])[j]
            fullBlockInfo[currKeyName] = blocks[i]["blocks"][currKeyName]
        }
    }
    return fullBlockInfo
})

function printOnChangeMessage() {
    console.log("The full block list sequence: ")
    console.log(currentBlocks.value)
    console.log("The full block info: ")
    console.log(fullBlockInfoList.value)
}

function handleDelete(index) {
    currentBlocks.value.splice(index, 1)
}

</script>
<template>
    <div class="main-box">
        <draggable
        :list="currentBlocks"
        group="blocks"
        item-key="id"
        @change="printOnChangeMessage"
        :move="()=>true">
            <template #item="{ element, index }">
                <div>
                    <Block :id="element + '-' + uuidv4()" :content-template="fullBlockInfoList[element]['visualize'][getCurrentLanguage()]" :code-template="fullBlockInfoList[element]['code']" :is-in-command="true" @on-delete="handleDelete(index)"></Block>
                </div>
            </template>
        </draggable>
    </div>
</template>
<style scoped>
.main-box {
    display: flex;
    flex-direction: column;
}
</style>