<template>
    <div class="main">
        <h1 class="title"><i>Canvas</i></h1>
        <div class="side side-left">
            <a class="btn" :class="strokeMode==0?'btn-on':''" @click="onClickMoveTo">移动</a>
            <a class="btn" :class="strokeMode==1?'btn-on':''" @click="onClickLineTo">直线</a>
            <a class="btn" :class="strokeMode==2?'btn-on':''" @click="onClickCurveTo">曲线<i v-if="strokeMode==2">({{curveStep}})</i></a>
            <!-- <a class="btn" @click="onClickDye">着色</a> -->
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
                <a class="btn btn-sm" @click="onClickX2">x2</a>
                <a class="btn btn-sm" @click="onClickD2">d2</a>
                <br/>
                <a class="btn btn-sm" @click="onClickZoomXin">X缩</a>
                <a class="btn btn-sm" @click="onClickZoomXout">X放</a>
                <br/>
                <a class="btn btn-sm" @click="onClickZoomYin">Y缩</a>
                <a class="btn btn-sm" @click="onClickZoomYout">Y放</a>
                <br/>
                <a class="btn btn-sm" @click="onClickShift(2)">左</a>
                <a class="btn btn-sm" @click="onClickShift(1)">右</a>
                <br/>
                <a class="btn btn-sm" @click="onClickShift(4)">上</a>
                <a class="btn btn-sm" @click="onClickShift(3)">下</a>
                <br/>
                <a class="btn btn-sm" @click="onClickFlatCopy">水平复制</a>
                <a class="btn btn-sm" @click="onClickFlatUp">水平翻转</a>
                <br/>
                <br/>
                <a class="btn btn-sm" @click="onClickRead">读取</a>
            </div>
            <div class="btn-wrap">
                <a class="btn" @click="onClickRandom(1)">随机男</a>
                <a class="btn" @click="onClickRandom(2)">随机女</a>
                <br/>
                <div v-if="person.name">
                    <a class="btn" @click="onClickSelectiItemStyle(1)">选择前头发</a>
                    <a class="btn" @click="onClickSelectiItemStyle(2)">选择刘海</a>
                    <a class="btn" @click="onClickSelectiItemStyle(3)">选择后头发</a>
                    <a class="btn" @click="onClickSelectiItemStyle(4)">选择眼镜</a>
                    <a class="btn" @click="onClickChangeCloth()">换衣服</a>
                    <a class="btn" @click="onClickTakeoffCloth()">*</a>
                </div>
                <br/>
                <a class="btn" @click="onClickSave">保存的头像</a>
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
        <!-- <div class="wrap board">
            {{JSON.stringify(allPoints)}}
            <br/>
            <br/>
            {{JSON.stringify(modifyPoint)}}
        </div> -->
        <div class="wrap board" v-if="person.name">
            <h4>{{person.name}}</h4>
            <div><label>性别：</label><span>{{person.gender==1?'男':'女'}}</span></div>
            <div><label>年龄：</label><span>{{person.age}}</span></div>
            <div><label>性格：</label><span>{{common.genPersonalityTip(person)}}</span></div>
            <div><label>能力介绍：</label><span>{{common.genAbilityTip(person)}}</span></div>
            <!-- <div><label>精锐化次数：</label><span>{{person.power}}</span></div> -->
            <br/>
            <div>
                <label>能力：</label>
                <div>生命值 = {{person.hp}}</div>
                <div>意志值 = {{person.pow}}</div>
                <div>力量 = {{person.abilities[0]}}</div>
                <div>精准 = {{person.abilities[1]}}</div>
                <div>速度 = {{person.abilities[2]}}</div>
                <div>智力 = {{person.abilities[3]}}</div>
                <div>经验 = {{person.abilities[4]}}</div>
                <div>固定存在感 = {{(Math.round(person.fixawareness/100))}}%</div>
                <div>基础攻击 = {{person.baseAttack}}</div>
                <div>状态抗性 = {{person.imm}}%</div>
            </div>
            <br/>
        </div>
        <div class="pop" v-if="itemStylePop.length>0">
            <div class="panel">
                <a class="btn hair-icon" v-for="hair in itemStylePop" @click="onClickChooseItemStyle(hair)">
                    {{hair.name}}
                </a>
            </div>
            <a class="btn btn-close" @click="onClickCloseItemStylePop">关闭</a>
        </div>
        <div class="pop save-pop" v-if="showSavedAvatars">
            <div class="panel">
                <div class="avatar-icon" v-if="avatar.name" v-for="(avatar,index) in savedAvatars">
                    <a class="btn btn-avatar" @click="onClickImportSave(index)">{{avatar.name}}</a>
                    <a class="btn btn-avatar-del" @click="onClickDeleteSave(index)">删</a>
                </div>
            </div>
            <a class="btn" @click="onClickExportSave">保存当前头像</a>
            <a class="btn btn-close" @click="onClickCloseSave">关闭</a>
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
const CVSWIDTH = 500;
const CVSHEIGHT = 600;
export default {
    name: 'Canvas',
    data(){
        return {
            inputs: [],
            inputsIndex: 0,

            strokeMode: 0, // [0:移动|1:画直线|2:画曲线|3设置修改点]
            panPoint: [0,0,], // 画点

            curveStep: 0, // [0:设置拐点|1:设置终点]
            curvePoint: [0,0,], // 拐点

            modifyPoint: [0,0,0,0,0,], // 修改目标点 [mode,x,y,index,isCurvePoint]
            modifyStep: 0, // [0:选择修改点|1:修改]

            output: '',

            person: {},

            showAllPoints: false, // 显示所有点
            allPoints: [], // 所有点数组 [mode,x,y,index,isCurvePoint]

            itemStylePop: [],
            itemStyleMode: 0, // 修改发型模式[1:前头发|2:刘海|3:后头发|4:装饰]

            showSavedAvatars: false,
            savedAvatars: [], // 保存的头像数据列表

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
        drawInput(){
            this.ctx.clearRect(0,0,CVSWIDTH,CVSHEIGHT);
            this.ctx.beginPath();
            let input = this.inputs[this.inputsIndex];
            if(input){
                for(let option of input){
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
                        case 3:
                            ctx.arc(option[2],option[3],option[1],0,4*Math.PI);
                        break;
                    }
                }
                this.output = JSON.stringify(input);
                this.ctx.strokeStyle = '#000';
                this.ctx.stroke();
            }
            else{
                this.output = '';
            }
        },
        asynPanPoint(){ // 同步笔点
            let p = this.inputs[this.inputsIndex];
            if(p){
                let lastInput = p[p.length-1];
                if(lastInput[0]!=9){
                    this.panPoint = [lastInput[lastInput.length-2],lastInput[lastInput.length-1]];
                }
            }
            else{
                this.panPoint = [0,0];
            }
        },
        asynAllPoints(){ // 同步拐点数组
            let p = this.inputs[this.inputsIndex];
            if(p){
                let allPoints = [];
                for(let i=0;i<p.length;i++){
                    let option = p[i];
                    if(option[0]==0||option[0]==1){
                        allPoints.push([option[0],option[1],option[2],i,false]);
                    }
                    else if(option[0]==2){
                        allPoints.push([option[0],option[1],option[2],i,true]);
                        allPoints.push([option[0],option[3],option[4],i,false]);
                    }
                }
                this.allPoints = allPoints;
            }
            else{
                this.allPoints = [];
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
            // let lastInput = input[input.length-1];
            let x = e.offsetX;
            let y = e.offsetY;
            let setupNewInput = false;
            // 粘附
            // let closetPoint = this.findClosetPointIndex(x,y,input);
            // let stinkyPointDistance = closetPoint.distance;
            // let stinkyPointIndex = closetPoint.index;
            // let stinkyPointIsCurvePoint = closetPoint.isCurvePoint;
            // let nx = x, ny = y;
            // if(stinkyPointDistance<2){
            //     nx = input[stinkyPointIndex][input[stinkyPointIndex].length-2];
            //     ny = input[stinkyPointIndex][input[stinkyPointIndex].length-1];
            // }
            // if(lastInput&&nx==lastInput[lastInput.length-2]&&ny==lastInput[lastInput.length-1]){
            //     return;
            // }
            // else if(this.strokeMode==2&&this.curveStep==0){
            //
            // }
            // else{
            //     x = nx;
            //     y = ny;
            // }
            switch(this.strokeMode){
                case 0: // 移动
                    if(input[input.length-1]&&input[input.length-1][0]==0){
                        input[input.length-1] = [this.strokeMode,x,y];
                    }
                    else{
                        input.push([this.strokeMode,x,y]);
                    }
                    setupNewInput = true;
                break;
                case 1: // 画直线
                    input.push([this.strokeMode,x,y]);
                    setupNewInput = true;
                break;
                case 2: // 画曲线
                    if(this.curveStep==0){ // 设置拐点
                        this.curvePoint = [x,y];
                        this.curveStep = 1;
                    }
                    else if(this.curveStep==1){ // 设置终点
                        input.push([this.strokeMode,this.curvePoint[0],this.curvePoint[1],x,y]);
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
                        console.log(`${this.modifyPoint[1]},${this.modifyPoint[2]}`);
                    }
                    else{ // 修改
                        let isCurvePoint = this.modifyPoint[4];
                        let pointIndex = this.modifyPoint[3];
                        let point = input[pointIndex];
                        if(isCurvePoint||this.modifyPoint[0]!=2){
                            input[pointIndex][1] = x;
                            input[pointIndex][2] = y;
                        }
                        else{
                            input[pointIndex][3] = x;
                            input[pointIndex][4] = y;
                        }
                        this.modifyStep = 0;
                        setupNewInput = true;
                    }

                break;
            }
            if(setupNewInput){
                this.inputsIndex++;
                this.inputs[this.inputsIndex] = input;
            }
            this.asynPanPoint();
            this.asynAllPoints();
            this.drawInput();
        },
        onClickX2(e){ // 乘2
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]!=9){
                    for(let i=1;i<next.length;i++){
                        next[i] = outputD[k][i]*2;
                    }
                    outputD[k] = next;
                }
            }
            this.output = JSON.stringify(outputD);
        },
        onClickD2(e){ // 除2
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]!=9){
                    for(let i=1;i<next.length;i++){
                        next[i] = Math.round(outputD[k][i]/2);
                    }
                    outputD[k] = next;
                }
            }
            this.output = JSON.stringify(outputD);
        },
        onClickFlatCopy(){ // 水平复制
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let expend = [];
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[1] = CVSWIDTH-next[1];
                }
                else if(next[0]==2){
                    next[1] = CVSWIDTH-next[1];
                    next[3] = CVSWIDTH-next[3];
                }
                expend.push(next);
            }
            this.output = JSON.stringify([...outputD,...expend]);
        },
        onClickFlatUp(){ // 水平翻转
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=outputD.length-1;k>=0;k--){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[1] = CVSWIDTH-next[1];
                }
                else if(next[0]==2){
                    next[1] = CVSWIDTH-next[1];
                    next[3] = CVSWIDTH-next[3];
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickZoomXin(){ // 水平缩小
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[1] = 250-Math.round((250-next[1])/1.05);
                }
                else if(next[0]==2){
                    next[1] = 250-Math.round((250-next[1])/1.05);
                    next[3] = 250-Math.round((250-next[3])/1.05);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickZoomXout(){ // 水平放大
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[1] = 250-Math.round((250-next[1])*1.05);
                }
                else if(next[0]==2){
                    next[1] = 250-Math.round((250-next[1])*1.05);
                    next[3] = 250-Math.round((250-next[3])*1.05);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickZoomYin(){ // 垂直缩小
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[2] = 250-Math.round((250-next[2])/1.05);
                }
                else if(next[0]==2){
                    next[2] = 250-Math.round((250-next[2])/1.05);
                    next[4] = 250-Math.round((250-next[4])/1.05);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickZoomYout(){ // 垂直放大
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]==0||next[0]==1){
                    next[2] = 250-Math.round((250-next[2])*1.05);
                }
                else if(next[0]==2){
                    next[2] = 250-Math.round((250-next[2])*1.05);
                    next[4] = 250-Math.round((250-next[4])*1.05);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickShift(flag){ // 移动
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            if(flag==1||flag==2){ // 水平移动
                let shift = flag==1?2:-2;
                for(let k=0;k<outputD.length;k++){
                    let next = [...outputD[k]];
                    if(next[0]==0||next[0]==1){
                        next[1] += shift;
                    }
                    else if(next[0]==2){
                        next[1] += shift;
                        next[3] += shift;
                    }
                    outputD[k] = next;
                }
            }
            if(flag==3||flag==4){ // 垂直移动
                let shift = flag==3?2:-2;
                for(let k=0;k<outputD.length;k++){
                    let next = [...outputD[k]];
                    if(next[0]==0||next[0]==1){
                        next[2] += shift;
                    }
                    else if(next[0]==2){
                        next[2] += shift;
                        next[4] += shift;
                    }
                    outputD[k] = next;
                }
            }
            this.output = JSON.stringify(outputD);
        },
        onClickDye(){ // 着色
            let input = cloneObj(this.inputs[this.inputsIndex],[]);
            input.push([9,{color:{r:0,g:0,b:0,}}]);
            this.inputsIndex++;
            this.inputs[this.inputsIndex] = input;
            this.asynPanPoint();
            this.asynAllPoints();
            this.drawInput();
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
        onClickSelectiItemStyle(flag){ // 点击【选择发型】按钮
            if(!this.person.name){
                return;
            }
            this.itemStyleMode = flag;
            let gender = this.person.gender;
            let itemTemplates = [];
            switch(flag){
                case 1:
                    itemTemplates = [...generalForeHairTemplates,...maleForeHairTemplates,...femaleForeHairTemplates];
                break;
                case 2:
                    itemTemplates = [...generalBangsTemplates,...maleBangsTemplates,...femaleBangsTemplates];
                break;
                case 3:
                    itemTemplates = [...generalBackHairTemplates,...maleBackHairTemplates,...femaleBackHairTemplates];
                break;
                case 4:
                    itemTemplates = [...glassTemplates];
                break;
                case 5:
                    // itemTemplates = [...generalClothTemplates,...maleClothTemplates,...femaleClothTemplates];
                break;
            }
            this.itemStylePop = [{name:'/'},...itemTemplates];
        },
        onClickChooseItemStyle(itemStyle){ // 点击【选中样式】按钮
            let avatarData = this.person.avatarData;
            let gender = this.person.gender;
            let { faceData, bodyData, breastData, } = avatarData;
            let { color, grd, } = avatarData.hairColor;
            if(itemStyle.name&&itemStyle.name!='/'){
                this.itemStylePop = [];
                switch(this.itemStyleMode){
                    case 1: // 前头发
                        let foreHairData = genForeHairData(faceData,gender,color,grd,itemStyle.name);
                        avatarData.foreHairData = foreHairData;
                    break;
                    case 2: // 刘海
                        let bangsData = genBangsData(faceData,gender,color,grd,itemStyle.name);
                        avatarData.bangsData = bangsData;
                    break;
                    case 3: // 后头发
                        let backHairData = genBackHairData(faceData,gender,color,grd,itemStyle.name);
                        avatarData.backHairData = backHairData;
                    break;
                    case 4: // 眼镜
                        let glassData = genGlassData(faceData,gender,itemStyle.name);
                        avatarData.glassData = glassData;
                    break;
                }
            }
            else{ // 取消发型
                switch(this.itemStyleMode){
                    case 1: // 前头发
                        avatarData.foreHairData = undefined;
                    break;
                    case 2: // 刘海
                        avatarData.bangsData = undefined;
                    break;
                    case 3: // 后头发
                        avatarData.backHairData = undefined;
                    break;
                    case 4: // 眼镜
                        avatarData.glassData = undefined;
                    break;
                }
            }
            paintAvatar(this.ctx,avatarData,CVSWIDTH,CVSHEIGHT,1);
            this.onClickCloseItemStylePop();
            console.log(`更换样式`,this.person);
        },
        onClickCloseItemStylePop(){ // 点击【关闭选择发型弹窗】按钮
            this.itemStylePop = [];
            this.itemStyleMode = 0;
        },
        onClickChangeCloth(){ // 点击【换衣服】按钮
            let avatarData = this.person.avatarData;
            let gender = this.person.gender;
            let age = this.person.age;
            let { faceData, bodyData, breastData, } = avatarData;
            let clothForeData = genForeClothData(bodyData,breastData,gender,age);
            let clothBackData;
            for(let frag of clothForeData){
                if(frag.hasBackPart){
                    clothBackData = genBackClothData(clothForeData);
                }
            }
            avatarData.clothForeData = clothForeData;
            avatarData.clothBackData = clothBackData;
            paintAvatar(this.ctx,avatarData,CVSWIDTH,CVSHEIGHT,1);
        },
        onClickTakeoffCloth(){ // 点击【*】按钮
            let avatarData = this.person.avatarData;
            avatarData.clothForeData = undefined;
            avatarData.clothBackData = undefined;
            paintAvatar(this.ctx,avatarData,CVSWIDTH,CVSHEIGHT,1);
        },
        onClickRandom(gender){ // 点击【随机人物】按钮
            // this.inputs[this.inputsIndex] = [];
            // for(let i=1;i<500;i++){
            //     this.inputs[this.inputsIndex].push([1,i,500-exptr(i,0,500,2)]);
            // }
            // this.drawInput();

            // let person = common.genRandomPerson({gender,age:r(5,12)});
            let person = common.genRandomPerson({gender});
            let avatarData = genRandomAvatar(person);
            person.avatarData = avatarData;
            paintAvatar(this.ctx,avatarData,CVSWIDTH,CVSHEIGHT,1);
            this.person = person;
            console.log(`生成一个人`,person);

            // let t1 = {
            //     name: '基本款',
            //     outline: [[0,586,382],[1,498,386],[1,498,486],[1,596,478],[1,586,382],[9,{"color":{"r":40,"g":0,"b":0}}],[1,582,284],[1,672,288],[1,670,372],[1,586,382],[9,{"color":{"r":220,"g":0,"b":0}}]],
            // };
            // let t2 = cloneObj(t1);
            // console.log(`t2======>`,t2)
        },
        onClickSave(){ // 点击【保存】按钮
            let _savedAvatars = localStorage.getItem(CACHE.savedAvatars);
            let savedAvatars = JSON.parse(_savedAvatars);
            if(savedAvatars){
                this.savedAvatars = savedAvatars;
            }
            else{
                this.savedAvatars = [];
            }
            this.showSavedAvatars = true;
        },
        onClickCloseSave(){ // 点击【关闭保存】按钮
            this.showSavedAvatars = false;
        },
        onClickExportSave(){ // 点击【输出保存】按钮
            if(this.person.avatarData){
                let newEle = {
                    name: `${this.person.name}（${this.person.gender==1?'男':'女'} ${this.person.age}）`,
                    ...this.person.avatarData
                };
                if(this.savedAvatars[0]&&this.savedAvatars[0].name){
                    this.savedAvatars.push(newEle);
                }
                else{
                    this.savedAvatars[0] = newEle;
                }
                localStorage.setItem(CACHE.savedAvatars,JSON.stringify(this.savedAvatars));
                this.onClickSave();
            }
        },
        onClickImportSave(index){ // 点击【导入保存】按钮
            this.person.avatarData = this.savedAvatars[index];
            paintAvatar(this.ctx,this.person.avatarData,CVSWIDTH,CVSHEIGHT,1);
        },
        onClickDeleteSave(index){ // 点击【删除保存】按钮
            this.savedAvatars.splice(index,1);
            localStorage.setItem(CACHE.savedAvatars,JSON.stringify(this.savedAvatars));
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

        /*
            自动生成肖像
        */


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
        width: 3px;
        height: 3px;
        border-top: 1px solid blue;
        border-left: 1px solid blue;
    }
    .curve-point{
        width: 3px;
        height: 3px;
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
        overflow-y: scroll;
        background-color: #cca;
        margin-bottom: 10px;
    }

    .pop{
        position: absolute;
        background-color: rgba(255,255,255,.5);
        width: 600px;
        height: 750px;
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

    .pop .panel .avatar-icon{
        display: inline-block;
        margin-right: 45px;
        position: relative;
        width: 25%;
        height: 40px;
        margin-bottom: 8px;
        border: 1px solid #131313;
        color: orange;
        background-color: #eee;
    }
    .btn-avatar{
        margin: 0;
        height: 100%;
        line-height: 40px;
        width: 100%;
        color: #131313;
        display: inline-block;
        background-color: transparent;
    }
    .btn-avatar-del{
        position: absolute;
        right: -35px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        display: inline-block;
        width: 30px;
        height: 30px;
        background-color: #e81313;
        border-radius: 15px;
        text-align: center;
        line-height: 30px;
        font-weight: bold;
    }
</style>
