<template>
    <div class="start">
        <h1 class="title" v-if="state!=3"><i>- Lord Wars -</i></h1>
        <div class="wrap op" v-if="state==1">
            <a class="btn" @click="onTapResume()" v-if="showResumeBtn">继续游戏</a>
            <a class="btn" @click="onTapStart()">开始新游戏</a>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    name: 'Start',
    data(){
        return {
            state: 1, // 状态[1:初始界面|2:|3:]
            showResumeBtn: false,

            game: {}, // 游戏数据

            loading: false,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            window.GLOBAL = null;
            let s_data = localStorage.getItem(CACHE.save1);
            let data = JSON.parse(s_data)||{};
            if(s_data){
                this.showResumeBtn = true;
            }
        },
        onTapResume(){
            // fullScreen();
            this.$router.push('home');
        },
        onTapStart(){
            this.initGameData();
        },
        onTapBack(){ // 点击【返回】按钮
            this.state = 2;
        },

        initGameData(){ // 初始化游戏数据
            this.game = {
                allMaps: [],
                allRoles: [],
            };
            this.initAllMaps();
            this.initAllRoles(this.game.allMaps);
            localStorage.setItem(CACHE.save1,JSON.stringify(this.game));
            console.log(this.game);
            this.$router.push('home');
        },
        initAllMaps(){ // 初始化地图数据
            let largeMapCount = r(7,8);
            let smallMapCount = 30-largeMapCount/2;
            let wildMapCount = 50-smallMapCount;
            let getDistance = (x1,y1,x2,y2) =>{
                return Math.abs(x1-x2)+Math.abs(y1-y2);
            }
            let isTooClose = position =>{
                let x = position[0], y = position[1];
                for(let i=0;i<this.game.allMaps.length;i++){
                    let map = this.game.allMaps[i];
                    let mx = map.position[0], my = map.position[1];
                    let distance = getDistance(mx,my,x,y);
                    if(distance<Math.sqrt(map.size)*5){
                        return true;
                    }
                }
                return false;
            }
            for(let i=0;i<largeMapCount;i++){ // 大城市
                let name = common.genAreaName(0);
                let position = [r(100,700),r(100,700)];
                let loop = 0;
                while(isTooClose(position)&&(loop++)<100){
                    position = [r(100,700),r(100,700)];
                }
                this.game.allMaps.push({
                    id: this.game.allMaps.length+1,
                    name,
                    type: 0,
                    size: r(800,1100),
                    position,
                    roads: [],
                    color: {r:255,g:255,b:255,},
                });
            }
            for(let i=0;i<smallMapCount;i++){ // 小城市
                let name = common.genAreaName(0);
                let position = [r(20,780),r(20,780)];
                let loop = 0;
                while(isTooClose(position)&&(loop++)<100){
                    position = [r(20,780),r(20,780)];
                }
                this.game.allMaps.push({
                    id: this.game.allMaps.length+1,
                    name,
                    type: 0,
                    size: r(150,300),
                    position,
                    roads: [],
                    color: {r:255,g:255,b:255,},
                });
            }
            for(let i=0;i<wildMapCount;i++){ // 野外
                let name = common.genAreaName(1);
                let position = [r(20,780),r(20,780)];
                let loop = 0;
                while(isTooClose(position)&&(loop++)<100){
                    position = [r(20,780),r(20,780)];
                }
                this.game.allMaps.push({
                    id: this.game.allMaps.length+1,
                    name,
                    type: 1,
                    size: r(100,400),
                    position,
                    roads: [],
                    color: {r:10,g:10,b:10,},
                });
            }
            // 初始化道路
            let fromMap, toMap;
            for(let i=0;i<largeMapCount;i++){
                fromMap = this.game.allMaps[i];
                for(let j=0;j<largeMapCount;j++){
                    if(i!=j){
                        toMap = this.game.allMaps[j];
                        let distance = getDistance(fromMap.position[0],fromMap.position[1],toMap.position[0],toMap.position[1]);
                        if(distance<400){
                            fromMap.roads.push(toMap.id);
                            if(arrContains(toMap.roads,fromMap.id)==-1){
                                toMap.roads.push(fromMap.id);
                            }
                        }
                    }
                }
            }
            for(let i=0;i<this.game.allMaps.length;i++){
                fromMap = this.game.allMaps[i];
                for(let j=0;j<this.game.allMaps.length;j++){
                    if(i!=j){
                        toMap = this.game.allMaps[j];
                        let distance = getDistance(fromMap.position[0],fromMap.position[1],toMap.position[0],toMap.position[1]);
                        if(distance<Math.sqrt(fromMap.size)*8){
                            fromMap.roads.push(toMap.id);
                            if(arrContains(toMap.roads,fromMap.id)==-1){
                                toMap.roads.push(fromMap.id);
                            }
                        }
                    }
                }
            }
            for(let i=0;i<this.game.allMaps.length;i++){
                fromMap = this.game.allMaps[i];
                if(fromMap.roads.length<=0){
                    let toMapID = r(1,this.game.allMaps.length);
                    while(toMapID==fromMap.id){
                        toMapID = r(1,this.game.allMaps.length);
                    }
                    fromMap.roads.push(toMapID);
                    if(arrContains(toMap.roads,fromMap.id)==-1){
                        toMap.roads.push(fromMap.id);
                    }
                }
            }
        },
        initAllRoles(maps){ // 初始化人物数据
            let roleCount = r(295,305);
            for(let i=0;i<roleCount;i++){
                let newRole = common.genRandomPerson({});
                let map = maps[r(0,maps.length-1)];
                newRole.mapID = map.id;
                newRole.position = [r(20,map.size-20),r(20,map.size-20)];
                newRole.id = this.game.allRoles.length+1;
                this.game.allRoles.push(newRole);
            }
        }
    },
    components:{

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../style/common.css';
    .start{
        text-align: center;
        background-color: #fafafa;
        padding-top: 150px;
        height: 100%;
        font-size: 20px;
    }
    .wrap{
        min-height: 40px;
        margin: 0 auto;
    }
    .tip{
        font-size: 16px;
        color: grey;
    }
    .sm{
        color: #888;
        font-size: 16px;
    }
    .title{
        margin-bottom: 20px;
    }
    .sub-title{
        width: 600px;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        border-bottom: 1px solid #131313;
    }
    .inp{
        width: 250px;
        height: 40px;
        line-height: 40px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        margin-bottom: 14px;
    }
    .inp label{
    }
    .inp input{
        -webkit-appearance: none;
        border: none;
        border-bottom: 1px solid #131313;
        background-color: transparent;
        width: 180px;
        height: 30px;
        line-height: 30px;
        padding: 0 6px;
        font-size: 16px;
        color: #666;
        text-align: right;
    }
    .btn-wrap{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .btn-gender{
        width: 40px;
        height: 40px;
        background-color: transparent;
        color: #666;
        margin: 0;
    }
    .select{
        background-color: #fff;
        border: 1px solid #131313;
    }

    .list{
        width: 600px;
        max-height: 400px;
        overflow-y: auto;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 40px;
    }
    .list-row{
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #888;
        font-size: 16px;
        text-align: center;
        margin-bottom: 2px;
    }
    .list-row-import{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, #ccc, #fff);
        background-repeat: no-repeat;
        animation: selection 1s ease-out infinite;
        transform: translateX(100%);
    }
    @keyframes selection {
        to{
            transform: translateX(-100%);
        }
    }
    .list-row-content{
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }
    .list-row:hover{
        background-color: #f1f1f1;
        color: #131313;
    }
    .row-info{
        display: inline-block;
    }
    .row-info span{
        display: inline-block;
        margin: 0 10px;
    }
    .list-row .btn{
        display: inline-block;
        min-width: 40px;
        width: auto;
        height: 26px;
        font-size: 14px;
        line-height: 26px;
        padding: 0 4px;
        margin: 0 4px;
    }
    .list-row .select{
        color: #666;
    }
    .list-row .btn-del{
        background-color: #e81313;
    }

    .pop{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .pop-shadow{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,.3);
    }
    .pop-content{
        position: absolute;
        width: 1680px;
        height: 840px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background-color: #fff;
        padding: 6px;
        border: 5px double #131313;
    }
</style>
