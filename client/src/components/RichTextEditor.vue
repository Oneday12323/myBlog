<template>
    <div>
        <!-- 封装富文本编辑器 -->

        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 600px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { reactive, ref, inject, onMounted, shallowRef, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject('server_url')
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: "uploadVideo" };
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 10 * 1024, // 10kb
    server: server_url + '/upload/rich_editor_upload',
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        //查看文件路径是否包含http，如果不包含，就补回去
        if (src.indexOf("http") != 0) {
            return `${server_url}${src}`
        }
        return src
    },
}


const mode = ref("default");
const valueHtml = ref("");


//定义属性，要传递出去
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
//定义emit事件，用来把修改后的事件往外抛出去
const emit = defineEmits(["update:model-value"]);

let initFinished = false
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true
    }, 10)
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    //修改之后把值传出去
    if (initFinished) {
        //initFinished意思是初始化成功再把值传出去
        emit("update:model-value", valueHtml.value)
    }
};
</script>

<style lang="scss" scoped>

</style>