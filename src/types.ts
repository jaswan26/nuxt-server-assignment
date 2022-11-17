import type { ColProps, FormProps, FormItemProps, TableProps, DrawerProps, ModalProps } from 'ant-design-vue';
import type { VNode, Component as C1 } from 'vue';

export interface KV<T = any> {
  [k: string | number]: T;
}

export interface NFormItem extends FormItemProps {
  is: string | VNode | C1;
  name?: string;
  modelName?: string;
  props?: KV;
  span?: ColProps['span'];
  defaultValue?: any;
  toggle?: boolean;
}

interface UC {
  formProps?: FormProps;
  // ModelValue is not exposed to the Definec function
  // modelValue: KV;
  items: (formData: KV) => NFormItem[];
}

/**
 * "New" Form Patriarch's Properties
 */
export interface CProps extends UC {
  modalProps?: ModalProps;
  before?: ((formData: KV) => Promise<void>) | (() => void);
  done: (formData: KV) => Promise<[boolean, string?]>;
}

/**
 *"Edit" Form Patriarch's Properties
 */
export interface UProps extends UC {
  drawerProps?: DrawerProps;
  before?: ((formData: KV) => Promise<KV>) | (() => void);
  done: (formData: KV, currentRow: KV) => Promise<[boolean, string?]>;
}

export interface RProps extends TableProps {
  before?: () => void;
  drawerProps?: DrawerProps;
  // Filter condition configuration
  conditionItems?: (shared?: KV) => NFormItem[];
  tableProps?: TableProps
  done: (params: KV) => Promise<{ list: KV[], total: number }>;
  hideRowSelection?: boolean;
  // Get one
  getOne?: (params: KV) => Promise<KV>;
  // Export Excel
  exportExcel?: {
    done: (condition: KV) => Promise<KV[]>;
  }
}

export interface DProps {
/** 
    * Click to execute after deleting 
    * @param keys's array of primary key, 
    * @param Row deletes when the line is deleted, the current information information 
    */
  done: (keys: string[], row?: KV) => Promise<[boolean, string]>;
}
