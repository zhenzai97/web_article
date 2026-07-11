<script setup>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css"

const props = defineProps({
  height: {
    type: String,
    default: "480px"
  }
})

const model = defineModel({ default: "" })

const editorRef = shallowRef()
const mode = "default"

const bodyStyle = computed(() => ({
  "--editor-body-height": props.height
}))

const toolbarConfig = {
  excludeKeys: ["group-video", "fullScreen"]
}

const editorConfig = {
  placeholder: "请输入正文内容..."
}

function handleCreated(editor) {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<template>
  <div class="rich-editor" :style="bodyStyle">
    <Toolbar
      class="rich-editor__toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <div class="rich-editor__wrapper">
      <Editor
        v-model="model"
        class="rich-editor__body"
        :default-config="editorConfig"
        :mode="mode"
        @on-created="handleCreated"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rich-editor {
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  &__toolbar {
    flex-shrink: 0;
    border-bottom: 1px solid var(--el-border-color);
  }

  &__wrapper {
    height: var(--editor-body-height, 480px);
    overflow: hidden;
  }

  &__body {
    height: 100% !important;
    overflow: hidden;
  }

  /* wangEditor 内部容器需穿透设置高度 */
  :deep(.w-e-text-container) {
    height: var(--editor-body-height, 480px) !important;
  }

  :deep(.w-e-scroll) {
    min-height: 100% !important;
  }
}
</style>
