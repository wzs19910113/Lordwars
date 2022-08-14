<template>
    <div class="bar2" :class="'st-'+type">
        <div class="bar">
            <div class="bar-full" :style="{transform:`scale(${calcBarLength()}%)`}"></div>
            <div class="label">{{crt}}</div>
        </div>
        <div class="title">{{title}}</div>
        <div class="float" v-for="(change,index) in changes" :class="change>0?'plus':'minus'">{{change>0?`+${change}`:`${change}`}}</div>
    </div>
</template>
<script>
import { query, r, bulbsort } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        title: String,
        type: Number, // [1:力量|2:精准|3:速度]
        crt: Number,
        max: Number,
        changes: Array,
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
        calcBarLength(){
            let res = Math.round(this.crt/this.max*100);
            if(res>100)
                res = 100
            else if(res<0)
                res = 0;
            return res;
        },
    },
};
</script>
<style scoped>
    .bar2{
        height: 51px;
        width: 60px;
        text-align: center;
    }
    .st-1 .bar{
        border-color: FireBrick;
    }
    .st-1 .bar-full{
        background-color: FireBrick;
        box-shadow: 0 0 10px FireBrick;
    }
    .st-1 .float{
        color: FireBrick;
    }
    .st-2 .bar{
        border-color: #1E90FF;
    }
    .st-2 .bar-full{
        background-color: #1E90FF;
        box-shadow: 0 0 10px #1E90FF;
    }
    .st-2 .float{
        color: #1E90FF;
    }
    .st-3 .bar{
        border-color: ForestGreen;
    }
    .st-3 .bar-full{
        background-color: ForestGreen;
        box-shadow: 0 0 10px ForestGreen;
    }
    .st-3 .float{
        color: ForestGreen;
    }
    .title{
        width: 60px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        margin-top: 2px;
        text-align: center;
        white-space: nowrap;
        word-break: keep-all;
    }
    .bar{
        height: 35px;
        width: 35px;
        margin: 0 auto;
        border-width: 1px;
        border-style: solid;
        border-radius: 17.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ccc;
        overflow: hidden;
    }
    .bar-full{
        height: 100%;
        width: 100%;
        border-radius: 20px;
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
        color: #fff;
        text-shadow: 0 0 2px #000;
    }
    .float{
        position: absolute;
        top: -18px;
        right: 0;
        left: 0;
        margin: 0 auto;
        font-size: 30px;
        font-weight: bold;
        height: 14px;
        line-height: 14px;
        width: 35px;
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
        to{
            opacity: 0;
            transform: translateY(-50%);
        }
    }
    @keyframes fl2 {
        to{
            opacity: 0;
            transform: translateY(50%);
        }
    }
</style>
