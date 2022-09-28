<template>
    <div class="footer">
        <div class="block nav-wrap">
            <a class="btn" @click="onClickNav('/test')">首页<img src="" /></a>
        </div>
        <div class="block nav-wrap">
            <a class="btn" @click="onClickNav('/rank')">活动<img src="" /></a>
        </div>
        <div class="block nav-wrap">
            <a class="btn" @click="onClickNav('/test')">订单<img src="" /></a>
        </div>
        <div class="block nav-wrap">
            <a class="btn" @click="onClickNav('/test')">我<img src="" /></a>
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

        };
    },
    computed: {},
    mounted(){
        
    },
    methods: {
        onClickNav(path){
            console.log(path);
            this.$router.push(path);
        },
    },
};
</script>
<style scoped>
    .footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 65px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 65px;
        line-height: 65px;
        border: 1px solid #aaa;
        color: #fff;
        background-color: #131313;
    }
    .footer .block{
        width: 25%;
        text-align: center;
    }
</style>
