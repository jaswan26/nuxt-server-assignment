<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import type { FormInstance, FormProps } from 'ant-design-vue';
import type { NFormItem, KV } from '@/types';
import cloneDeep from 'lodash/cloneDeep';
import { computed } from 'vue';

interface Props {
  modelValue: KV;
  formProps?: FormProps;
  items: (formData: KV) => NFormItem[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
});

const isLoading = ref(true);
const formData = ref<KV>(props.modelValue || {});
// Back up the fields and data deleted in the form, 
 // When Formitem is deleted, FormData will delete the corresponding value, 
 // FormDataBackup will back up, 
 // So when Formitem appears again, 
 // Synchronize the corresponding value from FormDataBackup to FormData
const formDataBackup = ref<KV>({})
const defaultValueMap: KV = !!props.modelValue ? cloneDeep(props.modelValue) : {};
watch(
  () => props.modelValue,
  (modelValue) => {
    formData.value = cloneDeep(modelValue);
  }
);



// Structure data
const formItems = computed(() => props.items(formData.value));

// Determine the title width according to the number of Label words
const labelCol = computed(() => {
  const labelSizes: number[] = [];
  formItems.value.forEach(({ label }) => {
    if (label) {
      labelSizes.push(calcStringSize(label))
    }
  });
  const max = Math.max(...labelSizes);
  return { span: Math.ceil(max / 3) };
});
// console.log(labelCol);

/**
 * Calculate character length
 * @param inputString Input string
 * @return length
 */
function calcStringSize(inputString: string): number {
  var len = 0;
  for (var i = 0; i < inputString.length; i++) {
    var c = inputString.charCodeAt(i);
    //Single byte plus 1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

// If Items decreases,
// Then simultaneously delete the corresponding data on FormData
const formItemNamesMap = ref<Record<string, 1>>({});
watch(formItemNamesMap, formItemNamesMap => {
  for (const name in formData.value) {
    // Form data that does not exist in FormIITEMS in FormData
    if (1 !== formItemNamesMap[name]) {
      // The value of the backup delete
      formDataBackup.value[name] = formData.value[name];
      // delete
      Reflect.deleteProperty(formData.value, name);
      // delete formData.value[name];
    }
  }
})

watch(formItems, (formItems) => {
  //Table name mapping
  formItemNamesMap.value = {};

  formItems.forEach((item) => {
    const { name, defaultValue } = item;
    //Synchronous default value
    if (void 0 !== name) {
      // Record the key value in Formitems
      formItemNamesMap.value[name] = 1;

   // Re -judge the form value of the form 
       // The values set before recovery to the form item
      formData.value[name] = formData.value[name] ?? formDataBackup.value[name] ?? defaultValue;
    }
  });
},
  { immediate: true, deep: true }
);

isLoading.value = false;
const formRef = ref<FormInstance>();

/**
  * Get the VMODEL name that the form item should use 
  * @param item form single item configuration information
 */
function getVModelName(item: NFormItem) {
  return item.modelName || 'value';
}

/**
 * Reset form
 */
async function reset() {
  // console.log(cloneDeep(defaultValueMap));
  // formData.value = cloneDeep(defaultValueMap);
  // console.log(formRef.value?.scrollToField);
  // formRef.value?.scrollToField('mouldName')
  formRef.value?.resetFields();

}

const isShowFormItem = ref(false);
async function toggleItem() {
  isShowFormItem.value = !isShowFormItem.value;
}

defineExpose({ formRef, reset, toggleItem });
</script>

<template>
  <!-- {{ defaultValueMap }} -->
  <a-form v-if="!isLoading && void 0 !== formData" ref="formRef" :model="formData" :labelCol="labelCol"
    v-bind="formProps">
    <!-- {{ formData }} -->
    <template v-for="item in formItems" :key="item.name">
      <a-form-item v-if="!('toggle' in item && !isShowFormItem)" colon :id="item.name" v-bind="item">
        <!-- {{formData[item.name]}} -->

        <!-- Form class component -->
        <component v-if="item.name" :is="item.is" v-bind="{
          allowClear: true,
          placeholder: `please enter${item.label || ''}`,
          ...item.props,
        }" v-model:[getVModelName(item)]="formData[item.name as string]">
        </component>
        <!--Pure display component -->
        <component v-else :is="item.is" v-bind="item.props"></component>
      </a-form-item>
    </template>
    <slot name="after"></slot>
  </a-form>
</template>
