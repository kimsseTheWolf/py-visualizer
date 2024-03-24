<script setup>
import { Flex, message } from 'ant-design-vue';
import { Button, Empty, Input, Modal, Form, FormItem, Select, SelectOption, InputNumber, Tag } from 'ant-design-vue';
import { ref, computed, reactive, toRefs, toRef } from 'vue';
import {PlusCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue"
import { getAll, dataTypes, createNewVar, deleteVar, setValue } from "../js/variableUtil"
import VariableTag from "./VariableTag.vue"
import { useI18n } from "vue-i18n";

const {t} = useI18n()

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
        message.error(t("variableManager.messages.unknownTypeError"))
        return
    }
    const result = createNewVar(key, type, value)
    if (!result) {
        message.error(t("variableManager.messages.error"))
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
    message.success(t("variableManager.messages.createSuccess"))
}

function handleVarDelete(id) {
    deleteVar(id)
    // refresh the list
    vars.value = getAll()
    message.success(t("variableManager.messages.deleteSuccess"))
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
            <div style="font-weight: bold; font-size: 15px;">{{ t("variableManager.title") }}</div>
            <Flex :vertical="false" gap="small" align="center">
                <Button size="small" type="primary" shape="round" @click="interfaceControl.showCreateVarModal = true">
                    <PlusCircleOutlined/>
                </Button>
                <Input :placeholder="t('variableManager.searchVariablePlaceholder')"></Input>
            </Flex>
            <Flex v-if="vars.length == 0" justify="center" align="center">
                <Empty>
                    <template #description>
                        {{ t("variableManager.emptyDescription") }}
                    </template>
                </Empty>
            </Flex>
            <Flex :vertical="false" gap="small" wrap="wrap">
                <VariableTag v-for="i in vars" :var-props="i" @on-delete="handleVarDelete" @on-modify="handleOnChange" :enable-on-click="false"/>
            </Flex>
        </Flex>
    </div>
    <Modal v-model:open="interfaceControl.showCreateVarModal" :title="t('variableManager.createModal.title')">
        <Form :model="newVarInfo" layout="vertical">
                <FormItem :label="t('variableManager.createModal.name.title')" name="name" :rules="[{required: true, message: t('variableManager.createModal.name.message')}]">
                    <Input v-model:value="newVarInfo.name" :placeholder="t('variableManager.createModal.name.placeholder')"></Input>
                </FormItem>
                <FormItem :label="t('variableManager.createModal.type.title')" name="type" :rules="[{required: true, message: t('variableManager.createModal.type.message')}]">
                    <Select v-model:value="newVarInfo.type">
                        <SelectOption v-for="i in Object.keys(dataTypes)" :value="dataTypes[i]">{{ dataTypes[i] }}</SelectOption>
                    </Select>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.number" :label="t('variableManager.createModal.value.title')" name="name" :rules="[{required: false, message: t('variableManager.createModal.value.message')}]">
                    <InputNumber v-model:value="newVarValue.number"></InputNumber>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.string" :label="t('variableManager.createModal.value.title')" name="name" :rules="[{required: false, message: t('variableManager.createModal.value.message')}]">
                       <Input :placeholder="t('variableManager.createModal.value.placeholder')" v-model:value="newVarValue.string"></Input>
                </FormItem>
                <FormItem v-if="newVarInfo.type === dataTypes.boolean" :label="t('variableManager.createModal.value.title')" name="name" :rules="[{required: false, message: t('variableManager.createModal.value.message')}]">
                    <Select v-model:value="newVarValue.boolean">
                        <SelectOption :value="true">True</SelectOption>
                        <SelectOption :value="false">False</SelectOption>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" :disabled="!shouldEnableCreateBtn" @click="createNewVariable()">{{t('general.create')}}</Button>
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