<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep';
import { ref, toRaw } from 'vue';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree';
import { walkTree } from '@/shared';
import { SettingOutlined } from '@ant-design/icons-vue';
type Node = { [k: string]: any; title: string; key: string; children?: any[] };
type Tree = Node[];

interface Props {
  columns: Tree;
}

interface Emits {
  (type: 'change', columns: Tree): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const treeRaw = cloneDeep(toRaw(props.columns));
// Let each node have a key field
walkTree(treeRaw, (node) => {
  const { title, dataIndex, key } = node;
  node.key = key || dataIndex || title;
  return node;
});

//Tree
const tree = ref(treeRaw);
//The nodes of the default tree are selected
//Note that you cannot use Reactive here, you can only reF, otherwise the Tree component cannot "check" interaction
const checkedKeys = ref(treeRaw.map(({ key }) => key));

function onCheck(checkedKeys: string[], { halfCheckedKeys }: { halfCheckedKeys: string[] }) {
  const keys = [...checkedKeys, ...halfCheckedKeys];
  const treeRaw2 = cloneDeep(treeRaw);
  walkTree(treeRaw2, (node) => {
    if (keys.includes(node.key)) return node;
  });
  console.log(treeRaw2);
  emit('change', treeRaw2);
}

/**
 *Choose all columns
 */
function reset() {
  checkedKeys.value = treeRaw.map(({ key }) => key);
  tree.value = treeRaw;
  emit('change', treeRaw);
}

function onDrop(e: AntTreeNodeDropEvent) {
  // dropToGap It is still inside after plugging in dropnode
  // dropPosition Before moving (do not consider moving), if the horizontal line becomes a node, node index
  const { dragNode, node, dropToGap, dropPosition } = e;
  const dragNodePos = dragNode.pos?.split('-').slice(1);
  const dropNodePos = node.pos?.split('-').slice(1);
  // console.log(dragNode.pos, node.pos, dropToGap, dropPosition, e);
  // console.log({ insertToChildren: !dropToGap });
  if (dragNodePos && dropNodePos) {
    const treeRaw = cloneDeep(toRaw(tree.value));
    insertNode(treeRaw, dragNodePos, dropNodePos, !dropToGap, dropPosition);
    tree.value = treeRaw;
    emit('change', treeRaw);
  }
}

/**
 * Mobile node
 * @param tree
 * @param path1Source node path
 * @param path2 Target path
 */
function insertNode(tree: Tree, path1: string[], path2: string[], insertToChildren: boolean, dropPosition: number) {
  const [children1, childIndex1] = findChildrenRef(tree, path1);
  const [children2, childIndex2] = findChildrenRef(tree, path2);
  const node1 = children1[childIndex1];
  const lastIndex = path1.length - 1;
  const moveUp = path1[lastIndex] >= (path2[lastIndex] || 0);

  function _insertToChildren() {
    if (moveUp) {
      // Delete the source node first
      // console.log(children1, childIndex1,children2, childIndex2);
      const [_node1] = children1.splice(childIndex1, 1);
      const node2 = children2[childIndex2];
      node2.children = node2.children || [];
      node2.children.unshift(_node1);
      // console.log(node2);
    } else {
      // Move the source node first, and then delete the source node
      const node2 = children2[childIndex2];
      node2.children = node2.children || [];
      node2.children.unshift(node1);
      children1.splice(childIndex1, 1);
    }
  }

  function _insertSibling() {
    if (moveUp) {
      // Delete the source node first
      const [_node1] = children1.splice(childIndex1, 1);
      children2.splice(childIndex2 + 1, 0, _node1);
    } else {
      // Move the source node first
      children2.splice(childIndex2 + 1, 0, node1);
      children1.splice(childIndex1, 1);
    }
  }

  if (insertToChildren) {
    // Children field inserted into the node
    _insertToChildren();
    // Temporary only level 1
    // _insertSibling();
  } else {
    //Insert behind DropNode
    if (-1 == dropPosition) {
      // -1 Special refers to the first position of the first position mixed with the root
      // Delete the source node first
      const [_node1] = children1.splice(childIndex1, 1);
      children2.unshift(_node1);
    } else {
      _insertSibling();
    }
  }
}

/**
 * Find the parent container (Children) and element indexes
 */
function findChildrenRef(tree: Tree, path: string[]): [Node[], number] {
  const { length } = path;
  if (1 === length) return [tree, Number(path[0])];
  let node = tree[Number(path[0])];
  for (let i = 1; i < length - 1; i++) {
    node = node.children![Number(path[i])];
  }
  return [node.children!, Number(path[length - 1])];
}
</script>

<template>
  <a-popover trigger="click">
    <template #title>
      <p class="d-flex align-items-center">
        <span class="flex-1">Column settings</span>
        <a-button class="px-0" type="link" @click="reset">Repossess</a-button>
      </p>
    </template>
    <template #content>
      <a-tree
        class="tree-sort"
        v-model:checkedKeys="checkedKeys"
        @check="onCheck"
        :tree-data="tree"
        autoExpandParent
        checkable
        draggable
        block-node
        defaultExpandAll
        @drop="onDrop"
      />
    </template>

    <a-tooltip>
      <template #title>Column settings</template>
      <a>
        <setting-outlined />
      </a>
    </a-tooltip>
  </a-popover>
</template>

<style lang="scss">
.tree-sort {
  .ant-tree-treenode {
    &::before {
      content: '';
      cursor: grab;
      // color: #ccc;
      height: 20px;
      width: 20px;
      display: block;
      font-size: 20px;
      background-image: url(@/assets/icon/drag.svg);
      opacity: 0.5;
      background-size: 100% auto;
    }

    &:hover {
      &::before {
        opacity: 1;
        transition: transform 1s;
        transform: scale(0.9);
      }
    }
  }
}
</style>
