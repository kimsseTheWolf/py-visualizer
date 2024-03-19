<script setup>
import { Flex, message } from 'ant-design-vue';
import { Button, Empty, Input, Modal, Form, FormItem, Select, SelectOption, InputNumber, Tag } from 'ant-design-vue';
import { ref, computed, reactive, toRefs, toRef } from 'vue';
import {PlusCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue"
import { getAll, dataTypes, createNewVar, deleteVar, setValue } from "../js/variableUtil"
import VariableTag from "./VariableTag.vue"

const vars = ref([])
const emits = defineEmits(["onVarChange"])
vars.value = getAll()
const shouldEnableCreateBtn = computed(()=>{
    if (newVarInfo.name === "" || newVarInfo.type === "") {
        return false
    }
    else {
        return true
    }
})
const interfaceControl = ref({
    showCreateVarModal: false
})
const newVarInfo = reactive({
    name: "",
    type: "",
    value: ""
})
const newVarValue = reactive({
    number: 0,
    string: "",
    boolean: false
})

const colors= {
    Number: "blue",
    String: "orange",
    Bool: "green"
}

function createNewVariable() {
    // create new var
    const key = newVarInfo.name
    const type = newVarInfo.type
    let value = undefined
    if (type === dataTypes.string) {
        value = newVarValue.string
    }
    else if (type === dataTypes.number) {
        value = newVarValue.number
    }
    else if (type === dataTypes.boolean) {
        value = newVarValue.boolean
    }
    else if (type === dataTypes.list) {
        value = []
    }
    else if (type === dataTypes.dictionary) {
        value = {}
    }
    else {
        message.error("创建变量出现错误：未知的数据类型")
        return
    }
    const result = createNewVar(key, type, value)
    if (!result) {
        message.error("创建失败")
        return
    }

    // refresh the list
    vars.value = getAll()
    console.log(vars.value)

    // clear the info and values
    newVarInfo.name = ""
    newVarInfo.type = ""
    newVarValue.boolean = false
    newVarValue.number = 0
    newVarValue.string = ""

    // notify the user the process is finished
    message.success("创建成功")
}

function handleVarDelete(id) {
    deleteVar(id)
    // refresh the list
    vars.value = getAll()
    message.success("删除成功")
}

/**
 * @param {Object} info the metadata of changed variable
 * 
 * Inclduing the following information:
 *  - id
 *  - type
 *  - newValue
 */
function handleOnChange(info) {
    console.log("Value has been modified! Received!", info.id, info.value)
    setValue(info.id, info.value)
    vars.value = getAll()
    console.log("New list: ", vars.value)
    emits("onVarChange", info)
}

</script>
<template>
    <div class="main-block">
        <Flex :vertical="true" gap="small">
            <div style="font-weight: bold; font-size: 15px;">变量管理</div>
            <Flex :vertical="false" gap="small" align="center">
                <Button size="small" type="primary" shape="round" @click="interfaceControl.showCreateVarModal = true">
                    <PlusCircleOutlined/>
                </Button>
                <Input placeholder="搜索变量"></Input>
            </Flex>
            <Flex v-if="vars.length == 0" justify="center" align="center">
                <Empty>
                    <template #description>
                        还没有创建任何变量，点击左上角添加
                    </template>
                </Empty>
            </Flex>
            <Flex :vertical="false" gap="small" wrap="wrap">
                <VariableTag v-for="i in vars" :var-props="i" @on-delete="handleVarDelete" @on-modify="handleOnChange" :enable-on-click="false"/>
            </Flex>
        </Flex>
    </div>
    <Modal v-model:open="interfaceControl.showCreateVarModal" title="创建新变量">
        <Form :model="newVarInfo" layout="vertical">
                <FormItem label="变量名称" name="name" :rules="[{required: true, message: '请输入变量名称！'}]">
                    <Input v-model:value="newVarInfo.name" placeholder="变量名"></Input>
                </FormItem>
                <FormItem label="类型" name="type" :rules="[{required: true, message: '请选择类型！'}]">
                    <Select v-model:value="newVarInfo.type">
                        <SelectOption v-for="i in Object.keys(dataTypes)" :value="dataTypes[i]">{{ dataTypes[i] }}</SelectOption>
                    </Select>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.number" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                    <InputNumber v-model:value="newVarValue.number"></InputNumber>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.string" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                       <Input placeholder="字符串初始值" v-model:value="newVarValue.string"></Input>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.boolean" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                    <Select v-model:value="newVarValue.boolean">
                        <SelectOption :value="true">True</SelectOption>
                        <SelectOption :value="false">False</SelectOption>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" :disabled="!shouldEnableCreateBtn" @click="createNewVariable()">创建</Button>
                </FormItem>
            </Form>
        <template #footer>
            
        </template>
    </Modal>
</template>
<style>
.main-block {
    margin: 10px;
    margin-top: 0;
    margin-bottom: 7px;
    padding: 10px;
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.05);
    height: fit-content;
    font-size: small;
    user-select: none;
    transition: all 0.1s;
}
</style>