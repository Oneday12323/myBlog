<template>
    <div>
        <n-card style="margin-bottom: 16px">
            <n-tabs v-model:value="tabValue" justify-content="start" type="line">
                <n-tab-pane name="list" tab="文章列表">
                    <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px ;">
                        <n-card :title="blog.title">
                            {{ blog.content }}
                            <template #footer>
                                <n-space align="center">
                                    <div>发布时间：{{ blog.create_time }}</div>
                                    <n-button @click="toUpdate(blog)">修改</n-button>
                                    <n-button @click="toDelete(blog)">删除</n-button>

                                </n-space>
                            </template>
                        </n-card>
                    </div>

                    <n-space>
                        <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount ">
                            <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">{{ pageNum }}</div>
                        </div>
                    </n-space>

                </n-tab-pane>
                <n-tab-pane name="add" tab="添加文章">
                    <n-form>
                        <n-form-item label="标题">
                            <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                        </n-form-item>

                        <n-form-item label="分类">
                            <n-select v-model:value="addArticle.category_id" :options="categoryOptions" />
                            <!-- 打开界面的时候就会将服务端的数据读取过来   -->
                        </n-form-item>

                        <n-form-item label="内容">
                            <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                        </n-form-item>
                        <n-form-item label="">
                            <n-button @click="add">提交</n-button>
                        </n-form-item>
                    </n-form>
                </n-tab-pane>
                <n-tab-pane name="update" tab="修改文章">
                    <n-form>
                        <n-form-item label="标题">
                            <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                        </n-form-item>

                        <n-form-item label="分类">
                            <n-select v-model:value="updateArticle.category_id" :options="categoryOptions" />
                            <!-- 打开界面的时候就会将服务端的数据读取过来   -->
                        </n-form-item>

                        <n-form-item label="内容">
                            <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                        </n-form-item>
                        <n-form-item label="">
                            <n-button @click="update">提交</n-button>
                        </n-form-item>
                    </n-form>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';
import { reactive, ref, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RichTextEditor from '../../components/RichTextEditor.vue'

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog")
const adminStore = AdminStore();
const router = useRouter();
const route = useRoute();


const addArticle = reactive({
    category_id: 0,
    title: '',
    content: '欢迎来到这里！'
});
const updateArticle = reactive({
    id: 0,
    category_id: 0,
    title: '',
    content: '欢迎来到这里！'
})

const tabValue = ref("list")
const categoryOptions = ref([])
const blogListInfo = ref([]);
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0, //每页多少条
    count: 0 //总数
})

onMounted(() => {
    loadBlogs()
    loadCategorys()

})

const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`,)
    console.log(res);
    let temp_rows = res.data.data.rows;
    console.log(temp_rows);

    for (let row of temp_rows) {
        row.content += "...";
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`

    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)

}

const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categoryOptions.value = res.data.data.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions.value);
    //console.log(res.data.data);
}

const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle);
    //console.log(res);
    if (res.data.code == 200) {
        message.info(res.data.msg);
        addArticle.title = ''
    } else {
        message.error(res.data.msg)
    }
}

const toPage = async (pageNum) => {
    pageInfo.page = pageNum;
    loadBlogs()
}
const toUpdate = async (blog) => {
    tabValue.value = "update";
    let res = await axios.get("/blog/detail?id=" + blog.id);
    updateArticle.title = res.data.rows[0].title;
    updateArticle.category_id = res.data.rows[0].category_id;
    updateArticle.content = res.data.rows[0].content;
    updateArticle.id = res.data.rows[0].id;



    console.log(res);
}

const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle);
    if (res.data.code == 200) {
        message.info(res.data.msg);
        addArticle.title = ''
    } else {
        message.error(res.data.msg)
    }
    tabValue.value = "list";
}

const toDelete = async (blog) => {
    let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`);
    if (res.data.code == 200) {
        message.info(res.data.msg);
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }

}
</script>

<style lang="scss" scoped>

</style>