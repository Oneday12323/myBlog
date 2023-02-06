<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>

        </div>
        <!-- 二级路由 -->
        <div style="padding:20px;width:100%">
            <router-view></router-view>
        </div>
    </div>
    <div class="title">oneday的博客</div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';
import { reactive, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const axios = inject("axios");
const message = inject("message")
const adminStore = AdminStore();
const router = useRouter();
const route = useRoute();

let menus = [
    { name: "文章管理", herf: "/dashboard/article" },
    { name: "分类管理", herf: "/dashboard/category" },
    { name: "退出", herf: "logout" }
]

const toPage = (menu) => {
    if (menu.herf == "logout") {
        router.push("/login")
    } else {
        router.push(menu.herf)
    }
}

</script>

<style lang="scss" scoped>
.main-panel {
    display: flex; //里面是横向布局
    color: #64676a;
    max-width: 1700px;
    margin: 15px;
    background-color: aliceblue;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 100vh; //vh指的是？
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;

        &:hover {
            color: #fd760e;
        }
    }
}

.title {
    font-size: 55px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px)/2);
    bottom: 20px;
}
</style>