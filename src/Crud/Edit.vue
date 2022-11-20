<script setup lang="ts">
import { ref } from 'vue';
import { type FormProps, type DrawerProps } from 'ant-design-vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { useForm } from '@/shared';
import NForm from '@/Crud/VForm.vue';
import type { KV, NFormItem, UProps } from '@/types';

interface Props extends UProps {
  before?: ((formData: KV) => Promise<KV>) | (() => void);
  formProps?: FormProps;
  drawerProps?: DrawerProps;
  modelValue: KV;
  items: (formData: KV) => NFormItem[];
  done: (formData: KV, row:KV) => Promise<[boolean, string?]>;
}
interface Emits {
  (type: 'success', formData: KV): void;
  (type: 'fail', error: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currentRow = ref<KV>({});

const { nFormRef, isShow, isSubmitting, save, reset, formData, setDefault } = useForm(
  props.done,
  currentRow,
  (formData) => {
    emit('success', formData);
  },
  (error) => {
    emit('fail', error);
  }
);

const isLoading = ref(false);
const errorMessage = ref('');
/**
 * Display form
 * @param row Current line
 */
async function show(row: KV) {
  isShow.value = true;
  isLoading.value = true;
  errorMessage.value = '';
  currentRow.value = row;
  try {
    setDefault(row);
    // Pre -operation, 
    // It can be used to get the default value
    if (props.before) {
      const data = await props.before(row);
      if (data) {
        setDefault(!!data ? data : {});
        formData.value = data;
      }
    }
  } catch (error) {
    console.log(error);
    errorMessage.value = 'string' === typeof error ? error : 'System failure, please try again later';
  } finally {
    isLoading.value = false;
  }
}

defineExpose({
  show,
});
</script>

<template>
  <a-drawer v-model:visible="isShow" title="Edit" size="large" v-bind="drawerProps">
    <a-skeleton :loading="isLoading" active>
      <a-result v-if="errorMessage" status="500" title="error" :sub-title="errorMessage">
        <template #extra>
          <a-button type="primary" @click="isShow = false">
            <template #icon>
              <arrow-right-outlined />
            </template>
           closure</a-button
          >
        </template>
      </a-result>
      <n-form v-else v-model="formData" ref="nFormRef" :items="items" :formProps="formProps"></n-form>
      <!-- <div v-else style="position: relative; padding: 16px">
        <n-form v-model="formData" ref="nFormRef" :items="items" :formProps="formProps"></n-form>
        <div style="display:flex;position: absolute; top: 0; right: 0; left: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2)">
          <LockOutlined style="font-size: 60px;margin:auto; color: rgba(255, 255, 255, 0.9);" />
        </div>
      </div> -->
    </a-skeleton>

    <template v-if="!isLoading && !errorMessage" #footer>
      <a-space>
        <a-button :loading="isSubmitting" @click="reset">Reset</a-button>
        <a-button type="primary" :loading="isSubmitting" @click="save">Update</a-button></a-space
      >
    </template>
  </a-drawer>
</template>
