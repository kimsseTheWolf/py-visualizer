<script setup>
import draggable from "vuedraggable"
import {ref, computed} from "vue"
import {v4 as uuidv4} from "uuid"
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import Block from "./Block.vue"
import { Dropdown, Menu, MenuItem } from "ant-design-vue"

const currentBlocks = ref([])
const isDragging = ref(false)


function printOnChangeMessage() {
    console.log("The full block list sequence: ")
    console.log(currentBlocks.value)
}

function handleDelete(index) { 
    currentBlocks.value.splice(index, 1)
}

function handleValueOnChange(blockIndex, paramIndex, infos) {
    currentBlocks.value[blockIndex]["slots"][paramIndex] = infos
}

</script>
<template>
    <!-- <div>{{ currentBlocks }}</div> -->
    <div class="main-box">
        <draggable
        :list="currentBlocks"
        group="blocks"
        item-key="seqID"
        @change="printOnChangeMessage"
        :move="()=>true">
            <template #item="{ element, index }">
                <div>
                    <Block :index="index" :id="element['seqID']" :content-template="element['visualize'][getCurrentLanguage()]" :code-template="element['code']" :is-in-command="true" @on-delete="handleDelete(index)" @on-value-change="handleValueOnChange" :slots="element['slots']"></Block>
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