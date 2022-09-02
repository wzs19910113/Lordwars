<template>
    <div class="scenepage">
        <div class="block top-block" v-if="data.mode!=4">
            <UnitIcon :ref="`uic-${youTeam[0].id}`" :highlight="youTeam[0].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="youTeam[0]" :unit="youTeam[0]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${youTeam[1].id}`" :highlight="youTeam[1].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="youTeam[1]" :unit="youTeam[1]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${youTeam[2].id}`" :highlight="youTeam[2].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="youTeam[2]" :unit="youTeam[2]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${youTeam[3].id}`" :highlight="youTeam[3].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="youTeam[3]" :unit="youTeam[3]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${youTeam[4].id}`" :highlight="youTeam[4].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="youTeam[4]" :unit="youTeam[4]" :onClick="onClickUnit" />
        </div>
        <div class="block top-block" v-else></div>
        <div class="block mid-block">
            <a class="btn btn-start" v-if="state==1&&data.mode!=4" @click="onClickStartFight">开始{{data.mode==3?'观战':''}}</a>
            <Bar1 class="time-bar" v-if="(state==2||state==3)&&data.mode!=4" :title="`回合${roundCount}`" :type="5" :crt="time" />
            <!-- <Bar1 class="time-bar" v-if="state==2||state==3" :title="`回合${roundCount}`" :type="5" :crt="time" /> -->
            <Bar1 class="escape-bar" v-if="state==2&&escapeTime>0" title="逃跑" :type="6" :crt="maxEscapeTime-escapeTime" :max="maxEscapeTime" />
            <div class="panel inform" v-if="state!=1">{{inform}}</div>
            <div class="panel detail-inform" v-if="state!=1">
                {{detailInform}}
                <span v-if="detailInformSkillName" class="skill-name">
                    <i v-if="detailInformFlashing" class="flashing flashing-left">{{detailInformSkillName}}</i>
                    <i :class="detailInformFlashing?'flashing-skill':''">{{detailInformSkillName}}</i>
                    <i v-if="detailInformFlashing" class="flashing flashing-right">{{detailInformSkillName}}</i>
                </span>
            </div>
            <div class="panel action" v-if="state==3&&data.mode!=4">
                <div class="panel basic-action" v-if="optionState==1">
                    <a class="btn" @click="onClickAttack">攻击</a>
                    <a class="btn" @click="onClickSkill" :class="{'ban':banSkill}">技能</a>
                    <a class="btn" @click="onClickOther">其他</a>
                </div>
                <div class="panel basic-action" v-if="optionState==3||optionState==5">
                    <a class="btn" @click="onClickCancel">取消</a>
                </div>
                <AttackBoard class="panel skill-board" v-if="optionState==2" :type="1" :onClickCancel="onClickCancel" :onClickAttack="onClickAttackType" :unit="curUnits[curUnitIndex]" />
                <SkillBoard class="panel skill-board" v-if="optionState==4" :type="1" :onClickCancel="onClickCancel" :onClickSkill="onClickUseSkill" :unit="curUnits[curUnitIndex]" :mode="data.mode" />
                <OtherBoard class="panel skill-board" :mode="data.mode" v-if="optionState==6" :onClickCancel="onClickCancel" :onClickAction="onClickOtherAction" :unit="curUnits[curUnitIndex]" :round="roundCount" />
            </div>
            <div class="panel action" v-if="state==3&&data.mode==4">
                <div class="panel basic-action" v-if="optionState==1">
                    <a class="btn" @click="onClickSkill" :class="{'ban':banSkill}">技能</a>
                    <a class="btn" @click="onClickSkipSceneMode">跳过(S)</a>
                    <a class="btn" @click="onClickLeaveSceneMode">离开(Q)</a>
                </div>
                <div class="panel basic-action" v-if="optionState==3||optionState==5">
                    <a class="btn" @click="onClickCancel">取消</a>
                </div>
                <SkillBoard class="panel skill-board" v-if="optionState==4" :type="1" :mode="data.mode" :onClickCancel="onClickCancel" :onClickSkill="onClickUseSkill" :unit="curUnits[curUnitIndex]" />
            </div>
        </div>
        <div class="block bottom-block">
            <UnitIcon :ref="`uic-${meTeam[0].id}`" :highlight="meTeam[0].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="meTeam[0]" :unit="meTeam[0]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${meTeam[1].id}`" :highlight="meTeam[1].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="meTeam[1]" :unit="meTeam[1]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${meTeam[2].id}`" :highlight="meTeam[2].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="meTeam[2]" :unit="meTeam[2]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${meTeam[3].id}`" :highlight="meTeam[3].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="meTeam[3]" :unit="meTeam[3]" :onClick="onClickUnit" />
            <UnitIcon :ref="`uic-${meTeam[4].id}`" :highlight="meTeam[4].id==(impactTargets[impactTargetIndex]||{}).id&&state==7&&!popTransAni" v-if="meTeam[4]" :unit="meTeam[4]" :onClick="onClickUnit" />
        </div>
        <div class="panel test" v-if="DEBUG">
            <!-- <span v-for="(unit,index) in curUnits" :style="{'font-weight':(curUnitIndex==index?'bold':'normal')}">{{unit.name}}，</span> -->
            <!-- <span v-for="(fact,index) in meTeam[1].strFacts">{{fact}}，</span> -->
            <div>{{meTeam[0].actTimeIndex}}/{{meTeam[0].actTimePerRound}}</div>
            <a class="btn" @click="onClickTest(0)">获胜</a>
            <a class="btn" @click="onClickTest(1)">失败</a>
            <div>{{bonusRatio}},{{bonusFix}}</div>
        </div>
        <div class="panel watcher" v-if="data.mode==3">
            <a class="btn" @click="pause=!pause">{{pause?'继续':'暂停'}}</a>
            <a class="btn" @click="onClickEnd">结束观看</a>
        </div>
        <div class="alert" v-for="(alertMsg,index) in alertMsgs" :key="index" v-if="alertMsg">{{alertMsg}}</div>
        <div class="cover" v-if="state==2||state==4"></div>
        <div class="buff-pop" v-if="impactTargets.length>0&&buffEditTarget.id">
            <div class="buff-pop-cover"></div>
            <div class="buff-selection" :class="popTransAni?'buff-selection-trans':''">
                <div class="buff-btn-wrap">
                    <BuffIcon class="btn" :class="{'btn-buff-sel':buffIsSelected(buff)}" :mouseon="showBuffTip" :mouseoff="hideBuffTip" :key="index" :buff="buff" :onClick="onClickBuffEditor" v-for="(buff,index) in buffEditors" />
                </div>
                <div class="buff-selection-tip">{{buffTip}}</div>
                <div class="buff-selection-title">解除 <b>{{buffEditTarget.name}}</b> 的 {{impactBuffCount}} 个状态</div>
            </div>
        </div>
        <audio ref="sound-0" :src="`static/sound/a-1.mp3`"></audio>
        <audio ref="sound-1" :src="`static/sound/a-2.mp3`"></audio>
        <audio ref="sound-2" :src="`static/sound/a-3.mp3`"></audio>
        <audio ref="sound-3" :src="`static/sound/a-4.mp3`"></audio>
        <audio ref="sound-4" :src="`static/sound/a-5.mp3`"></audio>
        <audio ref="sound-5" :src="`static/sound/a-6.mp3`"></audio>
    </div>
</template>
<script>
import UnitIcon from '../components/UnitIcon';
import Bar1 from '../components/Bar1';
import Bar2 from '../components/Bar2';
import BuffIcon from '../components/BuffIcon';
import SkillBoard from '../components/SkillBoard';
import AttackBoard from '../components/AttackBoard';
import OtherBoard from '../components/OtherBoard';
import { query, r, rr, cloneObj, shuffle, bulbsort, getParentNode, getMatchList, removeFromList, removeFromNumberList, arrContains, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const EFF_TIME = 2900;
const ANI_TIME = 4500;
export default {
    props:{
        game: Object,
        /*
        data: {
            meTeam: [{
                id: 1,
                name: '阿奇',
                age: 20,
                gender: 1, // [1:男|2:女]
                personalities: [10,20,30,40,50,], // 性格（0-100）
                abilities: [222,444,222,180,30], // 能力（>0） [力量，精准，速度，智力，经验]
                hp: 5000,
                pow: 1000,
                imm: 22, // 状态抗性
                baseAttack: 8, // 基础攻击力
                fixawareness: 1300, // 固有存在感（0-10000）
                weapon: { // 武器
                 	id: 1,
                	name: '铁剑',
                	dmg: [12,11,3,0,0,0,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
                	buffLevels: [1,2,1,0,0,0], // 攻击对应buff等级
                	consume: [4,3,2,0,0,0],
                	type: 2, // [1:攻击单人|2:攻击全体]
                },
                viceWeapon: {}, // 副手武器
                skills: [{ // 技能数组
                	id: 1,
                	name: '躲避',
                	target: 4, // [1:我方单体|2:我方全体|4:自己|5:敌方单体|6:敌方全体]
                	effects: [8], // [1:伤害|2:治疗|3:改变意志|7:改变行动力|8:改变存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
                	dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
                	cure: 0, // 固定治疗
                	cureRate: 0, // 比率治疗
                	powShift: 0, // 改变意志
                	attrShift: 0, // 改变基础属性
                	awaShift: -4000, // 改变存在感
                	moveShift: 0, // 改变行动力
                	buffs: [], // buff序号
                	buffLevels: [], // buff等级(1-9)
                	consume: 7, // 意志消耗
                	fixawareness: 0,
                	absolute: 0, // 必中，无视对方存在感
                }],
                isAI: false,
            }],
            youTeam: [],
            map: {

            },
            cell: {

            },
            mode: 1, // 战斗模式 [0:非战斗状态|1:过招|2:厮杀|3:观战]
        }
        */
        data: Object,
        onEnd: Function, // 战斗结束事件
    },
    data() {
        return {
            state: 1, // 状态[1:准备开始|2:战斗-时间流逝|3:战斗-操作中|4:动画|5:战斗结束|6:离开|7:状态编辑]

            optionState: 1, // 操作状态[1:主动作|2:选择攻击类型|3:选择攻击对象|4:选择技能|5:选择技能对象|6:选择其他操作]

            meTeam: [],
            youTeam: [],

            pause: false, // 暂停

            roundCount: 1, // 当前回合次数
            inform: '',
            detailInform: '',
            detailInformFlashing: false,
            detailInformSkillName: '', // 技能名
            alertMsgs: [],

            curUnits: [], // 当前行动单位数组
            curUnitIndex: 0, // 当前行动单位的序号
            castingSkill: {}, // 当前释放的技能

            attack: {}, // 当前进行的攻击数据
            skill: {}, // 当前释放的技能数据

            effectData: {},
            numberEffectData: {},
            /*
                {
                    caster: {...unit,changes},
                    targets: [{...unit,changes},...],
                    actionType: 1, // [0:其他|1:普通攻击|2:技能|3:追踪]
                }
            */

            escapeTime: 0, // 逃跑计时
            maxEscapeTime: 0, // 逃跑计时最大值
            escapeCaster: {}, // 逃跑发起者

            bonusFix: 0, // 固定额外金币数值
            bonusRatio: 0, // 额外金币奖励百分比

            banSkill: false,
            banSearch: false,
            banSkip: false,
            banEscape: false,

            impactTargets: [], // 可解除buff的单位对象
            impactBuffCount: 0, // 可解除buff的数量（每个单位对象）
            impactBuffType: 0, // 解除buff类型[0:负面buff|1:正面buff]
            impactTargetIndex: 0, // 可解除buff的单位对象的下标
            impactNewTargets: [], // 可解除buff的单位对象修改数据

            buffEditTarget: {}, // 状态编辑弹窗的单位对象
            buffEditors: [], // 状态选择弹窗的状态对象
            buffSelections: [],
            popTransAni: false, // 播放弹窗转换动画
            buffTip: '',

            time: 0, // 总时间
            time_ani: 0, // 动画时间

            itv: null, // 总间隔器
            itv_ani: null, // 动画间隔器
            itv_sound: null, // 音效间隔器

            auds: [null,null,null,null,null,null,],

            CONFIG,
            DEBUG,
            common,
        };
    },
    created(){
        this.init();
    },
    destroyed(){
        clearInterval(this.itv);
        clearInterval(this.itv_ani);
        document.onkeyup = null;
    },
    mounted(){
        // 加载音效
        for(let i=0;i<this.auds.length;i++){
            this.auds[i] = this.$refs[`sound-${i}`];
        }
    },
    methods: {
        init(){
            this.meTeam = Array.from(this.data.meTeam,(unit,index)=>{
                return this.formatUnit(unit,index,2);
            },);
            this.youTeam = Array.from(this.data.youTeam,(unit,index)=>{
                return this.formatUnit(unit,index,1);
            },);
            if(DEBUG){
                console.log('我的队伍',this.meTeam);
                console.log('敌方队伍',this.youTeam);
                console.log('模式',this.data.mode);
                console.log('地图',this.data.map);
                console.log('格子',this.data.cell);
            }
            for(let unit of this.meTeam){
                if(unit.isTempMember){
                    this._alert(`${unit.name} 援助作战`);
                }
            }
            this.initKeyboard();
        },
        initKeyboard(){ // 初始化键盘事件
            if(!document.onkeyup){
                document.onkeyup = event =>{
                    let e = event||window.event||arguments.callee.caller.arguments[0];
                    if(e&&e.keyCode==65){ // 按 A
                        this.onKeyupA();
                    }
                    else if(e&&e.keyCode==84){ // 按 T
                        this.onKeyupT();
                    }
                    else if(e&&e.keyCode==70){ // 按 F
                        this.onKeyupF();
                    }
                    else if(e&&e.keyCode==66){ // 按 B
                        this.onKeyupB();
                    }
                    else if(e&&e.keyCode==88){ // 按 X
                        this.onKeyupX();
                    }
                    else if(e&&e.keyCode==81){ // 按 Q
                        this.onKeyupQ();
                    }
                    else if(e&&e.keyCode==83){ // 按 S
                        this.onKeyupS();
                    }
                    else if(e&&(e.keyCode==13||e.keyCode==32)){ // 按 回车 或 空格
                        this.onKeyupEnter();
                    }
                    else if(e&&(e.keyCode==49)){ // 按 1
                        this.onKeyupNumber(1);
                    }
                    else if(e&&(e.keyCode==50)){ // 按 2
                        this.onKeyupNumber(2);
                    }
                    else if(e&&(e.keyCode==51)){ // 按 3
                        this.onKeyupNumber(3);
                    }
                    else if(e&&(e.keyCode==52)){ // 按 4
                        this.onKeyupNumber(4);
                    }
                    else if(e&&(e.keyCode==53)){ // 按 5
                        this.onKeyupNumber(5);
                    }
                    else if(e&&(e.keyCode==54)){ // 按 6
                        this.onKeyupNumber(6);
                    }
                };
            }
        },
        playSound(type){ // 播放音效 type:[0-5]
            this.auds[type].volume = .3;
            this.auds[type].play();
        },
        formatUnit(member,index,side){ // 单位战斗数据化
            let res = {};
            let abilities = member.abilities;
            res = {
                ...member,
                awareness: common.calcAwareness(member),
                fixstr: abilities[0],
                fixacr: abilities[1],
                fixdex: abilities[2],
                str: abilities[0],
                acr: abilities[1],
                dex: abilities[2],
                strFacts: [0,0,0,0,],
                acrFacts: [0,0,0,0,],
                dexFacts: [0,0,0,0,],
                dead: false,
                cooldowns: [],
                move: 0,
                side, // [1:敌人|2:我方]
                canSleep: true,
                cursor: 0,
                buffs: [],
                fixBuffs: [],
                actTimePerRound: 1,
                actTimeIndex: 0,
                switchCount: 0,
            };

            // 数组手动赋值防止指针重叠
            if(member.isCreep&&!member.isBoss){
                res.id = 10000+index;
            }
            return res;
        },
        calcBanAttacks(unit){ // 返回‘禁用攻击’数组
            let hands = unit.weapon;
            let dmg = hands.dmg;
            let attackableTargetCount = common.getAliveUnitArr(this.youTeam).length; // 可攻击的敌人数量
            let res = [];
            if(dmg){
                for(let i=0;i<dmg.length;i++){
                    let thisDmg = dmg[i];
                    let stat = 0;
                    if(thisDmg<=0||attackableTargetCount<=0||unit.pow<(unit.consume+(hands.consume[i]||0))){
                        stat = 1;
                    }
                    res.push(stat);
                }
            }
            return res;
        },
        setOptionState(optionState,detailInform){ // 设置操作面板的步骤
            let curUnit = this.curUnits[this.curUnitIndex];
            let weapon = curUnit.weapon;
            this.detailInform = [((weapon&&weapon.lastAttackAction&&this.data.mode!=4)?'（按 A 键重复上一次攻击）':''),'选择攻击手段','选择目标','选择技能','选择目标',detailInform][optionState-1];
            this.optionState = optionState;
        },

        buffIsSelected(buff){
            return getMatchList(this.buffSelections,[['id',buff.id]])[0];
        },

        perFrame(){ // 每帧动作
            for(let unit of this.meTeam){
                this.perFrameUnit(unit);
            }
            for(let unit of this.youTeam){
                this.perFrameUnit(unit);
            }

            // 微回合
            let tinyRoundInterval = CONFIG.enviorTimeIncrement*10;
            let intervalCount = Math.round(CONFIG.maxEnviorTime/tinyRoundInterval);
            if(this.time%tinyRoundInterval==0){
                this.perTinyRound(intervalCount);
            }

            if(this.curUnits.length>0){ // 如果本帧有单位行动
                let curUnit = this.curUnits[this.curUnitIndex];
                this.unitRound(curUnit,1);
            }
            else{ // 如果本帧没有单位要行动，继续时间流逝
                this.time += CONFIG.enviorTimeIncrement;
                if(this.time>=CONFIG.maxEnviorTime){
                    this.perRound();
                    this.time = 0;
                }
                //  非调整模式下，判断战斗是否结束
                if(this.data.mode!=4){
                    this.checkWinner();
                }
            }
        },
        perFrameUnit(unit){ // 单位每帧的数据计算
            if(!unit.dead){
                // buff消退
                let buffObj0 = common.getBuffObj(unit,120); // 灾厄bufff
                for(let buff of unit.buffs){
                    if(buffObj0&&!buff.good&&buff.id!=120){ // 灾厄bufff

                    }
                    else{
                        buff.time -= CONFIG.enviorTimeIncrement;
                    }
                    if(buff.time<=0){
                        unit.buffs = removeFromList(buff.id,'id',unit.buffs);
                        // 取消buff效果
                        if(this.isAttrBuff(buff)){
                            let { valueName, factIndex, } = this.getAttrBuffData(buff);
                            let oValue = common.calcAttrOffset(unit,valueName);
                            unit[`${valueName}Facts`][factIndex] = 0;
                            let nValue = common.calcAttrOffset(unit,valueName);
                            unit[`${valueName}`] = nValue;
                            if(unit[`${valueName}`]<=0){
                                unit[`${valueName}`] = 0;
                            }
                            let nextChanges = {};
                            nextChanges[valueName] = nValue-oValue;
                            this.playNumberAnimation([{...unit,changes:nextChanges,}]);
                        }
                    }
                }
                let buffObj;
                // 如果是玩家单位，且正在逃亡
                if(this.escapeTime>0&&unit.side==2){
                    let escapeTime = this.escapeTime;
                    escapeTime -= unit.dex;
                    if(escapeTime<0){
                        escapeTime = 0;
                    }
                    this.escapeTime = escapeTime;
                    if(this.escapeTime<=0){ // 逃跑计数到时，逃跑成功
                        this.endBattle({
                            type: 2,
                        });
                    }
                }
                else{
                    let buffObj1 = common.getBuffObj(unit,105); // 晕眩bufff
                    let buffObj2 = common.getBuffObj(unit,118); // 昏睡bufff
                    if(!buffObj1&&!buffObj2){
                        unit.move += this.data.mode!=4?unit.dex:(CONFIG.enviorTimeIncrement*2); // 行动力累加
                        // unit.move += CONFIG.enviorTimeIncrement; // 行动力累加
                    }
                    if(unit.move>=CONFIG.maxMove){ // 如果轮到该单位行动，将它加入本帧行动数组
                        unit.movementOverflow = unit.move-CONFIG.maxMove;
                        // 灵巧bufff
                        buffObj = common.getBuffObj(unit,14);
                        if(buffObj){
                            unit.move = buffObj.increment;
                            if(unit.move>CONFIG.maxMove){
                                unit.move = CONFIG.maxMove;
                            }
                        }
                        else{
                            unit.move = 0;
                        }
                        this.curUnits.push(unit);
                        // 按溢出行动力排序
                        let sortedCurUnits = bulbsort(this.curUnits,'movementOverflow',1);
                        this.curUnits = sortedCurUnits;
                    }
                }
            }
        },
        preAniFrame(){ // 动画每帧动作
            this.time_ani += CONFIG.enviorTimeIncrement;
            if(this.time_ani==EFF_TIME){ // 出数据效果
                this.onEffect();
            }
            if(this.time_ani>=ANI_TIME){ // 动画结束
                this.onAnimationEnd();
            }
        },
        perTinyRound(intervalCount){ // 每微回合动作
            let targets = [];
            let allAliveUnits = [...common.getAliveUnitArr(this.meTeam),...common.getAliveUnitArr(this.youTeam)];
            for(let unit of allAliveUnits){ // 遍历每个存活单位
                let buffs = unit.buffs;
                let canBeTarget = 0;
                let changes = {
                    hp: 0,
                    pow: 0,
                    awareness: 0,
                    move: 0,
                    str: 0,
                    acr: 0,
                    dex: 0,
                    removeBuffs: [],
                    removeCertainBuffs: [],
                };
                for(let buff of buffs){ // 遍历该单位身上的 buff
                    let { base, lvlup, level } = buff;
                    let increment = base+lvlup*(level-1);
                    let val = 0;
                    let wakeup = false; // 昏睡bufff
                    if(buff.id==1){ // 急救bufff
                        canBeTarget = true;
                        val = Math.round((unit.maxhp-unit.hp)*increment/intervalCount);
                        if(val<=0){
                            val = 1;
                        }
                        changes.hp += val;
                    }
                    else if(buff.id==2){ // 自愈bufff
                        canBeTarget = true;
                        val = Math.round(unit.maxhp*increment/intervalCount);
                        if(val<=0){
                            val = 1;
                        }
                        changes.hp += val;
                    }
                    else if(buff.id==101){ // 消极bufff
                        canBeTarget = true;
                        // val = Math.round((unit.maxpow*increment*unit.dex/1000+buff.level*5)/intervalCount);
                        val = Math.round((unit.maxpow*.02*(buff.level+1)+increment)/intervalCount);
                        let buffObj = common.getBuffObj(unit,20); // 慧心bufff
                        if(buffObj){
                            if(val>buffObj.increment){
                                val = buffObj.increment;
                            }
                        }
                        if(val<=0){
                            val = 1;
                        }
                        changes.pow -= val;
                        wakeup = true; // 昏睡bufff
                    }
                    else if(buff.id==114){ // 干毒bufff
                        canBeTarget = true;
                        val = Math.round(((.3*increment+unit.maxhp*.00085*(increment+2))*5/intervalCount));
                        if(val<=0){
                            val = 1;
                        }
                        changes.hp -= val;
                        wakeup = true; // 昏睡bufff
                    }
                    else if(buff.id==115){ // 湿毒bufff
                        canBeTarget = true;
                        let powRate = 1-unit.pow/unit.maxpow;
                        val = Math.round(((.2*increment+unit.maxhp*.00085*(increment+2))*powRate*5/intervalCount));
                        if(val<=0){
                            val = 1;
                        }
                        changes.hp -= val;
                        wakeup = true; // 昏睡bufff
                    }
                    if(wakeup){
                        changes.removeCertainBuffs.push(getMatchList(CONFIG.buffs,[['id',118]])[0]); // 目标昏睡bufff
                    }
                }
                if(canBeTarget){
                    targets.push({
                        ...unit,
                        changes,
                    });
                }
            }
            this.numberEffectData = {
                targets,
            };
            this.settleEffect(this.numberEffectData);
        },
        perRound(){ // 每回合动作
            this.roundCount += 1;
        },
        unitRound(unit,resetActTime){ // 单位回合动作
            // console.log(`单位回合动作`,unit.name);
            this.inform = `${unit.name}`;
            let weapon = unit.weapon;
            let targets = [];
            let buffs = unit.buffs;
            let canBeTarget = 0;
            let changes = {
                hp: 0,
                pow: 0,
                awareness: 0,
                move: 0,
                str: 0,
                acr: 0,
                dex: 0,
                removeBuffs: [],
                removeCertainBuffs: [],
            };
            if(weapon&&weapon.lastAttackAction&&this.data.mode!=4){  // 非调整模式
                this.detailInform = `（按 A 键重复上一次攻击）`;
            }
            this.curUnits[this.curUnitIndex] = unit;

            // 检查buff
            for(let buff of buffs){ // 遍历该单位身上的 buff
                let { base, lvlup, level } = buff;
                let increment = base+lvlup*(level-1);
                let val = 0;
                if(buff.id==103){ // 内伤bufff
                    canBeTarget = true;
                    val = Math.round(1.5*(increment-1)+unit.maxhp*.001*increment);
                    if(val<=0){
                        val = 1;
                    }
                    changes.hp -= val;
                    changes.removeBuffs.push(getMatchList(CONFIG.buffs,[['id',118]])[0]); // 目标昏睡bufff
                }
            }
            // 设置所有单位的临时固有状态数组
            let allUnits = [...this.meTeam,...this.youTeam];
            for(let unit of allUnits){
                if(!unit.dead){
                    let newFixBuffs = [];
                    for(let buff of unit.buffs){
                        newFixBuffs.push({...buff});
                    }
                    unit.fixBuffs = newFixBuffs;
                }
            }

            if(canBeTarget){
                targets.push({
                    ...unit,
                    changes,
                });
            }
            this.numberEffectData = {
                targets,
            };
            this.settleEffect(this.numberEffectData);

            // 如果需要重置回合行动次数
            if(resetActTime){
                unit.actTimeIndex = unit.actTimePerRound;
            }
            // 如果已死亡
            if(unit.dead||unit.id==(this.escapeCaster||{}).id){
                this.endRound();
            }
            else{
                if(unit.isAI){
                    this.aiRound(unit);
                }
                else{
                    this.playerRound(unit);
                }
            }
        },
        playerRound(unit){ // 玩家操控单位回合动作
            let buffObj;
            this.state = 3;
            unit.cursor = 1;
            if(buffObj=common.getBuffObj(unit,107)){ // 沉默bufff
                this.banSkill = true;
            }
            else{
                this.banSkill = false;
            }
            let name = unit.name;
            unit.name = 'JK';
            unit.name = name;
        },
        aiRound(unit){ // 电脑操控单位回合动作
            let unitTeam = unit.side==2?this.meTeam:this.youTeam;
            let enemyTeam = unit.side==1?this.meTeam:this.youTeam;
            let commond = ai.genActionCommand(unit,unitTeam,enemyTeam);
            // 技能cd减少
            for(let cooldown of unit.cooldowns){
                if(cooldown&&cooldown.cd>0){
                    cooldown.cd -= 1;
                }
            }
            if(commond.actionType==0){ // 攻击
                let { attack, targets, attackAll, } = commond;
                // console.log(`敌方单位回合动作`,commond.attack.name,commond.attack,targets);
                this.execAttack(unit,attack,targets,attackAll);
            }
            else if(commond.actionType==1){ // 使用技能
                let { skill, targets, } = commond;
                // console.log(`敌方单位回合动作`,commond.skill.name,commond.skill,targets);
                let needCooldown = false; // 是否设置技能冷却时间
                let ocooldown = getMatchList(unit.cooldowns,[['id',skill.id]])[0];
                let buffObj=common.getBuffObj(unit,3); // 专注bufff
                let minCd = 3;
                let maxCd = 10;

                if(unit.isCreep&&!unit.isBoss&&!buffObj){ // 如果此单位为普通野怪，且没有专注效果，则设置技能冷却
                    needCooldown = true;
                }
                else if(unit.isBoss||!unit.isCreep){ // 如果此单位为BOSS或NPC
                    needCooldown = true;
                }
                if(arrContains(skill.effects,9)!=-1){ // 此技能拥有状态效果
                    minCd = 6;
                }
                let goodTrend = skill.trends[0]+skill.trends[1];
                let badTrend = skill.trends[2]+skill.trends[3];
                if(!unit.isCreep&&badTrend>goodTrend&&skill.trends[2]>skill.trends[3]){ // 非野怪，且此技能为主伤害技能，则不设置cd
                    needCooldown = false;
                }
                if(badTrend>goodTrend&&skill.absolute&&skill.awaShift>0){ // 此技能为主探知技能，则不设置cd
                    if(unit.isBoss){ // 如果是boss
                        minCd = 0;
                        maxCd = 2;
                    }
                    else{
                        needCooldown = false;
                    }
                }
                if(needCooldown){ // 设置技能冷却时间
                    if(ocooldown){
                        ocooldown.cd = r(minCd,maxCd);
                    }
                    else{
                        maxCd = 8;
                        unit.cooldowns.push({
                            id: skill.id,
                            cd: r(minCd,maxCd),
                        });
                    }
                }
                // console.log(`设置技能冷却时间`,skill.name,minCd);

                this.execSkill(unit,skill,targets);
            }
            else if(commond.actionType==2){ // 集中
                // console.log(`敌方单位回合动作`,'集中');
                this.execFocus();
            }
            else if(commond.actionType==3){ // 追踪
                // console.log(`敌方单位回合动作`,'追踪');
                this.execObserve();
            }
        },
        endRound(){ // 回合结束
            let curUnit = this.curUnits[this.curUnitIndex];
            curUnit.cursor = 2;
            curUnit.actTimeIndex -= 1;

            let name = curUnit.name;
            curUnit.name = 'JK';
            curUnit.name = name;

            this.setOptionState(1);
            this.inform = '';
            this.detailInform = '';
            this.detailInformFlashing = false;
            this.detailInformSkillName = '';
            this.effectData = {};
            this.numberEffectData = {};
            this.time_ani = 0;

            this.buffEditTarget = {};
            this.impactTargetIndex = 0;
            this.impactTargets = [];
            this.impactBuffCount = 0;
            this.impactNewTargets = [];
            this.buffEditors = [];
            this.buffSelections = [];
            this.popTransAni = false;

            // 清空动画效果
            let allUnits = [...this.meTeam,...this.youTeam];
            for(let unit of allUnits){
                if(!unit.dead){ // 清空所有单位的临时固有状态数组
                    unit.fixBuffs = [];
                }
                let uicRef = this.$refs[`uic-${unit.id}`];
                if(uicRef){
                    uicRef.resetAnimation();
                }
            }

            // 在非调整模式下，判断战斗是否结束
            if(this.data.mode!=4){
                this.checkWinner();
            }
            setTimeout(_=>{
                if(this.state!=5){
                    if(this.curUnits[this.curUnitIndex]&&this.curUnits[this.curUnitIndex].actTimeIndex>0){ // 如果当前回合的单位有剩余的行动次数，则当前单位行动
                        this.unitRound(this.curUnits[this.curUnitIndex]);
                    }
                    else{
                        this.curUnitIndex += 1;
                        curUnit = this.curUnits[this.curUnitIndex];
                        if(!curUnit){ // 本帧已没有剩余未行动单位
                            this.curUnitIndex = 0;
                            this.curUnits = [];
                            this.state = 2;
                        }
                        else{ // 本帧还有其他单位要行动
                            this.unitRound(curUnit,1);
                        }
                    }
                }
            },5);
        },

        onClickStartFight(){ // 点击【开始战斗】
            this.state = 2;
            let interval = CONFIG.battleSpeed;
            if(this.data.mode==4){ // 调整模式，速度加快
                interval = CONFIG.battleSpeed/25;
            }
            this.itv = setInterval(_=>{
                if(this.state!=3&&this.state!=4&&this.state!=5&&this.state!=7&&!this.pause){
                    this.perFrame();
                }
                else if(this.state==4){ // 播放动画
                    this.preAniFrame();
                }
            },interval);
        },
        onClickUnit(unit){ // 点击【单位】
            // console.log(`点击【单位】`,unit);
            if(unit.dead){
                return;
            }
            let curUnit = this.curUnits[this.curUnitIndex],
                attack = this.attack;
            if(this.state==3){
                if(this.optionState==3){ // 被选中为攻击对象
                    if(unit.dead) return;
                    if(unit.side==1){
                        this.execAttack(curUnit,attack,[unit],0);
                    }
                }
                else if(this.optionState==5){ // 被选中为技能释放对象
                    if((this.castingSkill.target==1&&unit.side==2)
                        ||(this.castingSkill.target==5&&unit.side==1)
                        ||this.castingSkill.target==9){
                        this.execSkill(this.curUnits[this.curUnitIndex],this.castingSkill,[unit]);
                    }
                }
            }
        },
        onClickAttack(){ // 点击【攻击】按钮
            let curUnit = this.curUnits[this.curUnitIndex];
            curUnit.weapon.banAttacks = this.calcBanAttacks(curUnit);
            this.setOptionState(2);
        },
        onClickAttackType(attack){ // 点击【攻击类型】按钮
            let curUnit = this.curUnits[this.curUnitIndex];
            if(curUnit&&curUnit.weapon.type==2&&!common.getBuffObj(curUnit,22)){ // 全体攻击
                this.execAttack(curUnit,attack,common.getAliveUnitArr(this.youTeam),1);
            }
            else{ // 单体攻击
                this.attack = attack;
                this.setOptionState(3);
            }
        },
        onClickSkill(){ // 点击【技能】按钮
            if(!this.banSkill){
                this.setOptionState(4);
            }
        },
        onClickUseSkill(skill){ // 点击【使用技能】按钮
            this.castingSkill = skill;
            if(skill.target==1||skill.target==5||skill.target==9){
                this.setOptionState(5);
            }
            else{
                let targets = [],
                    aliveMeTeam = common.getAliveUnitArr(this.meTeam),
                    aliveYouTeam = common.getAliveUnitArr(this.youTeam);
                switch(skill.target){
                    case 2: // 我方全体
                        targets = [...aliveMeTeam];
                    break;
                    case 3: // 我方随机单体
                        targets = [aliveMeTeam[r(0,aliveMeTeam.length-1)]];
                    break;
                    case 4: // 自己
                        targets = [this.curUnits[this.curUnitIndex]];
                    break;
                    case 6: // 敌方全体
                        targets = [...aliveYouTeam];
                    break;
                    case 7: // 敌方随机单体
                        targets = [aliveYouTeam[r(0,aliveYouTeam.length-1)]];
                    break;
                    case 8: // 敌我全体
                        targets = [...aliveMeTeam,...aliveYouTeam];
                    break;
                }
                this.execSkill(this.curUnits[this.curUnitIndex],skill,targets);
            }
        },
        onClickOther(){ // 点击【其他】按钮
            this.setOptionState(6);
        },
        onClickOtherAction(action){ // 点击【其他操作】按钮
            let id = action.id;
            switch(id){
                case 0: // 集中
                    this.execFocus();
                break;
                case 1: // 追踪
                    this.execObserve();
                break;
                case 2: // 置后
                    this.execLater();
                break;
                case 3: // 切换武器
                    this.execSwitch();
                break;
                case 4: // 逃跑
                    this.execEscape();
                break;
                case 5: // 认输
                    this.execLose();
                break;
            }
        },
        onClickCancel(){ // 点击【取消】按钮
            if(this.optionState==5){
                this.setOptionState(4);
            }
            else if(this.optionState==3){
                this.setOptionState(2);
            }
            else{
                this.setOptionState(1);
            }
        },
        onClickLeaveSceneMode(){ // 点击【离开调整模式】按钮
            this.state = 5;
            this.curUnits = [];
            this.curUnitIndex = 0;
            this.inform = '战斗结束';
            clearInterval(this.itv);
            this.itv = null;
            this.onEnd({
                type: 3,
                mode: 4,
                meTeam: this.meTeam,
            });
        },
        onClickSkipSceneMode(){ // 点击【跳过调整模式】按钮
            this.endRound();
        },
        onClickBuffEditor(buff){ // 点击【确认状态编辑】按钮
            if(this.popTransAni)
                return;
            if(buff.selected){ // 已经选择了，则移除
                buff.selected = false;
                this.buffSelections = removeFromList(buff.id,'id',this.buffSelections);
            }
            else{ // 未选择，则加入
                buff.selected = true;
                this.buffSelections.push(buff);
                if(this.buffSelections.length>=this.impactBuffCount){ // 确认
                    let target = this.impactTargets[this.impactTargetIndex];
                    let newTarget = {
                        ...target,
                        dmg: [0,0,0,0,0,0,],
                        changes: {
                            hp: 0,
                            pow: 0,
                            str: 0,
                            acr: 0,
                            dex: 0,
                            move: 0,
                            awareness: 0,
                            buffs: [],
                            removeBuffs: [],
                            removeCertainBuffs: [],
                        },
                    };
                    for(let tbuff of this.buffSelections){
                        newTarget.changes.removeBuffs.push(tbuff);
                    }
                    this.impactNewTargets.push(newTarget);
                    this.impactTargetIndex += 1;
                    if(this.impactTargets[this.impactTargetIndex]){
                        this.popTransAni = true;
                        setTimeout(_=>{
                            this.popTransAni = false;
                            this.execBuffImpact();
                        },.15*1000);
                    }
                    else{
                        this.execBuffImpact();
                    }
                }
            }
        },
        onClickEnd(){ // 点击【结束观看】按钮
            this.endBattle({
                type: 5,
            });
        },
        onAnimationEnd(){ // 当动画结束
            let callback = _ =>{
                if(this.state==4){
                    if(this.impactTargets.length<=0){
                        this.endRound();
                    }
                    else{
                        this.state = 7; // 进入状态编辑
                        this.execBuffImpact();
                    }
                }
            }
            if(this.data.mode!=4){ // 非调整模式下，判断战斗是否结束
                this.checkWinner(callback);
            }
            else{
                callback();
            }
        },
        onEffect(){ // 当动画效果触发结算
            let effectData = this.effectData;
            if(effectData.caster){
                this.settleEffect(effectData);
            }
        },
        onKeyupA(){ // 按下 A 键
            if(this.state==3&&this.data.mode!=4){ // 非调整模式
                let curUnit = this.curUnits[this.curUnitIndex];
                let weapon = curUnit.weapon;
                let lastAttackAction = weapon.lastAttackAction;
                if(curUnit&&!curUnit.isAI&&lastAttackAction){
                    let action = lastAttackAction;
                    let newTargets = [];
                    if(action.actionType==0){ // 上一次行动为攻击
                        if(action.attack.consume>curUnit.pow){ // 意志不够
                            this._alert(`意志不够`);
                        }
                        else{ // 调整目标数组
                            if(action.attackAll){ // 全体攻击
                                for(let youUnit of this.youTeam){
                                    if(!youUnit.dead){
                                        newTargets.push(youUnit);
                                    }
                                }
                            }
                            else{ // 单体攻击
                                let targetUnit = getMatchList(this.youTeam,[['id',action.targetIDs[0]]])[0];
                                if(targetUnit&&!targetUnit.dead){ // 对面存在上一次的攻击目标，且该目标存活
                                    newTargets.push(targetUnit);
                                }
                                else{ // 上一次的攻击目标已经不存在，则随机攻击另一个目标
                                    let availableTargets = common.getAliveUnitArr(this.youTeam);
                                    newTargets.push(availableTargets[r(0,availableTargets.length-1)]);
                                }
                            }
                            this.execAttack(curUnit,action.attack,newTargets,action.attackAll);
                        }
                    }
                }
            }
        },
        onKeyupT(){ // 按下 T 键
            if(this.state==3&&this.data.mode!=4){ // 非调整模式
                let curUnit = this.curUnits[this.curUnitIndex];
                this.execObserve();
            }
        },
        onKeyupF(){ // 按下 F 键
            if(this.state==3&&this.data.mode!=4){ // 非调整模式
                let curUnit = this.curUnits[this.curUnitIndex];
                this.execFocus();
            }
        },
        onKeyupB(){ // 按下 B 键
            if(this.state==3&&this.data.mode!=4){ // 非调整模式
                let curUnit = this.curUnits[this.curUnitIndex];
                this.execLater();
            }
        },
        onKeyupX(){ // 按下 X 键
            if(this.state==3&&this.data.mode!=4){ // 调整模式
                let curUnit = this.curUnits[this.curUnitIndex];
                this.execSwitch();
            }
        },
        onKeyupQ(){ // 按下 Q 键
            if(this.state==3&&this.data.mode==4){ // 调整模式
                this.onClickLeaveSceneMode();
            }
        },
        onKeyupS(){ // 按下 S 键
            if(this.state==3&&this.data.mode==4){ // 调整模式
                this.onClickSkipSceneMode();
            }
        },
        onKeyupEnter(){ // 按下回车键
            if(this.state==1){
                this.onClickStartFight();
            }
        },
        onKeyupNumber(num){ // 按下数字键
            if(this.state==3){
                let curUnit = this.curUnits[this.curUnitIndex];
                this.execFastSkill(num);
            }
        },

        settleEffect(effectData){ // 结算数据
            let deadCreepArray = []; // 本回合死亡敌人
            let changeValues = (ounit,changes) =>{ // 改变一个单位的数据
                let valueMap = ['hp','pow','awareness','move','str','acr','dex',];
                let attrValueMap = ['str','acr','dex',];
                let newChanges = {};
                let initMove = ounit.move;
                let initHp = ounit.hp;
                let doRemoveBuffs = (removeBuffs,removeCertainBuffs) =>{ // 移除buff
                    if(removeBuffs&&Array.isArray(removeBuffs)){ // 有条件移除buff
                        for(let buff of removeBuffs){ // 改变buff
                            if(getMatchList(ounit.fixBuffs,[['id',buff.id]])[0]){ // 如果是本回合开始时原本有的buff，则移除
                                ounit.buffs = removeFromList(buff.id,'id',ounit.buffs);
                                // 及时取消buff效果
                                if(this.isAttrBuff(buff)){
                                    let { valueName, factIndex, } = this.getAttrBuffData(buff);
                                    ounit[`${valueName}Facts`][factIndex] = 0;
                                }
                            }
                        }
                    }
                    if(removeCertainBuffs&&Array.isArray(removeCertainBuffs)){ // 无条件移除buff
                        for(let buff of removeCertainBuffs){ // 改变buff
                            ounit.buffs = removeFromList(buff.id,'id',ounit.buffs);
                            // 及时取消buff效果
                            if(this.isAttrBuff(buff)){
                                let { valueName, factIndex, } = this.getAttrBuffData(buff);
                                ounit[`${valueName}Facts`][factIndex] = 0;
                            }
                        }
                    }
                }
                for(let name of valueMap){
                    // 前段结算
                    let buffObj,cbuff;
                    newChanges[name] = (newChanges[name]||0)+(changes[name]||0);
                    if(name=='hp'){ // 生命值变化
                        // if(newChanges[name]<0&&(buffObj=common.getBuffObj(ounit,4))){ // 如果hp减少，且有护盾bufff
                        //     let { increment, buff, } = buffObj;
                        //     newChanges[name] -= Math.round(newChanges[name]*increment);
                        // }
                        if(newChanges[name]<0&&this.data.mode==2&&(buffObj=common.getBuffObj(ounit,117))){ // 厮杀模式下，如果hp减少，且战斗为生死对战，且有破财bufff
                            let { increment, buff, } = buffObj;
                            let hpChange = newChanges[name];
                            if((ounit.hp+hpChange)<0){
                                hpChange = -ounit.hp;
                            }
                            let goldDiff = Math.ceil(hpChange*increment);
                            if(ounit.isAI){ // 电脑操控单位
                                goldDiff *= -1;
                            }
                            this.bonusFix += goldDiff;
                            newChanges.gold = goldDiff;
                        }
                        if(newChanges[name]>0&&(buffObj=common.getBuffObj(ounit,119))){ // 如果hp增加，但有禁疗bufff
                            newChanges[name] = 0;
                        }
                    }
                    if(name=='pow'){ // 意志值变化
                        if(buffObj=common.getBuffObj(ounit,20)){ // 慧心bufff
                            if(-newChanges[name]>buffObj.increment){
                                newChanges[name] = -buffObj.increment;
                            }
                        }
                    }
                    if(name=='awareness'){ // 存在感变化
                        if(buffObj=common.getBuffObj(ounit,116)){ // 如果有锁定 bufff
                            if(newChanges[name]<0){
                                newChanges[name] = 0;
                            }
                        }
                    }
                    if(name=='move'){ // 行动力变化

                    }
                    if(name=='str'||name=='acr'||name=='dex'){ // 属性值变化

                    }
                    ounit[name] += newChanges[name];
                }
                // 后段结算
                for(let name of valueMap){ // 遍历所有数值，如果小于0则等于0
                    if(ounit[name]<0){
                        ounit[name] = 0;
                    }
                }
                let buffObj;
                if(buffObj=common.getBuffObj(ounit,18)&&ounit.hp<1){ // 不死bufff
                    ounit.hp = 1;
                }
                if(ounit.hp<=0&&this.data.mode!=4){ // 非调整模式下，如果死亡
                    if(this.data.mode==2&&ounit.isCreep){ // 厮杀模式下，如果死亡单位为敌人，检查额外奖励机制
                        deadCreepArray.push(ounit);
                        newChanges.bonusTips = [];
                        if(initMove>=CONFIG.bonus.move||initMove<=0){ // 破绽击杀奖励
                            this.bonusRatio += CONFIG.bonus.moveReward;
                            newChanges.bonusTips.push('burst');
                        }
                        let powRatio = ounit.pow/ounit.maxpow;
                        if(powRatio<=(CONFIG.bonus.pow/100)){ // 疲惫击杀奖励
                            let usedPowRatio = 1-powRatio;
                            this.bonusRatio += Math.round(usedPowRatio*CONFIG.bonus.powReward);
                            newChanges.bonusTips.push('timid');
                        }
                    }
                    ounit.dead = true;
                    ounit.pow = 0;
                    ounit.awareness = 0;
                    ounit.move = 0;
                }
                if(ounit.hp>ounit.maxhp){ // 如果生命值溢出
                    ounit.hp = ounit.maxhp;
                }
                if(ounit.pow>ounit.maxpow){ // 如果意志溢出
                    ounit.pow = ounit.maxpow;
                }
                if(ounit.move>CONFIG.maxMove){ // 如果行动力溢出
                    ounit.move = CONFIG.maxMove;
                }
                if(ounit.awareness>CONFIG.maxAwareness){ // 如果存在感溢出
                    ounit.awareness = CONFIG.maxAwareness;
                }
                // 添加buff
                if(changes.buffs&&Array.isArray(changes.buffs)){
                    for(let buff of changes.buffs){ // 改变buff
                        let obuffObj = common.getBuffObj(ounit,buff.id)||{};
                        let obuff = obuffObj.buff;
                        let cbuff = getMatchList(CONFIG.buffs,[['id',buff.id]])[0];
                        let activateBuff = _ =>{ // 启动buff效果
                            obuffObj = common.getBuffObj(ounit,buff.id)||{};
                            if(this.isAttrBuff(buff)){
                                let { valueName, factIndex, } = this.getAttrBuffData(buff);
                                ounit[`${valueName}Facts`][factIndex] = obuffObj.increment;
                            }
                            // 领队效果
                            // if(buff.id==14){
                            //     obuffObj = common.getBuffObj(ounit,14);
                            //     ounit.actTimePerRound = 2;
                            //     ounit.actTimeIndex = ounit.actTimePerRound;
                            // }
                            // 灵巧bufff
                            if(buff.id==14){
                                obuffObj = common.getBuffObj(ounit,14);
                                if(ounit.move<obuffObj.increment){
                                    ounit.move = obuffObj.increment;
                                }
                            }
                            // 祝福bufff
                            // if(buff.id==16){
                            //     doRemoveBuffs([],getMatchList(CONFIG.buffs,[['good',0]]));
                            // }
                        };
                        if(obuff){ // 已经有这种类型的buff，则补充等级
                            if(buff.level>obuff.level){
                                obuff.level = buff.level||1;
                                // if(obuff.base){ // 如果为【时效类】状态，还要补充持续时间
                                //     obuff.
                                // }
                            }
                            activateBuff();
                        }
                        else{ // 没有这种类型的buff，则添加一个新的buff
                            let buffObj = common.getBuffObj(ounit,16);
                            if(buff.id==118&&!ounit.canSleep){ // 昏睡bufff
                                this._alert(`无法昏睡`);
                            }
                            else if(buffObj&&!buff.good&&(buff.level<=buffObj.buff.level)){ // 祝福bufff
                                this._alert(`抵消负面状态`);
                            }
                            else{
                                let time = cbuff.fixTime;
                                if(!buff.base){ // 如果 buff 属于【时效类】状态
                                    time += buff.level*buff.lvlup;
                                }
                                // 根据状态抗性计算最终效果时间
                                let imm = ounit.imm||0;
                                if(imm<0){
                                    imm = 0;
                                }
                                else if(imm>100){
                                    imm = 100;
                                }
                                time = Math.round(time*(100-imm)/100);
                                let newBuff = {
                                    ...cbuff,
                                    level: buff.level||1,
                                    time,
                                };
                                ounit.buffs.push(newBuff);
                                if(buff.id==118){ // 昏睡bufff
                                    ounit.canSleep = false;
                                }
                                activateBuff();
                            }
                        }
                    }
                }
                // 移除buff
                doRemoveBuffs(changes.removeBuffs,changes.removeCertainBuffs);
                // 时效类状态（不死bufff和潜行bufff）时效影响
                let tmBuffs = [common.getBuffObj(ounit,12),common.getBuffObj(ounit,18)];
                if(changes.hp<0&&(tmBuffs[0]||tmBuffs[1])){
                    for(let buffObj of tmBuffs){
                        if(buffObj){
                            buffObj.buff.time -= Math.round(500+500*(-changes.hp/ounit.maxhp));
                            if(buffObj.buff.time<1){
                                buffObj.buff.time = 1;
                            }
                        }
                    }
                }

                for(let name of attrValueMap){ // 结算属性buff效果
                    let oValue = ounit[name],
                        nValue = common.calcAttrOffset(ounit,name);
                    ounit[name] = nValue;
                    if(ounit[name]<0){
                        ounit[name] = 0;
                    }
                    newChanges[name] = (newChanges[name]||0)+(nValue-oValue);
                }

                // BOSS 最小速度
                if(ounit.isBoss){
                    if(ounit.dex<ounit.level*10){
                        ounit.dex = ounit.level*10;
                    }
                }
                return {
                    unit: ounit,
                    changes: newChanges,
                };
            }
            let { targets, caster, } = effectData;
            let newTargets = [];
            let allTeam = [...this.meTeam,...this.youTeam];
            if(caster){ // 发动者
                let casterChanges = effectData.caster.changes;
                let casterUnit = getMatchList(allTeam,[['id',effectData.caster.id]])[0];
                let result = changeValues(casterUnit,casterChanges);
                casterUnit = result.unit;
                newTargets.push({
                    ...result.unit,
                    changes: result.changes,
                });
            }
            if(targets&&Array.isArray(targets)){ // 接收者们
                for(let target of targets){
                    let targetChanges = target.changes;
                    let targetUnit = getMatchList(allTeam,[['id',target.id]])[0];
                    let result = changeValues(targetUnit,targetChanges);
                    targetUnit = result.unit;
                    newTargets.push({
                        ...result.unit,
                        changes: result.changes,
                    });
                    if(!targetChanges.miss&&targetUnit.side==2&&caster&&caster.side==1&&effectData.actionType!=3){ // 取消逃跑状态
                        if(this.escapeTime>0){
                            this.escapeTime = 0;
                            this.maxEscapeTime = 0;
                            this.escapeCaster = {};
                            this._alert('逃跑被阻止');
                        }
                    }
                }
            }
            // 联合击杀奖励
            if(deadCreepArray.length>=2){
                for(let creep of deadCreepArray){
                    for(let newTarget of newTargets){
                        if(newTarget.id==creep.id){
                            newTarget.changes.bonusTips.push('rampage');
                        }
                    }
                }
                this.bonusRatio += CONFIG.bonus.rampageReward[deadCreepArray.length-2]||0;
            }
            this.playNumberAnimation(newTargets);
            this.effectData = {};
            this.numberEffectData = {};
        },
        isAttrBuff(buff){ // 判断buff是否属于属性加成buff
            return (buff.id==5||buff.id==6||buff.id==7||buff.id==8||buff.id==9||buff.id==10||buff.id==108||buff.id==111||buff.id==109||buff.id==112||buff.id==110||buff.id==113);
        },
        getAttrBuffData(buff){ // 获取属性加成buff数据
            let valueName = '', isDebuff = 0, factIndex = 0;
            if(buff.id==5||buff.id==8){ // 强力bufff + 暴筋bufff
                valueName = 'str';
                factIndex = buff.id==5?0:1;
            }
            if(buff.id==6||buff.id==9){ // 高精bufff + 清晰bufff
                valueName = 'acr';
                factIndex = buff.id==6?0:1;
            }
            if(buff.id==7||buff.id==10){ // 加速bufff + 迅捷bufff
                valueName = 'dex';
                factIndex = buff.id==7?0:1;
            }
            if(buff.id==108||buff.id==111){ // 弱力bufff + 虚弱bufff
                isDebuff = 1;
                valueName = 'str';
                factIndex = buff.id==108?2:3;
            }
            if(buff.id==109||buff.id==112){ // 低精bufff + 模糊bufff
                isDebuff = 1;
                valueName = 'acr';
                factIndex = buff.id==109?2:3;
            }
            if(buff.id==110||buff.id==113){ // 减速bufff + 迟钝bufff
                isDebuff = 1;
                valueName = 'dex';
                factIndex = buff.id==110?2:3;
            }
            return { valueName, isDebuff, factIndex, }
        },
        execAttack(curUnit,attack,targetArr,attackAll){ // 执行攻击：计算攻击结果&播放攻击动画
            let caster = {},
                targets = [],
                targetIDs = [],
                actionName = '',
                damage = 0,
                buffLevels = curUnit.weapon.buffLevels||[],
                rd = 0,awarnessChange,consume,buffObj,
                attackTypes = [];
            let weapon = curUnit.weapon;
            // 计算攻击者
            if(buffObj=common.getBuffObj(curUnit,12)){ // 如果有潜行bufff，则不提高存在感
                awarnessChange = 0;
            }
            else{
                awarnessChange = curUnit.fixawareness+(curUnit.weapon.fixawareness||0)+1000;
            }
            consume = common.calcAttackConsume(curUnit,attack.type);
            caster = {
                id: curUnit.id,
                changes: {
                    hp: 0,
                    pow: -consume,
                    move: 0,
                    awareness: awarnessChange,
                    buffs: [],
                },
                me: curUnit.side==2,
                side: curUnit.side,
            }
            // 出血bufff
            if(buffObj=common.getBuffObj(curUnit,102)){
                // val = Math.round(((.3*increment+unit.maxhp*.00025*(increment+2))*5/intervalCount));
                let bloodDamage = Math.round(curUnit.maxhp*buffObj.increment/10000+10*buffObj.buff.level*(buffObj.buff.level-1)+10);
                if(bloodDamage<=0){
                    bloodDamage = 1;
                }
                caster.changes.hp = (caster.changes.hp||0)-bloodDamage;
            }

            // 计算被攻击者
            for(let target of targetArr){
                let newTarget = {
                        ...target,
                        dmg: [0,0,0,0,0,0,],
                        changes: {
                            hp: 0,
                            pow: 0,
                            move: 0,
                            awareness: 0,
                            buffs: [],
                            removeBuffs: [],
                            removeCertainBuffs: [],
                        },
                    };
                damage = common.calcAttackDmg(curUnit,attack.type);
                let freakBuffObj = common.getBuffObj(target,17); // 狂暴bufff
                // 计算伤害
                if(r(1,CONFIG.maxAwareness)<=target.awareness||attack.type==3){ // 命中（存在感判定成功，或攻击类型为炮火）
                    newTarget.dmg[attack.type] = 1;
                    if(arrContains(attackTypes,attack.type)==-1){ // 统计攻击类型数组
                        attackTypes.push(attack.type);
                    }

                    let damageDiff = damage; // 伤害修正值
                    // 破绽bufff
                    if(buffObj=common.getBuffObj(newTarget,104)){
                        damageDiff += Math.round(damage*buffObj.increment);
                    }
                    // 护盾bufff
                    if(buffObj=common.getBuffObj(newTarget,4)){
                        damageDiff -= Math.round(damage*buffObj.increment);
                    }
                    damage = damageDiff;
                    newTarget.changes.hp = -damage;

                    // 特殊效果
                    let buffLevel = buffLevels[attack.type]||1;
                    if(attack.type==0){ // 割据攻击，添加【出血】【剧痛】buff
                        if(r(0,target.hp)<=damage){
                            newTarget.changes.buffs.push(this.genBuff(102,buffLevel));
                            newTarget.changes.buffs.push(this.genBuff(106,buffLevel));
                        }
                    }
                    else if(attack.type==1){ // 突刺攻击，添加【破绽】buff
                        if(r(0,target.hp)<=damage){
                            newTarget.changes.buffs.push(this.genBuff(104,buffLevel));
                        }
                    }
                    else if(attack.type==2){ // 钝击攻击，减少行动力
                        if(!freakBuffObj&&r(0,target.hp)<=damage){ // 如果被攻击者没有狂暴bufff
                            newTarget.changes.move -= CONFIG.moveDamageFromPunch[buffLevel-1]||0;
                        }
                    }
                    else if(attack.type==3){ // 炮火攻击，增加存在感
                        if(r(0,target.hp)<=damage){
                            newTarget.changes.awareness += CONFIG.awarenessDamageFromFire[buffLevel-1]||0;
                        }
                    }
                    else if(attack.type==4){ // 射击攻击，提高伤害
                        if(r(0,target.hp)<=damage){
                            newTarget.changes.hp -= Math.round(damage*(CONFIG.hpDamageFromShot[buffLevel-1]||0)/10000);
                            newTarget.changes.headshot = 1;
                        }
                    }
                    else if(attack.type==5){ // 抽击攻击，降低意志
                        if(r(0,target.hp)<=damage){
                            newTarget.changes.pow -= CONFIG.powDamageFromStab[buffLevel-1]||0;
                        }
                    }

                    // 反伤bufff
                    if(buffObj=common.getBuffObj(newTarget,13)){
                        let val = Math.round(damage*buffObj.increment);
                        if(val<=0){
                            val = 1;
                        }
                        caster.changes.hp -= val;
                    }
                    // 嗜血bufff
                    if(buffObj=common.getBuffObj(curUnit,15)){
                        let val = Math.round(Math.sqrt(damage)*buffObj.increment);
                        if(val>damage){
                            val = damage;
                        }
                        if(val<=0){
                            val = 1;
                        }
                        caster.changes.hp += val;
                    }
                    // 战气bufff
                    if(buffObj=common.getBuffObj(curUnit,19)){
                        let val = Math.round(target.maxpow*.0075+buffObj.increment);
                        if(val<=0){
                            val = 1;
                        }
                        newTarget.changes.pow -= val;
                    }
                    // 狂暴bufff
                    if(freakBuffObj){
                        let val = Math.round(freakBuffObj.increment);
                        if(val<=0){
                            val = 100;
                        }
                        newTarget.changes.move += val; // 受到攻击后增长行动力
                    }
                }
                else{ // 未命中
                    newTarget.changes.miss = 1;
                }
                newTarget.changes.removeBuffs.push(getMatchList(CONFIG.buffs,[['id',118]])[0]); // 昏睡bufff
                targets.push(newTarget);
                targetIDs.push(newTarget.id);
            }
            // 行动名
            if(attackAll){ // 对全体
                actionName = `发动「${attack.name}」`;
            }
            else{ // 对单人
                actionName = `对${targetArr[0].name}进行「${attack.name}」攻击`;
            }
            // 设置效果数据
            this.effectData = {
                caster: {
                    ...curUnit,
                    ...caster,
                },
                targets,
                actionType: 1,
            }
            // 播放动画
            this.playAnimation(caster, targets, actionName, attackTypes);
            // 设置行动记忆
            if(weapon){
                weapon.lastAttackAction = {
                    actionType: 0,
                    targetIDs,
                    attack,
                    attackAll,
                }
            }
            // curUnit.lastAction = {
            //     actionType: 0,
            //     targets,
            //     attack,
            //     attackAll,
            // }
        },
        execSkill(curUnit,skill,targetArr){ // 执行技能：计算技能结果&播放技能动画
            let caster = {};
            let targets = [];
            let actionName = '';
            let buffLevels = curUnit.weapon.buffLevels||[];
            let rd = 0,awarnessChange,consume,buffObj;
            let attackTypes = [];
            // 计算攻击者
            let targetArrHasEnemy = false;
            for(let unit of targetArr){
                if(unit.side!=curUnit.side){ // 如果目标中存在与施法者敌对的单位
                    targetArrHasEnemy = true;
                    break;
                }
            }
            if(targetArrHasEnemy){ // 如果目标单位中有敌人
                if(buffObj=common.getBuffObj(curUnit,12)){ // 如果有潜行bufff
                    awarnessChange = 0;
                }
                else{
                    awarnessChange = curUnit.fixawareness+(skill.fixawareness||0)+(curUnit.weapon.fixawareness||0);
                }
            }
            consume = common.calcSkillConsume(curUnit,skill);
            caster = {
                ...curUnit,
                changes: {
                    hp: 0,
                    pow: -consume,
                    awareness: awarnessChange,
                    buffs: [],
                    removeBuffs: [],
                    removeCertainBuffs: [],
                },
            }
            // 出血bufff
            if((arrContains(skill.effects,1)!=-1)&&(buffObj=common.getBuffObj(curUnit,102))){
                let bloodDamage = Math.round(curUnit.maxhp*buffObj.increment/10000+10*buffObj.buff.level*(buffObj.buff.level-1)+10);
                if(bloodDamage<=0){
                    bloodDamage = 1;
                }
                caster.changes.hp = (caster.changes.hp||0)-bloodDamage;
            }

            // 计算被攻击者
            for(let target of targetArr){ // 遍历每个技能释放对象
                let newTarget = {
                        ...target,
                        dmg: [0,0,0,0,0,0,],
                        changes: {
                            hp: 0,
                            pow: 0,
                            str: 0,
                            acr: 0,
                            dex: 0,
                            move: 0,
                            awareness: 0,
                            buffs: [],
                            removeBuffs: [],
                            removeCertainBuffs: [],
                        },
                    };
                let wakup = false; // 昏睡bufff
                let freakBuffObj = common.getBuffObj(target,17); // 狂暴bufff
                // 计算效果
                if((target.side==caster.side)||skill.absolute||r(1,CONFIG.maxAwareness)<=target.awareness){ // 命中
                    let shuffleBuffs = [];
                    let removeBuffs = [];
                    for(let effect of skill.effects){ // 遍历技能的每个效果
                        switch(effect){
                            case 1: // 伤害技能
                                newTarget.dmg = [...skill.dmg];
                                let hands = caster.weapon;
                                let ratio = 0;
                                let damage = 0;
                                for(let i=0;i<skill.dmg.length;i++){ // 遍历每种攻击类型
                                    if(skill.dmg[i]>0){
                                        if(arrContains(attackTypes,i)==-1){ // 统计攻击类型数组
                                            attackTypes.push(i);
                                        }
                                        ratio = common.calcDmgRatio(caster,i);
                                        let damageInc = skill.dmg[i];
                                        if(hands.dmg){ // 发动者有武器
                                            let handsDmgAddition = hands.dmg[i]; // 武器的加成伤害
                                            let buffObj1 = common.getBuffObj(caster,11)||{}; // 点燃bufff
                                            let buff1 = buffObj1.buff;
                                            let increment1 = buffObj1.increment;
                                            if(buff1&&hands.dmg[i]>0){
                                                let infact = hands.dmg[i]*increment1;
                                                if(infact<1){
                                                    infact = 1;
                                                }
                                                handsDmgAddition += infact;
                                            }
                                            let buffObj2 = common.getBuffObj(caster,106)||{}; // 剧痛bufff
                                            let buff2 = buffObj2.buff;
                                            let increment2 = buffObj2.increment;
                                            if(buff2&&hands.dmg[i]>0){
                                                let infact = hands.dmg[i]*increment2;
                                                if(infact<1){
                                                    infact = 1;
                                                }
                                                handsDmgAddition -= infact;
                                            }
                                            damageInc += handsDmgAddition;
                                        }
                                        damageInc = Math.ceil(ratio*damageInc/25+damageInc/5);
                                        damage += damageInc;
                                        // 添加攻击类型效果
                                        let buffLevel = buffLevels[i]||1;
                                        if(i==0){ // 割据攻击，添加【出血】【剧痛】buff
                                            if(r(0,target.hp)<=damage){
                                                newTarget.changes.buffs.push(this.genBuff(102,buffLevel));
                                                newTarget.changes.buffs.push(this.genBuff(106,buffLevel));
                                            }
                                        }
                                        else if(i==1){ // 突刺攻击，添加【破绽】buff
                                            if(r(0,target.hp)<=damage){
                                                newTarget.changes.buffs.push(this.genBuff(104,buffLevel));
                                            }
                                        }
                                        else if(i==2){ // 钝击攻击，减少行动力
                                            if(!freakBuffObj&&r(0,target.hp)<=damage){ // 如果被攻击者没有狂暴bufff
                                                newTarget.changes.move -= CONFIG.moveDamageFromPunch[buffLevel-1]||0;
                                            }
                                        }
                                        else if(i==3){ // 炮火攻击，增加存在感
                                            if(r(0,target.hp)<=damage){
                                                newTarget.changes.awareness += CONFIG.awarenessDamageFromFire[buffLevel-1]||0;
                                            }
                                        }
                                        else if(i==4){ // 射击攻击，提高伤害
                                            if(r(0,target.hp)<=damage){
                                                newTarget.changes.hp -= Math.round(damage*(CONFIG.hpDamageFromShot[buffLevel-1]||0)/10000);
                                                newTarget.changes.headshot = 1;
                                            }
                                        }
                                        else if(i==5){ // 抽击攻击，降低意志
                                            if(r(0,target.hp)<=damage){
                                                newTarget.changes.pow -= CONFIG.powDamageFromStab[buffLevel-1]||0;
                                            }
                                        }
                                    }
                                }

                                let damageDiff = damage; // 伤害修正值
                                // 破绽bufff
                                if(buffObj=common.getBuffObj(newTarget,104)){
                                    let val = Math.round(damage*buffObj.increment);
                                    if(val<=0){
                                        val = 1;
                                    }
                                    damageDiff += val;
                                }
                                // 护盾bufff
                                if(buffObj=common.getBuffObj(newTarget,4)){
                                    let val = Math.round(damage*buffObj.increment);
                                    if(val<=0){
                                        val = 1;
                                    }
                                    damageDiff -= val;
                                }
                                damage = damageDiff;
                                // 反伤bufff
                                if(buffObj=common.getBuffObj(target,13)){
                                    let val = Math.round(damage*buffObj.increment);
                                    if(val<=0){
                                        val = 1;
                                    }
                                    caster.changes.hp -= val;
                                }
                                // 嗜血bufff，且目标不是队友
                                if(caster.side!=target.side&&(buffObj=common.getBuffObj(curUnit,15))){
                                    let val = Math.round(Math.sqrt(damage)*buffObj.increment);
                                    if(val>damage){
                                        val = damage;
                                    }
                                    if(val<=0){
                                        val = 1;
                                    }
                                    caster.changes.hp += val;
                                }
                                // 战气bufff，且目标不是队友
                                if(caster.side!=target.side&&(buffObj=common.getBuffObj(curUnit,19))){
                                    let val = Math.round(target.maxpow*.0075+buffObj.increment);
                                    if(val<=0){
                                        val = 1;
                                    }
                                    newTarget.changes.pow -= val;
                                }
                                // 狂暴bufff
                                if(freakBuffObj){
                                    let val = Math.round(freakBuffObj.increment);
                                    if(val<=0){
                                        val = 100;
                                    }
                                    newTarget.changes.move += val; // 受到攻击后增长行动力
                                }
                                newTarget.changes.hp -= damage;
                                wakup = true; // 昏睡bufff
                            break;
                            case 2: // 治疗技能
                                newTarget.changes.hp += skill.cure;
                                if(skill.cureRate){
                                    newTarget.changes.hp += Math.round(target.maxhp*skill.cureRate/100);
                                }
                            break;
                            case 3: // 意志影响
                                newTarget.changes.pow += skill.powShift;
                                wakup = true; // 昏睡bufff
                            break;
                            case 4: // 力量影响
                                newTarget.changes.str += skill.attrShift;
                                wakup = true; // 昏睡bufff
                            break;
                            case 5: // 精准影响
                                newTarget.changes.acr += skill.attrShift;
                                wakup = true; // 昏睡bufff
                            break;
                            case 6: // 速度影响
                                newTarget.changes.dex += skill.attrShift;
                                wakup = true; // 昏睡bufff
                            break;
                            case 7: // 行动力影响
                                if(!freakBuffObj||skill.moveShift>0){ // 如果没有狂暴bufff，对行动力产生影响
                                    newTarget.changes.move += skill.moveShift;
                                }
                                wakup = true; // 昏睡bufff
                            break;
                            case 8: // 存在感影响
                                newTarget.changes.awareness += skill.awaShift;
                            break;
                            case 9: // 添加 buff
                                let buffs = Array.from(skill.buffs,(buffId,index)=>{
                                    let buff = this.genBuff(buffId,skill.buffLevels[index]);
                                    return buff;
                                });
                                for(let buff of buffs){
                                    newTarget.changes.buffs.push(buff);
                                    if(buff.id!=1&&buff.id!=2&&buff.id!=116&&buff.id!=118&&buff.id!=120){ // 非急救bufff、自愈bufff、锁定bufff、昏睡bufff和灾厄bufff，则唤醒
                                        wakup = true; // 昏睡bufff
                                    }
                                }
                            break;
                            case 10: // 解除 n 个负面状态
                                if(caster.isAI){ // 电脑
                                    let targetOriginBadBuffs = getMatchList(target.buffs,[['good',0]]);
                                    shuffleBuffs = shuffle(targetOriginBadBuffs);
                                    removeBuffs = [];
                                    for(let bi=0;bi<skill.badImpact;bi++){
                                        let buff = shuffleBuffs[bi];
                                        if(buff){
                                            removeBuffs.push(buff);
                                        }
                                    }
                                    wakup = true; // 昏睡bufff
                                }
                                else{ // 玩家
                                    this.impactTargets.push(target);
                                    this.impactBuffType = 0;
                                    this.impactBuffCount = skill.badImpact;
                                }
                            break;
                            case 11: // 解除 n 个正面状态
                                if(caster.isAI){ // 电脑
                                    let targetOriginGoodBuffs = getMatchList(target.buffs,[['good',1]]);
                                    shuffleBuffs = shuffle(targetOriginGoodBuffs);
                                    removeBuffs = [];
                                    for(let bi=0;bi<skill.goodImpact;bi++){
                                        let buff = shuffleBuffs[bi];
                                        if(buff){
                                            removeBuffs.push(buff);
                                        }
                                    }
                                    wakup = true; // 昏睡bufff
                                }
                                else{ // 玩家
                                    this.impactTargets.push(target);
                                    this.impactBuffType = 1;
                                    this.impactBuffCount = skill.goodImpact;
                                }
                            break;
                        }
                    }
                    for(let bi=0;bi<removeBuffs.length;bi++){
                        newTarget.changes.removeBuffs.push(removeBuffs[bi]);
                    }
                }
                else{ // 未命中
                    newTarget.changes.miss = 1;
                    wakup = true; // 昏睡bufff
                }
                // 昏睡bufff
                if(wakup){
                    newTarget.changes.removeBuffs.push(getMatchList(CONFIG.buffs,[['id',118]])[0]);
                }
                targets.push(newTarget);
            }
            // 设置效果数据
            this.effectData = {
                caster: {
                    ...curUnit,
                    ...caster,
                },
                targets,
                actionType: 2,
            }
            // 播放动画
            this.playAnimation(caster, targets, '使用', attackTypes, skill.name ,skill);
        },
        execFocus(){ // 执行【集中】
            let unit = this.curUnits[this.curUnitIndex];
            if(unit.pow<CONFIG.powRechargeTreshold){
                let targets = [{...unit,changes:{
                    pow: CONFIG.powRechargeValue,
                }}];
                this.numberEffectData = {
                    targets,
                }
                this.settleEffect(this.numberEffectData);
                if(unit.isAI){
                    this._alert(`${unit.name} 集中了精神`);
                }
            }
            else{
                if(unit.isAI){
                    this._alert(`${unit.name} 跳过回合`);
                }
            }
            this.endRound();
        },
        execObserve(){ // 执行【追踪】
            let curUnit = this.curUnits[this.curUnitIndex];
            if(curUnit.pow>=CONFIG.observeConsume){
                let enemyTeam = curUnit.side==1?this.meTeam:this.youTeam;
                let maxAwareness = 0;
                let targetUnits = [];
                let target;
                for(let unit of enemyTeam){
                    if(unit.awareness>maxAwareness){
                        maxAwareness = unit.awareness;
                    }
                }
                for(let unit of enemyTeam){
                    if(!unit.dead&&unit.awareness>=maxAwareness){
                        targetUnits.push(unit);
                    }
                }
                target = targetUnits[r(0,targetUnits.length-1)];
                if(target){
                    let caster = {
                        ...curUnit,
                        changes: {
                            pow: -CONFIG.observeConsume,
                        },
                    };
                    let targets = [{
                        ...target,
                        changes: {
                            awareness: curUnit.isBoss?(CONFIG.observeAwarenessIncrement*2):CONFIG.observeAwarenessIncrement,
                            search: 1,
                        }
                    }];
                    this.effectData = {
                        caster,
                        targets,
                        actionType: 3,
                    }
                    // 播放追踪动画
                    this.playAnimation(caster,targets,'进行追踪');
                }
            }
            else{
                this._alert(`意志不够`);
            }
        },
        execLater(){ // 执行【置后】
            let unit = this.curUnits[this.curUnitIndex];
            let move = CONFIG.laterMove-unit.move;
            let targets = [{...unit,changes:{
                move,
            }}];
            this.numberEffectData = {
                targets,
            }
            this.settleEffect(this.numberEffectData);
            this._alert(`${unit.name} 置后了`);
            this.endRound();
        },
        execSwitch(){ // 执行【切换武器】
            let unit = this.curUnits[this.curUnitIndex];
            if(unit.pow<CONFIG.switchConsume){
                this._alert(`意志不够`);
                return;
            }
            let move = CONFIG.switchWeaponMove-unit.move;
            let oawareness = unit.awareness;
            let targets = [{...unit,changes:{
                move,
                pow: -CONFIG.switchConsume,
                // removeBuffs: [{id:106},],
            }}];
            this.numberEffectData = {
                targets,
            }

            // 切换武器
            let vice = cloneObj(unit.viceWeapon);
            unit.viceWeapon = cloneObj(unit.weapon);
            unit.weapon = vice;
            unit.switchCount += 1;
            // 删除记忆行动
            // unit.lastAction = null;
            // 属性调整
            let finalData = common.calcRoleFinalData(unit);
            unit.hp = finalData.hp;
            unit.maxhp = finalData.maxhp;
            unit.pow = finalData.pow;
            unit.maxpow = finalData.maxpow;
            unit.fixstr = finalData.fixstr;
            unit.fixacr = finalData.fixacr;
            unit.fixdex = finalData.fixdex;
            let predict_awareness = common.calcAwareness(unit);
            // 计算切换武器带来的存在感变动
            if(predict_awareness>CONFIG.maxAwareness){
                predict_awareness = CONFIG.maxAwareness;
            }
            if(predict_awareness<0){
                predict_awareness = 0;
            }
            if(predict_awareness<oawareness){
                predict_awareness = oawareness;
            }
            let awarenessDiff = predict_awareness-oawareness;
            if(awarenessDiff!=0){ // 如果存在感变化值不为 0
                let buffObj1 = common.getBuffObj(unit,12); // 潜行bufff
                let buffObj2 = common.getBuffObj(unit,116); // 锁定bufff
                if(buffObj1&&awarenessDiff>0){ // 如果有潜行状态，且原本的存在感变化为正值，则不改变存在感

                }
                else if(buffObj2&&awarenessDiff<0){ // 如果有锁定状态，且原本的存在感变化为负值，则不改变存在感

                }
                else{
                    targets[0].changes.awareness = awarenessDiff;
                }
            }

            // 同步全局数据 TODO

            this.settleEffect(this.numberEffectData);
            this._alert(`${unit.name} 切换了武器`);
            this.endRound();
        },
        execEscape(){ // 执行【逃走】
            let aliveCount = common.getAliveUnitArr(this.meTeam).length;
            this.escapeTime = CONFIG.escapeTime*aliveCount;
            this.maxEscapeTime = this.escapeTime;
            this.escapeCaster = this.curUnits[this.curUnitIndex];
            if(this.escapeCaster.pow<CONFIG.escapeConsume){
                this._alert(`意志不够`);
                return;
            }

            // 计算消耗
            let targets = [{...this.escapeCaster,changes:{
                pow: -CONFIG.escapeConsume,
            }}];
            this.numberEffectData = {
                targets,
            }
            this.settleEffect(this.numberEffectData);

            this.endRound();
        },
        execLose(){ // 执行【认输】
            this.endBattle({
                type: 4
            });
        },
        execFastSkill(num){ // 执行快速技能
            let unit = this.curUnits[this.curUnitIndex];
            let skill = unit.skills[num-1];
            if(skill){
                let consume = common.calcSkillConsume(unit,skill);
                if(consume<=unit.pow){
                    this.onClickUseSkill(skill);
                }
                else{
                    this._alert(`意志不够`);
                }
            }
        },
        genBuff(id,level){ // 生成buff数据
            let cbuff = getMatchList(CONFIG.buffs,[['id',id]])[0];
            return {
                ...cbuff,
                level,
                time: cbuff.fixTime,
            }
        },
        execBuffImpact(){ // 显示状态编辑弹窗
            this.buffEditTarget = {};
            let target = this.impactTargets[this.impactTargetIndex];
            if(target){
                let skip = false;
                let buffs = target.buffs;
                let goodBuffs = getMatchList(buffs,[['good',1]]);
                let badBuffs = getMatchList(buffs,[['good',0]]);
                if(this.impactBuffType==1){ // 当前解除的是正面状态
                    if(goodBuffs.length>this.impactBuffCount){ // 本单位拥有的正面状态数过多，需手动选择
                        this.buffEditTarget = target;
                        this.buffEditors = goodBuffs;
                        this.buffSelections = [];
                    }
                    else{
                        skip = true;
                    }
                }
                else{ // 当前解除的是负面状态
                    if(badBuffs.length>this.impactBuffCount){ // 本单位拥有的负面状态数过多，需手动选择
                        this.buffEditTarget = target;
                        this.buffEditors = badBuffs;
                        this.buffSelections = [];
                    }
                    else{
                        skip = true;
                    }
                }
                if(skip){ // 不需要手动选择，自动解除
                    let newTarget = {
                        ...target,
                        dmg: [0,0,0,0,0,0,],
                        changes: {
                            hp: 0,
                            pow: 0,
                            str: 0,
                            acr: 0,
                            dex: 0,
                            move: 0,
                            awareness: 0,
                            buffs: [],
                            removeBuffs: [],
                            removeCertainBuffs: [],
                        },
                    };
                    newTarget.changes.removeBuffs = this.impactBuffType==1?goodBuffs:badBuffs;
                    this.impactNewTargets.push(newTarget);
                    this.impactTargetIndex += 1;
                    this.execBuffImpact();
                }
            }
            else{
                // 结算所有受影响的目标单位
                this.numberEffectData = {
                    targets: this.impactNewTargets,
                }
                this.settleEffect(this.numberEffectData);
                this.endRound();
            }
        },
        playAnimation(caster={},targets=[],actionName='?',attackTypes=[], flashingInform,skill){ // 播放动画
            this.state = 4;
            this.detailInform = actionName;
            if(flashingInform){
                this.detailInformSkillName = flashingInform;
                if(attackTypes.length>0&&(caster.side!=targets[0].side||skill.target==8)){
                    this.detailInformFlashing = true;
                }
            }
            setTimeout(_=>{ // 播放动画
                let uicRef,targetsContainCaster = 0;
                for(let target of targets){
                    uicRef = this.$refs[`uic-${target.id}`];
                    if(uicRef){
                        if(target.id==caster.id){
                            targetsContainCaster = 1;
                            uicRef.playAnimation(target,2);
                        }
                        else{
                            uicRef.playAnimation(target,1);
                        }
                    }
                }
                if(!targetsContainCaster){
                    uicRef = this.$refs[`uic-${caster.id}`];
                    if(uicRef){
                        uicRef.playAnimation(caster,0);
                    }
                }
                // 播放音效
                // console.log(`播放音效`,attackTypes);
                setTimeout(_=>{
                    let ind = 0;
                    this.itv_sound = setInterval(_=>{
                        if(ind>=attackTypes.length){
                            clearInterval(this.itv_sound);
                            this.itv_sound = null;
                        }
                        else{
                            if(attackTypes[ind]||attackTypes[ind]==0){
                                this.playSound(attackTypes[ind]);
                            }
                            ind++;
                        }
                    },100);
                },800);
            },1);
        },
        playNumberAnimation(targets=[]){ // 播放临时动画
            setTimeout(_=>{
                let uicRef;
                for(let target of targets){
                    uicRef = this.$refs[`uic-${target.id}`];
                    if(uicRef){
                        uicRef.playNumberAnimation(target,1);
                    }
                }
            },1);
        },
        checkWinner(callback){ // 判断战斗是否结束
            let youAliveTeam = common.getAliveUnitArr(this.youTeam);
            let meAliveTeam = common.getAliveUnitArr(this.meTeam);
            let resultData = {};
            if(meAliveTeam.length<=0){ // 我方全员退战
                resultData.type = 1;
                this.endBattle(resultData);
            }
            else if(youAliveTeam.length<=0){ // 敌方全员退战
                resultData.type = 0;
                this.endBattle(resultData);
            }
            else{
                callback&&callback();
            }
        },
        endBattle(resultData){ // 结束战斗
            this.state = 5;
            this.curUnits = [];
            this.curUnitIndex = 0;
            this.inform = '战斗结束';
            this.detailInform = '';
            this.detailInformFlashing = false;
            this.detailInformSkillName = '';
            clearInterval(this.itv);
            this.itv = null;
            this.detailInform = ['获胜','失败','逃跑成功','结束调整','认输','观战结束'][resultData.type];
            resultData = {
                ...resultData,
                cell: this.data.cell,
                map: this.data.map,
                mode: this.data.mode,
                meTeam: this.meTeam,
                youTeam: this.youTeam,
            }
            if(this.data.mode==2){ // 如果是厮杀模式
                resultData.bonusRatio = this.bonusRatio;
                resultData.bonusFix = this.bonusFix;
            }
            setTimeout(_=>{
                this.onEnd(resultData);
            },DEBUG?100:2000);
            this._alert(`${this.detailInform}`);
        },
        showBuffTip(buff){ // 显示状态提示
            this.buffTip = buff.desc;
        },
        hideBuffTip(){ // 躲避状态提示
            this.buffTip = ``;
        },
        _alert(tip){ // 弹出框
            let index = this.alertMsgs.length;
            this.alertMsgs.push(tip);
            setTimeout(_=>{
                this.alertMsgs[index] = '';
            },2000);
        },

        onClickTest(type){
            this.endBattle({
                type,
            });
        },
    },
    components:{
        Bar1,
        Bar2,
        BuffIcon,
        UnitIcon,
        SkillBoard,
        AttackBoard,
        OtherBoard,
    },
};
</script>
<style scoped>
    @import '../style/animation.css';
    .scenepage{
        position: relative;
        background-color: #fff;
        overflow: hidden;
    }
    .block{
        position: relative;
        /* border: 1px solid black; */
    }
    .cover{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 1000;
        background-color: #000;
    }
    .alert{
        position: absolute;
        top: 23%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 800px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        white-space: nowrap;
        word-break: keep-all;
        z-index: 1006;
        color: #fff;
        font-size: 28px;
        background-image: linear-gradient(to right, rgba(0,0,0,0), #000, rgba(0,0,0,0));
        animation: fadeout 2s linear forwards;
    }
    @keyframes fadeout {
        50%{
            transform: translateY(-15%);
            opacity: 1;
        }
        99%{
            transform: translateY(-30%);
            opacity: 0;
        }
        100%{
            transform: scale(0);
            opacity: 0;
        }
    }

    .btn:hover{
        opacity: .8;
    }
    .top-block{
        padding-top: 20px;
        height: 300px;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
    }
    .mid-block{
        position: relative;
        height: 280px;
    }
    .bottom-block{
        height: 300px;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
    }
    .time-bar{
        position: absolute;
        left: 0;
        right: 0;
        top: 4px;
        margin: 0 auto;
    }
    .escape-bar{
        position: absolute;
        left: 0;
        right: 0;
        top: 90px;
        margin: 0 auto;
    }
    .btn-start{
        position: absolute;
        left: 0;
        right: 0;
        top: 40px;
        margin: 0 auto;
        width: 250px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 40px;
        font-weight: bold;
        font-style: italic;
        white-space: nowrap;
        word-break: keep-all;
    }
    .panel{
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        text-align: center;
        opacity: 0;
        animation: .3s fadeIn forwards;
    }
    @keyframes fadeIn {
        to{
            opacity: 1;
        }
    }
    .inform{
        top: 40px;
        width: 250px;
        height: 50px;
        line-height: 50px;
        font-size: 22px;
    }
    .detail-inform{
        top: 90px;
        width: 800px;
        height: 25px;
        line-height: 18px;
        font-size: 14px;
        color: #444;
    }
    .detail-inform .skill-name{
        min-width: 120px;
        min-height: 30px;
        display: inline-block;
        font-weight: bold;
        font-style: italic;
        font-size: 18px;
        color: MediumSlateBlue;
        animation: skill .8s ease-out forwards;

    }
    .detail-inform .flashing-skill{
        left: 8px;
        top: 10px;
        display: inline-block;
        position: absolute;
        font-weight: bold;
        font-style: italic;
        width: 120px;
        white-space: nowrap;
        word-break: keep-all;
        font-size: 30px;
        animation: flashing .85s ease-out forwards;
    }
    .flashing-left,.flashing-right{
        left: 8px;
        top: 10px;
        display: inline-block;
        font-size: 30px;
        width: 120px;
        white-space: nowrap;
        word-break: keep-all;
        position: absolute;
    }
    .flashing-left{
        animation: flashingToLeft .7s ease-out forwards;
    }
    .flashing-right{
        color: MediumSlateBlue;
        animation: flashingToRight .7s ease-out forwards;
    }
    @keyframes skill {
        50% {
            opacity: .3;
            transform: scale(1.2);
        }
        100% {
            opacity: 1;
            transform: scale(1.1);
        }
    }
    @keyframes flashing {
        18% {
            opacity: .3;
            transform: scale(5);
        }
        24% {
            opacity: .3;
            transform: scale(4.5);
            color: #e81313;
        }
        35% {
            opacity: 1;
            transform: scale(1);
            color: #000;
        }
        50% {
            color: #e81313;
        }
        60% {
            color: MediumSlateBlue;
        }
        100% {
            color: #000;
        }
    }
    @keyframes flashingToLeft {
        10% {
            opacity: .5;
            transform: translate(-5%,-5.6%);
        }
        20% {
            opacity: .8;
            transform: translate(-4%,-12%);
        }
        30% {
            opacity: .5;
            transform: translate(-5.5%,-6.8%);
        }
        40% {
            opacity: .5;
            transform: translate(-4.2%,-18%);
        }
        50% {
            opacity: .8;
            transform: translate(-5.2%,-15.6%);
        }
        60% {
            opacity: .5;
            transform: translate(-3.6%,-4.5%);
        }
        80% {
            opacity: .8;
            transform: translate(-5.6%,-4.8%);
        }
        90% {
            opacity: .5;
            transform: translate(-4.1%,-19.3%);
        }
        100% {
            opacity: 0;
            transform: translate(0,0);
        }
    }
    @keyframes flashingToRight {
        10% {
            opacity: .5;
            transform: translate(5%,5.6%);
        }
        20% {
            opacity: .8;
            transform: translate(4%,12%);
        }
        30% {
            opacity: .5;
            transform: translate(5.5%,6.8%);
        }
        40% {
            opacity: .5;
            transform: translate(4.2%,18%);
        }
        50% {
            opacity: .8;
            transform: translate(5.2%,15.6%);
        }
        60% {
            opacity: .5;
            transform: translate(3.6%,4.5%);
        }
        80% {
            opacity: .8;
            transform: translate(5.6%,4.8%);
        }
        90% {
            opacity: .5;
            transform: translate(4.1%,19.3%);
        }
        100% {
            opacity: 0;
            transform: translate(0,0);
        }
    }
    .action{
        width: 800px;
        top: 125px;
        height: 150px;
    }
    .basic-action{
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50px;
        width: 100%;
        line-height: 50px;
        font-size: 22px;
        font-weight: bold;
    }
    .basic-action .btn{
        height: 50px;
        width: 120px;
        border: 1px solid #131313;
    }
    .basic-action .ban{
        color: #aaa;
        border: 1px solid #aaa;
        text-decoration: line-through;
    }
    .basic-action .btn:not(.ban):hover{
        background-color: #131313;
        color: #fff;
    }
    .skill-board{
        width: 100%;
        height: 150px;
    }

    /* 状态编辑弹窗 */
    .buff-pop{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        z-index: 1000;
    }
    .buff-pop-cover{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        background-color: rgba(0,0,0,.7);
    }
    .buff-selection{
        position: absolute;
        width: 210px;
        height: 252px;
        top: -15%;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        opacity: .95;
        padding-top: 32px;
        box-shadow: 0 0 20px 5px #000;
        background-color: #fff;
        transition: all .15s;
        animation: intervalShadow .5s ease-in-out alternate infinite;
    }
    .buff-selection-trans{
        opacity: 0;
    }
    @keyframes intervalShadow {
        from{
            box-shadow: 0 0 20px 5px #000;
        }
        to{
            box-shadow: 0 0 50px 10px #000;
        }
    }
    .buff-selection-title{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        background-color: #131313;
        text-shadow: 0 0 6px #000;
        text-align: center;
        white-space: nowrap;
        word-break: break-all;
    }
    .buff-selection-title b{
        font-size: 16px;
    }
    .buff-selection-tip{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 34px;
        line-height: 17px;
        font-size: 12px;
        opacity: .75;
        text-align: center;
        white-space: nowrap;
        word-break: break-all;
        color: #666;
    }
    .buff-selection .buff-btn-wrap{
        padding: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .buff-selection .btn-buff{
        display: inline-block;
        width: 60px;
        height: 25px;
        line-height: 25px;
        margin-bottom: 10px;
        margin-right: 14px;
        text-align: center;
    }
    .btn-buff-sel{
        animation: intervalFade .5s ease-in-out alternate infinite;
    }
    @keyframes intervalFade {
        from{
            background-color: orange;
        }
        to{
            background-color: #e81313;
        }
    }

    .watcher{
        position: absolute;
        left: 5%;
        top: 35%;
        margin: 0;
        width: 80px;
        z-index: 1500;
    }
    .watcher >.btn{
        display: block;
        width: 80px;
        height: 25px;
        line-height: 25px;
        margin-bottom: 10px;
        background-color: #131313;
        color: #fff;
        text-align: center;
    }

    .test{
        position: absolute;
        left: 0;
        top: 30%;
        margin: 0;
        background-color: #ccc;
        border: 1px solid #aaa;
        width: 200px;
        height: 100px;
        z-index: 1500;
    }



















</style>
