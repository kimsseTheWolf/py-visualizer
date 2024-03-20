<script setup>
import draggable from "vuedraggable"
import {ref, computed} from "vue"
import {getCurrentLanguage} from "../js/languageUtil"
import Block from "./Block.vue"

/**
 * Props for nested command panel
 * 
 * blocks is an array contains all the children box information
 * 
 * tabIndex indicate how many spaces should program to display before each block to have tab effects 
 */
const props = defineProps({
    "blocks": Array,
    "tabIndex": Number,
    "index": Number
})

/**
 * The pre-processed currentBlocks to avoid undefined and non array elements
 */
const currentBlocks = computed(()=>{
    if (props.blocks === null || props.blocks === undefined) {
        return []
    }
    else {
        return JSON.parse(JSON.stringify(props.blocks))
    }
})

/**
 * Events
 * 
 * onContentChange - Emits when the inner blocks and properties were changed
 */
const emits = defineEmits(["onContentChange"])


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