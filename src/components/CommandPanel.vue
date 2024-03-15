<script setup>
import draggable from "vuedraggable"
import {ref, computed} from "vue"
import {v4 as uuidv4} from "uuid"
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import Block from "./Block.vue"
import { Dropdown, Menu, MenuItem } from "ant-design-vue"

const currentBlocks = ref([])


function printOnChangeMessage() {
    console.log("The full block list sequence: ")
    console.log(currentBlocks.value)
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
                    <Block :id="element['id'] + '-' + uuidv4()" :content-template="element['visualize'][getCurrentLanguage()]" :code-template="element['code']" :is-in-command="true" @on-delete="handleDelete(index)"></Block>
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