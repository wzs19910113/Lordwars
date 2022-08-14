<template>
    <div class="bar1" :class="`st-${type} size-${size}`">
        <div class="title" v-if="type!=5&&type!=6">{{title}}</div>
        <div class="bar">
            <div class="bar-full" :class="{'trans':(type==1||type==2||type==3)}" :style="{width:`${calcBarLength()}%`}"></div>
            <div class="label">
                <span v-if="type==5||type==6">{{title}}</span>{{digitFormat()}}
                <span class="suffix">{{suffixFormat()}}</span>
            </div>
        </div>
        <div class="float" v-for="(change,index) in changes" :class="change>0?'plus':'minus'">{{changeFormat(change)}}</div>
    </div>
</template>
<script>
import { query, r, bulbsort } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        title: String,
        type: Number, // [1:生命值|2:意志|3:存在感|4:行动力|5:时间|6:逃跑|7-10:方向标|11:夺宝率]
        crt: Number,
        max: Number,
        size: String,
        changes: Array,
        checkSuffix: Boolean,
    },
    data() {
        return {

        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){

        },
        digitFormat(){
            if(this.type==3||this.type==4||this.type==11){
                return `${Math.round(this.crt/100)} %`;
            }
            else if(this.type==5){
                return `${Math.round(this.crt/50)} %`;
            }
            else{
                return `${Math.round(this.crt)} / ${Math.round(this.max)}`;
            }
        },
        changeFormat(change){
            let suffix = '';
            if(this.type==3||this.type==4||this.type==11){
                change = Math.round(change/100);
                suffix = '%';
            }
            return (change>0?`+${change}`:`${change}`)+suffix;
        },
        suffixFormat(){
            let res = '';
            if(this.checkSuffix){
                if(this.type==2){ // 疲惫
                    let powRatio = this.crt/this.max;
                    let bonusRatio = CONFIG.bonus.pow/100;
                    if(powRatio<=bonusRatio){
                        res = '疲惫！';
                    }
                }
                else if(this.type==4){ // 破绽
                    if(this.crt>=CONFIG.bonus.move||this.crt<=0){
                        res = '破绽！';
                    }
                }
            }
            return res;
        },
        calcBarLength(){
            let res = 0;
            if(this.type==3||this.type==4||this.type==11){
                res = Math.round(this.crt/100);
            }
            else if(this.type==5){
                res = Math.round(this.crt/50);
            }
            else{
                res = Math.round(this.crt/this.max*100);
            }
            if(res>100)
                res = 100;
            else if(res<0)
                res = 0;
            return res;
        },
    },
};
</script>
<style scoped>
    .bar1{
        height: 14px;
        line-height: 14px;
        width: 180px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .st-1 .bar-full{
        background-color: MediumVioletRed;
    }
    .st-1 .float{
        color: MediumVioletRed;
    }
    .st-2 .bar-full{
        background-color: RoyalBlue;
    }
    .st-2 .float{
        color: RoyalBlue;
    }
    .st-3 .bar-full{
        background-color: Orange;
    }
    .st-3 .float{
        color: Orange;
    }
    .st-4 .bar-full{
        background-color: ForestGreen;
    }
    .st-4 .float{
        color: ForestGreen;
    }
    .st-7 .bar-full{
        background-color: DarkSlateBlue;
    }
    .st-7 .float{
        color: DarkSlateBlue;
    }
    .st-8 .bar-full{
        background-color: Peru;
    }
    .st-8 .float{
        color: Peru;
    }
    .st-9 .bar-full{
        background-color: DarkGreen;
    }
    .st-9 .float{
        color: DarkGreen;
    }
    .st-10 .bar-full{
        background-color: Red;
    }
    .st-10 .float{
        color: Red;
    }
    .st-11 .bar-full{
        background-color: darkorange;
    }
    .st-11 .float{
        color: darkorange;
    }
    .title{
        width: 50px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        white-space: nowrap;
        word-break: keep-all;
        text-align: right;
        padding-right: 5px;
    }
    .bar{
        position: relative;
        border: 1px solid #555;
        border-top-left-radius: 9px;
        border-bottom-right-radius: 9px;
        height: 14px;
        width: 130px;
        padding-left: 3px;
    }
    .bar-full{
        position: absolute;
        top: 0;
        left: 0;
        height: 12px;
        border-top-left-radius: 9px;
        border-bottom-right-radius: 9px;
        opacity: .7;
    }
    .size-s{
        width: 130px;
        height: 18px;
        line-height: 18px;
    }
    .size-s .title{
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .size-s .label{
        line-height: 14px;
    }
    .size-s .bar{
        width: 100px;
        border: none;
        border-radius: 0;
        color: #fff;
    }
    .size-s .bar-full{
        border: none;
        opacity: 1;
        height: 14px;
        border-radius: 2px;
    }
    .trans{
        transition: .25s all;
    }
    .label{
        position: absolute;
        width: 100%;
        height: 14px;
        line-height: 12px;
        font-size: 14px;
        white-space: nowrap;
        word-break: keep-all;
        color: #131313;
        text-shadow: 0 0 4px #fff;
    }
    .label span{
        display: inline-block;
        margin-right: 30px;
    }
    .suffix{
        color: yellow !important;
        text-shadow: 0 0 4px #000;
        font-size: 11px;
    }
    .st-5,.st-6{
        width: 300px;
        height: 30px;
        line-height: 30px;
    }
    .st-11{
        width: 440px;
        height: 16px;
        line-height: 16px;
    }
    .st-5 .bar,
    .st-6 .bar{
        width: 300px;
        height: 30px;
    }
    .st-11 .bar{
        width: 440px;
        height: 16px;
    }
    .st-5 .bar-full{
        height: 28px;
        background-color: ForestGreen;
    }
    .st-6 .bar-full{
        height: 28px;
        background-color: SlateBlue;
    }
    .st-11 .bar-full{
        height: 14px;
        background-color: darkorange;
    }
    .st-5 .label,
    .st-6 .label{
        text-align: center;
        height: 30px;
        line-height: 28px;
        font-size: 20px;
    }
    .st-11 .label{
        text-align: center;
        height: 16px;
        line-height: 14px;
        font-size: 12px;
    }
    .st-7, .st-8, .st-9, .st-10{
        width: 140px;
    }
    .float{
        position: absolute;
        top: 0;
        right: -120px;
        font-size: 30px;
        font-weight: bold;
        height: 14px;
        line-height: 14px;
        width: 100px;
        white-space: nowrap;
        text-shadow: 0 0 4px #fff;
        word-break: keep-all;
    }
    .plus{
        animation: fl1 2.5s ease-out forwards;
    }
    .minus{
        animation: fl2 2.5s ease-out forwards;
    }
    @keyframes fl1 {
        50%{
            opacity: 1;
            transform: translateY(-25%);
        }
        100%{
            opacity: 0;
            transform: translateY(-50%);
        }
    }
    @keyframes fl2 {
        50%{
            opacity: 1;
            transform: translateY(25%);
        }
        100%{
            opacity: 0;
            transform: translateY(50%);
        }
    }
</style>
