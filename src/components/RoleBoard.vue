<template>
    <div class="roleboard" :class="`tp-${type}`">
        <div class="panel role" v-if="curSelection.role.heroTeached">
            <div class="member-name"><b>{{curSelection.role.title+'·'+curSelection.role.name+'之墓'}}</b><span>{{curSelection.role.gender==1?'男':'女'}}</span><span>享年 {{curSelection.role.age}}</span></div>
            <div class="member-grave">墓碑立于此处已有百年，你之前见到的只不过是{{curSelection.role.name}}的亡魂</div>
        </div>
        <div class="panel role" v-else>
            <div class="member-name">
                <b>
                    {{curSelection.role.isHero?`${curSelection.role.title}·`:''}}{{curSelection.role.name}} <i :style="{'color':['#131313','#131313','LimeGreen','#1E90FF','#1E90FF','OrangeRed'][curSelection.role.standpoint],'font-size':'14px','font-weight':'normal'}">[{{['路人','相识','友好','同道','在队'][curSelection.role.standpoint]}}]</i>
                </b>
                <span>{{curSelection.role.gender==1?'男':'女'}}</span>
                <span>{{curSelection.role.age}}岁</span>
                <a class="btn btn-viewdetail" @click="onClickViewDetail()">详情</a>
            </div>
            <Bar1 class="bar-1" title="生命" :type="1" :crt="curSelection.role.hp" :max="curSelection.role.maxhp" />
            <Bar1 class="bar-1" title="意志" :type="2" :crt="curSelection.role.pow" :max="curSelection.role.maxpow" />
            <div class="attr-wrap">
                <div class="member-attr str">力量：<span>{{curSelection.role.fixstr}}</span></div>
                <div class="member-attr acr">精准：<span>{{curSelection.role.fixacr}}</span></div>
                <div class="member-attr dex">速度：<span>{{curSelection.role.fixdex}}</span></div>
            </div>
            <!-- <div class="awareness">
                <label>初始存在感</label>
                <span>{{parseFloat(common.calcRoleAwareness(curSelection.role,game.allEquips)/100).toFixed(2)}}%</span>
            </div> -->
            <div class="rankscore">
                <label>综合战力</label>
                <span>{{curSelection.role.rankScore||'???'}}</span>
            </div>
            <div class="detail" v-if="viewDetail">
                <div class="detail-item detail-title"><b>基础数据：</b></div>
                <div class="detail-item">基础生命：<b>{{curSelection.role.basehp}}</b></div>
                <div class="detail-item">基础意志：<b>{{curSelection.role.basepow}}</b></div>
                <hr/>
                <div class="detail-item" title="决定记忆插槽的数量">◈脑潜力：<b>{{curSelection.role.brainLevel}}</b></div>
                <div class="detail-item">基础攻击力：<b>{{curSelection.role.baseAttack}}</b></div>
                <div class="detail-item">基础意志消耗：<b>{{curSelection.role.consume}}</b></div>
                <div class="detail-item" title="受到攻击的概率">◈基础存在感：<b>{{parseFloat(curSelection.role.fixawareness/100).toFixed(2)}}%</b>（当前：<b>{{parseFloat(common.calcRoleAwareness(curSelection.role,game.allEquips)/100).toFixed(2)}}%</b>）</div>
                <hr/>
                <div class="detail-item">基础力量：<b>{{curSelection.role.basestr}}</b></div>
                <div class="detail-item">基础精准：<b>{{curSelection.role.baseacr}}</b></div>
                <div class="detail-item">基础速度：<b>{{curSelection.role.basedex}}</b></div>
                <hr/>
                <div class="detail-item" title="状态抗性越高，获得状态的持续时间越短（包括增益和负面状态）">◈状态抗性：<b>{{curSelection.role.imm}}%</b></div>
                <div class="detail-item" title="受到伤害会累积" v-if="curSelection.role.imm<CONFIG.humanMaxImm">◈状态抗性提升经验：<b>{{curSelection.role.immExp}} / {{common.getImmExpRequire(curSelection.role.imm)}}</b></div>
                <div class="detail-item" title="受到伤害会累积" v-else>◈状态抗性提升经验：-- / --</div>
                <div class="detail-item" title="亲近度影响对其雇佣和购买的汇率；第一次过招获胜可以大幅提升，并肩作战也可以提升" v-if="curSelection.role.standpoint<3&&!curSelection.role.isHero">◈亲近度：<b>{{calcRelationship(curSelection.role.priceRatio)}}%</b></div>
                <hr v-if="curSelection.role.rankScoreDetail&&DEBUG" />
                <div v-if="curSelection.role.rankScoreDetail&&DEBUG">
                    <div class="detail-item detail-title"><b>战力分数来源：</b></div>
                    <div class="detail-item">生命：{{curSelection.role.rankScoreDetail.hp}} 分</div>
                    <div class="detail-item">意志：{{curSelection.role.rankScoreDetail.pow}} 分</div>
                    <div class="detail-item">基础攻击：{{curSelection.role.rankScoreDetail.baseAttack}} 分</div>
                    <div class="detail-item">状态抗性：{{curSelection.role.rankScoreDetail.imm}} 分</div>
                    <hr/>
                    <div class="detail-item">武器伤害：{{curSelection.role.rankScoreDetail.weaponDmg}} 分</div>
                    <div class="detail-item">武器buff：{{curSelection.role.rankScoreDetail.weaponBuff}} 分</div>
                    <hr/>
                    <div class="detail-item" v-if="curSelection.role.rankScoreDetail.halo>0">光环：{{curSelection.role.rankScoreDetail.halo}} 分</div>
                    <hr v-if="curSelection.role.rankScoreDetail.halo>0"/>
                    <div class="detail-item">技能数量：{{curSelection.role.rankScoreDetail.skill}} 分</div>
                    <div class="detail-item">伤害技能：{{curSelection.role.rankScoreDetail.dmgSkill}} 分</div>
                    <div class="detail-item">其他技能：{{curSelection.role.rankScoreDetail.otherSkill}} 分</div>
                    <hr/>
                    <div class="detail-item">速度分数：{{curSelection.role.rankScoreDetail.dex}} 分</div>
                </div>
            </div>
            <div class="option" v-if="type==1">
                <a class="btn" @click="onClickHire(curSelection.role,Math.round(curSelection.role.price*curSelection.role.priceRatio/100))" v-if="curSelection.role.standpoint==2&&!curSelection.role.isHero">招募（&nbsp;<b class="price" v-html="common.moneyFormat(Math.round(curSelection.role.price*curSelection.role.priceRatio/100))"></b>&nbsp;$）</a>
                <a class="btn" @click="onClickFight(curSelection.role)" v-if="curSelection.role.standpoint<=2">{{curSelection.role.isHero?'挑战':'过招'}}</a>
                <a class="btn" @click="onClickCallback(curSelection.role)" v-if="curSelection.role.standpoint==3">召回</a>
            </div>
            <div class="option" v-if="type==2">
                <a class="btn" @click="onClickViewRebuild(curSelection.role)" v-if="curSelection.role.standpoint>=4">塑造记忆</a>
                <a class="btn" @click="onClickLeave(curSelection.role)" v-if="curSelection.role.id!=1&&curSelection.role.standpoint==4">遣散</a>
            </div>
        </div>
        <div class="panel role-equip onequip">
            <div class="panel-title">
                <span class="panel-title-name">▶ 装备 ◀</span>
                <span class="panel-title-btn-wrap" v-if="type==2">
                    <a class="btn btn-pt" @click="onTapTakeoffAll">全部卸下</a>
                </span>
            </div>
            <div class="panel-content">
                <div class="equip-item equip-onbody" :class="'equip-type-'+index" v-for="(name,index) in ['头部','武器','上身','下身','脚部']">
                    <div v-if="!curSelection.equipments[index].id">
                        <i class="equip-name">{{name}}：无</i>
                    </div>
                    <i class="equip-name" v-if="curSelection.equipments[index].id">
                        {{name}}：{{curSelection.equipments[index].name}}
                        <span v-if="curSelection.equipments[index].equipType==1&&curSelection.equipments[index].type==2"> (全)</span>
                        <a class="btn btn-edit" @click="onClickEditEquipName(curSelection.equipments[index])" v-if="type==2&&curSelection.equipments[index].equipType==1" title="修改名字">✍</a>
                    </i>
                    <div v-if="!curSelection.role.heroTeached&&curSelection.equipments[index].id">
                        <div class="equip-price" v-if="curSelection.equipments[index].price&&type==2"><b class="price" v-html="common.moneyFormat(curSelection.equipments[index].price,1)"></b></div>
                        <div class="equip-awareness">存在感：{{parseFloat(curSelection.equipments[index].fixawareness/100).toFixed(2)}}%</div>
                        <div class="equip-hp" v-if="curSelection.equipments[index].hp">生命+{{curSelection.equipments[index].hp}}</div>
                        <div class="equip-pow" v-if="curSelection.equipments[index].pow">意志+{{curSelection.equipments[index].pow}}</div>
                        <div class="equip-str" v-if="curSelection.equipments[index].strOffset">力量+{{curSelection.equipments[index].strOffset}}</div>
                        <div class="equip-acr" v-if="curSelection.equipments[index].acrOffset">精准+{{curSelection.equipments[index].acrOffset}}</div>
                        <div class="equip-dex" v-if="curSelection.equipments[index].dexOffset">速度+{{curSelection.equipments[index].dexOffset}}</div>
                        <div class="equip-dmg-wrap" v-if="curSelection.equipments[index].equipType==1">
                            <div class="equip-dmg" v-if="curSelection.equipments[index].dmg[index2]>0" v-for="(name2,index2) in ['割据','突刺','钝击','炮火','射击','抽击',]">
                                {{name2}}：{{curSelection.equipments[index].dmg[index2]}} (消耗：{{curSelection.equipments[index].consume[index2]}}) (效果等级：{{curSelection.equipments[index].buffLevels[index2]}})
                            </div>
                        </div>
                        <div class="option-wrap" v-if="type==2">
                            <a class="btn" v-if="index==1" @click="onClickSwitchWeapon(curSelection.equipments[index],1)">切换</a>
                            <a class="btn" @click="onClickTakeoff(curSelection.equipments[index])">卸下</a>
                            <a class="btn" @click="onClickMoveEquips([curSelection.equipments[index]])">转移</a>
                        </div>
                    </div>

                    <!-- 副手武器 -->
                    <div class="vice" v-if="!curSelection.role.heroTeached&&curSelection.equipments[index].vice&&curSelection.equipments[index].vice.id">
                        <i class="equip-name">
                            副武器：{{curSelection.equipments[index].vice.name}}
                            <span v-if="curSelection.equipments[index].vice.equipType==1&&curSelection.equipments[index].vice.type==2"> (全)</span>
                            <a class="btn btn-edit" @click="onClickEditEquipName(curSelection.equipments[index].vice)" v-if="type==2&&curSelection.equipments[index].vice.equipType==1" title="修改名字">✍</a>
                        </i>
                        <div v-if="!curSelection.role.heroTeached">
                            <div class="equip-price" v-if="curSelection.equipments[index].vice.price&&type==2"><b class="price" v-html="common.moneyFormat(curSelection.equipments[index].vice.price,1)"></b></div>
                            <div class="equip-awareness">存在感：{{parseFloat(curSelection.equipments[index].vice.fixawareness/100).toFixed(2)}}%</div>
                            <div class="equip-hp" v-if="curSelection.equipments[index].vice.hp">生命+{{curSelection.equipments[index].vice.hp}}</div>
                            <div class="equip-pow" v-if="curSelection.equipments[index].vice.pow">意志+{{curSelection.equipments[index].vice.pow}}</div>
                            <div class="equip-str" v-if="curSelection.equipments[index].vice.strOffset">力量+{{curSelection.equipments[index].vice.strOffset}}</div>
                            <div class="equip-acr" v-if="curSelection.equipments[index].vice.acrOffset">精准+{{curSelection.equipments[index].vice.acrOffset}}</div>
                            <div class="equip-dex" v-if="curSelection.equipments[index].vice.dexOffset">速度+{{curSelection.equipments[index].vice.dexOffset}}</div>
                            <div class="equip-dmg-wrap">
                                <div class="equip-dmg" v-if="curSelection.equipments[index].vice.dmg[index3]>0" v-for="(name3,index3) in ['割据','突刺','钝击','炮火','射击','抽击',]">
                                    {{name3}}：{{curSelection.equipments[index].vice.dmg[index3]}} (消耗：{{curSelection.equipments[index].vice.consume[index3]}}) (效果等级：{{curSelection.equipments[index].vice.buffLevels[index3]}})
                                </div>
                            </div>
                            <div class="option-wrap" v-if="type==2">
                                <a class="btn" v-if="index==1" @click="onClickSwitchWeapon(curSelection.equipments[index].vice,0)">切换</a>
                                <a class="btn" @click="onClickTakeoff(curSelection.equipments[index].vice)">卸下</a>
                                <a class="btn" @click="onClickMoveEquips([curSelection.equipments[index].vice])">转移</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel role-equip bag">
            <div class="panel-title">
                <span class="panel-title-name">▶ 背包 ◀<small v-if="curSelection.bag.length">（{{curSelection.bag.length}}）</small></span>
                <span class="panel-title-btn-wrap" v-if="type==2">
                    <a class="btn btn-pt" @click="onTapLockoffAll" v-if="curSelection.bag.length>0">全部解锁</a>
                    <a class="btn btn-pt" @click="onTapMoveAll" v-if="curSelection.bag.length>0">全部转移</a>
                    <a class="btn btn-pt" @click="onTapSellAll" v-if="mode==2&&curSelection.bag.length>0">全部售卖</a>
                </span>
            </div>
            <div class="panel-content">
                <div class="equip-item" v-for="(equip,index) in curSelection.bag" @mouseenter="onmouseoverBag(equip)" @mouseleave="onmouseooutBag(equip)">
                    <i class="equip-name">
                        {{equip.name}}
                        <span v-if="equip.equipType==1&&equip.type==2"> (全)</span>
                        <a class="btn btn-edit" @click="onClickEditEquipName(equip)" v-if="type==2&&equip.equipType==1" title="修改名字">✍</a>
                    </i>
                    <div class="equip-price" v-if="equip.price&&type==2"><b class="price" v-html="common.moneyFormat(equip.price,1)"></b></div>
                    <div class="equip-awareness">存在感：{{parseFloat(equip.fixawareness/100).toFixed(2)}}%</div>
                    <div class="equip-hp" v-if="equip.hp">生命+{{equip.hp}}</div>
                    <div class="equip-pow" v-if="equip.pow">意志+{{equip.pow}}</div>
                    <div class="equip-str" v-if="equip.strOffset">力量+{{equip.strOffset}}</div>
                    <div class="equip-acr" v-if="equip.acrOffset">精准+{{equip.acrOffset}}</div>
                    <div class="equip-dex" v-if="equip.dexOffset">速度+{{equip.dexOffset}}</div>
                    <div class="equip-dmg-wrap" v-if="equip.equipType==1">
                        <div class="equip-dmg" v-if="equip.dmg[index2]>0" v-for="(name,index2) in ['割据','突刺','钝击','炮火','射击','抽击',]">
                            {{name}}：{{equip.dmg[index2]}} (消耗：{{equip.consume[index2]}}) (效果等级：{{equip.buffLevels[index2]}})
                        </div>
                    </div>
                    <div class="option-wrap" v-if="type==1&&curSelection.role.standpoint==2">
                        <a class="btn" @click="onClickBuy(equip,Math.round(equip.price*curSelection.role.priceRatio/100))">购买（&nbsp;<b class="price" v-html="common.moneyFormat(Math.round(equip.price*curSelection.role.priceRatio/100))"></b>&nbsp;$）</a>
                    </div>
                    <div class="option-wrap" v-if="type==2">
                        <a class="btn" v-if="!equip.locked" @click="onClickLockEquip(equip,1)">LOCK</a>
                        <a class="btn" v-if="equip.locked" @click="onClickLockEquip(equip,0)">UNLOCK</a>
                        <a class="btn" v-if="(mode==1||mode==3||mode==4)&&!equip.locked&&!equip.joinedCombine" @click="onClickTakeon(equip)">装备</a>
                        <a class="btn" v-if="!equip.locked" @click="onClickMoveEquips([equip])">转移</a>
                        <a class="btn" v-if="mode==2&&!equip.locked" @click="onClickSellEquips([equip])">售卖（&nbsp;<b class="price" v-html="common.moneyFormat(Math.round(equip.price/2))"></b>&nbsp;$）</a>
                        <a class="btn btn-deposit" v-if="mode==4&&!equip.locked" @click="onClickDepositEquip(equip)">寄存</a>
                        <a class="btn btn-red" v-if="mode==3&&!equip.locked&&!equip.joinedCombine&&(!firstCombineEquip||(firstCombineEquip&&firstCombineEquip.equipType==equip.equipType))" @click="onClickJoinCombineEquip(equip)">加入熔炉</a>
                    </div>
                    <div class="compare" v-if="mouseonEquip&&compares.length>0&&mouseonEquip.id==equip.id">
                        <div class="equip-item compare-item" v-for="(compareEquip,index2) in compares">
                            <i class="equip-name">{{compareEquip.owner.name}}:{{compareEquip.name}}
                            <span v-if="compareEquip.equipType==1&&compareEquip.type==2"> (全)</span><span v-if="!compareEquip.fixawareness&&compareEquip.fixawareness!=0">空</span></i>
                            <div v-if="compareEquip.fixawareness||compareEquip.fixawareness==0">
                                <div class="equip-awareness" v-if="compareEquip.fixawareness||compareEquip.fixawareness==0">存在感：{{parseFloat(compareEquip.fixawareness/100).toFixed(2)}}%</div>
                                <div class="equip-hp" :class="compareEquip.suffix.hp?'bold':''" v-if="compareEquip.hp||equip.hp">
                                    生命+{{compareEquip.hp||0}}<b class='suffix' v-if='compareEquip.suffix.hp'>&nbsp;{{compareEquip.suffix.hp}}</b>
                                </div>
                                <div class="equip-pow" :class="compareEquip.suffix.pow?'bold':''" v-if="compareEquip.pow||equip.pow">
                                    意志+{{compareEquip.pow||0}}<b class='suffix' v-if='compareEquip.suffix.pow'>&nbsp;{{compareEquip.suffix.pow}}</b>
                                </div>
                                <div class="equip-str" :class="compareEquip.suffix.str?'bold':''" v-if="compareEquip.strOffset||equip.strOffset">
                                    力量+{{compareEquip.strOffset||0}}<b class='suffix' v-if='compareEquip.suffix.str'>&nbsp;{{compareEquip.suffix.str}}</b>
                                </div>
                                <div class="equip-acr" :class="compareEquip.suffix.acr?'bold':''" v-if="compareEquip.acrOffset||equip.acrOffset">
                                    精准+{{compareEquip.acrOffset||0}}<b class='suffix' v-if='compareEquip.suffix.acr'>&nbsp;{{compareEquip.suffix.acr}}</b>
                                </div>
                                <div class="equip-dex" :class="compareEquip.suffix.dex?'bold':''" v-if="compareEquip.dexOffset||equip.dexOffset">
                                    速度+{{compareEquip.dexOffset||0}}<b class='suffix' v-if='compareEquip.suffix.dex'>&nbsp;{{compareEquip.suffix.dex}}</b>
                                </div>
                                <div class="equip-dmg-wrap" v-if="compareEquip.equipType==1">
                                    <div class="equip-dmg" v-if="compareEquip.dmg[index3]>0" v-for="(name,index3) in ['割据','突刺','钝击','炮火','射击','抽击',]">
                                        {{name}}：{{compareEquip.dmg[index3]}} (消耗：{{compareEquip.consume[index3]}}) (效果等级：{{compareEquip.buffLevels[index3]}})
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel role-halo" v-if="curSelection.slots.length>0||curSelection.halos.length>0||curSelection.role.standpoint==4">
            <div class="panel-title">▶ 光环 ◀</div>
            <div class="panel-content">
                <div class="slot-item" :class="{'slot-on':slot.id}" v-for="(slot,index) in curSelection.slots">
                    <div class="slot-name">
                        <span class="slot-title" v-if="!slot.id">槽位{{['一','二','三','四','五','六','七','八','九','十',][index]}}：</span>
                        <span class="slot-halo-name" v-else>槽位{{['一','二','三','四','五','六','七','八','九','十',][index]}}：{{slot.name}}</span>
                    </div>
                    <div class="option-wrap" v-if="curSelection.role.standpoint==4">
                        <a class="btn" v-if="slot.id" @click="onClickHaloOff(index)">卸下</a>
                        <a class="btn" v-if="map.type==0" @click="onClickMoveSlot(index)">转移</a>
                    </div>
                </div>
                <div class="halo-item" v-for="(halo,index) in curSelection.halos">
                    <div class="halo-name">
                        <span>{{halo.name}}</span>
                    </div>
                    <div class="option-wrap" v-if="curSelection.role.standpoint==4">
                        <a class="btn" @click="onClickHaloOn(halo)">装上</a>
                        <a class="btn" v-if="map.type==0" @click="onClickMoveHalo(halo)">转移</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel role-skill">
            <div class="panel-title">▶ 技能 ◀ <small>（{{curSelection.skills.length}}）</small></div>
            <div class="panel-content">
                <draggable class="skill-list-group" handle=".mover" :disabled="map.type!=0||type!=2" v-model="curSelection.skills" @end="onSkillDragEnd" animation="100">
                    <div class="skill-item" :class="{'skill-on':index<CONFIG.maxSkillCountOnBattle,'skill-item-draggable':(map.type==0&&type==2)}" v-for="(skill,index) in curSelection.skills">
                        <div v-if="map.type==0&&type==2" class="mover draggable" title="按住拖拽排序"></div>
                        <div class="skill-name">
                            <span><b v-if="skill.heroName&&!curSelection.role.isHero">{{skill.heroName}}·</b>{{skill.name}}</span>
                            <!-- <span><b v-if="skill.heroName&&!curSelection.role.isHero">{{skill.heroName}}·</b>{{skill.name}}[{{['护','强','伤','弱'][skill.trend]}}]</span> -->
                            (<span class="pow">{{skill.consume}}</span>)
                            <span class="on" v-if="!curSelection.role.heroTeached" v-html="">{{skillTip(index)}}</span>
                            <a class="btn btn-edit" @click="onClickEditSkillName(skill)" v-if="type==2&&skill.price!=0&&!skill.heroName" title="修改名字">✍</a>
                            <!-- <a class="btn btn-sort" @click="onClickSkillSort(curSelection.role,skill,-1)" v-if="map.type==0&&type==2&&index>0" title="向上移动">▲</a>
                            <a class="btn btn-sort" @click="onClickSkillSort(curSelection.role,skill,1)" v-if="map.type==0&&type==2&&index<curSelection.skills.length-1" title="向下移动">▼</a> -->
                        </div>
                        <div class="skill-price" v-if="type==2&&skill.price!=0"><b class="price" v-html="common.moneyFormat(skill.price,1)"></b></div>
                        <div class="skill-tip" v-html="common.genSkillTip(skill,1)"></div>
                        <div class="option-wrap" style="height:auto" v-if="!curSelection.role.isHero">
                            <a class="btn" v-if="map.type==0&&type==2&&skill.price!=0" @click="onClickMoveSkill(skill)">转移</a>
                            <a class="btn" v-if="mode==2&&skill.price!=0" @click="onClickSellSkill(skill,Math.round(skill.price/2))">售卖（&nbsp;<b class="price" v-html="common.moneyFormat(Math.round(skill.price/2))"></b>&nbsp;$）</a>
                            <a class="btn" v-if="type==1&&skill.price!=0&&curSelection.role.standpoint==2" @click="onClickLearn(skill,Math.round(skill.price*curSelection.role.priceRatio/200))">请教（&nbsp;<b class="price" v-html="common.moneyFormat(Math.round(skill.price*curSelection.role.priceRatio/200))"></b>&nbsp;$）</a>
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort, getMatchList } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import Bar1 from './Bar1';
import Bar2 from './Bar2';
import { DEBUG, CONFIG, CACHE } from '../config/config';
import draggable from 'vuedraggable';
export default {
    props:{
        game: Object,
        map: Object,
        curSelection: {
            type: Object,
            default: {},
        },
        curMeSelection: {
            type: Object,
            default: {},
        },
        type: { // 1:NPC 2:队员
            type: Number,
            default: 0,
        },
        mode: { // 1:查看 2:售卖 3:融合 4:寄存
            type: Number,
            default: 0,
        },
        firstCombineEquip: Object,
        onClickHire: Function,
        onClickFight: Function,
        onClickCallback: Function,
        onClickLeave: Function,
        onClickBuy: Function,
        onClickSellEquips: Function,
        onClickDepositEquip: Function,
        onClickSellSkill: Function,
        onClickTakeoff: Function,
        onClickMoveEquips: Function,
        onClickMoveSkill: Function,
        onClickLearn: Function,
        onClickTakeon: Function,
        onClickEditSkillName: Function,
        onClickEditEquipName: Function,
        onClickLockEquip: Function,
        onClickSkillSort: Function,
        onClickJoinCombineEquip: Function,
        onClickSwitchWeapon: Function,
        onClickHaloOn: Function,
        onClickHaloOff: Function,
        onClickMoveHalo: Function,
        onClickMoveSlot: Function,
        onClickViewRebuild: Function,
        onSkillDragEnd: Function,
    },
    data() {
        return {
            common,
            mouseonEquip: null,
            compares: [],

            viewDetail: false,

            common,
            CONFIG,
            DEBUG,
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){

        },
        onmouseoverBag(equip){ // 显示【对比】
            this.mouseonEquip = equip;
            this.compares = [];
            let myTeam = getMatchList(this.game.allRoles,[['standpoint',4]]);
            myTeam = bulbsort(myTeam,'teamOrder',0);
            for(let member of myTeam){
                let onequipID = member.equipments[CONFIG.equipItemNameMap[equip.equipType]].id;
                let onequip = getMatchList(this.game.allEquips,[['id',onequipID]])[0];
                if(onequip){
                    if(this.compares.length<myTeam.length){
                        let hp = equip.hp>onequip.hp?`+${equip.hp-onequip.hp}`:'';
                        let pow = equip.pow>onequip.pow?`+${equip.pow-onequip.pow}`:'';
                        let str = equip.strOffset>onequip.strOffset?`+${equip.strOffset-onequip.strOffset}`:'';
                        let acr = equip.acrOffset>onequip.acrOffset?`+${equip.acrOffset-onequip.acrOffset}`:'';
                        let dex = equip.dexOffset>onequip.dexOffset?`+${equip.dexOffset-onequip.dexOffset}`:'';
                        let suffix = {
                            hp,
                            pow,
                            str,
                            acr,
                            dex,
                        };
                        let compareObj = {
                            owner: member,
                            suffix: {
                                hp: 0,
                                pow: 0,
                                str: 0,
                                acr: 0,
                                dex: 0,
                            },
                            ...onequip,
                        }
                        if(equip.equipType==1&&equip.type==onequip.type){
                            compareObj.suffix = suffix;
                        }
                        else if(equip.equipType!=1){
                            compareObj.suffix = suffix;
                        }
                        this.compares.push(compareObj);
                    }
                }
                else{
                    this.compares.push({
                        owner: member,
                        suffix: {
                            hp: 0,
                            pow: 0,
                            str: 0,
                            acr: 0,
                            dex: 0,
                        },
                    });
                }
            }
        },
        onmouseooutBag(equip){ // 取消显示【对比】
            this.mouseonEquip = null;
            this.compares = [];
        },
        skillTip(index){
            return index<CONFIG.maxSkillCountOnBattle?'':'[战斗外]';
        },
        onClickViewDetail(){ // 点击【详情】按钮
            this.viewDetail = !this.viewDetail;
        },

        onTapTakeoffAll(){ // 点击【全部卸下】按钮
            for(let i=0;i<5;i++){
                let equip = this.curSelection.equipments[i];
                this.onClickTakeoff(equip);
            }
            this.onClickTakeoff(this.curSelection.equipments[1].vice);
        },
        onTapLockoffAll(){ // 点击【全部解锁】按钮
            let bag = this.curSelection.bag;
            for(let equip of bag){
                this.onClickLockEquip(equip,0);
            }
        },
        onTapMoveAll(){ // 点击【全部转移】按钮
            this.onClickMoveEquips(this.curSelection.bag);
        },
        onTapSellAll(){ // 点击【全部售卖】按钮
            this.onClickSellEquips(this.curSelection.bag);
        },

        calcRelationship(ratio){ // 计算亲近度
            let res = 0;
            let max = 560, min = CONFIG.minPriceRatio;
            res = Math.floor((max-ratio)/(max-min)*100);
            return res;
        },
    },
    components:{
        Bar1,
        Bar2,
        draggable,
    },
};
</script>
<style scoped>
    /* panel */
    .bar-1{
        margin-bottom: 4px;
    }
    .member{
        border: 1px solid #131313;
        border-radius: 4px;
        width: 100%;
        height: 140px;
        padding: 4px;
        margin-bottom: 6px;
    }
    .member-name{
        height: 32px;
        line-height: 32px;
        font-size: 16px;
    }
    .member-name span{
        display: inline-block;
        margin-left: 16px;
        font-size: 14px;
    }
    .member-grave{
        color: #666;
        margin-bottom: 6px;
    }
    .option{
        width: 100%;
        max-height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .panel{
        border: 1px solid #131313;
        border-left: 4px solid #131313;
    }
    .role{
        position: relative;
        padding: 2px 8px;
    }
    .attr-wrap{
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .member-attr{
        background-color: #131313;
        height: 22px;
        line-height: 22px;
        text-align: center;
        width: 100px;
        font-size: 12px;
        white-space: nowrap;
        word-break: keep-all;
        color: #fff;
    }
    .str{
        background-color: FireBrick;
    }
    .acr{
        background-color: #1E90FF;
    }
    .dex{
        background-color: ForestGreen;
    }
    .member-attr span{
        font-size: 16px;
    }
    .option .btn{
        min-width: 65px;
        padding: 0 8px;
        height: 40px;
        margin: 4px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #131313;
        color: #fff;
        text-align: center;
    }
    .btn-leave{
        position: absolute;
        top: 770px;
        right: 10px;
        height: 120px;
        width: 130px;
        font-size: 28px;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btn{
        cursor: pointer;
    }
    .btn:hover{
        opacity: .8;
    }
    .panel-title{
        position: relative;
        font-weight: bold;
        color: #fff;
        background-color: #131313;
        padding: 0 8px;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #131313;
    }
    .panel-title-name{

    }
    .panel-title-btn-wrap{
        position: absolute;
        top: 0;
        right: 4px;
        height: 100%;
    }
    .panel-content{
        min-height: 10px;
    }
    .btn-pt{
        font-size: 11px;
        margin: 0 2px;
        padding: 2px;
        background-color: transparent !important;
        border: 1px solid #fff;
    }
    /* detail */
    .equip-item{
        position: relative;
        border: 1px solid #131313;
        padding: 6px;
        margin-bottom: 8px;
        box-shadow: 0 4px 4px #000;
        animation: item .25s ease-out forwards;
    }
    @keyframes item {
        from{
            background-color: #000;
        }
        to{
            background-color: #fff;
        }
    }
    .compare{
        position: absolute;
        right: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        border-width: 4px;
        width: 95%;
        bottom: calc( 100% - 15px );
    }
    .compare .equip-name{
        color: DarkSlateBlue !important;
    }
    .equip-title{
        color: MediumSlateBlue;
    }
    .equip-onbody{
    }
    .equip-name{
        color: DarkSlateBlue;
        font-weight: bold;
        font-size: 18px;
    }
    .equip-type-0{
        /* position: absolute; */
    }
    .equip-type-1{

    }
    .equip-type-2{

    }
    .equip-type-3{

    }
    .equip-type-4{

    }
    .equip-price{
        position: absolute;
        top: 2px;
        right: 8px;
        height: 30px;
        line-height: 30px;
        text-align: right;
    }
    .price{
        color: DarkOrange;
    }
    .equip-dmg-wrap{
        line-height: 20px;
        margin: 4px 0;
        color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .equip-dmg{
        width: 100%;
        height: 20px;
        line-height: 20px;
        padding-left: 4px;
        margin-bottom: 2px;
        background-image: linear-gradient(to right, #131313 80%, transparent 100%);
    }
    .bold{
        font-weight: bold;
    }
    .compare-item{
        border-width: 4px;
        border-color: SeaGreen;
        background-color: MintCream;
        padding: 2px;
        margin-bottom: 2px;
        font-size: 13px;
        color: #444;
        width: 100%;
        box-shadow: 0 4px 4px #000;
        animation: none;
    }
    .compare-item .equip-name{
        font-size: 13px;
    }
    .compare-item .equip-dmg-wrap{
        padding: 2px;
        background-color: Azure;
        border-color: ForestGreen;
    }
    .compare-item .suffix{
        color: OrangeRed;
    }
    .compare-item .equip-dmg{
        height: 14px;
        line-height: 14px;
    }
    .skill-item{
        background-color: #eaeaea;
    }
    .skill-on{
        background-color: #fff;
    }
    .draggable{
        cursor: cell;
    }
    .skill-item .skill-name{
        color: #444;
    }
    .skill-on .skill-name{
        color: OrangeRed;
    }
    .skill-item,.halo-item,.slot-item{
        position: relative;
        padding: 0 6px;
        border-bottom: 1px solid #ccc;
        padding-top: 4px;
    }
    .skill-item-draggable{
        padding-left: 22px;
    }
    .skill-name{
        height: 20px;
        font-weight: bold;
        color: OrangeRed;
        font-size: 14px;
        line-height: 20px;
    }
    .mover{
        position: absolute;
        left: 2px;
        top: 5%;
        width: 16px;
        height: 90%;
        border-top: 2px solid #bbb;
        border-bottom: 2px solid #999;
        background-image: linear-gradient(to right, #ccc 0%, #fff 50%, #ccc 100%);
    }

    .halo-item,.slot-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        height: 30px;
        line-height: 30px;
        border-bottom: #ccc solid 1px;
        transition: all .2s;
    }
    .halo-name{
        color: OrangeRed;
        font-weight: bold;
    }
    .slot-name{
        font-weight: bold;
    }
    .slot-title{
        color: #aaa;
    }
    .slot-halo-name{
        color: #fff;
    }
    .slot-on{
        background-color: OrangeRed;
        height: 50px;
        line-height: 50px;
    }
    .slot-on .halo-name{
        color: white;
        padding-left: 33px;
        text-shadow: 0 0 6px #ccc;
    }
    .btn-edit{
        display: inline-block;
        height: 16px;
        line-height: 16px;
        width: 16px;
        font-size: 10px;
    }
    .skill-price{
        position: absolute;
        top: 2px;
        right: 8px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        text-align: right;
    }
    .skill-tip{
        font-size: 14px;
        line-height: 24px;
        padding: 4px 0;
        color: #666;
    }
    .pow{
        color: RoyalBlue;
    }
    .option-wrap{
        margin: 2px 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 25px;
        line-height: 25px;
    }
    .option-wrap .btn{
        min-width: 65px;
        padding: 0 8px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #131313;
        color: #fff;
        text-align: center;
        margin: 0 2px;
    }
    .onequip{
        background-color: MediumSlateBlue !important;
    }
    .onequip .equip-title{

    }
    .onequip .btn{
        background-color: DarkSlateBlue;
    }
    .bag{
    }
    .bag .equip-name{
        color: #131313;
    }
    .btn-deposit{
        background-color: DarkCyan !important;
    }
    .btn-red{
        background-color: FireBrick !important;
    }
    .btn-viewdetail{
        display: inline-block;
        padding: 0 6px;
        font-size: 14px;
        height: 17px;
        line-height: 17px;
        background-color: #131313;
        color: #fff;
        text-align: center;
        margin-left: 10px;
    }
    /* .awareness label{
        color: #131313;
        font-size: 14px;
    }
    .awareness span{
        color: Orange;
        font-weight: bold;
        font-size: 16px;
    } */
    .rankscore{
        position: absolute;
        top: 28px;
        right: 20px;
        height: 40px;
        line-height: 20px;
        display: flex;
        text-align: center;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        background-color: FireBrick;
        color: #fff;
        padding: 0 3px;
        box-shadow: 3px 3px 6px #000;
        transform: skewX(-20deg);
    }
    .rankscore label{
        font-size: 13px;
        width: 70px;
    }
    .rankscore span{
        font-weight: bold;
        letter-spacing: 2px;
        font-size: 16px;
        min-width: 45px;
    }
    .detail{
        padding: 2px 4px;
        background-color: #333;
        color: #fff;
    }
    .detail-title{
        height: 18px;
        line-height: 18px;
        margin: 6px 0;
        text-indent: 4px;
        border-left: 4px solid orange;
    }
    .btn-sort{
        display: inline-block;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        font-size: 12px;
        background-color: #131313;
        color: #fff;
    }
    .skill-on{

    }
    .skill-on .on{
        color: DarkSlateBlue;
    }
    .skill-on .option-wrap .btn,
    .skill-on .btn-sort{
        background-color: DarkSlateBlue;
    }

    .equip-type-1{
        background-color: CornflowerBlue;
        animation: none;
        color: #fff;
    }
    .equip-type-1 .equip-name{
        color: #fff;
    }
    .equip-type-1 .price{
        text-shadow: 0 0 4px #000;
    }
    .vice{
        position: relative;
        border: 2px dashed #131313;
        margin-top: 10px;
        padding: 6px;
        background-color: #777;
        /* position: relative;
        background-color: #fff;
        margin-top: 10px;
        padding: 6px;
        color: #131313; */
    }
    .vice .equip-name{
        font-size: 13px;
    }
    /* .vice .equip-name{
        color: DarkSlateBlue;
    }
    .vice .price{
        text-shadow: none;
    } */
</style>
