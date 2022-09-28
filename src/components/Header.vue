<template>
    <div class="header">
        <div class="block user-wrap">
            <a class="btn"><img src="" /></a>
        </div>
        <div class="block search-wrap">
            <input class="inp inp-search" v-model="keywords" placeholder="搜索活动" />
        </div>
        <div class="block setting-wrap">
            <a class="btn"><img src="" /></a>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{

    },
    data() {
        return {
            keywords: '',
        };
    },
    computed: {},
    mounted(){

    },
    methods: {

    },
};
</script>
<style scoped>
    .header{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        line-height: 40px;
        border: 1px solid #aaa;
        color: #fff;
        background-color: #131313;
    }
</style>
