<template>
    <div class="home">
        <Scenepage ref="scene" v-if="state==2" :data="sceneData" :game="game" :onEnd="onBattleEnd" />
        <div class="alert" v-for="(alertMsg,index) in alertMsgs" v-if="alertMsgs.length>0">{{alertMsg}}</div>
        <div class="confirm" v-if="confirmTip">
            <h4 class="confirm-title" v-html="confirmTip"></h4>
            <div class="btn-wrap">
                <a class="btn" @click="onClickConfirm()">确定</a>
                <a class="btn" @click="onClickCancel()" v-if="!hideConfirmCancel">取消</a>
            </div>
        </div>
    </div>
</template>

<script>
import Scenepage from './Scenepage';
import { query, r, rr, bulbsort, shuffle, getParentNode, getMatchList, removeFromList, arrContains, removeFromNumberList, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    name: 'Home',
    data(){
        return {
            state: 0, // 状态[1:地图|2:战斗]
            sceneData: {
                meTeam: [],
                youTeam: [],
                mode: 0, // 战斗模式 [0:非战斗状态|1:过招|2:厮杀|3:观战|4:战前调整]
                cell: null,
                map: null,
            },

            hideConfirmCancel: false,
            confirmTip: '', // 确认文本
            alertMsgs: [],

            game: { // 游戏数据

            },

            common,
        };
    },
    destroyed(){
        this.itv&&clearInterval(this.itv);
    },
    created(){
        this.init();
    },
    mounted(){
    },
    methods: {
        init(){
            this._confirm('开始测试？',_=>{
                this.sceneData = {
                    meTeam: [{
                        id: 1,
                        name: '万绣', // 名字
        				standpoint: 0, // 立场 [0:路人|1:相识|2:友好|3:同道|4:在队伍中]
                        gender: 2, // 性别 [1:男|2:女]
                        age: 34, // 年龄
                        fixawareness: 1000, // 固有存在感
                        basehp: 74, // 固定生命值
                        basepow: 120, // 固定意志
                        basestr: 171, // 固定力量
                        baseacr: 166, // 固定精准
                        basedex: 90, // 固定速度
                        consume: 1, // 基础意志消耗
        				imm: 75,
        				immExp: 0,
                        baseAttack: 60, // 基础攻击力
        				level: 10,
                        equipments: {
                            head: {
        				        name: '殿皇发簪',
        						hp: 1200,
        						pow: 700,
        						strOffset: 44,
        						acrOffset: 65,
        						dexOffset: 15,
        						fixawareness: 0,
        						price: 500000,
        						equipType: 0,
                            },
                            hands: {
        				        name: '宫廷剑',
        						pow: 1300,
        						strOffset: 205,
        				        dmg: [61,89,68,0,0,0,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
        						buffLevels: [8,9,9,0,0,0], // 攻击对应buff等级
        				        consume: [1,1,1,0,0,0],
        				        type: 2, // [1:攻击单人|2:攻击全体]
        				        fixawareness: 3300,
        						price: 1000000, // 价格
        						equipType: 1,
        						vice: {
        							id: 0,
        						},
                            },
                            body: {
        				        name: '帝后袍',
        						hp: 13150,
        						pow: 520,
        						strOffset: 140,
        						acrOffset: 65,
        						dexOffset: 45,
        						fixawareness: 8000,
        						price: 2000000,
        						equipType: 2,
                            },
                            legs: {
        				        name: '绣龙裙尾',
        						hp: 5200,
        						pow: 317,
        						strOffset: 156,
        						acrOffset: 58,
        						dexOffset: 175,
        						fixawareness: 5000,
        						price: 1800000,
        						equipType: 3,
                            },
                            foots: {
        				        name: '绣龙靴',
        						hp: 1300,
        						pow: 350,
        						strOffset: 90,
        						acrOffset: 46,
        						dexOffset: 136,
        						fixawareness: 900,
        						price: 500000,
        						equipType: 4,
                            },
                        },
        				halos: [], // 光环数组
        				slots: [], // 光环槽数组
                        skills: [ // 技能id数组
        					{
        						name: '隐藏',
        				        target: 4, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
        				        effects: [8], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        				        dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
        				        cure: 0, // 治疗
        						cureRate: 0, // 比率治疗
        						powShift: 0, // 改变意志
        				        attrShift: 0, // 改变基础属性
        				        awaShift: -7500, // 改变存在感
        				        moveShift: 0, // 改变行动力
        						buffs: [], // buff序号
        						buffLevels: [], // buff等级(1-9)
        				        consume: 9, // 意志消耗
        						fixawareness: 0,
        						absolute: 0, // 必中，无视对方存在感
        						level: 1, // 等级
        						price: 0, // 价值（为 0 时代表固有技能，无法转让和售卖）
        					},
        					{
        						name: '烫川花',
        				        target: 6, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
        				        effects: [1,3,9], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        				        dmg: [49,210,120,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
        				        cure: 0, // 治疗
        						cureRate: 0, // 比率治疗
        						powShift: -250, // 改变意志
        				        attrShift: 0, // 改变基础属性
        				        awaShift: 0, // 改变存在感
        				        moveShift: 0, // 改变行动力
        						buffs: [102,114,], // buff序号 #出血 #干毒
        						buffLevels: [9,9,], // buff等级(1-9)
        						goodImpact: 1,
        						badImpact: 1,
        				        consume: 165, // 意志消耗
        						fixawareness: 10000,
        						absolute: 0, // 必中，无视对方存在感
        						level: 9, // 等级
        						price: 10000, // 价值（为 0 时代表固有技能，无法转让和售卖）
        					},
        				],
                        teamOrder: 1,
                    },],
                    youTeam: [{
                        id: 2,
                        name: '长官', // 名字
        				standpoint: 0, // 立场 [0:路人|1:相识|2:友好|3:同道|4:在队伍中]
                        gender: 1, // 性别 [1:男|2:女]
                        age: 34, // 年龄
                        fixawareness: 1000, // 固有存在感
                        basehp: 74, // 固定生命值
                        basepow: 120, // 固定意志
                        basestr: 171, // 固定力量
                        baseacr: 166, // 固定精准
                        basedex: 90, // 固定速度
                        consume: 1, // 基础意志消耗
        				imm: 75,
        				immExp: 0,
                        baseAttack: 60, // 基础攻击力
        				level: 10,
                        equipments: {
                            head: {
                            },
                            hands: {
                            },
                            body: {
                            },
                            legs: {
                            },
                            foots: {
                            },
                        },
        				halos: [], // 光环数组
        				slots: [], // 光环槽数组
                        skills: [ // 技能id数组
        					{
        						name: '隐藏',
        				        target: 4, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
        				        effects: [8], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        				        dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
        				        cure: 0, // 治疗
        						cureRate: 0, // 比率治疗
        						powShift: 0, // 改变意志
        				        attrShift: 0, // 改变基础属性
        				        awaShift: -3500, // 改变存在感
        				        moveShift: 0, // 改变行动力
        						buffs: [], // buff序号
        						buffLevels: [], // buff等级(1-9)
        				        consume: 7, // 意志消耗
        						fixawareness: 0,
        						absolute: 0, // 必中，无视对方存在感
        						level: 1, // 等级
        						price: 0, // 价值（为 0 时代表固有技能，无法转让和售卖）
        					},
        					{
        						name: '激光炮',
        				        target: 5, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
        				        effects: [1,], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        				        dmg: [0,0,0,60,25,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
        				        cure: 0, // 治疗
        						cureRate: 0, // 比率治疗
        						powShift: 0, // 改变意志
        				        attrShift: 0, // 改变基础属性
        				        awaShift: 0, // 改变存在感
        				        moveShift: 0, // 改变行动力
        						buffs: [], // buff序号 #出血 #干毒
        						buffLevels: [], // buff等级(1-9)
        						goodImpact: 0,
        						badImpact: 0,
        				        consume: 44, // 意志消耗
        						fixawareness: 10000,
        						absolute: 1, // 必中，无视对方存在感
        						level: 4, // 等级
        						price: 2500, // 价值（为 0 时代表固有技能，无法转让和售卖）
        					},
        				],
                        teamOrder: 1,
                    },],
                    mode: 0, // 战斗模式 [0:非战斗状态|1:过招|2:厮杀|3:观战|4:战前调整]
                    cell: null,
                    map: null,
                };
                this.state = 2;
            });
        },

        _confirm(tip,onClickConfirm,hideCancel){ // 显示确认文本
            this.confirmTip = tip;
            this.hideConfirmCancel = false;
            if(onClickConfirm){
                this.onClickConfirmFunc = onClickConfirm;
            }
            if(hideCancel){
                this.hideConfirmCancel = true;
            }
        },
        onClickConfirm(){ // 点击【确认】按钮
            this.confirmTip = '';
            this.onClickConfirmFunc&&this.onClickConfirmFunc();
        },
        onClickCancel(){ // 点击【取消】按钮
            this.confirmTip = '';
        },
        onClickConfirmFunc(){ // 点击【确认】按钮功能

        },
    },
    components:{
        Scenepage,
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn{
        cursor: pointer;
    }
    .btn:hover{
        background-color: #131313;
        color: #fff;
    }
    .home{
        background-color: #131313;
    }
    .shadow{
        background-color: #131313;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        animation: flash .5s linear forwards alternate;
    }
    @keyframes flash {
        20%{
            opacity: 1;
        }
        80%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }

    /* confirm */
    .confirm{
        position: absolute;
        top: 13%;
        left: 0;
        right: 0;
        margin: 0 auto;
        padding: 20px;
        width: 600px;
        min-height: 160px;
        text-align: center;
        background-color: #fff;
        border: 1px solid #131313;
        box-shadow: 0 0 10px #131313;
        z-index: 1005;
    }
    .confirm-title{
        min-height: 90px;
        line-height: 25px;
        padding: 20px 0;
        margin-bottom: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 18px;
        white-space: nowrap;
        word-break: keep-all;
    }
    .confirm .btn-wrap{
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .confirm .btn-wrap a{
        width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border: 1px solid #131313;
        display: inline-block;
    }
    .deadpop .btn-wrap a{
        width: 135px;
    }

    /* 侠传授技能 */
    .hero-rewards{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 450;
    }
    .hero-rewards-shadow{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .5;
    }
    .hero-rewards-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 25%;
        margin: 0 auto;
        width: 500px;
        min-height: 150px;
        padding: 12px;
        background-color: #fff;
    }
    .hero-rewards-title{
        height: 45px;
        line-height: 45px;
        font-size: 26px;
        text-align: center;
        color: #131313;
        margin-bottom: 20px;
        white-space: nowrap;
        word-break: keep-all;
    }
    .hero-rewards-skills{
        width: 100%;
        padding: 0 6px;
    }
    .hero-rewards-skills .btn{
        display: block;
        border: 1px solid #131313;
        margin: 0 auto;
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        padding: 0 8px;
        font-size: 14px;
        margin-bottom: 10px;
        color: #444;
        transition: all .15s;
    }
    .hero-rewards-skills .btn .skill-name{
        display: block;
        color: OrangeRed;
        font-weight: bold;
    }
    .hero-rewards-skills .btn .skill-tip{
        display: block;
        color: #666;
    }
    .pow{
        color: RoyalBlue;
    }
    .hero-rewards-skills .btn:hover{
        background-color: #131313;
        color: #fff;
    }
    .hero-rewards-skills .btn:hover .skill-tip{
        color: #fff;
    }
    .gold{
        color: orange;
        display: inline;
    }



</style>
