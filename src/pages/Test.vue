<template>
    <div class="main">
        <h1>首页TEST</h1>
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
        <div class="banner">
            <div class="block user-wrap">
                <a class="btn"><img src="" /></a>
            </div>
        </div>
        <div class="act-list-wrap">
            <ol class="block act-list">
                <li class="block act" v-for="act in actList">
                    <a class="btn">
                        <div class="act-icon">
                            <img :src="act.icon" />
                        </div>
                        <div class="act-detail">
                            <h3>{{act.name}}</h3>
                            <div>{{act.desc}}</div>
                        </div>
                    </a>
                </li>
            </ol>
        </div>
        <div class="footer">
            <div class="block nav-wrap">
                <a class="btn">首页<img src="" /></a>
            </div>
            <div class="block nav-wrap">
                <a class="btn">活动<img src="" /></a>
            </div>
            <div class="block nav-wrap">
                <a class="btn">订单<img src="" /></a>
            </div>
            <div class="block nav-wrap">
                <a class="btn">我<img src="" /></a>
            </div>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const CVSWIDTH = 500;
const CVSHEIGHT = 600;
export default {
    name: 'Canvas1',
    data(){
        return {

            keywords: '',
            loading: false,

            actList: [],

            CONFIG,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.actList = [];
            for(let i=0;i<48;i++){
                this.actList.push({
                    name: `活动${i+1}`,
                    desc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                });
            }
        },
    },
    components:{

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        position: relative;
        padding-top: 40px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: #fff;
    }
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
    .footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
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
    .block{
        border: 1px solid #aaa;
    }
    .banner{
        height: 130px;
        background-color: pink;
        margin-bottom: 12px;
    }
    .footer .block{
        width: 25%;
        text-align: center;
    }
    .search-wrap{
        width: 75%;
    }
    .act{
        width: 100%;
        height: 65px;
    }
    .act .btn{
        width: 100%;
        height: 65px;
        padding: 10px 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .act-icon{
        height: 55px;
        width: 55px;
        border: 1px solid #e81313;
        margin-right: 6px;
    }
    .act-detail{
        width: 100%;
        height: 100%;
    }
</style>
