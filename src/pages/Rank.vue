<template>
    <div class="main">
        <h1>排行榜</h1>
        <Header />
        <div class="act-list-wrap">
            <ol class="block act-list">
                <li class="block act" v-for="(rank,index) in rankList">
                    <div class="number">{{index+1}}</div>
                    <a class="btn">
                        {{rank.name}}
                    </a>
                </li>
            </ol>
        </div>
        <Nav />
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
import Header from '../components/Header';
import Nav from '../components/Nav';
const CVSWIDTH = 500;
const CVSHEIGHT = 600;
export default {
    name: 'Rank',
    data(){
        return {

            keywords: '',
            loading: false,

            rankList: [],

            CONFIG,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.rankList = [];
            for(let i=0;i<48;i++){
                this.rankList.push({
                    name: `用户名${i+1}`,
                    desc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                });
            }
        },
    },
    components:{
        Header,
        Nav,
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
    .block{
        border: 1px solid #aaa;
    }
    .banner{
        height: 130px;
        background-color: pink;
        margin-bottom: 12px;
    }
    .search-wrap{
        width: 75%;
    }
    .act{
        position: relative;
        width: 100%;
        height: 65px;
        padding-left: 80px;
    }
    .number{
        position: absolute;
        left: 10px;
        top: 10px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #131313;
        color: #fff;
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        line-height: 50px;
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
