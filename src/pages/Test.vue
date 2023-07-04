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
        <div v-if="mode==3">
            <div class="word-wrap">
                <a class="btn word" v-for="count in 12" @click="onClickWord(count)">{{wordList[count]}}</a>
            </div>
            <a class="btn btn-reroll" @click="onClickReroll()">Reroll</a>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, shuffle, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
import Header from '../components/Header';
import Nav from '../components/Nav';
const WI = 15;
// mode3
const word1List = ['公寓','学校','化工厂','医院','警察局','写字楼','街道','公园','田园','法院','商场','托儿所','养老院','卧室','厕所','客厅','书房','洗衣间','吸烟区','密室',]; // 场所
const word2List = ['教师','医生','调查员','侦探','警察','学生','律师','乞讨者','公务员','柜员','程序员','小偷','老板','经理','管理员','工人','作家','歌手','狗','猫','猪','羊','牛','鸡','鸭','鸟','鱼','马','虫子']; // 职业
const word3List = ['灭火器','摇椅','电视机','冰箱','电脑','平板','遥控器','花瓶','电灯','电风扇','垃圾桶',]; // 室内物件
export default {
    name: 'Canvas1',
    data(){
        return {

            loading: false,
            mode: 3,

            /* mode 1 */
            actList: [],

            /* mode 2 */
            cellList: [],

            /* mode 3 */
            wordList: [],

            WI,
            CONFIG,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            /* mode 1 */
            this.actList = [];
            for(let i=0;i<48;i++){
                this.actList.push({
                    name: `活动${i+1}`,
                    desc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                });
            }

            /* mode 2 */
            this.cellList = [];
            let amount = WI*WI;
            for(let i=0;i<amount;i++){
                this.cellList.push({
                    stat: r(0,1),
                });
            }

            /* mode 3 */
            this.onClickReroll();
        },
        onClickCell(index){ // mode1
            let cell = this.cellList[index];
            cell.stat = !cell.stat;
        },
        onClickWord(index){ // mode3
            let word = this.wordList[index];
            console.log(word);
        },
        onClickReroll(){ // mode3
            let wordList = [...word1List,...word2List,...word3List];
            this.wordList = shuffle(wordList);
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
    .btn{
        display: inline-block;
        cursor: pointer;
        text-align: center;
        border: 1px solid #131313;
        font-weight: bold;
    }
    .btn:hover{
        opacity: .8;
    }
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
    /* mode3 */
    .word-wrap{
        width: 300px;
        padding: 10px;
        margin: 0 auto;
    }
    .word-wrap .word{
        width: 120px;
        line-height: 30px;
        height: 30px;
        margin: 4px 10px;
        padding: 0;
        background-color: orange;
        color: #fff;
        font-weight: bold;
        font-size: 20px;
        text-shadow: 0 0 1px #000;
    }
    .btn-reroll{
        display: block;
        margin: 0 auto;
        width: 300px;
        line-height: 30px;
        height: 30px;
    }
</style>
