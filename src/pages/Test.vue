<template>
    <div class="main">
        <div v-if="mode==1">
            <Header />
            <h1>首页TEST</h1>
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
            <Nav />
        </div>
        <div v-if="mode==2">
            <div class="cell-wrap" :style="`width:${WI*20}px;height:${WI*20}px`">
                <a class="cell" :class="cell.stat?'cell-on':'cell-off'" v-for="(cell,index) in cellList" @click="onClickCell(index)"></a>
            </div>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
import Header from '../components/Header';
import Nav from '../components/Nav';
const WI = 15;
export default {
    name: 'Canvas1',
    data(){
        return {

            loading: false,
            mode: 2,

            actList: [],
            cellList: [],

            WI,
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

            this.cellList = [];
            let amount = WI*WI;
            for(let i=0;i<amount;i++){
                this.cellList.push({
                    stat: r(0,1),
                });
            }
        },
        onClickCell(index){
            let cell = this.cellList[index];
            cell.stat = !cell.stat;
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

    .cell-wrap{
        margin: 0 auto;
        padding: 0;
        line-height: 0;
        background-color: #aaa;
        box-shadow: 0 0 20px #a3a;
    }
    .cell{
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 0;
        padding: 0;
    }
    .cell:hover{
        opacity: .5;
    }
    .cell-off{
        background-color: #000;
    }
    .cell-on{
        background-color: #fff;
    }
</style>
