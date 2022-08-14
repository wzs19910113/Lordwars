<template>
    <div class="bar3" :class="`st-${color}`">
        <div class="title" :class="crt>=max?'clickable':''">{{title}}</div>
        <div class="bar">
            <div class="dot" :class="{'highlight':(index<=crt),'dot-full':(crt>=max)}" v-for="index in max"></div>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        title: String,
        color: String, //blue,peru,green,red
        crt: Number,
        max: Number,
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
    },
};
</script>
<style scoped>
    .bar3{
        position: relative;
        width: 180px;
        height: 20px;
        line-height: 20px;
    }
    .title{
        position: absolute;
        left: 0;
        top: 0;
        width: 70px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
        white-space: nowrap;
        word-break: keep-all;
        border-radius: 3px;
        color: #fff;
        background-color: #ccc;
        text-align: center;
    }
    .bar{
        position: absolute;
        right: 0;
        top: 0;
        width: 110px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: transparent;
        padding-right: 30px;
    }
    .dot{
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #ddd;
    }
    .dot-full{
        border: 2px solid #fff;
    }
    .st-blue .highlight{
        background-color: DarkSlateBlue;
        box-shadow: 0 0 6px DarkSlateBlue;
    }
    .st-blue .clickable{
        background-color: DarkSlateBlue;
    }
    .st-blue .dot-full{
        animation: t-flash-blue .5s linear infinite alternate;
    }
    @keyframes t-flash-blue {
        to{
            box-shadow: 0 0 8px 6px DarkSlateBlue;
        }
    }
    .st-peru .highlight{
        background-color: Peru;
        box-shadow: 0 0 6px Peru;
    }
    .st-peru .clickable{
        background-color: Peru;
    }
    .st-peru .dot-full{
        animation: t-flash-peru .5s linear infinite alternate;
    }
    @keyframes t-flash-peru {
        to{
            box-shadow: 0 0 8px 6px Peru;
        }
    }
    .st-green .highlight{
        background-color: DarkGreen;
        box-shadow: 0 0 6px DarkGreen;
    }
    .st-green .clickable{
        background-color: DarkGreen;
    }
    .st-green .dot-full{
        animation: t-flash-green .5s linear infinite alternate;
    }
    @keyframes t-flash-green {
        to{
            box-shadow: 0 0 8px 6px DarkGreen;
        }
    }
    .st-red .highlight{
        background-color: Red;
        box-shadow: 0 0 6px Red;
    }
    .st-red .clickable{
        background-color: Red;
    }
    .st-red .dot-full{
        animation: t-flash-red .5s linear infinite alternate;
    }
    @keyframes t-flash-red {
        to{
            box-shadow: 0 0 8px 6px Red;
        }
    }
</style>
