import { DEBUG, CONFIG } from '../config/config';
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, arrContains, } from './utils';
import * as common from './common';

 /* 生成 AI 动作指令
 @return {
    actionType: 0, // [0:攻击|1:技能|2:集中|3:追踪]
    targets: [],
    attack: {
        type: 0, // 0-5
        name: (hands.type==2?'全·':'')+CONFIG.attackTypeNameMap[attackType],
        consume: 3,
    }
    attackAll: 0, // [0:单体攻击|1:全体攻击]
}
@return {
   actionType: 1,
   targets: [],
   skill: {
       id: 2,
       name: '多重射击',
       target: 6, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
       effects: [1], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
       dmg: [0,0,0,0,30,30,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
       cure: 0, // 治疗
       powShift: 0, // 改变意志
       attrShift: 0, // 改变基础属性
       awaShift: 0, // 改变存在感
       moveShift: 0, // 改变行动力
       buffs: [0,4,], // buff序号
       buffLevels: [3,1], // buff等级(1-9)
       consume: 50, // 意志消耗
       fixawareness: 1000,
       absolute: 0, // 必中，无视对方存在感
   }
}
*/
export function genActionCommand(unit,unitTeam,enemyTeam){
    let { weapon, skills, } = unit;
    let actionType = 0;
    let aliveUnitTeam = common.getAliveUnitArr(unitTeam); // 我方阵营存活单位数组
    let aliveEnemyTeam = common.getAliveUnitArr(enemyTeam); // 敌方阵营存活单位数组
    let allAliveUnits = [...aliveUnitTeam,...aliveEnemyTeam]; // 所有存活单位数组
    let attackType, attackAll = weapon.type==2;
    let enemyTotalAwareness = 0; // 敌方存在感总数
    let enemyMaxAwareness = 0; // 敌方存在感最大值
    let actionPool = [];
    let pushToArray = (arr,data,count=1) =>{
            for(let i=0;i<count;i++){
                arr.push(data);
            }
        };
    let absSkillActionArr = []; // 可以发动的必中技能数组
    for(let unit of aliveEnemyTeam){
        enemyTotalAwareness += unit.awareness;
        enemyMaxAwareness += CONFIG.maxAwareness;
    }
    // 生成攻击指令
    let genAttackCommand = _ =>{
        let attackTrendIndex = 0; // 攻击倾向分数
        let attackTargets = []; // 攻击对象数组
        let potentAttackType = []; // 潜在攻击类型可选项
        let potentTargets = []; // 潜在攻击对象
        let consume;
        if(!weapon.name){ // 没有武器，默认攻击类型为“钝击”
            if(unit.pow>0){
                potentAttackType = [2];
                attackTrendIndex += 1;
            }
        }
        else{ // 有武器，选择攻击类型
            for(let i=0;i<weapon.dmg.length;i++){
                if(weapon.dmg[i]>0&&(weapon.consume[i]<=unit.pow)){
                    pushToArray(potentAttackType,i,int(weapon.dmg[i]));
                }
            }
        }
        if(weapon.type==1){ // 单体攻击
            for(let target of aliveEnemyTeam){
                if(target.awareness>0){
                    let ceilAwareness = int(target.awareness/5000);
                    pushToArray(potentTargets,target,ceilAwareness);
                }
            }
        }
        else{ // 全体攻击
            attackTargets = aliveEnemyTeam;
        }
        // 计算倾向
        if(potentAttackType.length>0){
            attackTrendIndex = int(enemyTotalAwareness/900/enemyTeam.length);
            for(let i=0;i<attackTrendIndex;i++){
                consume = attackTrendIndex
                attackType = randInArr(potentAttackType);
                let attack = {
                    type: attackType,
                    name: (weapon.type==2?'全·':'')+CONFIG.attackTypeNameMap[attackType],
                    consume,
                };
                if(weapon.type==1){
                    attackTargets = [randInArr(potentTargets)];
                }
                let action = {
                   actionType,
                   targets: attackTargets,
                   attack,
                   attackAll, // [0:单体攻击|1:全体攻击]
                }
                pushToArray(actionPool,action);
            }
        }
    }

    // 生成技能指令
    let genSkillCommand = _ =>{
        let powFact = unit.pow/unit.maxpow;
        let targets = [];
        let unitHasBuff = (unit,buff) =>{
            for(let ubuff of unit.buffs){
                if(ubuff.id==buff.id){
                    return true;
                }
            }
            return false;
        }
        let skillHasBuff = (skill,buff) =>{
            for(let id of skill.buffs){
                if(id==buff.id){
                    return true;
                }
            }
            return false;
        }

        for(let skill of skills){
            let canUse = true; // 是否有条件使用此技能
            let shouldUse = true; // 是否应该使用此技能
            let envFact = 1; // 环境因素
            let consume = common.calcSkillConsume(unit,skill);

            // 判断是否有条件使用此技能
            if((unit.pow+10)<consume){
                canUse = false;
            }
            let cooldown = getMatchList(unit.cooldowns,[['id',skill.id]])[0];
            if(cooldown&&cooldown.cd>0){
                canUse = false;
            }

            // 判断是否应该使用此技能
            let buffObj = common.getBuffObj(unit,116); // 锁定bufff
            if(buffObj&&skill.name=='躲避'){
                shouldUse = false;
            }
            if(unit.awareness<=0&&skill.name=='躲避'){
                shouldUse = false;
            }

            if(canUse&&shouldUse){ // 有条件发动技能
                let trend = skill.trend; // 技能倾向
                let trends = skill.trends; // 技能倾向列表
                let potentTargets = []; // 潜在技能释放对象
                // console.log(['保护','强化','伤害','弱化'][trend]);
                switch(skill.target){
                    case 1: // 我方单体
                        potentTargets = aliveUnitTeam;
                    break;
                    case 2: // 我方全体
                        potentTargets = aliveUnitTeam;
                    break;
                    case 3: // 我方随机单体
                        potentTargets = aliveUnitTeam;
                    break;
                    case 4: // 自己
                        potentTargets = [unit];
                    break;
                    case 5: // 敌方单体
                        potentTargets = aliveEnemyTeam;
                    break;
                    case 6: // 敌方全体
                        potentTargets = aliveEnemyTeam;
                    break;
                    case 7: // 敌方随机单体
                        potentTargets = aliveEnemyTeam;
                    break;
                    case 8: // 敌我全体
                        potentTargets = allAliveUnits;
                    break;
                    case 9: // 任一单体
                        potentTargets = allAliveUnits;
                    break;
                }
                for(let target of potentTargets){ // 遍历潜在技能目标单位

                    // 计算环境因素
                    if(arrContains(skill.effects,9)!=-1){ // 如果技能效果里有 9-添加buff效果
                        let buffDupRate = getBuffDupRate(skill.buffs,target.buffs); // buff重叠率
                        envFact = 1-buffDupRate;
                        // if(DEBUG){
                        //     console.log(skill.name+'====计算环境因素',buffDupRate,envFact);
                        // }
                    }

                    if(target.side==unit.side){ // 如果这个潜在目标单位是我方单位
                        if(trend==0&&(trends[0]>(trends[2]*4))){ // 如果技能倾向为“保护”
                            if(skill.target==1||skill.target==3||skill.target==4||skill.target==9){
                                action = {
                                    actionType: 1,
                                    targets: [target],
                                    skill,
                                };
                                if(arrContains(skill.effects,9)!=-1){ // 如果技能效果里有 9-添加buff效果
                                    if(DEBUG) console.log(`填充动作池1-1-1(己方单体状态保护)`,action.skill.name,`+${int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact)} (Math.sqrt(${target.maxhp}-${target.hp})*${powFact}*${envFact})`);
                                    pushToArray(actionPool,action,int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact));
                                }
                                else{
                                    if(DEBUG) console.log(`填充动作池1-1-2(己方单体恢复保护)`,action.skill.name,`+${int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/10)} (Math.sqrt(${target.maxhp}-${target.hp})*${powFact}*${envFact}/10)`);
                                    pushToArray(actionPool,action,int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/10));
                                }
                            }
                            else if(skill.target==2){
                                action = {
                                    actionType: 1,
                                    targets: potentTargets,
                                    skill,
                                };
                                if(arrContains(skill.effects,9)!=-1){ // 如果技能效果里有 9-添加buff效果
                                    if(DEBUG) console.log(`填充动作池1-2-1(己方全体状态保护)`,action.skill.name,`+${int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/2)} (Math.sqrt(${target.maxhp}-${target.hp})*${powFact}*${envFact}/2)`);
                                    pushToArray(actionPool,action,int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/2));
                                }
                                else{
                                    if(DEBUG) console.log(`填充动作池1-2-2(己方全体恢复保护)`,action.skill.name,`+${int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/10)} (Math.sqrt(${target.maxhp}-${target.hp})*${powFact}*${envFact}/10)`);
                                    pushToArray(actionPool,action,int(Math.sqrt(target.maxhp-target.hp)*powFact*envFact/10));
                                }
                            }
                        }
                        else if(trend==1&&(trends[1]>(trends[3]*1.5))){ // 如果技能倾向为“强化”
                            if(skill.target==1||skill.target==3||skill.target==4||skill.target==9){
                                action = {
                                    actionType: 1,
                                    targets: [target],
                                    skill,
                                };
                                if(DEBUG) console.log(`填充动作池1-3(强化己方单体)`,action.skill.name,`+${int(Math.sqrt(target.dex)*powFact*envFact)} (Math.sqrt(${target.dex})*${powFact}*${envFact}/2)`);
                                pushToArray(actionPool,action,int(Math.sqrt(target.dex)*powFact*envFact));
                            }
                            else if(skill.target==2){
                                action = {
                                    actionType: 1,
                                    targets: potentTargets,
                                    skill,
                                };
                                if(DEBUG) console.log(`填充动作池1-4(强化己方全体)`,action.skill.name,`+${int(Math.sqrt(target.dex)*powFact*envFact/2)} (Math.sqrt(${target.dex})*${powFact}*${envFact}/2)`);
                                pushToArray(actionPool,action,int(Math.sqrt(target.dex)*powFact*envFact/2));
                            }
                        }
                    }
                    else{ // 如果这个潜在目标单位是敌人
                        if((trend==2&&(trends[2]>(trends[0]*1.5)))||(trend==3&&(trends[3]>(trends[1]*1.5)))){ // 如果技能倾向为“伤害”或“弱化”
                            if(skill.target==1||skill.target==5||skill.target==7||skill.target==9){ // 单体目标
                                let action = {
                                    actionType: 1,
                                    targets: [target],
                                    skill,
                                };
                                let count = target.awareness/2000;
                                if(skill.absolute){
                                    count = 5;
                                }
                                if(skill.effects.length==1&&skill.effects[0]==8&&target.awareness>=CONFIG.maxAwareness){ // 单纯的探测技能，且目标存在感为满值，则不加入动作池
                                    count = 0;
                                }
                                if(trend==2){
                                    if(DEBUG) console.log(`填充动作池1-5(伤害单体敌人)`,action.skill.name,`+${int(count*powFact*1.3)} (${count}*${powFact}*1.3)`);
                                    pushToArray(actionPool,action,int(count*powFact*1.3));
                                }
                                else{
                                    if(DEBUG) console.log(`填充动作池1-6(弱化单体敌人)`,action.skill.name,`+${int(count*powFact*envFact)} (${count}*${powFact}*${envFact})`);
                                    pushToArray(actionPool,action,int(count*powFact*envFact));
                                }
                            }
                            else if(skill.target==6){ // 全体目标
                                let action = {
                                    actionType: 1,
                                    targets: potentTargets,
                                    skill,
                                };
                                let count = target.awareness/5000;
                                if(skill.absolute){
                                    count = 2;
                                }
                                if(skill.effects.length==1&&skill.effects[0]==8&&target.awareness>=CONFIG.maxAwareness){ // 单纯的探测技能，且目标存在感为满值，则不加入动作池
                                    count = 0;
                                }
                                if(trend==2){
                                    if(DEBUG) console.log(`填充动作池1-7(伤害全体)`,action.skill.name,`+${int(count*powFact*1.3)} (${count}*${powFact}*1.3)`);
                                    pushToArray(actionPool,action,int(count*powFact*1.3));
                                }
                                else{
                                    if(DEBUG) console.log(`填充动作池1-8(弱化全体)`,action.skill.name,`+${int(count*powFact*envFact)} (${count}*${powFact}*${envFact})`);
                                    pushToArray(actionPool,action,int(count*powFact*envFact));
                                }
                            }
                        }
                    }
                }
                let count = enemyTotalAwareness/enemyMaxAwareness*15;
                if(skill.absolute){
                    count = 25;
                }
                let action;
                if(skill.target==3||skill.target==7){ // 如果技能的目标类型为“我方随机”或“敌方随机”
                    action = {
                        actionType: 1,
                        targets: [randInArr(potentTargets)],
                        skill,
                    };
                }
                else if(skill.target==1||skill.target==5){ // 如果技能的目标类型为“我方单体”或“敌方单体”
                    action = {
                        actionType: 1,
                        targets: [potentTargets[r(0,potentTargets.length-1)]],
                        skill,
                    };
                }
                else if(skill.target==9){ // 如果技能的目标类型为“任一单体”
                    let goodTrend = trends[0]+trends[1];
                    let badTrend = trends[2]+trends[3];
                    let totalTrend = goodTrend+badTrend;
                    if(r(1,totalTrend)<=goodTrend){ // 如果是有利技能
                        potentTargets = aliveUnitTeam;
                    }
                    else{ // 如果是不利技能
                        potentTargets = aliveEnemyTeam;
                    }
                    action = {
                        actionType: 1,
                        targets: [potentTargets[r(0,potentTargets.length-1)]],
                        skill,
                    };
                }
                else{ // 如果技能的目标类型为“我方全体”或“敌方全体”或“自己”或“敌我全体”
                    action = {
                        actionType: 1,
                        targets: potentTargets,
                        skill,
                    };
                }
                if(skill.effects.length==1&&skill.effects[0]==8){ // 单纯的探测技能，则不加入动作池
                    count = 0;
                }
                if(DEBUG) console.log(`填充动作池2`,action.skill.name,`+${int(count*powFact/50)} (${count}*${powFact}/50)`);
                pushToArray(actionPool,action,int(count*powFact/50));
                // 对敌必中伤害技能
                if(skill.absolute&&(skill.trend==2||skill.trend==3)&&skill.awaShift>1000){
                    absSkillActionArr.push(action);
                }
            }
        }
    }

    // 生成集中指令
    let genFocusCommand = _ =>{
        let focusTrendIndex = 0; // 技能集中分数
        let action = {
            actionType: 2,
        };
        if(unit.pow<CONFIG.powRechargeTreshold){
            focusTrendIndex += (CONFIG.powRechargeTreshold-unit.pow)*10;
        }
        pushToArray(actionPool,action,focusTrendIndex);
    }

    // 生成追踪指令
    let genObserveCommand = _ =>{
        let observeTrendIndex = 0; // 追踪倾向分数
        let action = {
            actionType: 3,
        };
        if(unit.pow>=CONFIG.observeConsume){
            let highestAwarenessEnemyUnit = { awareness: 0 };
            for(let unit of aliveEnemyTeam){
                if(highestAwarenessEnemyUnit.awareness<unit.awareness){
                    highestAwarenessEnemyUnit = unit;
                }
            }
            observeTrendIndex += int((CONFIG.maxAwareness-highestAwarenessEnemyUnit.awareness)/200);
            if(CONFIG.maxAwareness>highestAwarenessEnemyUnit.awareness){
                observeTrendIndex += 10;
            }
        }
        if(absSkillActionArr.length>0){
            pushToArray(actionPool,randInArr(absSkillActionArr),observeTrendIndex);
            pushToArray(actionPool,action,observeTrendIndex/10);
        }
        else{
            pushToArray(actionPool,action,observeTrendIndex);
        }
    }

    // 生成 actionPool
    genAttackCommand();
    let buffObj=common.getBuffObj(unit,107); // 沉默bufff
    if(!buffObj){
        genSkillCommand();
    }
    genFocusCommand();
    genObserveCommand();

    if(actionPool.length<=0){
        actionPool.push({ // 集中
            actionType: 2,
        });
    }
    let resAction = randInArr(actionPool);

    if(DEBUG){
        prt(actionPool);
        console.log(`%c${unit.name} 采取行动：${getActionDesc(resAction)}`,'color: OrangeRed');
        // console.log(`${unit.name}(${unit.level}级)(ID:${unit.id})的执行动作：`,getActionDesc(resAction),resAction);
    }

    return resAction;
}
function int(value){
    return Math.ceil(value);
}
function randInArr(arr){
    return arr[r(0,arr.length-1)];
}
function prt(actionPool){
    let res = Array.from(actionPool,getActionDesc);
    console.log(res);
}
function getActionDesc(action){
    let res = '';
    if(action.actionType==0){
        let targetNames = Array.from(action.targets,target=>{
            return target.name;
        });
        res += `${action.attack.name} -> ${targetNames}`;
    }
    else if(action.actionType==1){
        let targetNames = Array.from(action.targets,target=>{
            return target.name;
        });
        res = `${action.skill.name} -> ${targetNames}`;
    }
    else if(action.actionType==2){
        res = '集中';
    }
    else if(action.actionType==3){
        res = '追踪';
    }
    return res;
}

/* 获悉一个技能的功能倾向
@return {Number} [0:保护|1:强化|2:伤害|3:弱化]
*/
export function getSkillTrend(skill,trendArr){
    if(!trendArr){
        trendArr = getSkillTrends(skill);
    }
    // console.log(trendArr);
    let max = Math.max(...trendArr),
        maxArr = [];
    for(let i=0;i<trendArr.length;i++){
        if(trendArr[i]==max){
            maxArr.push(i);
        }
    }
    return maxArr[0];
}


/* 获悉一个技能的功能倾向列表
@return {Array} [0,0,0,8] // [0:保护|1:强化|2:伤害|3:弱化]
*/
export function getSkillTrends(skill){
    let trendArr = [0,0,0,0];
    let { effects, dmg, buffs, buffLevels, } = skill;
    for(let effect of effects){
        switch(effect){
            case 1: // 伤害功能
                for(let d of dmg){
                    trendArr[2] += int(d);
                }
            break;
            case 2: // 治疗功能
                trendArr[0] += int(skill.cure/5);
                trendArr[0] += int(skill.cureRate*18);
            break;
            case 3: // 意志调整
                trendArr[3] += -int(skill.powShift);
            break;
            case 4:
            case 5:
            case 6: // 属性调整
                trendArr[skill.attrShift>0?1:3] += int(Math.abs(skill.attrShift));
            break;
            case 7: // 行动力
                trendArr[skill.moveShift>0?1:3] += int(Math.abs(skill.moveShift)/50);
            break;
            case 8: // 存在感
                trendArr[skill.awaShift<0?0:3] += int(Math.abs(skill.awaShift)/150);
            break;
            case 9: // 添加 buff
                for(let i=0;i<buffs.length;i++){
                    let bid = buffs[i];
                    let blvl = buffLevels[i];
                    let ibuff = common.getCBuff(bid);
                    let trend = ibuff.trend;
                    trendArr[trend] += blvl*50;
                }
            break;
            case 10: // 解除负面 buff
                trendArr[0] += 150*skill.badImpact;
            break;
            case 11: // 解除正面 buff
                trendArr[3] += 150*skill.goodImpact;
            break;
        }
    }
    return trendArr;
}

/* 获取技能价值 */
export function getSkillValue(skill){
    let res = 0;
    let targetFact = 1;
    if(skill.target==2||skill.target==6){
        targetFact = 1.5;
    }
    else if(skill.target==1||skill.target==5||skill.target==9){
        targetFact = 1.2;
    }
    let trends = getSkillTrends(skill);
    let goodTrendIndex = trends[0]+trends[1];
    let badTrendIndex = trends[2]+trends[3];
    if(goodTrendIndex>badTrendIndex){ // 有利技能
        res = goodTrendIndex*targetFact;
    }
    else{
        res = badTrendIndex*targetFact;
    }
    return res;
}

/* 获取buff重叠度 */
export function getBuffDupRate(buffs,targetBuffs){
    let res = 0;
    let dupBuffCount = 0;
    for(let buff of targetBuffs){
        if(arrContains(buffs,buff.id)!=-1){
            dupBuffCount += 1;
        }
    }
    res = Math.round(dupBuffCount/buffs.length*100)/100;
    return res;
}
