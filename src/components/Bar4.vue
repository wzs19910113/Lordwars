<template>
    <div class="bar4" :class="`st-${type}`">
        <div class="title">{{digitFormat()}}</div>
        <div class="bar">
            <div class="bar-full" :class="{'trans':type==1}" :style="{height:`${calcBarLength()}%`}"></div>
            <div class="label">
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
        type: Number, // [1:存在感|2:行动力]
        crt: Number,
        max: Number,
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
            return `${Math.round(this.crt/100)}%`;
        },
        changeFormat(change){
            let suffix = '';
            change = Math.round(change/100);
            suffix = '%';
            return (change>0?`+${change}`:`${change}`)+suffix;
        },
        suffixFormat(){
            let res = '';
            if(this.checkSuffix){
                if(this.type==2){ // 破绽
                    if(this.crt>=CONFIG.bonus.move||this.crt<=0){
                        res = '破';
                    }
                }
            }
            return res;
        },
        calcBarLength(){
            let res = 0;
            res = Math.round(this.crt/100);
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
    .bar4{
        width: 22px;
        height: 134px;
        line-height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .st-1 .bar-full{
        background-color: Orange;
    }
    .st-1 .float{
        color: Orange;
    }
    .st-2 .bar-full{
        background-color: ForestGreen;
    }
    .st-2 .float{
        color: ForestGreen;
    }
    .title{
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 10px;
        height: 14px;
        line-height: 14px;
        white-space: nowrap;
        word-break: keep-all;
        text-align: right;
        padding-right: 5px;
        color: #777;
    }
    .bar{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        border: 1px solid #888;
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
        height: 120px;
        width: 12px;
        padding-top: 3px;
    }
    .bar-full{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 10px;
        height: 120px;
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
        opacity: .7;
    }
    .trans{
        transition: .25s all;
    }
    .label{
        position: absolute;
        width: 100%;
        height: 100%;
        line-height: 12px;
        font-size: 12px;
        white-space: nowrap;
        word-break: keep-all;
        color: #131313;
        text-shadow: 0 0 4px #fff;
    }
    .suffix{
        display: block;
        width: 100%;
        height: 100%;
        word-wrap: break-word;
        color: yellow !important;
        margin: 0 auto;
        writing-mode: vertical-lr;
        text-shadow: 0 0 4px #000;
        font-size: 11px;
    }
    .float{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
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
