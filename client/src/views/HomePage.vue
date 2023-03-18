<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory"
                    :options="categoryOptions" trigger="click">
                    <div>分类 <span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="dashBoard">后台</div>
        </div>

        <n-divider />
        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字"></n-input>
            <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
        </n-space>
        <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px ;cursor: pointer;" @click="toDetail(blog)">
            <n-card :title="blog.title">
                <div v-html="blog.content"></div>
                <template #footer>
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
        <n-divider />
        <div class="footer">
            <div>Power by oneday</div>
            <div>XICP备xxxx号-1</div>

        </div>
    </div>
</template>

<script setup>

import { reactive, ref, inject, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog")
const router = useRouter();
const route = useRoute();


const selectedCategory = ref(0);
const categoryOptions = ref([]);
const blogListInfo = ref([]);

const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0, //每页多少条
    count: 0,//总数
    keyword: "",
    category_id: 0
})

onMounted(() => {
    loadBlogs()
    loadCategorys();

})

const searchByCategory = (category_id) => {
    pageInfo.category_id = category_id;
    loadBlogs()
}

const loadBlogs = async (page = 0) => {
    if (page != 0) {
        pageInfo.page = page
    }
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${pageInfo.category_id}`)
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

const categoryName = computed(() => {
    let selectedOption = categoryOptions.value.find((option) => {
        return option.value == selectedCategory.value
    })
    return selectedOption ? selectedOption.label : ''
})
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

const homePage = () => {
    router.push('/')
}
const dashBoard = () => {
    router.push('/login')
}
const toDetail = (blog) => {
    router.push({ path: '/detail', query: { id: blog.id } })
}

</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    min-height: 880px;
    margin: 0 auto;

    .nav {
        display: flex;
        font-size: 20px;
        padding-top: 20px;
        color: #64676a;

        div {
            cursor: pointer;
            margin-right: 15px;

            &:hover {
                color: rgb(132, 213, 222);
            }

            span {
                font-size: 12px;
            }
        }

    }

    .search {
        margin-bottom: 20px;
    }

    .footer {
        text-align: center;
        line-height: 25px;
        color: #64676a;
    }
}
</style>