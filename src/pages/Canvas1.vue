<template>
    <div class="main">
        <h1 class="title"><i>Canvas衣服</i></h1>
        <div class="side side-left">
            <div class="inp-wrap">
                <span>编辑碎片序号:</span><input v-model="fragIndex" @input="onChangeFragIndex($event)" />
            </div>
            <a class="btn" @click="onClickShowEStyle">编辑碎片属性</a>
            <br/>
            <a class="btn" :class="strokeMode==0?'btn-on':''" @click="onClickMoveTo">移动</a>
            <a class="btn" :class="strokeMode==1?'btn-on':''" @click="onClickLineTo">直线</a>
            <a class="btn" :class="strokeMode==2?'btn-on':''" @click="onClickCurveTo">曲线<i v-if="strokeMode==2">({{curveStep}})</i></a>
            <a class="btn" :class="strokeMode==4?'btn-on':''" @click="onClickArc">圆圈</a>
            <div class="inp-wrap">
                <span>圆半径:</span><input v-model="arcRadius" />
            </div>
            <div class="inp-wrap">
                <span>锚点:</span><input v-model="anchorPoint" />
            </div>
            <a class="btn" :class="strokeMode==3?'btn-on':''" @click="onClickModify">修改</a>
            <br/>
            <a class="btn" @click="onClickPrevStep">上一步({{inputsIndex}})</a>
            <!-- <a class="btn" @click="onClickNextStep">下一步</a> -->
        </div>
        <div class="side side-right">
            <textarea class="output" ref="txt" v-model="output"></textarea>
            <div class="float-tip">
                <code v-if="strokeMode==3&&modifyStep==1" ref="floattip">{{modifyPoint[1]}},{{modifyPoint[2]}}</code>
            </div>
            <div class="btn-wrap">
                <span>操作全部碎片：</span>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(1,true)">x2</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(2,true)">d2</a>
                <br/>
                <span>操作当前碎片：</span>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(1,false)">x2</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(2,false)">d2</a>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(3,false)">X缩</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(4,false)">X放</a>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(5,false)">Y缩</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(6,false)">Y放</a>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(7,false)">左</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(8,false)">右</a>
                <br/>
                <a class="btn btn-sm" @click="onClickModifyOutput(9,false)">上</a>
                <a class="btn btn-sm" @click="onClickModifyOutput(10,false)">下</a>
                <br/>
                <a class="btn btn-sm" @click="onClickFlatCopy">水平复制</a>
                <a class="btn btn-sm" @click="onClickFlatUp">水平翻转</a>
                <br/>
                <br/>
                <a class="btn btn-sm" @click="onClickRead">读取</a>
            </div>
        </div>
        <div class="wrap op">
            <div class="cvs-bg">
                <div class="hline"></div>
                <div class="point pan-point" :style="{top:panPoint[1]+'px',left:panPoint[0]+'px'}"></div>
                <div class="point modify-point" :style="{top:modifyPoint[2]+'px',left:modifyPoint[1]+'px'}" v-if="strokeMode==3&&modifyStep==1"></div>
                <div class="point all-point" v-if="showAllPoints" :class="point[4]?'curve-point':''" v-for="point in allPoints" :style="{top:point[2]+'px',left:point[1]+'px'}"></div>
            </div>
            <canvas class="cvs" width="500" height="600" ref="cvs" @click="onClickCanvas" />
        </div>
        <div class="pop" v-if="showEStyle">
            <div class="panel">
                <textarea class="output output-pop" ref="poptxt" v-model="estyleOutput"></textarea>
                <textarea class="pop-template">
                    ["color",{"r":0,"g":0,"b":0}]
                    ["strokeColor",{"r":0,"g":0,"b":0}]
                    ["lineWidth",1]
                    ["noStroke",true]
                </textarea>
            </div>
            <a class="btn btn-close" @click="showEStyle=false">关闭</a>
            <a class="btn btn-confirm" @click="onClickConfirmEStyle">确认修改</a>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import * as common from '../tools/common';
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, genGlassData, generalForeHairTemplates, maleForeHairTemplates, femaleForeHairTemplates, generalBangsTemplates, maleBangsTemplates, femaleBangsTemplates, generalBackHairTemplates, maleBackHairTemplates, femaleBackHairTemplates, glassTemplates,  } from '../tools/avatar';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const CVSWIDTH = 500;
const CVSHEIGHT = 600;
export default {
    name: 'Canvas1',
    data(){
        return {
            /*
                [
                    {
                        outline: [[1,a1,b1],[1,a2,b2],],
                        color: {},
                        strokeColor: {},
                        lineWidth: 2,
                        noStroke: true,
                    },
                ]
            */
            inputs: [],
            fragIndex: 0, // 碎片下标
            inputsIndex: 0, // 历史记录下标

            strokeMode: 0, // [0:移动|1:画直线|2:画曲线|3:设置修改点|4:圆圈]
            panPoint: [0,0,], // 画点

            curveStep: 0, // [0:设置拐点|1:设置终点]
            curvePoint: [0,0,], // 拐点

            modifyPoint: [0,0,0,0,0,], // 修改目标点 [mode,x,y,index,isCurvePoint]
            modifyStep: 0, // [0:选择修改点|1:修改]

            arcRadius: 5, // 圆半径

            anchorPoint: '', // 锚点

            output: '',

            person: {},

            showAllPoints: false, // 显示所有点
            allPoints: [], // 所有点数组 [mode,x,y,index,isCurvePoint]

            showEStyle: false, // 显示编辑碎片属性弹窗
            estyleOutput: '[]', // 编辑碎片属性

            ctx: null,
            loading: false,

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
            this.initKeyboard();
        },
        initKeyboard(){ // 初始化键盘事件
            if(!document.onkeyup){
                document.onkeyup = event =>{
                    let e = event||window.event||arguments.callee.caller.arguments[0];
                    if(e&&e.keyCode==81){ // 按 Q
                        this.onKeyupQ();
                    }
                    if(e&&e.keyCode==90){ // 按 Z
                        this.onKeyupZ();
                    }
                };
            }
        },
        onKeyupZ(){ // 按 A
            this.showAllPoints = !this.showAllPoints;
        },
        onKeyupQ(){ // 按 A
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onChangeFragIndex(e){ // 修改碎片下标
            let val = e.target.value;
            if(this.inputs[this.inputsIndex][val]){
                this.asynPanPoint();
                this.asynAllPoints();
            }
        },
        drawInput(){
            let input = this.inputs[this.inputsIndex];
            if(input){
                this.ctx.clearRect(0,0,CVSWIDTH,CVSHEIGHT);
                for(let i=0;i<input.length;i++){
                    let frag = input[i];
                    if(frag){
                        this.drawData(frag);
                    }
                }
                this.output = JSON.stringify(input);
            }
            else{
                this.output = '';
            }
        },
        asynPanPoint(){ // 同步笔点
            let p = this.inputs[this.inputsIndex];
            if(p){
                let frag = p[this.fragIndex];
                if(frag){
                    let outline = frag.outline;
                    let option = outline[outline.length-1];
                    let mode = this.formatMode(option[0])[0];
                    if(option){
                        this.panPoint = [option[option.length-2],option[option.length-1]];
                    }
                }
            }
            else{
                this.panPoint = [0,0];
            }
        },
        asynAllPoints(){ // 同步拐点数组
            let p = this.inputs[this.inputsIndex];
            let anchor = this.anchorPoint;
            if(p){
                let allPoints = [];
                let frag = p[this.fragIndex];
                if(frag){
                    let outline = frag.outline;
                    for(let i=0;i<outline.length;i++){
                        let option = outline[i];
                        if(option){
                            let mode = this.formatMode(option[0])[0];
                            if(mode==0||mode==1){
                                allPoints.push([mode,option[1],option[2],i,false]);
                            }
                            else if(mode==2){
                                allPoints.push([mode,option[1],option[2],i,true]);
                                allPoints.push([mode,option[3],option[4],i,false]);
                            }
                            else if(mode==3){
                                allPoints.push([mode,option[2],option[3],i,false]);
                            }
                        }
                    }
                    this.allPoints = allPoints;
                }
            }
            else{
                this.allPoints = [];
            }
        },
        formatMode(mode){ // 锚点格式转化
            if(isNaN(mode)){
                /*
                    '{绘制模式[0|1|2|3]},是否连贯{1|0},{锚点名[c1-k]}_{对齐轴[x|y]}_{紧致度百分比[R]}'
                    '2,0,c1_x_0,i22_y_50' => [2,0,[['c1','x',0],['i22','y',50],]]
                */
                let res = [];
                let d1 = mode.split(',');
                res[0] = parseInt(d1[0]);
                res[1] = parseInt(d1[1]);
                res[2] = [];
                for(let i=2;i<d1.length;i++){
                    let d2 = d1[i].split('_');
                    // let
                    // for(let j=0;j<d2.length;j++){
                    //     res[1].push(d2[j]);
                    // }
                    res[2].push(d2);
                }
                return res;
            }
            else{
                return [parseInt(mode)];
            }
        },

        onClickShowEStyle(){ // 点击【修改碎片属性】按钮
            let input = this.inputs[this.inputsIndex];
            if(input){
                if(!input[this.fragIndex]){
                    input[this.fragIndex] = {outline:[]};
                }
                let frag = input[this.fragIndex];
                let eoutput = [];
                for(let key in frag){
                    if(key!='outline'){
                        eoutput.push([key,frag[key]]);
                    }
                }
                this.estyleOutput = JSON.stringify(eoutput);
                this.showEStyle = !this.showEStyle;
            }
        },
        onClickConfirmEStyle(){ // 点击【确认修改】碎片属性按钮
            let estyle = JSON.parse(this.estyleOutput);
            let input = this.inputs[this.inputsIndex];
            if(input){
                let frag = {
                    outline: input[this.fragIndex].outline,
                }
                if(frag){
                    for(let st of estyle){
                        frag[st[0]] = st[1];
                    }
                    this.inputs[this.inputsIndex][this.fragIndex] = frag;
                    this.asynPanPoint();
                    this.asynAllPoints();
                    this.drawInput();
                    this.showEStyle = false;
                }
            }
        },
        onClickMoveTo(e){ // 点击【移动】按钮
            this.strokeMode = 0;
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onClickLineTo(e){ // 点击【直线】按钮
            this.strokeMode = 1;
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onClickCurveTo(e){ // 点击【曲线】按钮
            this.strokeMode = 2;
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onClickArc(e){ // 点击【圆圈】按钮
            this.strokeMode = 4;
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onClickModify(){ // 点击【修改】按钮
            this.strokeMode = 3;
            this.curveStep = 0;
            this.modifyStep = 0;
        },
        onClickPrevStep(){ // 上一步
            if(this.inputsIndex>0){
                this.inputsIndex--;
                // if(input.length>0){
                //     let lastInput = input[input.length-1];
                //     if(lastInput){
                //         if(lastInput[0]!=2){ // 移动或直线模式
                //             this.panPoint = [lastInput[1],lastInput[2]];
                //         }
                //         else{ // 曲线模式
                //             this.panPoint = [lastInput[3],lastInput[4]];
                //         }
                //     }
                //     this.drawInput();
                // }
                this.asynPanPoint();
                this.asynAllPoints();
                this.drawInput();
            }
        },
        onClickNextStep(){ // 下一步
            this.drawInput();
        },

        onClickCanvas(e){ // 点击【Canvas】
            let input = cloneObj(this.inputs[this.inputsIndex],[]);
            let frag = input[this.fragIndex]||{outline:[]};
            let x = e.offsetX;
            let y = e.offsetY;
            let setupNewInput = false;
            let mode = `${this.strokeMode}${this.anchorPoint?(','+this.anchorPoint):''}`;
            // 粘附
            /*let closetPoint = this.findClosetPointIndex(x,y,input);
            let stinkyPointDistance = closetPoint.distance;
            let stinkyPointIndex = closetPoint.index;
            let stinkyPointIsCurvePoint = closetPoint.isCurvePoint;
            let nx = x, ny = y;
            if(stinkyPointDistance<2){
                nx = input[stinkyPointIndex][input[stinkyPointIndex].length-2];
                ny = input[stinkyPointIndex][input[stinkyPointIndex].length-1];
            }
            if(lastInput&&nx==lastInput[lastInput.length-2]&&ny==lastInput[lastInput.length-1]){
                return;
            }
            else if(this.strokeMode==2&&this.curveStep==0){

            }
            else{
                x = nx;
                y = ny;
            }*/
            switch(this.strokeMode){
                case 0: // 移动
                    let lastOption;
                    let lastOptionMode;
                    lastOption = frag.outline[frag.outline.length-1];
                    if(lastOption){
                        lastOptionMode = this.formatMode(lastOption[0])[0];
                    }
                    if(lastOptionMode==0){
                        frag.outline[frag.outline.length-1] = [mode,x,y];
                    }
                    else{
                        frag.outline.push([mode,x,y]);
                    }
                    setupNewInput = true;
                break;
                case 1: // 画直线
                    frag.outline.push([mode,x,y]);
                    setupNewInput = true;
                break;
                case 2: // 画曲线
                    if(this.curveStep==0){ // 设置拐点
                        this.curvePoint = [x,y];
                        this.curveStep = 1;
                    }
                    else if(this.curveStep==1){ // 设置终点
                        frag.outline.push([mode,this.curvePoint[0],this.curvePoint[1],x,y]);
                        this.curveStep = 0;
                        setupNewInput = true;
                    }
                break;
                case 3: // 修改
                    if(this.modifyStep==0){ // 选择修改点
                        let { distance, index, } = this.findClosetPointIndex(x,y,this.allPoints);
                        this.modifyPoint = this.allPoints[index];
                        this.modifyStep = 1;
                        let floattip = this.$refs.floattip;
                        if(floattip){
                            floattip.focus();
                            floattip.select();
                        }
                    }
                    else{ // 修改
                        let isCurvePoint = this.modifyPoint[4];
                        let pointIndex = this.modifyPoint[3];
                        let point = frag.outline[pointIndex];
                        if(isCurvePoint||this.modifyPoint[0]==0||this.modifyPoint[0]==1){
                            frag.outline[pointIndex][1] = x;
                            frag.outline[pointIndex][2] = y;
                        }
                        else if(this.modifyPoint[0]==2){
                            frag.outline[pointIndex][3] = x;
                            frag.outline[pointIndex][4] = y;
                        }
                        else if(this.modifyPoint[0]==3){
                            frag.outline[pointIndex][2] = x;
                            frag.outline[pointIndex][3] = y;
                        }
                        this.modifyStep = 0;
                        setupNewInput = true;
                    }
                break;
                case 4: // 画圆圈
                    frag.outline.push([3,parseInt(this.arcRadius),x,y]);
                    setupNewInput = true;
                break;
            }
            if(setupNewInput){
                this.inputsIndex++;
                if(!this.inputs[this.inputsIndex]){
                    this.inputs[this.inputsIndex] = [];
                }
                if(this.inputs[this.inputsIndex-1]){
                    this.inputs[this.inputsIndex] = cloneObj(this.inputs[this.inputsIndex-1]);
                }
                else{
                    this.inputs[this.inputsIndex] = [];
                }
                this.inputs[this.inputsIndex][this.fragIndex] = frag;
            }
            this.asynPanPoint();
            this.asynAllPoints();
            this.drawInput();
        },

        onClickModifyOutput(flag,allFrags){ // 编辑 output 按钮
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let doModify = frag =>{
                if(frag&&frag.outline){
                    for(let k=0;k<frag.outline.length;k++){
                        let next = [...frag.outline[k]];
                        let mode = this.formatMode(next[0])[0];
                        switch(flag){
                            case 1: // 乘2
                                for(let i=1;i<next.length;i++){
                                    next[i] = frag.outline[k][i]*2;
                                }
                            break;
                            case 2: // 除2
                                for(let i=1;i<next.length;i++){
                                    next[i] = frag.outline[k][i]/2;
                                }
                            break;
                            case 3: // X缩
                                if(mode==0||mode==1){
                                    next[1] = 250-Math.round((250-next[1])/1.05);
                                }
                                else if(mode==2){
                                    next[1] = 250-Math.round((250-next[1])/1.05);
                                    next[3] = 250-Math.round((250-next[3])/1.05);
                                }
                                else if(mode==3){
                                    next[2] = 250-Math.round((250-next[2])/1.05);
                                }
                            break;
                            case 4: // X放
                                if(mode==0||mode==1){
                                    next[1] = 250-Math.round((250-next[1])*1.05);
                                }
                                else if(mode==2){
                                    next[1] = 250-Math.round((250-next[1])*1.05);
                                    next[3] = 250-Math.round((250-next[3])*1.05);
                                }
                                else if(mode==3){
                                    next[2] = 250-Math.round((250-next[2])*1.05);
                                }
                            break;
                            case 5: // Y缩
                                if(mode==0||mode==1){
                                    next[2] = 300-Math.round((300-next[2])/1.05);
                                }
                                else if(mode==2){
                                    next[2] = 300-Math.round((300-next[2])/1.05);
                                    next[4] = 300-Math.round((300-next[4])/1.05);
                                }
                                else if(mode==3){
                                    next[3] = 300-Math.round((300-next[3])/1.05);
                                }
                            break;
                            case 6: // Y放
                                if(mode==0||mode==1){
                                    next[2] = 300-Math.round((300-next[2])*1.05);
                                }
                                else if(mode==2){
                                    next[2] = 300-Math.round((300-next[2])*1.05);
                                    next[4] = 300-Math.round((300-next[4])*1.05);
                                }
                                else if(mode==3){
                                    next[3] = 300-Math.round((300-next[3])*1.05);
                                }
                            break;
                            case 7: // 左移
                                if(mode==0||mode==1){
                                    next[1] -= 2;
                                }
                                else if(mode==2){
                                    next[1] -= 2;
                                    next[3] -= 2;
                                }
                                else if(mode==3){
                                    next[2] -= 2;
                                }
                            break;
                            case 8: // 右移
                                if(mode==0||mode==1){
                                    next[1] += 2;
                                }
                                else if(mode==2){
                                    next[1] += 2;
                                    next[3] += 2;
                                }
                                else if(mode==3){
                                    next[2] += 2;
                                }
                            break;
                            case 9: // 上移
                                if(mode==0||mode==1){
                                    next[2] -= 2;
                                }
                                else if(mode==2){
                                    next[2] -= 2;
                                    next[4] -= 2;
                                }
                                else if(mode==3){
                                    next[3] -= 2;
                                }
                            break;
                            case 10: // 下移
                                if(mode==0||mode==1){
                                    next[2] += 2;
                                }
                                else if(mode==2){
                                    next[2] += 2;
                                    next[4] += 2;
                                }
                                else if(mode==3){
                                    next[3] += 2;
                                }
                            break;
                        }
                        frag.outline[k] = next;
                    }
                }
            }
            if(allFrags){
                for(let frag of outputD){
                    doModify(frag);
                }
            }
            else{
                doModify(outputD[this.fragIndex]);
            }
            this.output = JSON.stringify(outputD);
        },
        onClickFlatCopy(){ // 水平复制
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let expend = [];
            let frag = outputD[this.fragIndex];
            for(let k=0;k<frag.outline.length;k++){
                let next = [...frag.outline[k]];
                let formatedMode = this.formatMode(next[0]);
                let mode = formatedMode[0];
                let moptionarr = formatedMode[2];
                if(isNaN(next[0])){
                    let newMoptionArr = [];
                    for(let i=0;i<moptionarr.length;i++){
                        let moption = moptionarr[i];
                        let anchor = moption[0], axis = moption[1], shrink = moption[2];
                        let pname = anchor.substring(0,anchor.length-1); // a,b,c,d,e,f,g,h,i1,i2,j,k
                        let pside = anchor[anchor.length-1]; // 1 或 2
                        let newMoption = `${pname}${pside==1?2:1}_${axis}_${parseInt(shrink)*(axis=='x'?-1:1)}`;
                        newMoptionArr.push(newMoption);
                    }
                    newMoptionArr = newMoptionArr.join(',');
                    next[0] = `${mode},${formatedMode[1]},${newMoptionArr}`;
                }
                if(mode==0||mode==1){
                    next[1] = CVSWIDTH-next[1];
                }
                else if(mode==2){
                    next[1] = CVSWIDTH-next[1];
                    next[3] = CVSWIDTH-next[3];
                }
                else if(mode==3){
                    next[2] = CVSWIDTH-next[2];
                }
                expend.push(next);
            }
            frag.outline = [...frag.outline,...expend];
            this.output = JSON.stringify(outputD);
        },
        onClickFlatUp(){ // 水平翻转
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let expend = [];
            let frag = outputD[this.fragIndex];
            for(let k=0;k<frag.outline.length;k++){
                let next = frag.outline[k];
                let formatedMode = this.formatMode(next[0]);
                let mode = formatedMode[0];
                let moptionarr = formatedMode[2];
                if(isNaN(next[0])){
                    let newMoptionArr = [];
                    for(let i=0;i<moptionarr.length;i++){
                        let moption = moptionarr[i];
                        let anchor = moption[0], axis = moption[1], shrink = moption[2];
                        let pname = anchor.substring(0,anchor.length-1); // a,b,c,d,e,f,g,h,i1,i2,j,k
                        let pside = anchor[anchor.length-1]; // 1 或 2
                        let newMoption = `${pname}${pside==1?2:1}_${axis}_${parseInt(shrink)*(axis=='x'?-1:1)}`;
                        newMoptionArr.push(newMoption);
                    }
                    newMoptionArr = newMoptionArr.join(',');
                    next[0] = `${mode},${formatedMode[1]},${newMoptionArr}`;
                }
                if(mode==0||mode==1){
                    next[1] = CVSWIDTH-next[1];
                }
                else if(mode==2){
                    next[1] = CVSWIDTH-next[1];
                    next[3] = CVSWIDTH-next[3];
                }
                else if(mode==3){
                    next[2] = CVSWIDTH-next[2];
                }
                frag.outline[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },

        onClickRead(){ // 读取
            if(!this.output)
                return;
            this.inputsIndex++;
            this.inputs[this.inputsIndex] = JSON.parse(this.output);
            this.asynPanPoint();
            this.asynAllPoints();
            this.drawInput();
        },
        findClosetPointIndex(x,y,points){ // 寻找最近点的下标值
            let targetPointIndex = -1; // 目标点下标
            let minDist = Infinity; // 最小路径
            for(let i=0;i<points.length;i++){
                let option = points[i];
                let dist = calcDistance(x,y,option[1],option[2]);
                if(dist<minDist){
                    minDist = dist;
                    targetPointIndex = i;
                }
            }
            return {
                distance: minDist,
                index: targetPointIndex,
            };
        },


        fill(data,mode){ // 填充
            let {
                color, strokeColor, alpha,
                grd, topY, bottomY, leftX, rightX,
                rgrd, radial,
                noStroke,
            } = data;
            let ctx = this.ctx;
            if(!noStroke){
                ctx.stroke();
            }
            if(color){
                let grdStyle;
                if(grd){ // 线性渐变
                    if(data.test) console.log(`画`,data.topY,data.bottomY);
                    grdStyle = ctx.createLinearGradient(leftX||500,topY||0,rightX||500,bottomY||1000);
                    grdStyle.addColorStop(0,grd);
                    grdStyle.addColorStop(1,`rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`);
                }
                else if(rgrd){ // 扩散渐变
                    // console.log(`扩散渐变`,radial,rgrd);
                    grdStyle = ctx.createRadialGradient(radial.x1,radial.y1,radial.r1,radial.x2,radial.y2,radial.r2);
                    grdStyle.addColorStop(0,rgrd);
                    grdStyle.addColorStop(1,`rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`);
                }
                else{
                    grdStyle = `rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`;
                }
                ctx.fillStyle = grdStyle;
                ctx.fill();
            }
        },
        drawData(data,mode){ // 画
            let { color, outline, topY, bottomY, grd, rgrd, radial, lineWidth, strokeColor, alpha, noStroke, } = data;
            let ctx = this.ctx;
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineWidth = lineWidth||1;
            if(strokeColor){
                ctx.strokeStyle = `rgba(${strokeColor.r},${strokeColor.g},${strokeColor.b},${strokeColor.alpha||1})`;
            }
            else{
                ctx.strokeStyle = '#000';
            }
            for(let option of outline){
                let mode = this.formatMode(option[0])[0];
                switch(mode){
                    case 0: // 移动
                        ctx.moveTo(option[1],option[2],);
                    break;
                    case 1: // 直线
                        ctx.lineTo(option[1],option[2],);
                    break;
                    case 2: // 曲线
                        ctx.quadraticCurveTo(option[1],option[2],option[3],option[4],);
                    break;
                    case 3: // 圆
                        ctx.moveTo(option[2]+option[1],option[3],);
                        ctx.arc(option[2],option[3],option[1],0,2*Math.PI);
                        ctx.closePath();
                    break;
                }
            }
            this.fill(data,mode);
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
    .btn-wrap{
        background-color: PaleTurquoise;
        border: 2px solid SlateBlue;
        padding: 6px;
        width: 100%;
        margin-bottom: 12px;
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
        font-size: 14px;
    }
    .btn-sm{
        display: inline-block;
        width: 65px;
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
    .inp-wrap{
        width: 120px;
        margin-bottom: 5px;
    }
    .inp-wrap input{
        display: inline-block;
        width: 100%;
    }
    .op{
        position: relative;
        width: 500px;
        height: 600px;
        /* transform: scale(50%); */
        border: 1px solid #aaa;
    }
    .board{
        width: 500px;
        min-height: 300px;
        background-color: #eee;
        padding: 12px;
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
    .point{
        position: absolute;
    }
    .hline{
        position: absolute;
        height: 100%;
        border: 1px solid #000;
        opacity: .3;
        width: 0;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        transform: scaleX(25%) translateX(200%);
        margin: 0 auto;
    }
    .pan-point{
        width: 4px;
        height: 4px;
        border-radius: 2px;
        transform: translate(-50%,-50%);
        background-color: red;
    }
    .modify-point{
        width: 6px;
        height: 6px;
        border-radius: 3px;
        transform: translate(-50%,-50%);
        border: 1px solid blue;
    }
    .all-point{
        width: 5px;
        height: 5px;
        border-top: 1px solid blue;
        border-left: 1px solid blue;
    }
    .curve-point{
        width: 5px;
        height: 5px;
        border-top: 1px solid Chocolate;
        border-left: 1px solid Chocolate;
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
        opacity: .8;
    }
    .float-tip{
        display: block;
        width: 100px;
        height: 25px;
        line-height: 25px;
        border: 1px solid OrangeRed;
        background-color: #fff;
        color: #131313;
        margin-bottom: 20px;
    }
    .float-tip code{
        display: block;
        user-select: text;
        font-size: 14px;
        padding: 2px;
    }
    .output{
        width: 100%;
        height: 100%;
        padding: 12px;
        font-family: cursive;
        overflow-y: scroll;
        background-color: #cca;
        margin-bottom: 10px;
    }
    .output-pop{
        width: 100%;
        height: 60%;
        padding: 12px;
        font-family: cursive;
        overflow-y: scroll;
        background-color: #acc;
        margin-bottom: 10px;
    }
    .pop-template{
        display: block;
        padding: 6px;
        height: 30%;
        width: 100%;
        user-select: text;
    }

    .pop{
        position: absolute;
        background-color: rgba(255,255,255,.5);
        width: 600px;
        height: 650px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        box-shadow: 0 0 5px #000;
        border: 1px solid #000;
        z-index: 20;
    }
    .pop .btn-close{
        position: absolute;
        width: 40px;
        height: 40px;
        line-height: 40px;
        top: -42px;
        text-align: center;
        background-color: #222;
        color: #fff;
        right: 0;
    }
    .pop .panel{
        width: 100%;
        height: 100%;
        padding: 12px;
    }
    .pop .panel .hair-icon{
        display: inline-block;
        width: 100px;
        height: 25px;
        line-height: 25px;
        margin: 5px;
        display: inline-block;
        text-align: center;
        font-size: 18px;
        white-space: nowrap;
        word-wrap: break-word;
    }
</style>
