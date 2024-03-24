<script setup>
import { Tag, Popover, List, ListItem, ListItemMeta, Flex, Button, Modal, Input, InputNumber, Select, SelectOption, Form, FormItem, message, Empty, Alert } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';
import { dataTypes } from "../js/variableUtil"
import { useI18n } from "vue-i18n";

const {t} = useI18n()

const props = defineProps(["varProps", "enableOnClick"])
const emits = defineEmits(["onDelete", "onModify", "click"])

const colors= {
    Number: "blue",
    String: "orange",
    Bool: "green",
    List: "purple",
    Dictionary: "red"
}

const interfaceControl = ref({
    showHoverPopover: false,
    showClickedPopover: false,
    showModifyModal: false,
    showNewKeyArea: false
})

const interfaceData = ref({
    newKeyName: "",
    newKeyValue: ""
})

const newVarValue = ref({
    Number: 0,
    String: "",
    Bool: false,
    List: [],
    Dictionary: {}
})

function closePopover() {
    interfaceControl.value.showClickedPopover = false
    interfaceControl.value.showHoverPopover = false
}

function handleHoverChange(visible) {
    interfaceControl.value.showHoverPopover = visible
    interfaceControl.value.showClickedPopover = false
}

function handleClickChange(visible) {
    interfaceControl.value.showHoverPopover = false
    interfaceControl.value.showClickedPopover = visible
}

function handleDelete() {
    emits("onDelete", props.varProps.id)
}

function handleOpenModal() {
    // apply the current value to the modify value first
    newVarValue.value[props['varProps'].type] = props['varProps'].value
    interfaceControl.value.showModifyModal = true
}

function handleOnValueChange() {
    const newValueInfo = {
        id: props['varProps'].id,
        type: props['varProps'].type,
        value: JSON.parse(JSON.stringify(newVarValue.value[props['varProps'].type]))
    }
    emits("onModify", newValueInfo)
    message.info(t('variableTag.message.success'))
    interfaceControl.value.showModifyModal = false
}

function addListItem() {
    newVarValue.value.List.push("")
}

function removeListItem(index) {
    newVarValue.value.List.splice(index, 1)
}

function addDictionaryItem(key, value) {
    newVarValue.value.Dictionary[interfaceData.value.newKeyName] = interfaceData.value.newKeyValue
    interfaceData.value.newKeyName = ""
    interfaceData.value.newKeyValue = ""
}

function removeDictionaryItem(key) {
    delete newVarValue.value.Dictionary[key]
}

function handleOnClick() {
    if (props.enableOnClick === true) {
        emits("click")
    }
}
</script>
<template>
    <Popover :title="props['varProps'].key + t('variableTag.title')" placement="topLeft" style="z-index: 10000;">
        <template #content>
            <Flex :vertical="true" gap="small">
                <List size="small">
                    <ListItem>
                        <b>{{t('variableTag.name')}}</b> {{ props['varProps'].key }}
                    </ListItem>
                    <ListItem>
                        <b>{{t('variableTag.type')}}</b> <Tag :color="colors[props['varProps'].type]"> {{ props['varProps'].type }}</Tag>
                    </ListItem>
                    <ListItem>
                        <b>{{t('variableTag.initValue')}}</b> {{ props['varProps'].value }}
                    </ListItem>
                    <ListItem v-if="!enableOnClick">
                        <b>{{t('variableTag.id')}}</b> {{ props['varProps'].id }}
                    </ListItem>
                </List>
                <Flex :vertical="false" gap="small" v-if="!enableOnClick">
                    <Button type="text" @click="handleOpenModal()"><EditOutlined/>{{t('general.modify')}}</Button>
                    <Button type="text" danger @click="handleDelete"><DeleteOutlined/>{{t('general.delete')}}</Button>
                </Flex>
            </Flex>
        </template>
        <Tag :color="colors[props['varProps'].type]" style="font-size: 15px; padding: 5px; cursor: pointer;" @click="handleOnClick">{{props['varProps'].key}}</Tag>
    </Popover>
    <Modal :title="t('variableTag.edit.title')" v-model:open="interfaceControl.showModifyModal">
        <Flex :vertical="true" gap="small">
            <div>{{t('variableTag.edit.itemTitle')}}</div>
            <InputNumber v-if="props['varProps'].type === dataTypes.number" v-model:value="newVarValue.Number"></InputNumber>
            <Input v-if="props['varProps'].type === dataTypes.string" v-model:value="newVarValue.String"></Input>
            <Select v-if="props['varProps'].type === dataTypes.boolean" v-model:value="newVarValue.Bool">
                <SelectOption :value="true">True</SelectOption>
                <SelectOption :value="false">False</SelectOption>
            </Select>
            <Form v-if="props['varProps'].type === dataTypes.list" style="max-height: 500px; overflow-y: auto;">
                <FormItem>
                    <Button type="primary" @click="addListItem"><PlusCircleOutlined/>{{t('variableTag.edit.list.addItem')}}</Button>
                </FormItem>
                <FormItem v-if="newVarValue.List.length === 0">
                    <Empty :description="t('variableTag.edit.list.emptyDescription')"/>
                </FormItem>
                <FormItem v-for="({i}, index) in newVarValue.List">
                    <Flex :vertical="false" gap="small">
                        <DeleteOutlined @click="removeListItem(index)"/>
                        <Input v-model:value="newVarValue.List[index]" :placeholder="t('variableTag.edit.list.elementPlaceholder')"></Input>
                    </Flex>
                </FormItem>
            </Form>
            <Form v-if="props['varProps'].type === dataTypes.dictionary" style="max-height: 500px; overflow-y: auto;">
                <Alert :message="t('variableTag.edit.dictionary.warning')" type="warning" closable banner style="margin-bottom: 10px;"></Alert>
                <FormItem>
                    <Button type="primary" @click="interfaceControl.showNewKeyArea = !interfaceControl.showNewKeyArea"><PlusCircleOutlined/>{{t('variableTag.edit.dictionary.addItem')}}</Button>
                </FormItem>
                <FormItem v-if="interfaceControl.showNewKeyArea">
                    <Flex :vertical="false" gap="small" align="center">
                        <Flex :vertical="true" gap="small">
                            <div>{{t('variableTag.edit.dictionary.keyPlaceholder')}}</div>
                            <Input v-model:value="interfaceData.newKeyName"></Input>
                        </Flex>
                        <Flex :vertical="true" gap="small">
                            <div>{{t('variableTag.edit.dictionary.valuePlaceholder')}}</div>
                            <Input v-model:value="interfaceData.newKeyValue"></Input>
                        </Flex>
                        <Flex :vertical="true" gap="small">
                            <div>&nbsp;</div>
                            <Button type="primary" @click="addDictionaryItem(interfaceData.newKeyName, interfaceData.newKeyValue)">{{t('general.create')}}</Button>
                        </Flex>
                    </Flex>
                </FormItem>
                <FormItem v-if="Object.keys(newVarValue.Dictionary).length === 0">
                    <Empty :description="t('variableTag.edit.dictionary.emptyDescription')"/>
                </FormItem>
                <FormItem v-for="i in Object.keys(newVarValue.Dictionary)">
                    <Flex :vertical="false" gap="small">
                        <DeleteOutlined @click="removeDictionaryItem(i)"/>
                        <div style="width:15%">{{ i }}</div>
                        <Input v-model:value="newVarValue.Dictionary[i]" :placeholder="t('variableTag.edit.dictionary.keyPlaceholder')"></Input>
                    </Flex>
                </FormItem>
            </Form>
        </Flex>
        <template #footer>
            <Button type="primary" @click="handleOnValueChange()">{{t('general.apply')}}</Button>
            <Button @click="interfaceControl.showModifyModal = false">{{ t('general.cancel') }}</Button>
        </template>
    </Modal>
</template>
<style scoped>
</style>