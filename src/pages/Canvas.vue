<template>
    <div class="main">
        <h1 class="title"><i>Canvas</i></h1>
        <div class="side side-left">
            <a class="btn" :class="strokeMode==0?'btn-on':''" @click="onClickMoveTo">移动</a>
            <a class="btn" :class="strokeMode==1?'btn-on':''" @click="onClickLineTo">直线</a>
            <a class="btn" :class="strokeMode==2?'btn-on':''" @click="onClickCurveTo">曲线<i v-if="strokeMode==2">({{curveStep}})</i></a>
            <a class="btn" :class="strokeMode==3?'btn-on':''" @click="onClickModify">修改</a>
            <br/>
            <a class="btn" @click="onClickPrevStep">上一步({{inputsIndex}})</a>
            <!-- <a class="btn" @click="onClickNextStep">下一步</a> -->
        </div>
        <div class="side side-right">
            <textarea class="output" v-model="output"></textarea>
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
                <a class="btn btn-sm" @click="onClickFlatCopy">水平复制</a>
                <a class="btn btn-sm" @click="onClickFlatUp">水平翻转</a>
                <br/>
                <a class="btn btn-sm" @click="onClickImport">导入</a>
            </div>
            <div class="btn-wrap">
                <a class="btn" @click="onClickRandom(1)">随机男</a>
                <a class="btn" @click="onClickRandom(2)">随机女</a>
                <br/>
                <div v-if="person.name">
                    <a class="btn" @click="onClickSelectHairStyle(1)">选择前头发</a>
                    <a class="btn" @click="onClickSelectHairStyle(2)">选择刘海</a>
                    <a class="btn" @click="onClickSelectHairStyle(3)">选择后头发</a>
                </div>
            </div>
        </div>
        <div class="wrap op">
            <div class="cvs-bg">
                <div class="hline"></div>
                <div class="point pan-point" :style="{top:panPoint[1]+'px',left:panPoint[0]+'px'}"></div>
                <div class="point modify-point" :style="{top:modifyPoint[2]+'px',left:modifyPoint[1]+'px'}" v-if="strokeMode==3&&modifyStep==1"></div>
                <div class="point all-point" v-if="showAllPoints" :class="point[4]?'curve-point':''" v-for="point in allPoints" :style="{top:point[2]+'px',left:point[1]+'px'}"></div>
            </div>
            <canvas class="cvs" width="500" height="500" ref="cvs" @click="onClickCanvas" />
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
        <div class="pop" v-if="hairStylePop.length>0">
            <div class="panel">
                <a class="btn hair-icon" v-for="hair in hairStylePop" @click="onClickChooseHairStyle(hair)">
                    {{hair.name}}
                </a>
            </div>
            <a class="btn btn-close" @click="onClickCloseHairStylePop">关闭</a>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import * as common from '../tools/common';
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, } from '../tools/avatar';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const CVSLEN = 500;
export default {
    name: 'Canvas',
    data(){
        return {
            inputs: [],
            inputsIndex: 0,

            strokeMode: 0, // [0:移动|1:画直线|2:画曲线]
            panPoint: [0,0,], // 画点

            curveStep: 0, // [0:设置拐点|1:设置终点]
            curvePoint: [0,0,], // 拐点

            modifyPoint: [0,0,0,0,0,], // 修改目标点 [mode,x,y,index,isCurvePoint]
            modifyStep: 0, // [0:选择修改点|1:修改]

            output: '',

            person: {},

            showAllPoints: false, // 显示所有点
            allPoints: [], // 所有点数组 [mode,x,y,index,isCurvePoint]

            hairStylePop: [],
            hairStyleMode: 0, // 修改发型模式[1:前头发|2:刘海|3:后头发]

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
		    this.ctx.width = CVSLEN;
		    this.ctx.height = CVSLEN;
            this.initKeyboard();
        },
        initKeyboard(){ // 初始化键盘事件
            if(!document.onkeyup){
                document.onkeyup = event =>{
                    let e = event||window.event||arguments.callee.caller.arguments[0];
                    if(e&&e.keyCode==90){ // 按 Z
                        this.onKeyupZ();
                    }
                };
            }
        },
        onKeyupZ(){ // 按 A
            this.showAllPoints = !this.showAllPoints;
        },
        drawInput(){
            this.ctx.clearRect(0,0,CVSLEN,CVSLEN);
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
                this.panPoint = [lastInput[lastInput.length-2],lastInput[lastInput.length-1]];
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
            let lastInput = input[input.length-1];
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
                    }
                    else{ // 修改
                        let isCurvePoint = this.modifyPoint[4];
                        let pointIndex = this.modifyPoint[3];
                        let point = input[pointIndex];
                        if(isCurvePoint||this.modifyPoint[0]!=2){
                            input[pointIndex][1] = x;
                            input[pointIndex][2] = y;
                            console.log('改1,2',input[pointIndex],this.modifyPoint);
                        }
                        else{
                            input[pointIndex][3] = x;
                            input[pointIndex][4] = y;
                            console.log('改3,4',input[pointIndex],this.modifyPoint);
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
                for(let i=1;i<next.length;i++){
                    next[i] = outputD[k][i]*2;
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickD2(e){ // 除2
            if(!this.output)
                return;
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
        onClickFlatCopy(){ // 水平复制
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let expend = [];
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]!=2){
                    next[1] = CVSLEN-next[1];
                }
                else{
                    next[1] = CVSLEN-next[1];
                    next[3] = CVSLEN-next[3];
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
                if(next[0]!=2){
                    next[1] = CVSLEN-next[1];
                }
                else{
                    next[1] = CVSLEN-next[1];
                    next[3] = CVSLEN-next[3];
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
                if(next[0]!=2){
                    next[1] = 250-Math.round((250-next[1])/1.05);
                }
                else{
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
                if(next[0]!=2){
                    next[1] = 250-Math.round((250-next[1])*1.05);
                }
                else{
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
                if(next[0]!=2){
                    next[2] = 250-Math.round((250-next[2])/1.05);
                }
                else{
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
                if(next[0]!=2){
                    next[2] = 250-Math.round((250-next[2])*1.05);
                }
                else{
                    next[2] = 250-Math.round((250-next[2])*1.05);
                    next[4] = 250-Math.round((250-next[4])*1.05);
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickShift(flag){ // 平移
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            let shift = flag==1?2:-2;
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]!=2){
                    next[1] += shift;
                }
                else{
                    next[1] += shift;
                    next[3] += shift;
                }
                outputD[k] = next;
            }
            this.output = JSON.stringify(outputD);
        },
        onClickImport(){ // 导入
            if(!this.output)
                return;
            this.inputsIndex++;
            this.inputs[this.inputsIndex] = JSON.parse(this.output);
            this.asynPanPoint();
            this.asynAllPoints();
            this.drawInput();
        },
        onClickSelectHairStyle(flag){ // 点击【选择发型】按钮
            if(!this.person.name){
                return;
            }
            this.hairStyleMode = flag;
            let gender = this.person.gender;
            let hairTemplates = [];
            switch(flag){
                case 1:
                    hairTemplates = [...CONFIG.generalForeHairTemplates,...(gender==1?CONFIG.maleForeHairTemplates:CONFIG.femaleForeHairTemplates)];
                break;
                case 2:
                    hairTemplates = [...CONFIG.generalBangsTemplates,...(gender==1?CONFIG.maleBangsTemplates:CONFIG.femaleBangsTemplates)];
                break;
                case 3:
                    hairTemplates = [...CONFIG.generalBackHairTemplates,...(gender==1?CONFIG.maleBackHairTemplates:CONFIG.femaleBackHairTemplates)];
                break;
            }
            this.hairStylePop = [{name:'/'},...hairTemplates];
        },
        onClickChooseHairStyle(hair){ // 点击【选中发型】按钮
            let avatarData = this.person.avatarData;
            let gender = this.person.gender;
            let { faceData, } = avatarData;
            let { color, grd, } = avatarData.hairColor;
            if(hair.name&&hair.name!='/'){
                this.hairStylePop = [];
                switch(this.hairStyleMode){
                    case 1: // 前头发
                        let foreHairData = genForeHairData(faceData,gender,color,grd,hair.name);
                        avatarData.foreHairData = foreHairData;
                    break;
                    case 2: // 刘海
                        let bangsData = genBangsData(faceData,gender,color,grd,hair.name);
                        avatarData.bangsData = bangsData;
                    break;
                    case 3: // 后头发
                        let backHairData = genBackHairData(faceData,gender,color,grd,hair.name);
                        avatarData.backHairData = backHairData;
                    break;
                }
            }
            else{ // 取消发型
                switch(this.hairStyleMode){
                    case 1: // 前头发
                        avatarData.foreHairData = undefined;
                    break;
                    case 2: // 刘海
                        avatarData.bangsData = undefined;
                    break;
                    case 3: // 后头发
                        avatarData.backHairData = undefined;
                    break;
                }
            }
            paintAvatar(this.ctx,avatarData,CVSLEN);
            this.onClickCloseHairStylePop();
            console.log(`更换发型`,this.person);
        },
        onClickCloseHairStylePop(){ // 点击【关闭选择发型弹窗】按钮
            this.hairStylePop = [];
            this.hairStyleMode = 0;
        },
        onClickRandom(gender){ // 点击【随机人物】按钮
            // this.inputs[this.inputsIndex] = [];
            // for(let i=1;i<500;i++){
            //     this.inputs[this.inputsIndex].push([1,i,500-exptr(i,0,500,2)]);
            // }
            // this.drawInput();
            let person = this.genRandomPerson({gender});
            // let person = this.genRandomPerson({gender,level:r(0,3)});
            let avatarData = genRandomAvatar(person);
            person.avatarData = avatarData;
            paintAvatar(this.ctx,avatarData,CVSLEN);
            this.person = person;
            console.log(`生成一个人`,person);
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
            自动生成人物
        */
        genRandomPerson({gender,age,level,weaponID,viceWeaponID,skillIDs,}){
            if(!gender){
                gender = r(1,2);
            }
            if(!age){
                let r1 = r(1,100);
                if(r1<5){ // 未成年
                    age = r(15,17);
                }
                else if(r1<70){ // 青年
                    age = r(18,29);
                }
                else if(r1<97){ // 壮年
                    age = r(30,39);
                }
                else{ // 中老年
                    age = r(40,80);
                }
            }
            if(!level){
                level = 1;
            }
            // @TEST
            // age = 15;

            /* 初始化变量 */
            let hp = exptr(0,8500,20)+r(500,1500);
            let pow = Math.round((exptr(0,2835,20)+r(75,165))*.3+hp/10);
            let fixawareness = r(14,28)*50;
            let imm = age-14;
            let baseAttack;
            let abilities = [];
            abilities[0] = exptr(0,750,20)+r(50,250); // 力量
            abilities[1] = exptr(0,750,20)+r(50,250); // 精准
            abilities[2] = exptr(0,380,20)+r(50,120); // 速度
            abilities[3] = exptr(0,750,20)+r(5,250); // 智力
            abilities[4] = exptr(0,750,20)+r(1,250); // 经验
            let personalities = [];
            personalities[0] = r(0,100); // 无欲度
            personalities[1] = r(0,100); // 善良度
            personalities[2] = r(0,100); // 自信度
            personalities[3] = r((abilities[3]/500)*50,100); // 冷静度
            personalities[4] = r(0,100); // 开朗度
            /* 根据性别修正数据 */
            if(gender==2){ // 女
                hp = Math.round(hp*.85);
                abilities[0] = Math.round(abilities[0]*.8);
                abilities[1] = Math.round(abilities[1]*1.15);
                personalities[0] = personalities[0]+r(0,45);
                personalities[1] = personalities[1]+r(0,10);
            }
            else{ // 男
                abilities[0] = Math.round(abilities[0]*1.1);
                abilities[1] = Math.round(abilities[1]*.9);
                personalities[0] = personalities[0]-r(0,45);
            }
            // /* 根据年龄修正数据 */
            // // ----未成年能力整体降低
            if(age<18){
                let rd = r(age*5,100)/100;
                abilities[0] = Math.round(abilities[0]*rd*.8);
                abilities[1] = Math.round(abilities[1]*rd*.8);
                abilities[4] = Math.round(abilities[4]*rd*.8);
                hp = Math.round(hp*age/25+r(-50,50));
                pow = Math.round(pow*age/25+r(-25,25));
            }
            // // ----经验随年龄提升
            abilities[4] = Math.round(abilities[4]+(age-30)*2.5+r(0,age));
            // // ----25岁以下冷静值降低
            if(age<25){
                personalities[3] -= r(0,(25-age)*3);
            }
            // // ----中老年人力量和速度下降
            if(age>40){
                abilities[0] = Math.round(abilities[0]-(age-40)*2.5);
                abilities[2] = Math.round(abilities[2]-(age-30)*2.5);
            }

            /* 其他修正 */
            // personalities[3] = Math.round(personalities[3]+(abilities[3]-300)/4);
            pow += Math.round(pow*(personalities[3]/25-1));

            /* 精锐化 */
            let up = 1;
            let powerUp = (abir,hpr,powr,bar) =>{
                let abiUpIndex = [0,1,3,4][r(0,3)];
                let abiUpVal = Math.round(abilities[abiUpIndex]*r(0,abir*100)/100);
                let dexUpVal = Math.round(abilities[2]*r(0,50)/100);
                let hppowUpRate = r(0,100);
                let hpUpVal = Math.round(hp*hppowUpRate*hpr/100);
                let powUpVal = Math.round(pow*hppowUpRate*powr/100);
                let baUpVal = Math.round(baseAttack*r(0,bar*100)/100);
                abilities[abiUpIndex] += abiUpVal;
                abilities[2] += dexUpVal;
                hp += hpUpVal;
                pow += powUpVal;
                baseAttack += baUpVal;
                // console.log(`${['力量','精准','速度','智力','经验'][abiUpIndex]}提升${abiUpVal}`);
                up += 1;
            }
            if(up<level||r(0,100)<25){ // 第一次精锐化
                powerUp( 1.5, 2, 3, 1.5);
                if(up<level||r(0,100)<25){ // 第二次精锐化
                    powerUp( 1.5, 2, 3, 1.5);
                    if(up<level||r(0,100)<25){ // 第三次精锐化
                        powerUp( 1.5, 2, 3, 1.5);
                    }
                }
            }

            /* 规范数值范围 */
            if(hp<25){
                hp = 25;
            }
            if(pow<10){
                pow = 10;
            }
            if(fixawareness>CONFIG.maxAwareness){
                fixawareness = CONFIG.maxAwareness;
            }
            else if(fixawareness<0){
                fixawareness = 0;
            }
            if(imm>CONFIG.humanMaxImm){
                imm = CONFIG.humanMaxImm;
            }
            else if(imm<0){
                imm = 0;
            }
            if(abilities[0]<50){ // 力量
                abilities[0] = 50;
            }
            if(abilities[1]<50){ // 精准
                abilities[1] = 50;
            }
            if(abilities[2]<25){ // 速度
                abilities[2] = 25;
            }
            if(abilities[3]<5){ // 智力
                abilities[3] = 5;
            }
            if(abilities[4]<1){ // 经验
                abilities[4] = 1;
            }
            for(let i=0;i<personalities.length;i++){
                if(personalities[i]<0){
                    personalities[i] = r(5,10);
                }
                else if(personalities[i]>100){
                    personalities[i] = r(90,95);
                }
            }

            /* 其他赋值 */
            baseAttack = r(1,abilities[0]/3);
            baseAttack = Math.round(baseAttack/3);

            /* 数据整合并输出 */
            let res = {
                gender,
                age,
                name: common.genRoleName(gender),
                hp,
                pow,
                imm,
                baseAttack,
                fixawareness,

                personalities,
                abilities,

                weaponID: weaponID||0, // 武器
                viceWeaponID: viceWeaponID||0, // 副武器

                skillIDs: [], // 技能 ID 数组

                relations: [], // 关系
            }
            return res;
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
        height: 500px;
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
        width: 6px;
        height: 6px;
        border-top: 1px solid blue;
        border-left: 1px solid blue;
    }
    .curve-point{
        width: 6px;
        height: 6px;
        border-top: 1px solid orange;
        border-left: 1px solid orange;
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

    .pop{
        position: absolute;
        background-color: #fff;
        width: 600px;
        height: 350px;
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
