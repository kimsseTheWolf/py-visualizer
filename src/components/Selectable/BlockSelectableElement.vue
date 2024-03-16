<script setup>
import { Dropdown, Menu, MenuItem, Flex, Popover, Empty } from 'ant-design-vue';
import {ref, computed} from "vue"
import {getAll} from "../../js/variableUtil"
import BlockSelectableButton from './BlockSelectableButton.vue';
import VariableTag from '../VariableTag.vue';
/**
 * Properties of the element. Index is to indicate which element it is, and acceptType is the value tells the element what things are accepted
 */
const props = defineProps(["index", "acceptType", "isInCommand", "value"])
const emits = defineEmits(["onValueChange"])
const btnContent = computed(()=>{
    if (props.value === undefined || props.value === null) {
        return ""
    }
    else {
        return props.value
    }
})
const selectableValues = computed(()=>{
    let result = []
    for (let i = 0; i < props.acceptType.length; i++) {
        if (props.acceptType[i] === "var") {
            result.push({
                name: "Variable",
                value: "var"
            })
        }
        else if (props.acceptType[i] === "value") {
            result.push({
                name: "Value",
                value: "value"
            })
        }
    }
    return result
})
const interfaceControl = ref({
    openOverflow: false
})
const interfaceData = ref({
    selectedPage: []
})
const variables = ref(getAll())

function handleValueOnChange(type, data) {
    if (type === "var") {
        btnContent.value = "(Variable) " + data.key
    }
    else if (type === "value") {
        btnContent.value = "(Value) " + data
    }
    emits("onValueChange", props.index, {
        type: type,
        data: data,
        content: btnContent.value
    })
}

</script>
<template>
    <Popover v-if="props.isInCommand" @open-change="variables = getAll()">
        <BlockSelectableButton :content="btnContent"/>
        <template #content>
            <div class="dropdown-main-box">
                <div style="height: 100% !important;">
                    <Menu v-model:selected-keys="interfaceData.selectedPage" mode="inline" class="inbox-menu">
                        <MenuItem v-for="i in selectableValues" :key="i.value">{{ i.name }}</MenuItem>
                    </Menu>
                </div>
                <div class="main-content-box">
                    <div v-if="interfaceData.selectedPage[0] === 'value'" class="content-box"></div>
                    <div v-else-if="interfaceData.selectedPage[0] === 'var'" class="content-box">
                        <Flex :vertical="false" gap="small" wrap="wrap">
                            <VariableTag v-for="i in variables" :var-props="i" :enable-on-click="true" @click="handleValueOnChange('var', i)"></VariableTag>
                            <div v-if="variables.length === 0">No variables right now. You could create one in the variable section.</div>
                        </Flex>
                    </div>
                    <div v-else class="content-box full-center">
                        Choose a data type from the menu on the left
                    </div>
                </div>
            </div>
        </template>
    </Popover>
    <BlockSelectableButton :content="btnContent" v-if="!props.isInCommand"/>
</template>
<style scoped>
.dropdown-main-box {
    width: 50vh;
    height: 30vh;
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    padding: 5px;
    display: flex;
    flex-direction: row;
}

.inbox-menu {
    box-shadow: none !important;
    height: 100% !important;
}

.main-content-box {
    display: flex;
    flex-direction: row;
    flex: auto;
}

.content-box {
    display: flex;
    flex-direction: column;
    flex: auto;
    margin-left: 5px;
}

.full-center {
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>