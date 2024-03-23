<script setup>
import draggable from "vuedraggable"
import {ref, computed, watchEffect} from "vue"
import {getCurrentLanguage} from "../js/languageUtil"
import {getAll, deleteAll, createNewVar} from "../js/variableUtil"
import Block from "./Block.vue"
import { notification } from "ant-design-vue"

const currentBlocks = ref([])
const isDragging = ref(false)
const props = defineProps(["saveTrigger", "loadTrigger", "loadFileContent"])
const emits = defineEmits(["onSaveTrigger", "onLoadTrigger"])

watchEffect(() => {
    if (props.saveTrigger) {
        console.log("Received ONSAVE EVENT")
        const savedContentValue = {
            variables: JSON.parse(JSON.stringify(getAll())),
            content: currentBlocks.value
        }
        emits("onSaveTrigger", !props.saveTrigger, savedContentValue)
    }
    if (props.loadTrigger) {
        emits("onLoadTrigger")
        console.log("Received ONLOAD EVENT")
        let result = parseVariables(props.loadFileContent['variables'])
        if (!result) {
            return;
        }
        currentBlocks.value = props.loadFileContent['content']
        return;
    }
})

/**
 * Parse vars from metadata and add them into the variable pools
 * @param {Array} varList All variables metadata
 */
function parseVariables(varList) {
    // first delete all current variables
    deleteAll()

    // iterate the list to add new variables
    try {
        for (let i = 0; i < varList.length; i++) {
            const e = varList[i]
            createNewVar(e["key"], e["type"], e["value"])
        }
        return true
    }
    catch (error) {
        notification.error("Error while loading your content: " + error)
        return false
    }
}


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