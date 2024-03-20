<script setup>
import { message, notification } from 'ant-design-vue';
import { MinusCircleOutlined } from "@ant-design/icons-vue"
import { ref } from 'vue';
import draggableComponent from 'vuedraggable';
import BlockSelectableElement from './Selectable/BlockSelectableElement.vue';

/**
 * Properties for the Block Element
 * 
 * `ID` - The general id for a block
 * 
 * `contentTemplate` - How the words will display on the block
 * 
 * `codeTemplate` - Tells the code generator how to generate using the parameters inside the content
 */
const props = defineProps({
    "id": String,
    "contentTemplate": String,
    "codeTemplate": String,
    "isInCommand": Boolean,
    "index": Number,
    "slots": Array
})

const emits = defineEmits(["onDelete", "onValueChange"])

const patterns = {
    paramter: /<([^>]+)>/,
    index: /\[([0-9]+)\]/g,
    acceptTypes: /accept:\s*\{([^}]+)\}/g
}

/**
 * The Paramter Slots will store all the data of the parameters for easier code generation and content modification
 */
const paramSlots = ref({})
const contents = ref([])

/**
 * The variable to store the first time check template data for rerendering check
 */
let temp = ""

function sendErrorLoadingNotification() {
    notification.error({
        message: "Error while loading blocks",
        description: "We cannot instantiate a block due to wrong template syntax. Contact the module developer to solve or please temporarly disable that module."
    })
}

function processBlockContent() {
    // reset
    paramSlots.value = []
    contents.value = []
    // Problem here
    console.log("Going through contentTemplate: " + props.contentTemplate)
    temp = props.contentTemplate
    // iterate through the content template and seperate elements
    let contentSegment = ""
    let slotSegment = ""
    let isInSlot = false
    // iterate to seperate content
    for (let i = 0; i < props.contentTemplate.length; i++) {
        if (props.contentTemplate.charAt(i) === "<") {
            // register new state
            isInSlot = true
            slotSegment += "<"
            // commit content segment
            contents.value.push({
                type: "content",
                content: contentSegment
            })
            contentSegment = ""
        }
        else if (props.contentTemplate.charAt(i) === ">") {
            // register new state
            isInSlot = false
            slotSegment += ">"
            // commit param segment
            contents.value.push({
                type: "param",
                content: slotSegment,
                index: null,
                acceptTypes: []
            })
            slotSegment = ""
        }
        else {
            // normal append
            isInSlot ? slotSegment += props.contentTemplate.charAt(i) : contentSegment += props.contentTemplate.charAt(i)
        }
    }
    if (contentSegment !== "") {
        contents.value.push({
            type: "content",
            content: contentSegment
        })
        contentSegment = ""
    }
    if (slotSegment !== "") {
        contents.value.push({
            type: "param",
            content: slotSegment,
            index: null,
            acceptTypes: []
        })
        slotSegment = ""
    }

    // iterate to set param slot information
    for (let i = 0; i < contents.value.length; i++) {
        if (contents.value[i].type === "param") {
            if (!contents.value[i].content.match(patterns.paramter)) {
                sendErrorLoadingNotification()
            }
            // get the index of the param
            if (contents.value[i].content.match(patterns.index)) {
                for (const match of contents.value[i].content.matchAll(patterns.index)) {
                    contents.value[i].index = match[1]
                }
            }
            else {
                sendErrorLoadingNotification()
            }
            // get the accept types for each
            // console.log("Does match accept types: ", contents.value[i].content.match(patterns.acceptTypes))
            if (contents.value[i].content.match(patterns.acceptTypes)) {
                for (const match of contents.value[i].content.matchAll(patterns.acceptTypes)) {
                    const accepts = match[1].split("&")
                    // console.log("Value of accpets:", match[1])
                    contents.value[i].acceptTypes = accepts
                    // append for the situation if no & appears
                    if (accepts.length === 0) {
                        contents.value[i].acceptTypes.push(match[1])
                    }
                }
            }
            else {
                console.log("program says it does not match accpet types")
                sendErrorLoadingNotification()
            }

            // append to the slot
            paramSlots.value[contents.value[i].index] = null
        }
    }

    console.log("Process finished! Result: ", contents.value)
    console.log("Param Slots: ", paramSlots.value)

}

processBlockContent()
console.log("Another check for template: " + props.contentTemplate)

/**
 * To avoid not up-to-date template data, rerender if the two checkpoints were different
 */
function regenerateTemplate() {
    if (temp !== props.contentTemplate) {
        // go through again to update information
        processBlockContent()
    }
}

function handleDelete() {
    emits("onDelete")
}

function handleOnValueChange(index, info) {
    emits("onValueChange", props.index, index, info)
}

function getSlotValue(index) {
    if (props.slots === undefined || props.slots === null) {
        return undefined
    }
    else {
        console.log("What is love? ", props.slots)
        if (props.slots[index] === undefined || props.slots[index] === null) {
            return undefined
        }
        else {
            if (props.slots[index].type === "var") {
                return "(Variable) " + props.slots[index].data.key
            }
        }
    }
}
</script>
<template>
    <div class="main-block" :id="props.id">
        <div>{{ regenerateTemplate() }}</div>
        <template v-for="i in contents">
            <div v-if="i.type === 'content'" class="inner-element">{{ i.content }}</div>
            <BlockSelectableElement v-if="i.type === 'param' && (i.acceptTypes[0] !== 'nested' && i.acceptTypes.length > 1)" :accept-type="i.acceptTypes" :index="i.index" :is-in-command="props.isInCommand" @on-value-change="handleOnValueChange" :value="getSlotValue(i.index)"></BlockSelectableElement>
            <div class="slots-occupier" v-if="i.type === 'param' && (i.acceptTypes[0] === 'nested' && i.acceptTypes.length === 1)">A nested slot occupies here</div>
        </template>
        <MinusCircleOutlined class="remove-icon-btn" v-if="props.isInCommand" @click="handleDelete"></MinusCircleOutlined>
    </div>
</template>
<style scoped>
.main-block {
    margin: 10px;
    margin-top: 0;
    margin-bottom: 7px;
    padding: 7px;
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.05);
    height: fit-content;
    font-size: small;
    user-select: none;
    transition: all 0.1s;
}
.main-block:hover {
    background-color: rgba(0, 0, 0, 0.075);
}
.inner-element {
    display: inline-block;
}

.remove-icon-btn{
    color: black;
    cursor: pointer;
}
.remove-icon-btn:hover {
    color: red;
}
.slots-occupier {
    margin: 5px;
    padding: 5px;
    display: block;
    border-radius: 5px;
    background-color: rgba(255, 0, 0, 0.1);
    color: red;
}
</style>