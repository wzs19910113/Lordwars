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
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, formatPx, } from '../tools/avatar';
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
                let skills1 = [
                    { // 技能数组
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
                    },
                    {
                        name: '分连箭',
                        target: 5, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
                        effects: [1,3,9], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
                        dmg: [0,0,0,10,44,32,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
                        cure: 0, // 治疗
                        cureRate: 0, // 比率治疗
                        powShift: -35, // 改变意志
                        attrShift: 0, // 改变基础属性
                        awaShift: 0, // 改变存在感
                        moveShift: 0, // 改变行动力
                        buffs: [102,114,], // buff序号 #出血 #干毒
                        buffLevels: [9,9,], // buff等级(1-9)
                        goodImpact: 1,
                        badImpact: 1,
                        consume: 40, // 意志消耗
                        fixawareness: 10000,
                        absolute: 1, // 必中，无视对方存在感
                    }
                ];
                let skills2 = [
                    { // 技能数组
                        id: 1,
                        name: '躲避',
                        target: 4, // [1:我方单体|2:我方全体|4:自己|5:敌方单体|6:敌方全体]
                        effects: [8], // [1:伤害|2:治疗|3:改变意志|7:改变行动力|8:改变存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
                        dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
                        cure: 0, // 固定治疗
                        cureRate: 0, // 比率治疗
                        powShift: 0, // 改变意志
                        attrShift: 0, // 改变基础属性
                        awaShift: -9000, // 改变存在感
                        moveShift: 0, // 改变行动力
                        buffs: [], // buff序号
                        buffLevels: [], // buff等级(1-9)
                        consume: 11, // 意志消耗
                        fixawareness: 0,
                        absolute: 0, // 必中，无视对方存在感,
                    },
                    { // 技能数组
                        id: 1,
                        name: '治愈',
                        target: 4, // [1:我方单体|2:我方全体|4:自己|5:敌方单体|6:敌方全体]
                        effects: [2,9], // [1:伤害|2:治疗|3:改变意志|7:改变行动力|8:改变存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
                        dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
                        cure: 100, // 固定治疗
                        cureRate: 0, // 比率治疗
                        powShift: 0, // 改变意志
                        attrShift: 0, // 改变基础属性
                        awaShift: 0, // 改变存在感
                        moveShift: 0, // 改变行动力
                        buffs: [1], // buff序号
                        buffLevels: [4], // buff等级(1-9)
                        consume: 30, // 意志消耗
                        fixawareness: 0,
                        absolute: 0, // 必中，无视对方存在感,
                    }
                ];
                for(let i=0;i<skills1.length;i++){
                    let trends = ai.getSkillTrends(skills1[i]);
                    skills1[i].trends = trends;
                    skills1[i].trend = ai.getSkillTrend(skills1[i],skills1[i].trends);
                }
                for(let i=0;i<skills1.length;i++){
                    let trends = ai.getSkillTrends(skills2[i]);
                    skills2[i].trends = trends;
                    skills2[i].trend = ai.getSkillTrend(skills2[i],skills2[i].trends);
                }
                let person1 = {
                        id: 1,
                        name: '阿琪',
                        age: 20,
                        gender: 2, // [1:男|2:女]
                        personalities: [10,20,30,40,50,], // 性格（0-100）
                        abilities: [200,344,252,180,30], // 能力（>0） [力量，精准，速度，智力，经验]
                        hp: 220,
                        maxhp: 220,
                        pow: 125,
                        maxpow: 125,
                        imm: 2, // 状态抗性
                        baseAttack: 8, // 基础攻击力
                        fixawareness: 1300, // 固有存在感（0-10000）
                        weapon: { // 武器
                            id: 1,
                            name: '铁剑',
                            dmg: [12,11,3,0,0,0,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
                            buffLevels: [1,2,1,0,0,0], // 攻击对应buff等级
                            consume: [4,3,2,0,0,0],
                            type: 2, // [1:攻击单人|2:攻击全体]
                            fixawareness: 4000,
                        },
                        viceWeapon: {
                            id: 1,
                            name: '长弓',
                            dmg: [0,0,0,0,18,16,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
                            buffLevels: [0,0,0,0,2,1], // 攻击对应buff等级
                            consume: [0,0,0,0,2,1],
                            type: 1, // [1:攻击单人|2:攻击全体]
                            fixawareness: 7000,
                        }, // 副手武器
                        skills: skills1,
                        isAI: true,
                        relations: [ // 与其他角色的关系
                            {
                                id: 2, // 对应人物 ID
                                values: [0,0,0,], // [亲密度(0,无限),喜爱度(-无限,无限),信任度(-无限,无限) ]
                            },
                        ]
                    };
                let person2 = {
                        id: 2,
                        name: '郭核',
                        age: 20,
                        gender: 1, // [1:男|2:女]
                        personalities: [10,20,30,40,50,], // 性格（0-100）
                        abilities: [200,104,222,180,30], // 能力（>0） [力量，精准，速度，智力，经验]
                        hp: 225,
                        maxhp: 225,
                        pow: 100,
                        maxpow: 100,
                        imm: 5, // 状态抗性
                        baseAttack: 8, // 基础攻击力
                        fixawareness: 1000, // 固有存在感（0-10000）
                        weapon: { // 武器
                            id: 1,
                            name: '铁剑',
                            dmg: [12,11,3,0,0,0,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
                            buffLevels: [1,2,1,0,0,0], // 攻击对应buff等级
                            consume: [4,3,2,0,0,0],
                            type: 2, // [1:攻击单人|2:攻击全体]
                            fixawareness: 4000,
                        },
                        viceWeapon: {}, // 副手武器
                        skills: skills2,
                        isAI: true,
                        relations: [ // 与其他角色的关系
                            {
                                id: 3, // 对应人物 ID
                                values: [0,0,0,], // [亲密度(0,无限),喜爱度(-无限,无限),信任度(-无限,无限) ]
                            },
                        ]
                    };
                let avatarData1 = genRandomAvatar(person1);
                let avatarData2 = genRandomAvatar(person2);
                person1.avatarData = avatarData1;
                person2.avatarData = avatarData2;

                this.sceneData = {
                    meTeam: [person1,],
                    youTeam:[person2,],
                    mode: 0, // 战斗模式 [0:非战斗状态|1:过招|2:厮杀|3:观战|4:战前调整]
                    cell: null,
                    map: null,
                };
                this.state = 2;
            });
        },
        onBattleEnd(data){
            console.log(data);
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
