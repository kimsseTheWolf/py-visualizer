<script setup>
import { Dropdown, Menu, MenuItem, Flex, Popover, Empty, Tabs, TabPane, Input, InputNumber, Select, SelectOption, Button } from 'ant-design-vue';
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
    selectedPage: [],
    selectedTab: "0",
    setValue: {
        number: 0,
        string: "",
        boolean: false
    }
})
const variables = ref(getAll())

function handleValueOnChange(type, data) {
    console.log("Change Value Handled!")
    emits("onValueChange", props.index, {
        type: type,
        data: data,
        content: btnContent.value
    })
}

function handleStaticValueOnChange() {
    console.log("Change Handled Value Handled!")
    // pre-process data
    let value = undefined
    if (interfaceData.value.selectedTab === "0") {
        value = "\"" + interfaceData.value.setValue.string + "\""
    }
    else if (interfaceData.value.selectedTab === "1") {
        value = interfaceData.value.setValue.number
    }
    else if (interfaceData.value.selectedTab === "2") {
        value = interfaceData.value.setValue.boolean
    }
    // send the data out for update
    emits("onValueChange", props.index, {
        type: 'value',
        data: value,
        content: ""
    })
    // reset local input
    interfaceData.value.setValue.string = ""
    interfaceData.value.setValue.number = 0
    interfaceData.value.setValue.boolean = false
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
                    <div v-if="interfaceData.selectedPage[0] === 'value'" class="content-box">
                        <Flex :vertical="true" gap="small" style="margin-left: 8px;">
                            <Tabs v-model:active-key="interfaceData.selectedTab">
                                <TabPane key="0" tab="String">
                                    <Input v-model:value="interfaceData.setValue.string" placeholder="Input your string here"></Input>
                                </TabPane>
                                <TabPane key="1" tab="Number">
                                    <InputNumber v-model:value="interfaceData.setValue.number" placeholder="Numer"></InputNumber>
                                </TabPane>
                                <TabPane key="2" tab="Boolean">
                                    <Select v-model:value="interfaceData.setValue.boolean">
                                        <SelectOption :value="true">True</SelectOption>
                                        <SelectOption :value="false">False</SelectOption>
                                    </Select>
                                </TabPane>
                            </Tabs>
                            <Button type="primary" @click="handleStaticValueOnChange">Apply current value</Button>
                        </Flex> 
                    </div>
                    <div v-else-if="interfaceData.selectedPage[0] === 'var'" class="content-box">
                        <Flex :vertical="false" gap="small" wrap="wrap">
                            <VariableTag v-for="i in variables" :var-props="i" :enable-on-click="true" @click="handleValueOnChange('var', i)"></VariableTag>
                        </Flex>
                        <Flex :vertical="true" gap="small" align="center" justify="center" v-if="variables.length === 0" style="height: 100%;">
                            <Empty description="No variables right now. Create one from the manager under variable tab"/>
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
    border-style: none;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    /* padding: 5px; */
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