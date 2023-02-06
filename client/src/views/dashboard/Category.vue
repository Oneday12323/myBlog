<template>
    <n-button @click="showAddModel = true">添加</n-button>
    <div>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>
        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">

            <template #header-extra>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <button @click="add">提交</button>
                </div>
            </template>
        </n-modal>

        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">

            <template #header-extra>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入修改" />
            </div>
            <template #action>
                <div>
                    <button @click="update">提交</button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>

import { AdminStore } from '../../stores/AdminStore';
import { reactive, ref, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog")
const adminStore = AdminStore();
const router = useRouter();
const route = useRoute();

const showAddModel = ref(false);
const showUpdateModel = ref(false);
const categoryList = ref([]);
const addCategory = reactive([]);
const updateCategory = reactive([])


//页面挂载时向服务端请求数据
onMounted(() => {
    loadDatas(); //调用请求数据的方法
})

//定义请求服务端的方法
const loadDatas = async () => {
    let res = await axios.get("/category/list")
    categoryList.value = res.data.data
}
const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name });
    //console.log(res);
    if (res.data.code == 200) {
        //添加成功要读取一次列表数据
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }

    //添加无论成功还是失败，让弹出的输入框关闭
    showAddModel.value = false
}

const toUpdate = async (category) => {
    showUpdateModel.value = true;
    updateCategory.id = category.id;
    updateCategory.name = category.name;
}
const update = async () => {
    let res = await axios.put("/category/_token/update", { id: updateCategory.id, name: updateCategory.name });
    //console.log(res);
    if (res.data.code == 200) {
        //修改成功要读取一次列表数据
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }

    //添加无论成功还是失败，让弹出的输入框关闭
    showUpdateModel.value = false
}
const deleteCategory = async (category) => {

    dialog.warning({
        title: '警告',
        content: '是否要删除？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`);
            if (res.data.code == 200) {
                //删除成功要读取一次列表数据
                loadDatas()
                message.info(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })

}
</script>

<style lang="scss" scoped>

</style>