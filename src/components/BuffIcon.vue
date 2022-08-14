<template>
    <div class="bufficon" @mouseenter="_mouseon(buff)" @mouseleave="_mouseoff" @click="_onClick(buff)">
        <span class="buff-sp">
            <span class="buff-name" :class="`buff-${buff.good?'good':'bad'}`">
                <span class="buff-name-text">{{calcBuff(buff).name}}{{calcBuff(buff).level}}</span>
                <span class="buff-name-plat" :style="`background-color:${buff.style}`"></span>
            </span>
            <div class="buff-cir">
                <span class="cir-no" :class="`buff-${buff.good?'good':'bad'}-hv`">{{Math.ceil(buff.time/CONFIG.maxEnviorTime)}}</span>
                <div class="cir-pie-1" :style="{opacity:(parseFloat(buff.level/30+.7).toFixed(2))}" v-if="Math.ceil(buff.time/(calcBuffMaxTime(buff)/2))%2==0">
                    <div class="cir-pie-bg"></div>
                    <div class="cir-pie-left" :class="`buff-${buff.good?'good':'bad'}`"></div>
                    <div class="cir-pie-right" :class="`buff-${buff.good?'good':'bad'}`" :style="{transform:`rotateZ(${calcBuffDeg(buff,1)}deg)`}"></div>
                </div>
                <div class="cir-pie-2" :style="{opacity:(parseFloat(buff.level/30+.7).toFixed(2))}" v-else>
                    <div class="cir-pie-bg"></div>
                    <div class="cir-pie-left" :class="`buff-${buff.good?'good':'bad'}`" :style="{transform:`rotateZ(${calcBuffDeg(buff,2)}deg)`}"></div>
                    <div class="cir-pie-right" :class="`buff-${buff.good?'good':'bad'}`"></div>
                </div>
            </div>
        </span>
        <!-- <span class="buff-shadow" :class="`buff-shadow-${buff.good?'good':'bad'}`" :style="{opacity:(parseFloat(buff.time/30000).toFixed(2))}"></span> -->
        <span class="buff-shadow" :class="`buff-shadow-${buff.good?'good':'bad'}`" :style="{opacity:(parseFloat(buff.level/10).toFixed(2))}"></span>
    </div>
</template>
<script>
import { DEBUG, CONFIG, CACHE } from '../config/config';
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, } from '../tools/utils';
import * as common from '../tools/common';
export default {
    props:{
        buff: Object,
        mouseon: Function,
        mouseoff: Function,
        onClick: Function,
    },
    data() {
        return {
            common,
            CONFIG,
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){

        },
        _mouseon(buff){
            this.mouseon&&this.mouseon(buff);
        },
        _mouseoff(){
            this.mouseoff&&this.mouseoff();
        },
        _onClick(buff){
            this.onClick&&this.onClick(buff);
        },
        calcBuff(buff){
            let _buff = getMatchList(CONFIG.buffs,[['id',buff.id]])[0]||{};
            return {
                ..._buff,
                level: buff.level,
            };
        },

        calcBuffDeg(buff,flag){
            let res;
            let maxTime = this.calcBuffMaxTime(buff);
            let time = buff.time;
            if(flag==1){
                res = -Math.round(time/maxTime*360);
            }
            else{
                res = Math.round((1-time/(maxTime/2))*180);
            }
            return res;
        },
        calcBuffMaxTime(buff){
            let { base, lvlup, level, fixTime } = buff;
            let res = 0;
            if(buff.base){
                res = fixTime;
            }
            else{
                res = (fixTime+lvlup*level)||0;
            }
            return res;
        },
    },
};
</script>
<style scoped>
    .bufficon{
        position: relative;
        width: 64px;
        line-height: 30px;
        height: 30px;
        background-color: rgba(0,0,0,0);
    }
    .buff-sp{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        color: #fff;
        font-weight: bold;
        text-align: center;
        z-index: 10;
    }
    .buff-good{
        text-shadow: 0 0 6px ForestGreen;
        border-color: ForestGreen;
    }
    .buff-bad{
        text-shadow: 0 0 6px Maroon;
        border-color: Maroon;
    }
    .buff-good-hv{
        text-shadow: 0 0 4px ForestGreen;
    }
    .buff-bad-hv{
        text-shadow: 0 0 4px Maroon;
    }
    .buff:hover .buff-name{

    }
    .buff-name{
        position: relative;
        width: 36px;
        height: 16px;
    }
    .buff-name-text{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        line-height: 16px;
    }
    /* .buff-good .buff-name-plat{
        box-shadow: 0 0 2px 4px ForestGreen;
    }
    .buff-bad .buff-name-plat{
        box-shadow: 0 0 2px 4px Maroon;
    } */
    .buff-name-plat{
        position: absolute;
        z-index: 0;
        display: block;
        width: 100%;
        height: 20px;
        bottom: -10px;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 50%;
        transform: scaleY(.3) rotateZ(27deg);
        animation: spinning 3s linear infinite;
    }
    @keyframes spinning {
        to{
            transform: scaleY(.3) rotateZ(-343deg);
        }
    }
    .buff-shadow{
        position: absolute;
        height: 4px;
        width: 50px;
        border-radius: 2px;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        opacity: .6;
        z-index: 5;
    }
    .buff-shadow-good{
        box-shadow: 0 0 10px 10px ForestGreen;
        background-color: ForestGreen;
    }
    .buff-shadow-bad{
        box-shadow: 0 0 10px 10px Maroon;
        background-color: Maroon;
    }
    .buff-cir{
        position: relative;
        width: 20px;
        height: 20px;
        line-height: 20px;
    }
    .cir-no{
        position: absolute;
        font-size: 11px;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 80%;
        height: 80%;
        color: #fff;
        z-index: 20;
    }
    .cir-pie-1,.cir-pie-2{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 80%;
        height: 80%;
        z-index: 10;
    }
    .cir-pie-bg{
        position: absolute;
        background-color: #fff;
        border-radius: 8px;
        width: 16px;
        height: 16px;
        z-index: 11;
    }
    .cir-pie-left,.cir-pie-right{
        position: absolute;
        width: 16px;
        height: 16px;
        transition: .25s all;
    }
    .cir-pie-1 .cir-pie-left{
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border-left-style: solid;
        border-left-width: 8px;
        z-index: 13;
    }
    .cir-pie-1 .cir-pie-right{
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-right-style: solid;
        border-right-width: 8px;
        z-index: 12;
    }
    .cir-pie-2 .cir-pie-left{
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border-left-style: solid;
        border-left-width: 8px;
        z-index: 12;
    }
    .cir-pie-2 .cir-pie-right{
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-right-style: solid;
        border-right-width: 8px;
        border-color: #fff;
        z-index: 13;
    }
</style>
