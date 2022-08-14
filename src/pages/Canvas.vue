<template>
    <div class="main">
        <h1 class="title"><i>Canvas</i></h1>
        <div class="side side-left">
            <a class="btn" :class="strokeMode==0?'btn-on':''" @click="onClickMoveTo">移动</a>
            <a class="btn" :class="strokeMode==1?'btn-on':''" @click="onClickLineTo">直线</a>
            <a class="btn" :class="strokeMode==2?'btn-on':''" @click="onClickCurveTo">曲线<i v-if="strokeMode==2">({{curveStep}})</i></a>
            <br/>
            <a class="btn" @click="onClickPrevStep">上一步</a>
            <!-- <a class="btn" @click="onClickNextStep">下一步</a> -->
        </div>
        <div class="side side-right">
            <textarea class="output" v-model="output"></textarea>
            <a class="btn" @click="onClickX2">x2</a>
            <a class="btn" @click="onClickD2">d2</a>
            <a class="btn" @click="onClickImport">导入</a>
            <a class="btn" @click="onClickRandom(1)">随机脸（男）</a>
            <a class="btn" @click="onClickRandom(2)">随机脸（女）</a>
        </div>
        <div class="wrap op">
            <div class="cvs-bg">
                <div class="pan-point" :style="{top:panPoint[1]+'px',left:panPoint[0]+'px'}"></div>
            </div>
            <canvas class="cvs" width="500" height="500" ref="cvs" @click="onClickCanvas" />
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const CVSLEN = 500;
export default {
    name: 'Canvas',
    data(){
        return {
            input: [],
            recordInput: [],

            strokeMode: 0, // [0:移动|1:画直线|2:画曲线]
            panPoint: [0,0,], // 画点
            curveStep: 0, // [0:设置拐点|1:设置终点]
            curvePoint: [0,0,], // 拐点

            output: '',

            ctx: null,
            loading: false,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.ctx = this.$refs.cvs.getContext(`2d`);
		    this.ctx.width = 500;
		    this.ctx.height = 500;
            // this.drawInput();
        },
        drawInput(){
            this.ctx.clearRect(0,0,500,500);
            this.ctx.beginPath();
            for(let option of this.input){
                let mode = option[0];
                switch(mode){
                    case 0:
                        this.ctx.moveTo(option[1],option[2],);
                    break;
                    case 1:
                        this.ctx.lineTo(option[1],option[2],);
                    break;
                    case 2:
                        this.ctx.quadraticCurveTo(option[1],option[2],option[3],option[4],);
                    break;
                }
            }
            this.output = JSON.stringify(this.input);
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();
        },

        onClickMoveTo(e){ //
            this.strokeMode = 0;
            this.curveStep = 0;
        },
        onClickLineTo(e){ //
            this.strokeMode = 1;
            this.curveStep = 0;
        },
        onClickCurveTo(e){ //
            this.strokeMode = 2;
            this.curveStep = 0;
        },
        onClickPrevStep(){ // 上一步
            console.log(`上一步`);
            if(this.input.length>0){
                this.input.pop();
                let lastInput = this.input[this.input.length-1];
                if(lastInput){
                    if(lastInput[0]!=2){ // 移动或直线模式
                        this.panPoint = [lastInput[1],lastInput[2]];
                    }
                    else{ // 曲线模式
                        this.panPoint = [lastInput[3],lastInput[4]];
                    }
                }
                this.drawInput();
            }
        },
        onClickNextStep(){ // 下一步
            console.log(`下一步`);
            this.drawInput();
        },
        onClickImport(){ // 导入
            this.input = JSON.parse(this.output);
            this.drawInput();
        },
        onClickCanvas(e){ //
            let x = e.offsetX;
            let y = e.offsetY;
            switch(this.strokeMode){
                case 0: // 移动
                    if(this.input[this.input.length-1]&&this.input[this.input.length-1][0]==0){
                        this.input[this.input.length-1] = [this.strokeMode,x,y];
                    }
                    else{
                        this.input.push([this.strokeMode,x,y]);
                    }
                break;
                case 1: // 画直线
                    this.input.push([this.strokeMode,x,y]);
                break;
                case 2: // 画曲线
                    if(this.curveStep==0){ // 设置拐点
                        this.curvePoint = [x,y];
                        this.curveStep = 1;
                    }
                    else if(this.curveStep==1){ // 设置终点
                        this.input.push([this.strokeMode,this.curvePoint[0],this.curvePoint[1],x,y]);
                        this.curveStep = 0;
                    }
                break;
            }
            this.panPoint = [x,y];
            this.recordInput = [...this.input];
            this.drawInput();
        },
        onClickX2(e){ // 乘2
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                for(let i=1;i<next.length;i++){
                    next[i] = outputD[k][i]*2;
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickD2(e){ // 除2
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                for(let i=1;i<next.length;i++){
                    next[i] = Math.round(outputD[k][i]/2);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },

        /*
        {
            color: 'pink',
            outline: [
                [0,111,222],
                [1,222,333],
                [1,333,444],
                [1,111,222],
            ]
        }
        */
        drawData(data){ // 画数据
            let { color, outline } = data;
            this.ctx.beginPath();
            this.ctx.lineCap = 'round';
            for(let option of outline){
                let mode = option[0];
                switch(mode){
                    case 0:
                        this.ctx.moveTo(option[1],option[2],);
                    break;
                    case 1:
                        this.ctx.lineTo(option[1],option[2],);
                    break;
                    case 2:
                        this.ctx.quadraticCurveTo(option[1],option[2],option[3],option[4],);
                    break;
                }
            }
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();
            if(data.color){
                this.ctx.fillStyle= data.color;
                this.ctx.fill();
            }
        },
        onClickRandom(gender){ // 点击【随机脸】按钮
            // 生成基本脸
            let faceData = this.genRandomFaceData(gender);
            faceData.outline = this.formatPx(faceData.outline);
            // 生成头发
            let hairData = this.genRandomHairData(faceData,gender);
            hairData.outline = this.formatPx(hairData.outline);
            console.log(faceData);
            console.log(hairData);
            this.drawData(faceData);
            this.drawData(hairData);
        },
        formatPx(data){
            return Array.from(data,item=>{
                let res = [];
                if(item[0]!=2){
                    res = [item[0],parseInt(item[1]/2),parseInt(item[2]/2)];
                }
                else{
                    res = [2,parseInt(item[1]/2),parseInt(item[2]/2),parseInt(item[3]/2),parseInt(item[4]/2)];
                }
                return res;
            });
        },
        genRandomFaceData(gender){ // 随机生成脸
            let a,b,c,d,e,f,g,h,i;
            let color;
            if(gender==2){ // 女
                a = [500,r(240,260)]; // 头顶 千分比
                b = [500,r(280,290)]; // 刘海中心
                c = [r(310,330),r(410,440)]; // 脸左
                d = [r(390,410),r(380,450)]; // 左眉毛中心
                e = [r(390,410),r(485,520)]; // 左眼下
                f = [500,r(580,620)]; // 鼻下
                g = [500,r(625,655)]; // 唇上
                h = [r(410,425),r(700,720)]; // 颊左
                i = [500,r(740,770)]; // 下巴
                let colorDeep = r(0,5);
                color = `rgb(${r(250,255)-colorDeep},${r(239,245)-colorDeep},${r(229,234)-colorDeep})`;
            }
            else{ // 男
                a = [500,r(240,260)]; // 头顶 千分比
                b = [500,r(280,290)]; // 刘海中心
                c = [r(280,310),r(410,440)]; // 脸左
                d = [r(390,410),r(400,430)]; // 左眉毛中心
                e = [r(390,410),r(460,500)]; // 左眼下
                f = [500,r(580,620)]; // 鼻下
                g = [500,r(625,655)]; // 唇上
                h = [r(380,410),r(735,770)]; // 颊左
                i = [500,r(787,830)]; // 下巴
                let colorDeep = r(0,15);
                color = `rgb(${r(252,255)-colorDeep},${r(230,238)-colorDeep},${r(220,227)-colorDeep})`;
            }
            let res = {
                a,b,c,d,e,f,g,h,i,
                outline: [],
                color,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成头部轮廓
            let cp1,cp2,cp3;
            if(gender==2){ // 女
                cp1 = [r(c[0],c[0]+50),r(a[1],a[1]+20)];
                cp2 = [r(c[0],c[0]+25),r(h[1]-85,h[1]-55)];
                cp3 = [r(h[0]+5,h[0]+10),r(h[1]+10,h[1]+15)];
            }
            else{ // 男
                cp1 = [r(c[0],c[0]+50),r(a[1],a[1]+20)];
                cp2 = [r(c[0],c[0]+25),r(h[1]-65,h[1]-35)];
                cp3 = [r(h[0]+10,h[0]+30),r(h[1]+20,h[1]+30)];
            }
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 a-c1
            res.outline.push([2,cp2[0],cp2[1],h[0],h[1]]); // 曲线 c1-h1
            res.outline.push([2,cp3[0],cp3[1],i[0],i[1]]); // 曲线 h1-i
            res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(h[0]),h[1]]); // 曲线 i-h2
            res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 h2-c2
            res.outline.push([2,mirX(cp1[0]),cp1[1],a[0],a[1]]); // 曲线 c2-a

            return res;
        },
        genRandomHairData(faceData,gender){ // 随机生成发型
            let res;
            let rHair = CONFIG.maleHairTemplates[r(0,CONFIG.maleHairTemplates.length-1)];
            let center = [...rHair.center];
            let const_outline = [...rHair.outline];
            let outline = Array.from(const_outline,item=>{
                let newItem = [...item];
                return newItem;
            });
            let _scale = (x,y,ox,oy,rate) =>{
                let offset = [x-ox,y-oy];
                if(rate>=1){
                    return [Math.round(x+offset[0]*(rate-1)),Math.round(y+offset[1]*(rate-1))];
                }
                else if(rate>0){
                    return [Math.round(x-offset[0]*rate),Math.round(y-offset[1]*rate)];
                }
            };
            // 校准
            let a = faceData.a;
            let offset = [a[0]-center[0],a[1]-center[1]];
            for(let option of outline){
                if(option[0]!=2){
                    option[1] += offset[0];
                    option[2] += offset[1];
                }
                else{
                    option[1] += offset[0];
                    option[2] += offset[1];
                    option[3] += offset[0];
                    option[4] += offset[1];
                }
            }
            // 随机造型
            for(let option of outline){
                let dr = r(105,130)/100;
                console.log(dr);
                if(option[0]!=2){
                    let vector = _scale(option[1],option[2],center[0],center[1],dr);
                    option[1] = vector[0];
                    option[2] = vector[1];
                }
                else{
                    let vector1 = _scale(option[1],option[2],center[0],center[1],dr);
                    let vector2 = _scale(option[3],option[4],center[0],center[1],dr);
                    option[1] = vector1[0];
                    option[2] = vector1[1];
                    option[3] = vector2[0];
                    option[4] = vector2[1];
                }
            }
            console.log('=========>',outline);
            // 输出
            res = {
                color: `rgba(${r(0,200)},${r(0,200)},${r(0,200)})`,
                outline,
            }
            return res;
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
        height: 1200px;
        background-color: #fff;
    }
    .side{
        position: absolute;
        top: 50px;
        background-color: #ccc;
        padding: 10px;
    }
    .side-left{
        left: 100px;
        width: 140px;
        height: 600px;
    }
    .side-right{
        right: 100px;
        width: 240px;
        height: 240px;
    }
    .btn{
        width: 120px;
        height: 25px;
        line-height: 25px;
        background-color: OrangeRed;
        color: #fff;
        text-align: center;
        display: block;
        margin-bottom: 5px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
    }
    .side .btn-on{
        background-color: #000;
    }
    .wrap{
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 8px;
    }
    .op{
        position: relative;
        width: 500px;
        height: 500px;
        /* transform: scale(50%); */
        border: 1px solid #aaa;
    }
    .text{
        width: 600px;
        height: 100px;
    }
    .cvs-bg{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #ccc;
        z-index: 5;
    }
    .pan-point{
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        transform: translate(-50%,-50%);
        background-color: red;
    }
    .cvs{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 10;
    }
    .output{
        width: 100%;
        height: 100%;
        padding: 12px;
        overflow-y: scroll;
        background-color: #cca;
    }
</style>
