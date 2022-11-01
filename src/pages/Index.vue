<template>
    <div class="main">
        <h1 class="title">生成角色形象</h1>
        <div class="wrap op">
            <canvas class="cvs" :width="CVSWIDTH" :height="CVSHEIGHT" ref="cvs" />
            <div class="side">
                <div class="side-row">
                    <a class="btn btn-gender" :class="gender==1?'btn-gender-sel':''" @click="onClickGender(1)">男</a>
                    <a class="btn btn-gender" :class="gender==2?'btn-gender-sel':''" @click="onClickGender(2)">女</a>
                </div>
                <div class="side-row">
                    年龄：<input class="inp-num" type="number" min="5" max="99" v-model="age" />
                </div>
                <div class="side-row">
                    <a class="btn btn-confirm" @click="onClickConfirm">生成角色形象</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import * as common from '../tools/common';
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, genGlassData, generalForeHairTemplates, genForeClothData, genBackClothData, maleForeHairTemplates, femaleForeHairTemplates, generalBangsTemplates, maleBangsTemplates, femaleBangsTemplates, generalBackHairTemplates, maleBackHairTemplates, femaleBackHairTemplates, glassTemplates, } from '../tools/avatar';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE, } from '../config/config';
const CVSWIDTH = 750;
const CVSHEIGHT = 900;
export default {
    name: 'Canvas',
    data(){
        return {
            gender: 1,
            age: 18,
            person: {},

            ctx: null,
            loading: false,

            CVSWIDTH,
            CVSHEIGHT,

            common,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.ctx = this.$refs.cvs.getContext(`2d`);
		    this.ctx.width = CVSWIDTH;
		    this.ctx.height = CVSHEIGHT;
        },
        onClickGender(flag){ // 点击【选择性别】按钮
            this.gender = flag;
        },
        onClickConfirm(){ // 点击【生成角色形象】按钮
            let person = common.genRandomPerson({gender:this.gender,age:this.age,});
            let avatarData = genRandomAvatar(person);
            person.avatarData = avatarData;
            paintAvatar(this.ctx,avatarData,CVSWIDTH,CVSHEIGHT,1);
            this.person = person;
            console.log(`生成角色形象`,person);
        },


    },
    components:{

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        width: 100%;
        height: 1000px;
        background-color: #131313;
    }
    .title{
        display: block;
        height: 40px;
        line-height: 40px;
        margin: 0 auto;
        color: #fff;
        text-align: center;
    }
    .wrap{
        position: relative;
        width: 750px;
        height: 900px;
        margin: 0 auto;
    }
    .cvs{
        display: block;
        width: 750px;
        height: 900px;
        margin: 0 auto;
        background-color: #eee;
    }
    .side{
        position: absolute;
        right: -220px;
        top: 0;
        height: 300px;
        width: 200px;
        background-color: #ddf;
    }
    .side-row{
        padding: 6px 10px;
        display: block;
        width: 100%;
        min-height: 30px;
        margin-bottom: 10px;
    }
    .btn{
        cursor: pointer;
        display: inline-block;
        text-align: center;
        white-space: nowrap;
        word-break: keep-all;
        color: #666;
        font-weight: bold;
    }
    .btn:hover{
        opacity: .8;
    }
    .btn-gender{
        width: 40px;
        height: 30px;
        line-height: 30px;
    }
    .btn-gender-sel{
        background-color: #131313;
        color: #fff;
    }
    .inp-num{

    }
    .btn-confirm{
        background-color: OrangeRed;
        color: #fff;
        width: 100px;
        height: 30px;
        line-height: 30px;
    }
</style>
