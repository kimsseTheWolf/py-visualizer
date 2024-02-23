import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';
import './style.css';

createApp(App).use(Antd).use(VueMonacoEditorPlugin, {
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
    }
}).mount('#app')
