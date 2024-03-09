<script setup>
import { Flex } from 'ant-design-vue';
import { Button, Empty, Input, Modal, Form, FormItem, Select, SelectOption, InputNumber } from 'ant-design-vue';
import { ref, computed, reactive } from 'vue';
import {PlusCircleOutlined} from "@ant-design/icons-vue"
import { getAll, dataTypes } from "../js/variableUtil"

const vars = ref(getAll())
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
            <Flex v-if="vars.length === 0" justify="center" align="center">
                <Empty>
                    <template #description>
                        还没有创建任何变量，点击左上角添加
                    </template>
                </Empty>
            </Flex>
            <Flex :vertical="false" gap="small" wrap="wrap">
                <!-- Variable tags here -->
            </Flex>
        </Flex>
    </div>
    <Modal v-model:open="interfaceControl.showCreateVarModal" title="创建新变量">
        <Flex :vertical="true" gap="small">
            <Form :model="newVarInfo" layout="vertical">
                <FormItem label="变量名称" name="name" :rules="[{required: true, message: '请输入变量名称！'}]">
                    <Input v-model:value="newVarInfo.name" placeholder="变量名"></Input>
                </FormItem>
                <FormItem label="类型" name="type" :rules="[{required: true, message: '请选择类型！'}]">
                    <Select v-model:value="newVarInfo.type">
                        <SelectOption v-for="i in Object.keys(dataTypes)" :value="i">{{ dataTypes[i] }}</SelectOption>
                    </Select>
                </FormItem>
                <FormItem v-if="newVarInfo.type === 'number'" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                    <InputNumber v-model:value="newVarValue.number"></InputNumber>
                </FormItem>
                <FormItem v-if="newVarInfo.type === 'string'" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                    <Input placeholder="字符串初始值" v-model:value="newVarValue.string"></Input>
                </FormItem>
                <FormItem v-if="newVarInfo.type === 'boolean'" label="初始值" name="name" :rules="[{required: false, message: '请指定初始值！'}]">
                    <Select v-model:value="newVarValue.boolean">
                        <SelectOption :value="true">True</SelectOption>
                        <SelectOption :value="false">False</SelectOption>
                    </Select>
                </FormItem>
            </Form>
        </Flex>
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