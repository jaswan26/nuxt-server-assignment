<script setup lang="ts">
import graph from "./Graphs.vue"

import { h, reactive, ref, resolveComponent } from 'vue';
import Crud, { defineC, defineD, defineR, defineU } from '@/lib';
import Detail from '@/Detail.vue';
import http from '@/http';
import { message } from 'ant-design-vue';
import { ToolOutlined } from '@ant-design/icons-vue';
import StackedColumn from "./StackedColumn.vue";
import SemiCirclePie from "./SemiCirclePie.vue";
import CirclePie from "./CirclePie.vue";
import ProgressChart from "./ProgressChart.vue";

interface KV<T = any> {
    [k: string | number]: T;
}
type Row = {

    _id: string;
    author: string;
    category: string;

    title: string;

};


const primaryKey = '_id';

const r = defineR({
    drawerProps: {
        getContainer,
        style: { position: 'absolute' },
    },

    columns: [
        {
            title: 'Author Name',
            dataIndex: 'author',
        },
        {
            title: 'Book Title',
            dataIndex: 'title',
        },
        {
            title: 'Book Category',
            dataIndex: 'category',
        },

        {
            title: 'CRUD Operation',
            key: 'operation',
        },
    ],
    // conditionItems: () => {
    //     return [{ is: 'a-input', name: 'name', label: 'bookname' }];
    // },

    async getOne(row) {

        const { data } = await http.get('/book/' + row[primaryKey]);
        return data;
    },

    async done(params) {
        const { data } = await http('/book', { params });
        return data;
    },
});
const c = defineC({

    async done(formData) {
        const { status, data } = await http.post('/book', formData);
        return [200 === status, data.msg];
    },
    formProps: { labelCol: { span: 2 } },

    items: () => [
        { is: 'a-input', name: 'author', label: 'Author Name' },
        { is: 'a-input', name: 'title', label: 'Book Title' },
        { is: 'a-input', name: 'category', label: 'Book Category' },
    ],
});

const u = defineU({
    drawerProps: {
        getContainer,
        style: { position: 'absolute' },
    },
    async before(row) {
        const { data } = await http.get('/book/' + row[primaryKey]);

        return data;
    },

    async done(formData, row) {
        const { data, status } = await http.put('/book/' + row[primaryKey], formData);
        return [200 === status, data.msg];
    },

    items: c.items,
});

const d = defineD({
    async done(idList) {
        if (1 < idList.length) {
            const { data, status } = await http.delete('/book/', {
                params: {
                    idList,
                },
            });
            return [200 === status, data.msg];
        } else {
            const { data, status } = await http.delete('/book/' + idList[0]);
            return [200 === status, data.msg];
        }
    },
});

function config() {
    message.success('Custom button')
}

function getContainer() {
    return document.getElementById('box');
}
</script>

<template>
    <a-config-provider :getPopupContainer="getContainer">
        <h1 class="title" align="center">jas-crud-vue-ts</h1>
        <p align="center">
            Basic CRUD Application and Amchart Graphs
        </p>

        <div class="box" id="box">

            <crud v-bind="{ primaryKey, c, u, r, d }">
                <template #one="one">
                    <Detail :data-source="one" />
                </template>

                <template #row-buttons-before>
                    <a-button type="link" @click="config">
                        <tool-outlined />
                        Configuration
                    </a-button>
                </template>
            </crud>
        </div>


        <div class="box" id="box">
            <graph />
        </div>

        <div class="box" id="box">
            <circle-pie />
        </div>

        <div class="box" id="box">
            <progress-chart />
        </div>

        <div class="box" id="box">
            <stacked-column />
        </div>

        <div class="box" id="box">
            <semi-circle-pie />
        </div>


    </a-config-provider>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.title {
    margin: 0;
    font-size: 32px;
}

.box {
    position: relative;
    max-width: 80vw;
    max-height: 80vh;
    box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.2);
    margin: 0 auto 10vh;
    overflow-x: hidden;
}

::-webkit-scrollbar-track {
    background: hsla(0, 0%, 100%, 0.15);
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
</style>
