<script setup>
import draggable from "vuedraggable"
import { Dropdown, Menu, MenuItem, MenuDivider, Button, Input, Tabs, TabPane, Modal, ButtonGroup, Select, SelectOption, message } from 'ant-design-vue';
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
  GithubOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'
import { ref, computed } from 'vue';
import MenuBtn from "./components/MenuBtn.vue"
import BlockSectionSelector from "./components/BlockSectionSelector.vue";
import BlockPanel from "./components/BlockPanel.vue";
import CommandPanel from "./components/CommandPanel.vue";
import {initializeLanguage, languages, getCurrentLanguage, setCurrentLanguage} from "./js/languageUtil"
import {getBlockInfo} from "./js/blockLoaderUtil"

initializeLanguage()

const fileName = ref("")
const interfaceControl = ref({
  showFileNameInput: false,
  showCodePreview: true,
  showLanguageModal: false,
})
const interfaceData = ref({
  blockTabActiveKey: "basic.io",
  currentSelectedLang: getCurrentLanguage(),
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
/**
 * Get all tabs info. In future embedding in apps, will also add support to load local third party language extensions
 */
const tabsInfo = computed(()=>{
  let list = getBlockInfo()
  console.log(list[0]["name"][getCurrentLanguage()])
  let result = []
  for (let i = 0; i < list.length; i++) {
    result.push({
      "id": list[i]["id"],
      "name": list[i]["name"][getCurrentLanguage()],
      "blocks": list[i]["blocks"]
    })
  }
  return result
})

/**
 * Get the event from the tab box. Change the blocks to the contents that belongs to the tab. (Handler)
 * @param {String} tabID The received target tabID
 */
function onTabChangeHandler(tabID) {
    interfaceData.value.blockTabActiveKey = tabID
    console.log("Tab changed")
}

function handleSetLanguage() {
  setCurrentLanguage(interfaceData.value.currentSelectedLang)
  message.success("Success! In order to take effect, save your work and refresh this page")
}
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
        <div class="row" style="margin-bottom: 0;">
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
                <MenuDivider/>
                <MenuItem key="3" @click="interfaceControl.showLanguageModal = true">
                  <GlobalOutlined/>
                  Languages
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
        <BlockSectionSelector @on-tab-change="onTabChangeHandler"/>
        <BlockPanel :currentid="interfaceData.blockTabActiveKey"/>
      </div>
      <div class="work-panel panel" :style="WorkPanelFlex">
        <CommandPanel/>
      </div>
      <div class="code-panel panel" v-if="interfaceControl.showCodePreview">
        <vue-monaco-editor
        theme="vs-light"
        language="python"
        :options="VSOPTIONS"
        />
      </div>
    </div>
  </div>


  <Modal title="Choose a language" v-model:visible="interfaceControl.showLanguageModal">
    <div style="display: flex; flex-direction: column;">
      <div>Choose an desired language from the dropbox below, you need to refresh your page to apply changes:</div>
      <Select v-model:value="interfaceData.currentSelectedLang" style="margin-top: 5px;">
        <SelectOption v-for="i in languages" :value="i.value">{{ i.name }}</SelectOption>
      </Select>
      <div style="margin-top: 5px;">We also welcome people from the community to contribute on different language translations in order to bring this tool to everyone around the world.</div>
      <div style="margin-top: 5px;">Please visit out GitHub Repository to have more information on translation contribution.</div>
    </div>
    <template #footer>
      <Button type="primary" @click="handleSetLanguage">Apply</Button>
      <Button @click="interfaceControl.showLanguageModal = !interfaceControl.showLanguageModal">Cancle</Button>
    </template>
  </Modal>
</template>

<style scoped>

</style>
