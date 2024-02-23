<script setup>
import draggable from "vuedraggable"
import { Dropdown, Menu, MenuItem, Button, Input, Tabs, TabPane } from 'ant-design-vue';
import {
  UploadOutlined, 
  SaveOutlined, 
  ExportOutlined, 
  CopyOutlined, 
  PaperClipOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
  GithubOutlined
} from '@ant-design/icons-vue'
import { ref, computed } from 'vue';
import MenuBtn from "./components/MenuBtn.vue"
import BlockSectionSelector from "./components/BlockSectionSelector.vue";

const fileName = ref("")
const interfaceControl = ref({
  showFileNameInput: false,
  showCodePreview: true
})
const interfaceData = ref({
  blockTabActiveKey: "io"
})
const VSOPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  readOnly: true
}
const WorkPanelFlex = computed(()=> {
  if (interfaceControl.value.showCodePreview) {
    return {flex: "2"}
  }
  else {
    return {flex: "4"}
  }
})

</script>

<template>
  <div class="main-window">
    <div class="title-bar">
      <div style="width: 20px;">&nbsp;</div>
      <div class="column item">
        <div class="row">
          <div class="file-name item" style="margin-left: 5px;">
            <div v-if="!interfaceControl.showFileNameInput">{{ fileName === "" ? "New File" : fileName }}</div>
            <Input v-if="interfaceControl.showFileNameInput" placeholder="New File Name" v-model:value="fileName"/>
          </div>
          <Button type="primary" size="small" @click="interfaceControl.showFileNameInput = !interfaceControl.showFileNameInput">
            <EditOutlined/>
            Change
          </Button>
        </div>
        <div class="row">
          <Dropdown>
            <MenuBtn>File</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1">
                  <UploadOutlined/>
                  Upload from computer
                </MenuItem>
                <MenuItem key="2">
                  <SaveOutlined/>
                  Save
                </MenuItem>
                <MenuItem key="3">
                  <ExportOutlined/>
                  Export as Metacode file
                </MenuItem>
                <MenuItem key="4">
                  <ExportOutlined/>
                  Export as Python file
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>Edit</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1">
                  <CopyOutlined/>
                  Copy
                </MenuItem>
                <MenuItem key="2">
                  <PaperClipOutlined/>
                  Paste
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>Views</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1" @click="interfaceControl.showCodePreview = !interfaceControl.showCodePreview">
                  <EyeOutlined v-if="!interfaceControl.showCodePreview"/>
                  <EyeInvisibleOutlined v-if="interfaceControl.showCodePreview"/>
                  Toggle Code Preview
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>Help</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1">
                  <InfoCircleOutlined/>
                  About
                </MenuItem>
                <MenuItem key="2">
                  <GithubOutlined/>
                  GitHub
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <div class="main-body">
      <div class="block-panel panel">
        <BlockSectionSelector/>
        
      </div>
      <div class="work-panel panel" :style="WorkPanelFlex"></div>
      <div class="code-panel panel" v-if="interfaceControl.showCodePreview">
        <vue-monaco-editor
        theme="vs-light"
        language="python"
        :options="VSOPTIONS"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
