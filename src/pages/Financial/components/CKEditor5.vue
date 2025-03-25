<template>
  <div class="vhtml-text" :class="{ 'error-class': error }">
    <ckeditor
      :class="{ 'ck-editor__editable_inline': error }"
      :editor="editorConstructor"
      v-model="editorData"
      :config="editorConfig"
      @ready="initEditor"
    />
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import UploadAdapter from "./UploadAdater.ts";

export default {
  name: "app",
  data() {
    return {
      editorConstructor: ClassicEditor,
      editor: undefined,
      editorData: this.modelValue,
      editorConfig: {},
    };
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    error: {
      type: Boolean,
    },
  },
  methods: {
    initEditor(editor) {
      this.editor = editor;
      this.editor.plugins.get("FileRepository").createUploadAdapter = (
        loader
      ) => {
        return new UploadAdapter(loader);
      };
    },
  },
  emits: ["update:modelValue"],
  watch: {
    editorData: function (val) {
      this.$emit("update:modelValue", val);
    },
    modelValue: function (val) {
      this.editorData = val;
    },
  },
};
</script>

<style>
:root {
  --ck-color-focus-border: #43b7b1;
  --ck-color-focus-outer-shadow: rgba(67, 183, 177, 0.5);
  --ck-color-button-on-hover-background: rgba(67, 183, 177, 0.3);
  --ck-color-button-on-background: rgba(67, 183, 177, 0.1);
  --ck-color-list-button-on-background: #43b7b1;
  --ck-color-list-button-on-background-focus: #43b7b1;
}

.ck.ck-icon :not([fill]) {
  fill: black;
}

.ck-on .ck.ck-icon :not([fill]) {
  fill: #43b7b1;
}

.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-blurred,
.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-focused {
  height: 240px;
  overflow-y: scroll;
  box-shadow: none;
}

.ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline {
  background: #f3f6f9;
  border-radius: 6px;
}
/*.ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline {*/
/*  border: 1px solid red;*/
/*}*/

.error-class {
  border: 1px solid red;
  border-radius: 8px;
}
</style>
