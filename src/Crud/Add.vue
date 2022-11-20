<script setup lang="ts">
import { type FormProps, type ModalProps } from 'ant-design-vue';
import NForm from '@/Crud/VForm.vue';
import { useForm } from '@/shared';
import type { NFormItem, KV, CProps } from '@/types';

// Vue cannot derive the imported CPROPS, 
 // So here is props and cprops the same content, 
 // Extends is used to restrain PROPS
interface Props extends CProps {
  modalProps?: ModalProps;
  before?: ((formData: KV) => Promise<void>) | (() => void);
  formProps?: FormProps;
  modelValue: KV;
  items: (formData: KV) => NFormItem[];
  done: (formData: KV) => Promise<[boolean, string?]>;
}

interface Emits {
  (type: 'success', formData: KV): void;
  (type: 'fail', error: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function onReset() {
  const elList = document.querySelectorAll('.modal-add');
  for (const el of Array.from(elList)) {
    el.querySelector('.ant-modal-body')?.scrollTo(0, 0);
  }
}

const { nFormRef, isShow, isSubmitting, save, reset, formData, setDefault } = useForm(
  props.done,
  void 0,
  (formData) => {
    emit('success', formData);
  },
  (error) => {
    console.log(error);
    emit('fail', error);
  },
  onReset
);

setDefault({});

defineExpose({
  reset,
  show() {
    isShow.value = true;
  },
});
</script>

<template>
  <a-modal
    class="modal-add"
    ref="modalRef"
    v-model:visible="isShow"
    title="Newly built"
    width="52%"
    :bodyStyle="{ overflowY: 'auto', maxHeight: '70vh' }"
    v-bind="modalProps"
  >
    <n-form ref="nFormRef" v-model="formData" :items="items" :formProps="formProps"></n-form>
    <template #footer>
      <a-button :loading="isSubmitting" @click="reset">Reset</a-button>
      <a-button type="primary" :loading="isSubmitting" @click="save">Create</a-button>
    </template>
  </a-modal>
</template>
