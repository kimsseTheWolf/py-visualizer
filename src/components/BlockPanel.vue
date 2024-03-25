<script setup>
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo, parseBlockSlots} from "../js/blockLoaderUtil"
import {ref, computed} from "vue"
import {v4 as uuidv4} from "uuid"
import draggable from "vuedraggable"
import BlockSelectableElement from "./Selectable/BlockSelectableElement.vue";
import variableManager from "./VariableManager.vue"; // basic.var
import Block from "./Block.vue";

const props = defineProps(["currentid"])

const blocks = ref([])

/**
 * The full blocks definition object. Mainly for rendering the list
 */
const currentBlocks = computed(()=>{
    blocks.value = getBlockInfo()
    console.log(blocks.value)
    let currentBlockGroup = {}
    for (let i = 0; i < blocks.value.length; i++) {
        console.log(blocks.value[i], " ", props["currentid"])
        if (blocks.value[i].id === props["currentid"]) {
            console.log("Block information updated")
            console.log("Block value: ", blocks.value[i])
            currentBlockGroup = blocks.value[i]['blocks']
            console.log("Current Block Group: ", currentBlockGroup)
            break;
        }
    }
    // process the blocks info for drag and drop datas in the app
    const keys = Object.keys(currentBlockGroup)
    let results = []
    for (let i = 0; i < keys.length; i++) {
        console.log("Processing", currentBlockGroup[keys[i]])
        let currElement = JSON.parse(JSON.stringify(currentBlockGroup[keys[i]]))
        currElement["slots"] = parseBlockSlots(currElement["visualize"]["default"])
        console.log("Current Elements Slots: ", currElement["slots"])
        results.push(JSON.parse(JSON.stringify(currElement)))
    }
    console.log("Here are the block lists: ",  results)
    return results
})

/**
 * This function will pre-process the block metadata before it is ready to be clone to the panel
 * Using seqID prop to avoid invalid id in commandPanel, everything from here will be unique!
 */
function cloneCopier(origin) {
    let newOrigin = JSON.parse(JSON.stringify(origin))
    newOrigin["seqID"] = newOrigin["id"] + "_" + uuidv4()
    return JSON.parse(JSON.stringify(newOrigin))
}

console.log("Properties: ", props["currentid"])

</script>
<template>
    <variableManager v-if="props['currentid'] === 'basic.var'"></variableManager>
    <draggable
    :list="currentBlocks"
    :group="{name: 'blocks', pull: 'clone', put: false}"
    :clone="(origin)=>{return cloneCopier(origin)}"
    item-key="id">
        <template #item="{ element }">
            <Block :id="element" :content-template="element['visualize'][getCurrentLanguage()]" :code-template="element['code']" :slots="element['slots']" :contexts="element['exposes']"></Block>
        </template>
    </draggable>
    <!-- <Block v-for="i in currentBlocks['blocks']" :id="i['code']" :content-template="i['visualize'][getCurrentLanguage()]" :code-template="i['code']"></Block> -->
</template>
<style scoped>
.temp {
    margin: 5px;
    padding: 5px;
    height: fit-content;
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>