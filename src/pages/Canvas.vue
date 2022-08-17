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
                <div class="point modify-point" :style="{top:modifyPoint[1]+'px',left:modifyPoint[0]+'px'}" v-if="strokeMode==3&&modifyPointIndex>=0&&modifyStep==1"></div>
            </div>
            <canvas class="cvs" width="500" height="500" ref="cvs" @click="onClickCanvas" />
        </div>
        <div class="wrap board" v-if="person.name">
            <h4>{{person.name}}</h4>
            <div><label>性别：</label><span>{{person.gender==1?'男':'女'}}</span></div>
            <div><label>年龄：</label><span>{{person.age}}</span></div>
            <div><label>性格：</label><span>{{genPersonalityTip()}}</span></div>
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
import { query, r, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, } from '../tools/utils';
import * as common from '../tools/common';
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

            modifyPointIndex: -1, // 修改目标点下标
            modifyPoint: [0,0,], // 修改目标点
            modifyStep: 0, // [0:选择修改点|1:修改]

            output: '',

            person: {},

            hairStylePop: [],
            hairStyleMode: 0, // 修改发型模式[1:前头发|2:刘海|3:后头发]

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
            let findClosetPointIndex = (x,y,points) =>{ // 寻找最近点的下标值
                let targetPointIndex = -1; // 目标点下标
                let minDist = Infinity; // 最小路径
                for(let i=0;i<points.length;i++){
                    let option = input[i];
                    let opl = option.length;
                    let dist = Math.sqrt(Math.pow(x-option[opl-2],2)+Math.pow(y-option[opl-1],2));
                    if(dist<minDist){
                        minDist = dist;
                        targetPointIndex = i;
                    }
                }
                return {
                    distance: minDist,
                    index: targetPointIndex,
                };
            };
            // 粘附
            let closetPoint = findClosetPointIndex(x,y,input);
            let stinkyPointDistance = closetPoint.distance;
            let stinkyPointIndex = closetPoint.index;
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
            }
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
                        let targetPointIndex = findClosetPointIndex(x,y,input).index;
                        this.modifyPointIndex = targetPointIndex;
                        if(this.modifyPointIndex>=0){
                            let p = input[targetPointIndex];
                            let pl = p.length;
                            this.modifyPoint = [p[pl-2],p[pl-1]];
                        }
                        this.modifyStep = 1;
                    }
                    else{ // 修改
                        let opl = input[this.modifyPointIndex].length;
                        input[this.modifyPointIndex][opl-2] = x;
                        input[this.modifyPointIndex][opl-1] = y;
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
                    next[1] = 500-next[1];
                }
                else{
                    next[1] = 500-next[1];
                    next[3] = 500-next[3];
                }
                expend.push(next);
            }
            this.output = JSON.stringify([...outputD,...expend]);
        },
        onClickFlatUp(){ // 水平翻转
            if(!this.output)
                return;
            let outputD = JSON.parse(this.output);
            for(let k=0;k<outputD.length;k++){
                let next = [...outputD[k]];
                if(next[0]!=2){
                    next[1] = 500-next[1];
                }
                else{
                    next[1] = 500-next[1];
                    next[3] = 500-next[3];
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
            let formatPx = data =>{
                let rate = 2;
                if(typeof data === 'object'){
                    return Array.from(data,item=>{
                        let res = [];
                        if(item[0]==0||item[0]==1){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate)];
                        }
                        else if(item[0]==2){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate),parseInt(item[4]/rate)];
                        }
                        else if(item[0]==3){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate)];
                        }
                        return res;
                    });
                }
                else{
                    return parseInt(data/2);
                }
            }
            if(hair.name&&hair.name!='/'){
                this.hairStylePop = [];
                switch(this.hairStyleMode){
                    case 1: // 前头发
                        let foreHairData = this.genForeHairData(faceData,gender,color,grd,hair.name);
                        foreHairData.outline = formatPx(foreHairData.outline);
                        foreHairData.topY = formatPx(foreHairData.topY);
                        foreHairData.bottomY = formatPx(foreHairData.bottomY);
                        avatarData.foreHairData = foreHairData;
                    break;
                    case 2: // 刘海
                        let bangsData = this.genBangsData(faceData,gender,color,grd,hair.name);
                        bangsData.outline = formatPx(bangsData.outline);
                        bangsData.topY = formatPx(bangsData.topY);
                        bangsData.bottomY = formatPx(bangsData.bottomY);
                        avatarData.bangsData = bangsData;
                    break;
                    case 3: // 后头发
                        let backHairData = this.genBackHairData(faceData,gender,color,grd,hair.name);
                        backHairData.outline = formatPx(backHairData.outline);
                        backHairData.topY = formatPx(backHairData.topY);
                        backHairData.bottomY = formatPx(backHairData.bottomY);
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
            this.paintAvatar(this.ctx,500,avatarData);
            this.onClickCloseHairStylePop();
            console.log(this.person);
        },
        onClickCloseHairStylePop(){ // 点击【关闭选择发型弹窗】按钮
            this.hairStylePop = [];
            this.hairStyleMode = 0;
        },
        genPersonalityTip(){
            let res = '-';
            if(this.person.name){
                res = '';
                let psnlt = this.person.personalities;
                let adjs = [
                    ['有野心','无欲'],
                    ['恶念','善良'],
                    ['自卑','自信'],
                    ['鲁莽','冷静'],
                    ['沉闷','开朗'],
                ];
                for(let p=0;p<psnlt.length;p++){
                    let newAdj = '';
                    if(psnlt[p]<=5){
                        newAdj = `过于常人的${adjs[p][0]}`;
                    }
                    else if(psnlt[p]<=20){
                        newAdj = `${adjs[p][0]}`;
                    }
                    else if(psnlt[p]<35){
                        newAdj = `较${adjs[p][0]}`;
                    }
                    else if(psnlt[p]<65){

                    }
                    else if(psnlt[p]<80){
                        newAdj = `较${adjs[p][1]}`;
                    }
                    else if(psnlt[p]<95){
                        newAdj = `${adjs[p][1]}`;
                    }
                    else{
                        newAdj = `过于常人的${adjs[p][1]}`;
                    }
                    if(newAdj){
                        // res += `${newAdj}(${psnlt[p]})，`;
                        res += `${newAdj}，`;
                    }
                }
            }
            return res;
        },
        onClickRandom(gender){ // 点击【随机人物】按钮
            let person = this.genRandomPerson({gender});
            // let person = this.genRandomPerson({gender,level:r(0,3)});
            let avatarData = this.genRandomAvatar(500,person);
            person.avatarData = avatarData;
            this.paintAvatar(this.ctx,500,avatarData);
            this.person = person;
            console.log(`生成一个人`,person);
        },

        /*
            自动生成人物
        */
        genRandomPerson({gender,age,level,hand,vice,}){
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
            let hp = r(150,1000);
            let pow = r(50,400);
            let fixawareness = r(14,28)*50;
            let imm = age-14;
            let baseAttack;
            let abilities = [];
            abilities[0] = r(25,200); // 力量
            abilities[1] = r(25,200); // 精准
            abilities[2] = r(25,200); // 速度
            abilities[3] = r(5,200); // 智力
            abilities[4] = r(1,200); // 经验
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
            /* 根据年龄修正数据 */
            // ----未成年能力整体降低
            if(age<18){
                let rd = r(age*5,100)/100;
                abilities[0] = Math.round(abilities[0]*rd*.8);
                abilities[1] = Math.round(abilities[1]*rd*.8);
                abilities[4] = Math.round(abilities[4]*rd*.8);
                hp = Math.round(hp*age/25+r(-50,50));
                pow = Math.round(pow*age/25+r(-25,25));
            }
            // ----经验随年龄提升
            abilities[4] = Math.round(abilities[4]+(age-30)*2.5+r(0,age));
            // ----25岁以下冷静值降低
            if(age<25){
                personalities[3] -= r(0,(25-age)*3);
            }
            // ----中老年人力量和速度下降
            if(age>40){
                abilities[0] = Math.round(abilities[0]-(age-40)*2.5);
                abilities[2] = Math.round(abilities[2]-(age-30)*2.5);
            }

            /* 其他修正 */
            // personalities[3] = Math.round(personalities[3]+(abilities[3]-300)/4);

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
            if(up<level||r(0,100)<20){ // 第一次精锐化
                powerUp( 2.5, 5, 3, 1.5);
                if(up<level||r(0,100)<20){ // 第二次精锐化
                    powerUp( 3, 5.5, 4, 1.6);
                    if(up<level||r(0,100)<20){ // 第三次精锐化
                        powerUp( 3.5, 6, 5, 1.7);
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
                power: up-1,

                personalities,
                abilities,

                hand: hand||{}, // 武器
                vice: vice||{}, // 副武器
            }
            return res;
        },

        /*
            自动生成肖像
        */
        genRandomAvatar(canvasSize,person){ // 随机生成肖像
            let res;
            let { abilities, personalities, gender, age, } = person;
            let emotion = Math.round(personalities[2]*.25+personalities[4]*.75); // 0-100
            let formatPx = data =>{
                let rate = 1000/canvasSize;
                if(typeof data === 'object'){
                    return Array.from(data,item=>{
                        let res = [];
                        if(item[0]==0||item[0]==1){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate)];
                        }
                        else if(item[0]==2){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate),parseInt(item[4]/rate)];
                        }
                        else if(item[0]==3){
                            res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate)];
                        }
                        return res;
                    });
                }
                else{
                    return parseInt(data/2);
                }
            }
            // 生成发色
            let hairColor = this.genHairColor(gender);
            let { color, grd, } = hairColor;
            // 生成基本脸
            let faceData = this.genFaceData(gender);
            // 生成双耳
            let earsData = this.genEarsData(faceData,gender);
            // 生成双眉
            let browsData = this.genBrowsData(faceData,gender,color);
            // 生成双眼
            let eyesData = this.genEyesData(faceData,gender,personalities,abilities);
            // 生成双眼皮
            let eyeskinsData;
            if(r(0,100)<90||DEBUG){
                eyeskinsData = this.genEyeSkinsData(eyesData,gender);
            }
            let lashData;
            if(gender==2||DEBUG){
                lashData = this.genLashData(eyesData,gender);
            }
            // 生成外双瞳
            let eyeoutballsData = this.genEyeoutballsData(eyesData,gender);
            let eyeinballsData;
            if(r(0,100)<50||DEBUG){ // 生成内双瞳
                eyeinballsData = this.genEyeinballsData(eyesData,gender);
            }

            // 生成鼻子
            let noseData = this.genNoseData(faceData,gender);
            // 生成嘴唇
            let lipData = this.genLipData(faceData,gender,emotion);
            let bottomLipData;
            if(!lipData.strokeColor){ // 生成下嘴唇
                bottomLipData = this.genBottomLipData(faceData,lipData,gender);
            }
            let topMoustacheData;
            if((r(0,100)<age&&age>=30&&gender==1)||DEBUG){ // 生成上胡子
                topMoustacheData = this.genTopMoustacheData(faceData,lipData,color,grd);
            }
            let nasoData;
            if(age>=45||DEBUG){ // 生成法令纹
                nasoData = this.genNasoData(faceData,eyesData);
            }
            // 生成身体
            let bodyData = this.genBodyData(faceData,gender);

            let backHairData,foreHairData,bangsData;
            if(!((r(0,100)<10)&&gender==1)||DEBUG){
                // 生成前发
                foreHairData = this.genForeHairData(faceData,gender,color,grd);
                // 生成刘海
                if(r(0,100)<20||DEBUG){
                    bangsData = this.genBangsData(faceData,gender,color,grd);
                }
            }
            // 生成背发
            if(r(0,100)<50||DEBUG){
                backHairData = this.genBackHairData(faceData,gender,color,grd);
            }

            // 转化scale
            faceData.outline = formatPx(faceData.outline);

            earsData.outline = formatPx(earsData.outline);

            browsData.outline = formatPx(browsData.outline);

            eyesData.outline = formatPx(eyesData.outline);
            eyesData.lineWidth = formatPx(eyesData.lineWidth);

            if(eyeskinsData){
                eyeskinsData.outline = formatPx(eyeskinsData.outline);
                eyeskinsData.lineWidth = formatPx(eyeskinsData.lineWidth);
            }

            if(lashData){
                lashData.outline = formatPx(lashData.outline);
                lashData.lineWidth = formatPx(lashData.lineWidth);
            }

            eyeoutballsData.outline = formatPx(eyeoutballsData.outline);
            eyeoutballsData.topY = formatPx(eyeoutballsData.topY);
            eyeoutballsData.bottomY = formatPx(eyeoutballsData.bottomY);

            if(eyeinballsData){
                eyeinballsData.outline = formatPx(eyeinballsData.outline);
                eyeinballsData.topY = formatPx(eyeinballsData.topY);
                eyeinballsData.bottomY = formatPx(eyeinballsData.bottomY);
            }

            noseData.outline = formatPx(noseData.outline);

            lipData.outline = formatPx(lipData.outline);

            if(bottomLipData){
                bottomLipData.outline = formatPx(bottomLipData.outline);
            }

            if(topMoustacheData){
                topMoustacheData.outline = formatPx(topMoustacheData.outline);
            }

            if(nasoData){
                nasoData.outline = formatPx(nasoData.outline);
            }

            bodyData.outline = formatPx(bodyData.outline);

            if(foreHairData){
                foreHairData.outline = formatPx(foreHairData.outline);
                foreHairData.topY = formatPx(foreHairData.topY);
                foreHairData.bottomY = formatPx(foreHairData.bottomY);
            }

            if(bangsData){
                bangsData.outline = formatPx(bangsData.outline);
                bangsData.topY = formatPx(bangsData.topY);
                bangsData.bottomY = formatPx(bangsData.bottomY);
            }

            if(backHairData){
                backHairData.outline = formatPx(backHairData.outline);
                backHairData.topY = formatPx(backHairData.topY);
                backHairData.bottomY = formatPx(backHairData.bottomY);
            }

            res = {
                faceData,
                earsData,
                browsData,
                eyesData,
                eyeskinsData,
                lashData,
                eyeoutballsData,
                eyeinballsData,
                noseData,
                lipData,
                bottomLipData,
                topMoustacheData,
                nasoData,
                bodyData,
                backHairData,
                foreHairData,
                bangsData,
                hairColor,
            }
            return res;
        },
        paintAvatar(ctx,canvasSize,avatarData){ // 根据肖像数据进行绘制
            let drawData = data =>{ // 画
                let { color, outline, topY, bottomY, grd, lineWidth, strokeColor, alpha, } = data;
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineWidth = lineWidth||1;
                for(let option of outline){
                    let mode = option[0];
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
                            ctx.arc(option[2],option[3],option[1],0,4*Math.PI);
                        break;
                    }
                }
                if(strokeColor){
                    ctx.strokeStyle = `rgba(${strokeColor.r},${strokeColor.g},${strokeColor.b},${alpha||1})`;
                }
                else{
                    ctx.strokeStyle = '#000';
                }
                ctx.stroke();
                if(color){
                    let grdStyle;
                    // 线性渐变
                    if(grd){
                        grdStyle = this.ctx.createLinearGradient(0,topY||100,0,bottomY||500);
                        grdStyle.addColorStop(0,grd);
                        grdStyle.addColorStop(1,`rgba(${color.r},${color.g},${color.b},${alpha||1})`);
                    }
                    else{
                        grdStyle = `rgba(${color.r},${color.g},${color.b},${alpha||1})`;
                    }
                    ctx.fillStyle = grdStyle;
                    ctx.fill();
                }
            }
            let {
                faceData,
                earsData,
                browsData,
                eyesData,
                eyeskinsData,
                lashData,
                eyeoutballsData,
                eyeinballsData,
                noseData,
                lipData,
                bottomLipData,
                topMoustacheData,
                nasoData,
                bodyData,
                backHairData,
                foreHairData,
                bangsData,
                hairColor,
            } = avatarData;

            ctx.clearRect(0,0,canvasSize,canvasSize);
            // 绘制BG
            let midWidth = canvasSize/2;
            let rd1 = canvasSize/5, rd2 = canvasSize*4/5;
            let bggrd = ctx.createRadialGradient(midWidth,midWidth,rd1,midWidth,midWidth,rd2);
            bggrd.addColorStop(0,`rgba(${hairColor.color.r},${hairColor.color.g},${hairColor.color.b},.1)`);
            bggrd.addColorStop(1,`rgba(${hairColor.color.r},${hairColor.color.g},${hairColor.color.b},.9)`);
            this.ctx.fillStyle = bggrd;
            this.ctx.fillRect(0,0,canvasSize,canvasSize);

            if(backHairData){
                drawData(backHairData);
            }
            drawData(earsData);
            drawData(bodyData);
            drawData(faceData);

            if(eyeskinsData){
                drawData(eyeskinsData);
            }
            if(lashData){
                drawData(lashData);
            }
            drawData(eyesData);
            ctx.save();
            ctx.clip();
            drawData(eyeoutballsData);
            if(eyeinballsData){
                drawData(eyeinballsData);
            }
            ctx.restore();
            drawData(browsData);

            drawData(noseData);
            drawData(lipData);
            if(bottomLipData){
                drawData(bottomLipData);
            }
            if(topMoustacheData){
                drawData(topMoustacheData);
            }
            if(nasoData){
                drawData(nasoData);
            }

            if(foreHairData){
                drawData(foreHairData);
            }
            if(bangsData){
                drawData(bangsData);
            }
        },
        _scale(x,y,ox,oy,rate){
            let offset = [x-ox,y-oy];
            if(rate>=1){
                return [Math.round(x+offset[0]*(rate-1)),Math.round(y+offset[1]*(rate-1))];
            }
            else if(rate>0){
                return [Math.round(x-offset[0]*rate),Math.round(y-offset[1]*rate)];
            }
        },

        genHairColor(gender){ // 生成发色
            let color, grd;
            let basicColor = [{ // 黑
                r: r(10,30),
                g: r(10,30),
                b: r(10,30),
            },{ // 橙黄
                r: r(234,254),
                g: r(154,174),
                b: r(86,106),
            }];
            if(r(0,100)<50){
                color = basicColor[r(0,basicColor.length-1)];
            }
            else{
                color = {
                    r: r(0,gender==1?50:255),
                    g: r(0,gender==1?50:155),
                    b: r(0,200),
                };
            }
            if(r(0,100)<90){
                let grds = ['#222','#fff','#A0522D'];
                grd = grds[r(0,grds.length-1)];
            }
            return { color, grd, };
        },
        genEyeColor(flag){ // 生成瞳色
            let color, grd;
            let basicColor = [];
            if(flag==1){
                basicColor = [{
                    r: r(40,60),
                    g: r(40,60),
                    b: r(40,60),
                },{
                    r: r(240,250),
                    g: r(240,250),
                    b: r(240,250),
                },];
            }
            else if(flag==2){
                basicColor = [{
                    r: r(40,60),
                    g: r(40,60),
                    b: r(40,60),
                },];
            }
            if(r(0,100)<90){
                color = basicColor[r(0,basicColor.length-1)];
            }
            else{
                color = {
                    r: r(0,200),
                    g: r(0,200),
                    b: r(0,200),
                };
            }
            let grds = flag==1?['#777','#fff']:['#111','#777'];
            grd = grds[r(0,grds.length-1)];
            return { color, grd, };
        },
        genLipColor(){ // 生成唇色
            let color, grd;
            let basicColor = [{
                    r: r(255,255),
                    g: r(89,109),
                    b: r(61,81),
                },];
            if(r(0,100)<90){
                color = basicColor[r(0,basicColor.length-1)];
            }
            else{
                color = {
                    r: r(255,255),
                    g: r(89,109),
                    b: r(61,81),
                };
            }
            return { color, };
        },
        genFaceData(gender){ // 生成脸
            let a,b,c,d,e,f,g,h,i;
            let color;
            if(gender==2){ // 女
                a = [500,r(240,260)]; // 头顶 千分比
                b = [500,a[1]+r(45,55)]; // 刘海中心
                c = [r(300,320),r(410,440)]; // 脸左
                d = [r(410,445),r(475,485)]; // 左眉毛中心
                e = [d[0],d[1]+r(40,55)]; // 左眼下
                f = [500,r(620,640)]; // 鼻下
                g = [500,r(655,700)]; // 唇上
                h = [r(410,435),r(700,730)]; // 颊左
                i = [500,r(740,770)]; // 下巴
                let colorDeep = r(0,5);
                color = {
                    r: r(250,255)-colorDeep,
                    g: r(239,245)-colorDeep,
                    b: r(229,234)-colorDeep,
                };
            }
            else{ // 男
                a = [500,r(240,260)]; // 头顶 千分比
                b = [500,a[1]+r(45,55)]; // 刘海中心
                c = [r(300,320),r(410,440)]; // 脸左
                d = [r(400,450),r(478,490)]; // 左眉毛中心
                e = [d[0],d[1]+r(60,80)]; // 左眼下
                f = [500,r(630,660)]; // 鼻下
                g = [500,r(675,725)]; // 唇上
                h = [r(390,410),r(715,740)]; // 颊左
                i = [500,r(747,800)]; // 下巴
                let colorDeep = r(0,15);
                color = {
                    r: r(252,255)-colorDeep,
                    g: r(230,238)-colorDeep,
                    b: r(220,227)-colorDeep,
                };
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
                cp2 = [r(c[0]+10,c[0]+35),r(h[1]-85,h[1]-55)];
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
        genBodyData(faceData,gender){ // 生成身体
            let a,b,c,d,e,f,g;
            if(gender==2){ // 女
                a = [faceData.g[0],faceData.g[1]];
                b = [faceData.h[0]+r(3,10),faceData.g[1]];
                c = [b[0]+(r(1,20)/100)*(500-b[0]),b[1]+r(60,100)];
                d = [b[0]-(r(1,30)/100)*60-80,c[1]+r(80,100)];
                e = [d[0]-(r(1,30)/100)*60-90,d[1]+r(0,5)];
                f = [e[0]-(r(1,40)/100)*60-80,e[1]+(r(1,80)/200)*90+80];
                g = [faceData.g[0],f[1]];
            }
            else{ // 男
                a = [faceData.g[0],faceData.g[1]];
                b = [faceData.h[0]+10,faceData.g[1]];
                c = [b[0]+(r(1,20)/100)*(500-b[0]),b[1]+r(90,120)];
                d = [b[0]-(r(1,30)/100)*60-80,c[1]+r(70,100)];
                e = [d[0]-(r(1,30)/100)*80-100,d[1]+r(0,20)];
                f = [e[0]-(r(1,40)/100)*80-100,e[1]+(r(1,80)/200)*90+80];
                g = [faceData.g[0],f[1]];
            }
            let res = {
                a,b,c,d,e,f,g,
                color: faceData.color,
                outline: [],
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成身体轮廓
            let cp1,cp2,cp3;
            if(gender==2){ // 女
                cp1 = [r(c[0]-2,c[0]+10),r(b[1],b[1]+20)];
                cp2 = [r(c[0]-10,c[0]+5),r(d[1]-20,d[1])];
                cp3 = [r(f[0],f[0]+10),r(e[1],e[1]+20)];
            }
            else{ // 男
                cp1 = [r(c[0]-12,c[0]),r(b[1],b[1]+20)];
                cp2 = [r(c[0]-20,c[0]),r(d[1]-20,d[1])];
                cp3 = [r(f[0],f[0]+10),r(e[1],e[1]+20)];
            }
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([1,b[0],b[1]]); // 直线 a-b1
            res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 b1-c1
            res.outline.push([2,cp2[0],cp2[1],d[0],d[1]]); // 曲线 c1-d1
            res.outline.push([1,e[0],e[1]]); // 直线 d1-e1
            res.outline.push([2,cp3[0],cp3[1],f[0],f[1]]); // 曲线 e1-f1
            res.outline.push([1,g[0],g[1]]); // 直线 f1-g
            res.outline.push([1,mirX(f[0]),f[1]]); // 直线 g-f2
            res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(e[0]),e[1]]); // 曲线 f2-e2
            res.outline.push([1,mirX(d[0]),d[1]]); // 直线 e2-d2
            res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 d2-c2
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 c2-b2
            res.outline.push([1,mirX(a[0]),a[1]]); // 直线 b2-a

            return res;
        },
        genEarsData(faceData,gender){ // 生成双耳朵
            let a,b,c,d;
            if(gender==2){ // 女
                a = [faceData.c[0]+5,faceData.c[1]+50];
                b = [faceData.c[0]-r(10,18),a[1]+r(5,20)];
                c = [faceData.c[0]+(faceData.h[0]-faceData.c[0])/3,a[1]+r(100,125)];
                d = [a[0]+30,a[1]+40];
            }
            else{ // 男
                a = [faceData.c[0]+5,faceData.c[1]+50];
                b = [faceData.c[0]-r(20,25),a[1]+r(15,25)];
                c = [faceData.c[0]+(faceData.h[0]-faceData.c[0])/4,a[1]+r(120,145)];
                d = [a[0]+30,a[1]+40];
            }

            let res = {
                a,b,c,d,
                color: faceData.color,
                outline: [],
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双耳轮廓
            let cp1,cp2,cp3;
            cp1 = [r(a[0]-5,b[0]+5),r(a[1]-3,a[1]-12)];
            cp2 = [r(c[0]-5,b[0]+2),r(c[1]-10,c[1]+10)];
            cp3 = [r(c[0]+5,c[0]+20),r(c[1]-5,c[1]-20)];

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
            res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b1-c1
            res.outline.push([2,cp3[0],cp3[1],d[0],d[1]]); // 曲线 c1-d1
            res.outline.push([1,a[0],a[1]]); // 直线
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
            res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 b2-c2
            res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(d[0]),d[1]]); // 曲线 c2-d2
            res.outline.push([1,mirX(a[0]),a[1]]); // 直线

            return res;
        },
        genBrowsData(faceData,gender,color){ // 生成双眉
            let a,b,c,d;
            if(gender==2){ // 女
                a = [faceData.d[0]+r(20,25),faceData.d[1]+r(-5,15)];
                b = [faceData.d[0]+r(-5,5),faceData.d[1]-r(0,5)];
                c = [faceData.d[0]-r(50,55),faceData.d[1]+r(-15,5)];
                d = [faceData.d[0]+r(-5,5),faceData.d[1]+r(-5,5)];
            }
            else{ // 男
                a = [faceData.d[0]+r(20,25),faceData.d[1]+r(-5,15)];
                b = [faceData.d[0]+r(-5,5),faceData.d[1]-r(0,10)];
                c = [faceData.d[0]-r(70,95),faceData.d[1]+r(-15,5)];
                d = [faceData.d[0]+r(-5,5),faceData.d[1]+r(-5,5)];
            }

            let res = {
                a,b,c,d,
                outline: [],
                color,
                alpha: 1,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双眉轮廓
            let cp1,cp2,cp3;
            cp1 = [r(a[0]-5,a[0]),r(a[1]-8,a[1]-3)];
            cp2 = [r(c[0],c[0]+3),r(c[1]-10,c[1]-5)];
            cp3 = [r(d[0]-20,d[0]-10),r(d[1],c[1])];

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
            res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b1-c1
            res.outline.push([2,cp3[0],cp3[1],d[0],d[1]]); // 曲线 c1-d1
            res.outline.push([1,a[0],a[1]]); // 直线
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
            res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 b2-c2
            res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(d[0]),d[1]]); // 曲线 c2-d2
            res.outline.push([1,mirX(a[0]),a[1]]); // 直线

            return res;
        },
        genEyesData(faceData,gender,personalities,abilities){ // 生成双眼
            let a,b,c,lineWidth;
            let min,max;
            let calmness = personalities[3],
                libidinal = personalities[0];
            if(gender==2){ // 女
                a = [faceData.e[0]+r(40,55),faceData.e[1]-r(3,15)];
                b = [faceData.e[0]-r(50,70),faceData.e[1]-r(5,10)];
                if(a[1]>b[1]){
                    min = b[1];
                    max = a[1];
                }
                else{
                    min = a[1];
                    max = b[1];
                }
                lineWidth = r(7,10);
            }
            else{ // 男
                a = [faceData.e[0]+r(45,60),faceData.e[1]-r(5,30)];
                b = [faceData.e[0]-r(60,75),faceData.e[1]-r(5,30)];
                if(a[1]>b[1]){
                    min = b[1];
                    max = a[1];
                }
                else{
                    min = a[1];
                    max = b[1];
                }
                lineWidth = r(1,4);
            }
            if(a[0]>485){
                a[0] = 485;
            }
            if(b[1]>a[1]){
                b[1] = a[1]-r(0,5);
            }
            c = [Math.round((a[0]+b[0])/2),min+Math.round((max-min)/2)];
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双眼轮廓
            let cp1,cp2;
            if(gender==2){ // 女
                let cpTop = r(b[1]-15,a[1]-35);
                let cpBottom = r(b[1]+15,a[1]+35);
                // 欲望值修正
                if(libidinal>70){
                    cpTop += Math.round(15*r(15,45)/100);
                    cpBottom -= Math.round(15*r(15,45)/100);
                }
                cp1 = [r(b[0]+15,a[0]-15),cpTop];
                cp2 = [r(b[0]+15,a[0]-15),cpBottom];
            }
            else{ // 男
                let cpTop = r(b[1]-25,a[1]-45);
                let cpBottom = r(b[1]+25,a[1]+45);
                // 欲望值修正
                if(libidinal>70){
                    cpTop += Math.round(15*r(15,45)/100);
                    cpBottom -= Math.round(15*r(15,45)/100);
                }
                cp1 = [r(b[0]+15,a[0]-15),cpTop];
                cp2 = [r(b[0]+15,a[0]-15),cpBottom];
            }
            if(cp1[0]<c[0]){
                cp1[0] = c[0]+r(5,15);
            }
            if(cp2[0]<c[0]){
                cp2[0] = c[0]+r(5,15);
            }

            let res = {
                a,b,c,
                cp1,cp2,
                outline: [],
                lineWidth,
                color: {
                    r: 255,
                    g: 255,
                    b: 255,
                },
                alpha: 1,
            };

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
            res.outline.push([2,cp2[0],cp2[1],a[0],a[1]]); // 曲线 b1-a1
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
            res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(a[0]),a[1]]); // 曲线 b2-a2

            return res;
        },
        genEyeSkinsData(eyeData){ // 生成双眼皮
            let { lineWidth, cp1, cp2, a, b, c, } = eyeData;
            let d,e;
            let dw = r(3,9);
            let ew = dw+r(5,10);
            d = [a[0],a[1]-dw];
            e = [b[0],a[1]-ew];

            let res = {
                d,e,
                outline: [],
                lineWidth: Math.floor(lineWidth/2),
                alpha: 1,
            };
            if(res.lineWidth<1){
                res.lineWidth = 1;
            }
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双眼皮轮廓
            res.outline.push([0,d[0],d[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1]-dw,e[0],e[1]]); // 曲线 d1-e1
            res.outline.push([0,mirX(d[0]),d[1]]); // 移动
            res.outline.push([2,mirX(cp1[0]),cp1[1]-dw,mirX(e[0]),e[1]]); // 曲线 d2-e2

            return res;
        },
        genLashData(eyeData){ // 生成睫毛
            let { lineWidth, cp1, cp2, a, b, c, } = eyeData;
            let eyeWidth = a[0]-b[0];
            let eyeHeight = cp2[1]-cp1[1];
            let lashMode = r(0,1); // [0:上部|1:下部]
            let lashCount;
            if(lashMode==0){ // 睫毛在上部
                lashCount = r(6,9);
            }
            else{ // 睫毛在下部
                lashCount = r(2,4);
            }
            let xRange,yRange,xItv,yItv;
            if(lashMode==0){ // 睫毛在上部
                xRange = [b[0]-12,a[0]-5];
                yRange = [cp1[1]-eyeHeight/2,cp1[1]+eyeHeight/5];
            }
            else{ // 睫毛在下部
                xRange = [b[0]-12,c[0]];
                yRange = [c[1]+4,cp2[1]+5];
            }
            xItv = Math.round((xRange[1]-xRange[0])/(lashCount+0));
            yItv = Math.round((yRange[1]-yRange[0])/(lashCount+0));
            // 起始点为 a，终点为 ep
            let eps = [];
            if(lashMode==0){ // 睫毛在上部
                for(let i=0;i<lashCount;i++){
                    let newEp = [xRange[1]-i*xItv-i*3,yRange[0]+i*yItv];
                    eps.push(newEp);
                }
                for(let i=0;i<2;i++){
                    eps[i][1] += Math.round((c[1]-eps[i][1])*.5);
                }
                // eps.push([b[0]-yItv,b[1]]);
            }
            else{ // 睫毛在下部
                for(let i=0;i<lashCount;i++){
                    let newEp = [xRange[0]+i*xItv,yRange[0]+i*yItv];
                    eps.push(newEp);
                }
            }

            let res = {
                lashCount,
                outline: [],
                lineWidth: 1,
                alpha: .5,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成睫毛轮廓
            for(let i=0;i<eps.length;i++){
                let ep = eps[i];
                if(lashMode==0){ // 上部
                    res.outline.push([0,a[0],a[1]]); // 移动
                    res.outline.push([2,c[0],c[1],ep[0],ep[1]]); // 曲线
                }
                else{ // 下部
                    res.outline.push([0,a[0],a[1]]); // 移动
                    res.outline.push([1,ep[0],ep[1]]); // 直线
                }
            }
            for(let i=0;i<eps.length;i++){
                let ep = eps[i];
                if(lashMode==0){ // 上部
                    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
                    res.outline.push([2,mirX(c[0]),c[1],mirX(ep[0]),ep[1]]); // 曲线
                }
                else{ // 下部
                    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
                    res.outline.push([1,mirX(ep[0]),ep[1]]); // 直线
                }
            }

            return res;
        },
        genEyeoutballsData(eyeData,gender){ // 生成外双瞳
            let radius;
            let c = eyeData.c;
            if(gender==2){ // 女
                radius = r(18,25);
            }
            else{ // 男
                radius = r(17,24);
            }
            let eyeColor = this.genEyeColor(1);
            let {color,grd,} = eyeColor;

            let res = {
                radius,
                outline: [],
                color,
                grd,
                topY: c[1]-15,
                bottomY: c[1]+15,
                alpha: 1,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双瞳
            res.outline.push([0,c[0],c[1]]); // 移动
            res.outline.push([3,radius,c[0],c[1]]); // 左外瞳
            res.outline.push([0,mirX(c[0]),c[1]]); // 移动
            res.outline.push([3,radius,mirX(c[0]),c[1]]); // 右外瞳
            return res;
        },
        genEyeinballsData(eyeData,gender){ // 生成内双瞳
            let radius;
            let c = eyeData.c;
            if(gender==2){ // 女
                radius = r(12,15);
            }
            else{ // 男
                radius = r(5,7);
            }
            let eyeColor = this.genEyeColor(2);
            let {color,grd,} = eyeColor;

            let res = {
                radius,
                outline: [],
                color,
                grd,
                topY: c[1]-5,
                bottomY: c[1]+5,
                alpha: 1,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };

            // 生成双瞳
            res.outline.push([0,c[0],c[1]]); // 移动
            res.outline.push([3,radius,c[0],c[1]]); // 左内瞳
            res.outline.push([0,mirX(c[0]),c[1]]); // 移动
            res.outline.push([3,radius,mirX(c[0]),c[1]]); // 右内瞳
            return res;
        },
        genNoseData(faceData,gender){ // 生成鼻子
            let a,b,c,lineWidth;
            let dir;
            if(gender==2){ // 女
                a = [faceData.f[0],faceData.f[1]-r(60,115)];
                b = [faceData.f[0]-r(-7,7),faceData.f[1]-r(0,5)];
                dir = b[0]<0?-1:1; // 鼻子方向：[0:向左|1:向右]
                c = [(faceData.f[0]+r(0,6))*dir,faceData.f[1]];
                lineWidth = 1;
            }
            else{ // 男
                a = [faceData.f[0],faceData.f[1]-r(70,125)];
                b = [faceData.f[0]-r(-9,9),faceData.f[1]-r(0,8)];
                dir = b[0]<0?0:1; // 鼻子方向：[0:向左|1:向右]
                c = [(faceData.f[0]+r(0,12))*dir,faceData.f[1]];
                lineWidth = r(1,2);
            }
            if(b[0]==0){
                b[0] = 5;
            }
            if(b[0]<2&&b[0]>-2){
                b[0] *= 2;
            }
            // 生成鼻子轮廓
            let cp1,cp2;
            if(gender==2){ // 女
                cp1 = [r(a[0],(a[0]+9)*dir),r(b[1]-50,b[1])];
                cp2 = [r(c[0],(c[0]+4)*dir),r(b[1],b[1]+10)];
            }
            else{ // 男
                cp1 = [r(a[0],(a[0]+10)*dir),r(b[1]-50,b[1])];
                cp2 = [r(c[0],(c[0]+7)*dir),r(b[1],b[1]+16)];
            }

            let res = {
                a,b,c,
                outline: [],
                lineWidth,
                strokeColor: '#747443',
            };

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b
            res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b-c

            return res;
        },
        genLipData(faceData,gender,emotion){ // 生成嘴唇
            let a,b,lineWidth;
            let lipWidth;
            let lipColor = this.genLipColor();
            let strokeColor,color;
            if(gender==2){ // 女
                lipWidth = r(25,40);
                a = [faceData.g[0]+lipWidth,faceData.g[1]];
                b = [faceData.g[0]-lipWidth,faceData.g[1]];
                lineWidth = 1;
                if(r(0,100)<90){
                    strokeColor = lipColor.color;
                    lineWidth = r(1,3);
                }
                color = {
                    r: 255,
                    g: 99,
                    b: 71,
                };
            }
            else{ // 男
                lipWidth = r(30,80);
                a = [faceData.g[0]+lipWidth,faceData.g[1]];
                b = [faceData.g[0]-lipWidth,faceData.g[1]];
                lineWidth = 1;
            }
            // 生成嘴唇轮廓
            if(!emotion){
                emotion = r(0,100);
            }
            let arcDeg = Math.round(emotion/100*24-9); // (-9 - 15)
            let cp1;
            if(gender==2){ // 女
                cp1 = [faceData.g[0]+r(-25,25),faceData.g[1]+arcDeg];
            }
            else{ // 男
                cp1 = [faceData.g[0]+r(-25,25),faceData.g[1]+arcDeg];
            }

            let res = {
                a,b,
                outline: [],
                lineWidth,
                lipWidth,
                strokeColor,
                color,
                emotion,
            };

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b

            return res;
        },
        genBottomLipData(faceData,lipData,gender){ // 生成下嘴唇
            let a,b,lineWidth;
            let strokeColor = {
                r: 100,
                g: 100,
                b: 100,
            };
            let lipWidth = lipData.lipWidth/3+r(-4,4);
            let marginTop = r(9,15);
            if(gender==2){ // 女
                a = [faceData.g[0]+lipWidth,faceData.g[1]+marginTop];
                b = [faceData.g[0]-lipWidth,faceData.g[1]+marginTop];
                lineWidth = 1;
            }
            else{ // 男
                a = [faceData.g[0]+lipWidth,faceData.g[1]+marginTop];
                b = [faceData.g[0]-lipWidth,faceData.g[1]+marginTop];
                lineWidth = 1;
            }
            // 生成嘴唇轮廓
            let cp1;
            if(gender==2){ // 女
                cp1 = [faceData.g[0],r(a[1]-9,a[1]+4)];
            }
            else{ // 男
                cp1 = [faceData.g[0],r(a[1]-9,a[1]+4)];
            }

            let res = {
                a,b,
                outline: [],
                lineWidth,
                strokeColor,
            };

            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b

            return res;
        },
        genTopMoustacheData(faceData,lipData,color,grd){ // 生成上胡子
            let { lineWidth, lipWidth, } = lipData;
            let halfLipWidth = lipWidth/2;
            let strokeColor = {
                r: 100,
                g: 100,
                b: 100,
            };
            let a,b,c;
            a = [faceData.g[0]-halfLipWidth-r(40,60),faceData.g[1]-r(14,22)];
            b = [a[0]+r(-7,0),a[1]+r(15,35)];
            c = [faceData.g[0]+r(-10,0),a[1]+r(-12,12)];

            let res = {
                a,b,c,
                outline: [],
                alpha: .8,
                color,
                strokeColor,
            };
            if(res.lineWidth<1){
                res.lineWidth = 1;
            }
            let mirX = x =>{
                return x+2*(500-x);
            };
            let cp1 = [r(b[0],b[0]+10),r(a[1],parseInt((b[1]+a[1])/2))];

            // 生成上胡子轮廓
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([1,b[0],b[1]]); // 直线 a1-b1
            res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 b1-c1
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([1,mirX(b[0]),b[1]]); // 直线 a2-b2
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(c[0]),c[1]]); // 曲线 b2-c2

            return res;
        },
        genNasoData(faceData,eyeData){ // 生成法令纹
            let a,b;
            a = [eyeData.a[0]+r(0,10),eyeData.a[1]+r(5,20)];
            b = [a[0]-r(35,60),a[1]+r(70,100)];
            let strokeColor = {
                r: 100,
                g: 100,
                b: 100,
            };
            let res = {
                a,b,
                outline: [],
                alpha: .8,
                strokeColor,
            };
            let mirX = x =>{
                return x+2*(500-x);
            };
            let cp1 = [a[0]-r(0,15),a[1]+r(20,40)];

            // 生成上胡子轮廓
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a1-b1

            return res;
        },
        genForeHairData(faceData,gender,color,grd,hairName){ // 生成前发型
            let res,rHair;
            if(hairName){
                let hairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.maleForeHairTemplates,...CONFIG.femaleForeHairTemplates,];
                for(let h of hairTemplates){
                    if(h.name==hairName){
                        rHair = h;
                        break;
                    }
                }
            }
            else{
                let maleForeHairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.maleForeHairTemplates,];
                let femaleForeHairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.femaleForeHairTemplates,];
                if(gender==1){ // 男
                    rHair = maleForeHairTemplates[r(0,maleForeHairTemplates.length-1)];
                }
                else{ // 女
                    rHair = femaleForeHairTemplates[r(0,femaleForeHairTemplates.length-1)];
                }
            }
            if(DEBUG){
                rHair = CONFIG.testForeHairTemplates[r(0,CONFIG.testForeHairTemplates.length-1)];
            }
            let center = [...rHair.center];
            let const_outline = [...rHair.outline];
            let outline = Array.from(const_outline,item=>{
                let newItem = [...item];
                return newItem;
            });
            // 对准
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
            // 缩放
            let width = (500-faceData.c[0])*2; // 头部宽度
            let height = faceData.b[1]-faceData.a[1]; // 头部高度
            let widthScaleRate = width/400; // 水平缩放比率
            let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
            for(let option of outline){
                if(option[0]!=2){
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                }
                else{
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                    option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
                    option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
                }
            }
            // 随机造型
            if(!rHair.fixed){
                for(let option of outline){
                    let dr = r(100,107)/100;
                    // console.log(dr);
                    if(option[0]!=2){
                        let vector = this._scale(option[1],option[2],center[0],center[1],dr);
                        option[1] = vector[0];
                        option[2] = vector[1];
                    }
                    else{
                        let vector1 = this._scale(option[1],option[2],center[0],center[1],dr);
                        let vector2 = this._scale(option[3],option[4],center[0],center[1],dr);
                        option[1] = vector1[0];
                        option[2] = vector1[1];
                        option[3] = vector2[0];
                        option[4] = vector2[1];
                    }
                }
            }
            // 获取最高点和最低点
            let topY = Infinity, bottomY = 0;
            for(let option of outline){
                if(option[0]!=2){
                    if(option[2]<topY){
                        topY = option[2];
                    }
                    if(option[2]>bottomY){
                        bottomY = option[2];
                    }
                }
                else{
                    if(option[3]<topY){
                        topY = option[2];
                    }
                    if(option[4]>bottomY){
                        bottomY = option[2];
                    }
                }
            }
            // console.log('=========>',outline);

            // 输出
            res = {
                color,
                grd,
                topY: Math.round(topY*.2),
                bottomY: Math.round(bottomY*2),
                outline,
                name: rHair.name,
            }
            return res;
        },
        genBangsData(faceData,gender,color,grd,hairName){ // 生成刘海
            let res,rHair;
            if(hairName){
                let hairTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.maleBangsTemplates,...CONFIG.femaleBangsTemplates,];
                for(let h of hairTemplates){
                    if(h.name==hairName){
                        rHair = h;
                        break;
                    }
                }
            }
            else{
                let maleBangsTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.maleBangsTemplates,];
                let femaleBangsTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.femaleBangsTemplates,];
                if(gender==1){ // 男
                    rHair = maleBangsTemplates[r(0,maleBangsTemplates.length-1)];
                }
                else{ // 女
                    rHair = femaleBangsTemplates[r(0,femaleBangsTemplates.length-1)];
                }
            }
            if(DEBUG){
                rHair = CONFIG.testBangsTemplates[r(0,CONFIG.testBangsTemplates.length-1)];
            }
            let center = [...rHair.center];
            let const_outline = [...rHair.outline];
            let outline = Array.from(const_outline,item=>{
                let newItem = [...item];
                return newItem;
            });
            // 对准
            let a = faceData.a, b = faceData.b, c = faceData.c;
            let offset = [b[0]-center[0],b[1]-center[1]];
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
            // 缩放
            let width = (500-c[0])*2; // 头部宽度
            let height = b[1]-a[1]; // 头部高度
            let widthScaleRate = width/400; // 水平缩放比率
            let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
            for(let option of outline){
                if(option[0]!=2){
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                }
                else{
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                    option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
                    option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
                }
            }
            // 随机造型
            for(let option of outline){
                let dr = r(100,104)/100;
                // console.log(dr);
                if(option[0]!=2){
                    let vector = this._scale(option[1],option[2],center[0],center[1],dr);
                    option[1] = vector[0];
                    option[2] = vector[1];
                }
                else{
                    let vector1 = this._scale(option[1],option[2],center[0],center[1],dr);
                    let vector2 = this._scale(option[3],option[4],center[0],center[1],dr);
                    option[1] = vector1[0];
                    option[2] = vector1[1];
                    option[3] = vector2[0];
                    option[4] = vector2[1];
                }
            }
            // 获取最高点和最低点
            let topY = Infinity, bottomY = 0;
            for(let option of outline){
                if(option[0]!=2){
                    if(option[2]<topY){
                        topY = option[2];
                    }
                    if(option[2]>bottomY){
                        bottomY = option[2];
                    }
                }
                else{
                    if(option[3]<topY){
                        topY = option[2];
                    }
                    if(option[4]>bottomY){
                        bottomY = option[2];
                    }
                }
            }
            // console.log('=========>',outline);

            // 输出
            res = {
                color,
                grd,
                topY: Math.round(topY*.2),
                bottomY: Math.round(bottomY*2),
                outline,
                alpha: .96,
                name: rHair.name,
            }
            return res;
        },
        genBackHairData(faceData,gender,color,grd,hairName){ // 生成后发型
            let res,rHair;
            if(hairName){
                let hairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.maleBackHairTemplates,...CONFIG.femaleBackHairTemplates,];
                for(let h of hairTemplates){
                    if(h.name==hairName){
                        rHair = h;
                        break;
                    }
                }
            }
            else{
                let maleBackHairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.maleBackHairTemplates,];
                let femaleBackHairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.femaleBackHairTemplates,];
                if(gender==1){ // 男
                    rHair = maleBackHairTemplates[r(0,maleBackHairTemplates.length-1)];
                }
                else{ // 女
                    rHair = femaleBackHairTemplates[r(0,femaleBackHairTemplates.length-1)];
                }
            }
            if(DEBUG){
                rHair = CONFIG.testBackHairTemplates[r(0,CONFIG.testBackHairTemplates.length-1)];
            }
            let center = [...rHair.center];
            let const_outline = [...rHair.outline];
            let outline = Array.from(const_outline,item=>{
                let newItem = [...item];
                return newItem;
            });
            // 对准
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
            // 缩放
            let width = (500-faceData.c[0])*2; // 头部宽度
            let height = faceData.b[1]-faceData.a[1]; // 头部高度
            let widthScaleRate = width/400; // 水平缩放比率
            let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
            widthScaleRate *= r(90,110)/100;
            heightScaleRate *= r(80,120)/100;
            for(let option of outline){
                if(option[0]!=2){
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                }
                else{
                    option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
                    option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
                    option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
                    option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
                }
            }
            // 随机造型
            for(let option of outline){
                let dr = r(100,104)/100;
                // console.log(dr);
                if(option[0]!=2){
                    let vector = this._scale(option[1],option[2],center[0],center[1],dr);
                    option[1] = vector[0];
                }
                else{
                    let vector1 = this._scale(option[1],option[2],center[0],center[1],dr);
                    let vector2 = this._scale(option[3],option[4],center[0],center[1],dr);
                    option[1] = vector1[0];
                    option[3] = vector2[0];
                }
            }

            // 获取最高点和最低点
            let topY = Infinity, bottomY = 0;
            for(let option of outline){
                if(option[0]!=2){
                    if(option[2]<topY){
                        topY = option[2];
                    }
                    if(option[2]>bottomY){
                        bottomY = option[2];
                    }
                }
                else{
                    if(option[3]<topY){
                        topY = option[2];
                    }
                    if(option[4]>bottomY){
                        bottomY = option[2];
                    }
                }
            }
            // console.log('=========>',outline);

            // 输出
            res = {
                color,
                grd,
                topY: Math.round(topY*.2),
                bottomY: Math.round(bottomY*2),
                outline,
                name: rHair.name,
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
        height: 250px;
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
