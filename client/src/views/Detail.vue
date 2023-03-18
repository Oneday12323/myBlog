<template>
    <div class="container">
        <n-button @click="toHome">返回</n-button>
        <!-- 标题 -->
        <n-h1>{{ blogInfo.title }}</n-h1>
        <!-- 文章内容 -->
        <div class="blog-content">
            <div v-html="blogInfo.content"></div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, inject, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const axios = inject("axios");

const dialog = inject("dialog")
const router = useRouter();
const route = useRoute();
const blogInfo = ref({})

onMounted(() => {
    loadBlog()
})
const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id)
    console.log(res);
    blogInfo.value = res.data.rows[0]
}

const toHome = () => {
    router.push('/')
}
</script>

<style>
.blog-content img {
    max-width: 100% !important;
}

/* :deep(img){max-width:100%} */
</style>
<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>