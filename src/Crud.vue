<script setup lang="ts">
import { CloudDownloadOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import { ref, reactive, watch, computed, onBeforeMount, type PropType } from 'vue';
import { toggleFull } from 'be-full';
import { message } from 'ant-design-vue';
import * as xlsx from 'xlsx';
import ColumnSort from '@/Crud/ColumnSort.vue';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';
import Add from './Crud/Add.vue';
import Edit from './Crud/Edit.vue';
import NForm from './Crud/VForm.vue';
import type { CProps, DProps, RProps, UProps, KV } from '@/types';
import { _warn } from '@/shared';
// The data source required by the form
type tableData = {
  list: { [k: string]: unknown }[];
  total: string;
};

// In order to be able to generate D.TS correctly, 
 // Here we must use JS logic to define props, 
 // and ensure that there is a "props" variable
const props = defineProps({
  primaryKey: {
    type: String,
    required: true,
  },
  r: {
    type: Object as PropType<RProps>,
    required: true,
  },
  c: Object as PropType<CProps>,
  u: Object as PropType<UProps>,
  d: Object as PropType<DProps>,
});
const emit = defineEmits<{
  (type: 'remove-fail', error: unknown): void;
  (type: 'show-one', one: KV): void;
}>();

// Before display
const isLoading = ref(false);
const columnConfig = ref(cloneDeep(props.r.columns)!);
function changeColumns(columns: any) {
  columnConfig.value = columns;
}

// Initialize
onBeforeMount(async () => {
  if (props.r.before) {
    isLoading.value = true;
    await props.r.before();
    isLoading.value = false;
  }
});

// Filter
const conditionFormRef = ref<typeof NForm>();
const conditionFormData = ref({});
// Whether to display more screening conditions
const isShowMoreCondition = ref(false);
watch(isShowMoreCondition, () => {
  conditionFormRef.value?.toggleItem();
});

// Treatment hasshowmore
const conditionItems = props.r.conditionItems || (() => []);
const hasShowMore = conditionItems().some((item) => 'toggle' in item);

// Table selection 
 // Note that the rowkey attribute must be specified on the table component to take effect
const selectedRowKeys = ref<string[]>([]);
function onTableSelectChange(keys: string[]) {
  selectedRowKeys.value = keys;
}

// paging
const pageCurrent = ref(1);
const pageSize = ref(10);
const pageCount = ref(0);
const isTableLoading = ref(true);
const dataSouce = ref<tableData['list']>([]);
const pagination = computed(() => ({
  total: pageCount.value,
  current: pageCurrent.value,
  pageSize: pageSize.value,
  // hideOnSinglePage:true,
  showSizeChanger: true,
  // pageSizeOptions:[1,2,3],
  onChange: (page: number) => {
    pageCurrent.value = page;
  },
  onShowSizeChange: onPageSizeChange,
}));

const tableSize = ref(props.r.tableProps?.size || 'default');

const otherTableProps = computed(() => {
  const { r, primaryKey } = props;
  // console.log(dataSouce.value,dataSouce.value.map((row) => row[primaryKey]))
  return {
    pagination: { ...r.pagination, ...pagination.value },
    rowKey: (row: KV) => row[primaryKey],
    rowSelection: r.hideRowSelection ? null : { selectedRowKeys, onChange: onTableSelectChange, ...r.rowSelection },
    // expandedRowKeys: dataSouce.value.map((row) => row[primaryKey]),
    defaultExpandAllRows: true,
    ...r.tableProps,
    size: tableSize.value,
  };
});

function onPageSizeChange(current: number, size: number) {
  pageSize.value = size;
  pageCurrent.value = 1;
}


// Default the lower layer
const expandedRowKeys = ref<string[]>([]);
const {primaryKey} = props
function expandedRow(list:KV[]){
  list.forEach(row=>{
    expandedRowKeys.value.push(row[primaryKey]);
  })
}


// Reset condition 
 // Load the data
async function reset() {
  await conditionFormRef.value?.reset();
  
  getTableData();
}

// Download Data
async function getTableData() {
  isTableLoading.value = true;
  try {
// Clear the selection
    selectedRowKeys.value = [];

    const { list, total } = await props.r.done({
      // pageNum: pageCurrent.value,
      // pageSize: pageSize.value,
      // ...conditionFormData.value,
    });

    dataSouce.value = list;
    isTableLoading.value = false;
    pageCount.value = Number(total);
    expandedRow(list)
  } catch (error) {
    // props.r.onError(error);
    // message.error(error as string);
  } finally {
    isTableLoading.value = false;
  }
}
watch([pageCurrent, pageSize], getTableData, { immediate: true });

// =========delete =========
async function remove(keys: string[], row?: KV) {
  const [isSuccess, msg] = await props.d!.done(keys, row);
  if (isSuccess) {
    msg && message.success(msg);
    selectedRowKeys.value = [];
    getTableData();
  } else {
    msg && message.error(msg);
    emit('remove-fail', msg);
  }
}

// Mainly used to initialize silent recognition
const FormDataAdd = reactive({});
const FormDataEdit = reactive({});

// Newly increase
const addRef = ref<typeof Add | undefined>();
const isAddFormLoading = ref(false);
async function showAddForm() {
  try {
    isAddFormLoading.value = true;
    if (props.c?.before) {
      await props.c.before({});
    }
    addRef.value?.show();
  } catch (error) {
    console.log(error);
  } finally {
    isAddFormLoading.value = false;
  }
}

//edit
const editRef = ref<typeof Edit | undefined>();
function showEditForm(record: KV) {
  editRef.value?.show(record);
}

// Detail
const isShowOne = ref(false);
const one = ref<any>();
const isOneLoading = ref(false);
async function showOne(row: KV) {
  try {
    isShowOne.value = true;
    isOneLoading.value = true;
    one.value = await props.r.getOne!(row);
    if (void 0 === one.value) {
      _warn('The current "Getone" function does not return the value!');
    }
    emit('show-one', row);
  } catch (error) {
  } finally {
    isOneLoading.value = false;
  }
}

// Export form
async function exportExcelFile() {
  const keyAndTitleMap: KV = {};
  const columnTitles: string[] = [];
  props.r.columns?.forEach((column: any) => {
    const { title, dataIndex } = column;
    if (title && dataIndex && 'operate' !== title) {
      keyAndTitleMap[dataIndex] = title;
      columnTitles.push(title);
    }
  });

  const dataSouce = await props.r.exportExcel!.done(conditionFormData);
  const data = dataSouce.map((row) => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      if (keyAndTitleMap[key]) {
        newRow[key] = row[key];
      }
    }
    return newRow;
  });
  data.unshift(keyAndTitleMap);

  const sheet = xlsx.utils.json_to_sheet(data, { skipHeader: true });
  const book = xlsx.utils.book_new();
  book.SheetNames.push('sheet1');
  book.Sheets['sheet1'] = sheet;
  xlsx.writeFile(book, 'data.xlsx', { bookType: 'xlsx', type: 'binary' });
}
// const = useColumnSetting();


</script>

<template>
  <a-card class="crud" :loading="isLoading">
    <a-drawer v-if="r.getOne" v-model:visible="isShowOne" title="Detail" width="50%" v-bind="r.drawerProps">
      <a-skeleton :loading="isOneLoading" active>
        <slot name="one" v-bind="one"></slot>
      </a-skeleton>
    </a-drawer>

    <!-- edit-->
    <Edit ref="editRef" v-if="u" v-model="FormDataEdit" v-bind="u" @success="getTableData" />

    <!--Newly increase -->
    <Add ref="addRef" v-if="c" v-model="FormDataAdd" v-bind="c" @success="getTableData" />

    <!-- New & Export button -->
    <div class="mb-2 d-flex align-items-center" style="column-gap: 8px">
      <!--Batch operation-->
      <a-button v-if="c" :loading="isAddFormLoading" type="primary" @click="showAddForm"
        ><plus-outlined />Add New</a-button
      >

      <!-- Export form -->
      <a-button v-if="r.exportExcel" type="success" @click="exportExcelFile"><cloud-download-outlined />Export</a-button>

      <a-popconfirm
        v-if="void 0 !== d"
        title="You sure you want to delete it?"
        ok-text="Sure"
        cancel-text="Cancel"
        @confirm="remove(selectedRowKeys)"
      >
        <a-button class="ml-1" v-show="selectedRowKeys.length > 0" type="primary" ghost danger
          >batch deletion({{ selectedRowKeys.length }}strip)</a-button
        >
      </a-popconfirm>
      <p class="flex-1" align="right">
        <a-space :size="16">
          <a-tooltip title="Refresh table">
            <a class="icon-reset" @click="reset"><redo-outlined :spin="isTableLoading" /></a>
          </a-tooltip>

          <!-- Screening condition-->
          <column-sort v-if="r.columns" :columns="(r.columns as any)" @change="changeColumns" />

          <!-- Column density -->
          <a-tooltip title="Table size">
            <a-radio-group
              v-model:value="tableSize"
              size="small"
              option-type="button"
              :options="[
                { label: 'Loose', value: 'default' },
                { label: 'medium', value: 'middle' },
                { label: 'compact', value: 'small' },
              ]"
            />
          </a-tooltip>

          <!-- <a-tooltip title="full screen">
            <a @click="toggleTableFull"><FullscreenOutlined /></a>
          </a-tooltip> -->
        </a-space>
      </p>
    </div>

    <!-- Screening condition -->
    <n-form
      ref="conditionFormRef"
      v-model="conditionFormData"
      v-if="void 0 !== r.conditionItems"
      :items="r.conditionItems"
      layout="inline"
      :label-col="{ span: 5 }"
    >
      <template #after>
        <a-form-item>
          <a-space>
            <a-button :loading="isTableLoading" @click="reset">Repossess</a-button>
            <a-button type="primary" :loading="isTableLoading" @click="getTableData"><search-outlined />Inquire</a-button>
            <a-button v-if="hasShowMore" @click="isShowMoreCondition = !isShowMoreCondition" type="link">
              <template v-if="isShowMoreCondition"><up-outlined />Put away</template>
              <template v-else><down-outlined />Expand</template>
            </a-button>
          </a-space>
        </a-form-item>
      </template>
    </n-form>
    <!-- Table data -->
    <a-table
      bordered
      :loading="isTableLoading"
      :columns="columnConfig"
      :dataSource="dataSouce"
      v-model:expandedRowKeys="expandedRowKeys"
      v-bind="otherTableProps"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation' || column.key === 'operation'">
          <slot name="row-buttons-before" v-bind="record"></slot>

          <a-button v-if="r.getOne" type="link" @click="showOne(record)"><eye-outlined />Check</a-button>

          <a-button v-if="void 0 !== u" type="link" size="small" @click="showEditForm(record)">
            <edit-outlined />edit</a-button
          >
          <a-popconfirm
            v-if="void 0 !== d"
            title="You sure you want to delete it?"
            ok-text="Sure"
            cancel-text="Cancel"
            @confirm="remove([record[primaryKey]], record)"
          >
            <a-button type="link" size="small"><delete-outlined />delete</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style lang="scss">
.crud {
  &__header {
    background-color: #fff;
  }



  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 16px;
    }
  }
}

.icon-reset {
  transform: rotate3d(30deg);
}
</style>
