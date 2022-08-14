<template>
    <div class="role-editor">
        <div class="title">- {{mode==1?'新增角色':`编辑角色：${arole.name}`}} -</div>
        <div class="role">
            <div class="role-basic role-board role-board-1">
                <div class="board-title">人物<a class="btn btn-rand" @click="onTapRandom(1)">随</a></div>
                <div class="inp">
                    <label>姓名</label>
                    <div class="inp-wrap">
                        <input v-model="arole.name" />
                    </div>
                </div>
                <div class="inp">
                    <label>年龄</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.age" placeholder=">=13" />
                    </div>
                </div>
                <div class="inp">
                    <label>性别</label>
                    <div class="btn-wrap">
                        <a class="btn btn-gender" :class="{'btn-select':arole.gender==1}" @click="arole.gender=1">男</a>
                        <a class="btn btn-gender" :class="{'btn-select':arole.gender==2}" @click="arole.gender=2">女</a>
                    </div>
                </div>
                <div class="inp">
                    <label>与主角关系</label>
                    <div class="btn-wrap btn-wrap-4">
                        <a class="btn btn-gender" :class="{'btn-select':arole.standpoint==0}" @click="arole.standpoint=0">路人</a>
                        <a class="btn btn-gender" :class="{'btn-select':arole.standpoint==1}" @click="arole.standpoint=1">相识</a>
                        <a class="btn btn-gender" :class="{'btn-select':arole.standpoint==2}" @click="arole.standpoint=2">友好</a>
                        <a class="btn btn-gender" :class="{'btn-select':arole.standpoint==3}" @click="arole.standpoint=3">同道</a>
                    </div>
                </div>
                <div class="hr">战斗数据</div>
                <div class="inp">
                    <label>存在感</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.fixawareness" placeholder="0到100" />
                    </div>
                </div>
                <div class="inp">
                    <label>生命值</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.basehp" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>意志值</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.basepow" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>力量</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.basestr" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>精准</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.baseacr" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>速度</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.basedex" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>意志消耗</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.consume" placeholder="1到3" />
                    </div>
                </div>
                <div class="inp">
                    <label>状态抗性</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.imm" placeholder="0到100" />
                    </div>
                </div>
                <div class="inp">
                    <label>攻击力</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.baseAttack" placeholder=">0" />
                    </div>
                </div>
                <div class="inp">
                    <label>大脑等级</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.brainLevel" placeholder="4-8" />
                    </div>
                </div>
                <div class="inp">
                    <label>基础价值</label>
                    <div class="inp-wrap">
                        <input type="number" v-model="arole.basePrice" placeholder=">0" />
                    </div>
                </div>
            </div>
            <div class="role-equip role-board role-board-2">
                <div class="board-title">装备<a class="btn btn-rand" @click="onTapRandom(2)">随</a></div>
                <div class="equip-item" :class="'equip-type-'+index" v-for="(name,index) in CONFIG.equipItemNameMap">
                    <div class="equip-title">{{equipTypeNames[index]}}</div>
                    <a class="btn-add-item" v-if="!(arole.equipments[name]&&arole.equipments[name].exist)" @click="onTapAddEquip(name,index)">+</a>
                    <div class="equip-form" v-else>
                        <div class="inp-row">
                            <div class="inp-4">
                                <label>名字</label>
                                <input v-model="arole.equipments[name].name" />
                            </div>
                            <div class="inp-6" v-if="name=='hands'">
                                <label>模式</label>
                                <div class="btn-wrap btn-wrap-line">
                                    <a class="btn btn-gender" :class="{'btn-select':arole.equipments[name].type==1}" @click="arole.equipments[name].type=1">单体</a>
                                    <a class="btn btn-gender" :class="{'btn-select':arole.equipments[name].type==2}" @click="arole.equipments[name].type=2">全体</a>
                                </div>
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-4">
                                <label>生命值</label>
                                <input v-model="arole.equipments[name].hp" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-4">
                                <label>意志值</label>
                                <input v-model="arole.equipments[name].pow" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-4">
                                <label>存在感</label>
                                <input v-model="arole.equipments[name].fixawareness" placeholder="-25到100" type="number" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-4">
                                <label>力量</label>
                                <input v-model="arole.equipments[name].strOffset" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-4">
                                <label>精准</label>
                                <input v-model="arole.equipments[name].acrOffset" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-4">
                                <label>速度</label>
                                <input v-model="arole.equipments[name].dexOffset" type="number" placeholder=">=0" />
                            </div>
                        </div>
                        <!-- 武器 -->
                        <div class="inp-row" v-if="name=='hands'">
                            <div class="inp-2">
                                <label>割据</label>
                                <input v-model="arole.equipments[name].dmg[0]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>突刺</label>
                                <input v-model="arole.equipments[name].dmg[1]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>钝击</label>
                                <input v-model="arole.equipments[name].dmg[2]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>炮火</label>
                                <input v-model="arole.equipments[name].dmg[3]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>射击</label>
                                <input v-model="arole.equipments[name].dmg[4]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>抽击</label>
                                <input v-model="arole.equipments[name].dmg[5]" type="number" placeholder=">=0" />
                            </div>
                        </div>
                        <div class="inp-row" v-if="name=='hands'">
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[0]" type="number" placeholder="0到9" />
                            </div>
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[1]" type="number" placeholder="0到9" />
                            </div>
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[2]" type="number" placeholder="0到9" />
                            </div>
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[3]" type="number" placeholder="0到9" />
                            </div>
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[4]" type="number" placeholder="0到9" />
                            </div>
                            <div class="inp-2">
                                <label>等级</label>
                                <input v-model="arole.equipments[name].buffLevels[5]" type="number" placeholder="0到9" />
                            </div>
                        </div>
                        <div class="inp-row" v-if="name=='hands'">
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[0]" type="number" placeholder="0到4" />
                            </div>
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[1]" type="number" placeholder="0到4" />
                            </div>
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[2]" type="number" placeholder="0到4" />
                            </div>
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[3]" type="number" placeholder="0到4" />
                            </div>
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[4]" type="number" placeholder="0到4" />
                            </div>
                            <div class="inp-2">
                                <label>消耗</label>
                                <input v-model="arole.equipments[name].consume[5]" type="number" placeholder="0到4" />
                            </div>
                        </div>
                        <a class="btn-del-equip" @click="onTapDeleteEquip(name,index)">删除</a>
                    </div>
                </div>
            </div>
            <div class="role-skill role-board role-board-3">
                <div class="board-title">技能<a class="btn btn-rand" @click="onTapRandom(3)">随</a></div>
                <div class="role-skill-wrap">
                    <div class="item" v-for="(skill,index) in arole.skills">
                        <div class="inp-row">
                            <div class="inp-3">
                                <label>名字</label>
                                <input v-model="skill.name" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-3">
                                <label><a class="btn btn-help" @click="info=`数字代表技能目标：<br/>1-我方单体 2-我方全体 3-我方随机单体<br/>4-自己 5-敌方单体 6-敌方全体<br/>7-敌方随机单体 8-敌我全体 9-任一单体`">i</a>&nbsp;目标</label>
                                <input v-model="skill.target" type="number" />
                            </div>
                            <div class="inp-3">
                                <label><a class="btn btn-help"  @click="info=`数字代表技能效果：<br/>1-伤害 2-治疗 3-调整意志<br/>7-调整行动力 8-调整存在感 9-添加状态<br/>10-解除负面状态<br/>11-解除正面状态`">i</a>&nbsp;效果一</label>
                                <input v-model="skill.effects[0]" type="number" />
                            </div>
                            <div class="inp-3" v-if="skill.effects[0]&&skill.effects[0]>0">
                                <label>效果二</label>
                                <input v-model="skill.effects[1]" type="number" />
                            </div>
                            <div class="inp-3" v-if="skill.effects[1]&&skill.effects[1]>0&&skill.effects[0]&&skill.effects[0]>0">
                                <label>效果三</label>
                                <input v-model="skill.effects[2]" type="number" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-2">
                                <label>治疗</label>
                                <input v-model="skill.cure" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>治疗比 </label>
                                <input v-model="skill.cureRate" type="number" placeholder="0到100" />
                            </div>
                            <div class="inp-2">
                                <label>提供意志</label>
                                <input v-model="skill.powShift" type="number" placeholder="<=0" />
                            </div>
                            <div class="inp-3">
                                <label>提供存在感</label>
                                <input v-model="skill.awaShift" type="number" placeholder="-100到100" />
                            </div>
                            <div class="inp-3">
                                <label>提供行动力</label>
                                <input v-model="skill.moveShift" type="number" placeholder="-100到100" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-3">
                                <label>消耗</label>
                                <input v-model="skill.consume" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-3">
                                <label>存在感</label>
                                <input v-model="skill.fixawareness" type="number" placeholder="0到100" />
                            </div>
                            <div class="inp-3">
                                <label>必中</label>
                                <div class="btn-wrap btn-wrap-line">
                                    <a class="btn btn-gender" :class="{'btn-select':skill.absolute==0}" @click="skill.absolute=0">否</a>
                                    <a class="btn btn-gender" :class="{'btn-select':skill.absolute==1}" @click="skill.absolute=1">是</a>
                                </div>
                            </div>
                            <div class="inp-3">
                                <label>能够学习</label>
                                <div class="btn-wrap btn-wrap-line">
                                    <a class="btn btn-gender" :class="{'btn-select':!skill.canLearn}" @click="skill.canLearn=false">否</a>
                                    <a class="btn btn-gender" :class="{'btn-select':skill.canLearn}" @click="skill.canLearn=true">是</a>
                                </div>
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-2">
                                <label>割据</label>
                                <input v-model="skill.dmg[0]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>突刺</label>
                                <input v-model="skill.dmg[1]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>钝击</label>
                                <input v-model="skill.dmg[2]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>炮火</label>
                                <input v-model="skill.dmg[3]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>射击</label>
                                <input v-model="skill.dmg[4]" type="number" placeholder=">=0" />
                            </div>
                            <div class="inp-2">
                                <label>抽击</label>
                                <input v-model="skill.dmg[5]" type="number" placeholder=">=0" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-6">
                                <label>解除负面状态数量</label>
                                <input v-model="skill.badImpact" type="number" placeholder="1-3" />
                            </div>
                            <div class="inp-6">
                                <label>解除正面状态数量</label>
                                <input v-model="skill.goodImpact" type="number" placeholder="1-3" />
                            </div>
                        </div>
                        <div class="inp-row">
                            <div class="inp-3">
                                <label><a class="btn btn-help" @click="onTapHelp(1)">i</a>&nbsp;状态一</label>
                                <input v-model="skill.buffs[0]" type="number" />
                            </div>
                            <div class="inp-3" v-if="skill.buffs[0]&&skill.buffs[0]>0">
                                <label>状态二</label>
                                <input v-model="skill.buffs[1]" type="number" />
                            </div>
                            <div class="inp-3" v-if="skill.buffs[1]&&skill.buffs[1]>0&&skill.buffs[0]&&skill.buffs[0]>0">
                                <label>状态三</label>
                                <input v-model="skill.buffs[2]" type="number" />
                            </div>
                        </div>
                        <div class="inp-row" v-if="skill.buffs[0]&&skill.buffs[0]>0">
                            <div class="inp-3" v-if="skill.buffs[0]&&skill.buffs[0]>0">
                                <label>状态等级一</label>
                                <input v-model="skill.buffLevels[0]" type="number" placeholder="1到9" />
                            </div>
                            <div class="inp-3" v-if="skill.buffs[0]&&skill.buffs[0]>0&&skill.buffs[1]&&skill.buffs[1]>0">
                                <label>状态等级二</label>
                                <input v-model="skill.buffLevels[1]" type="number" placeholder="1到9" />
                            </div>
                            <div class="inp-3" v-if="skill.buffs[0]&&skill.buffs[0]>0&&skill.buffs[1]&&skill.buffs[1]>0&&skill.buffs[2]&&skill.buffs[2]>0">
                                <label>状态等级三</label>
                                <input v-model="skill.buffLevels[2]" type="number" placeholder="1到9" />
                            </div>
                        </div>
                        <a class="btn-move-skill" @click="onTapMoveSkill(skill)" v-if="index!=0">上移</a>
                        <a class="btn-del-equip" @click="onTapDeleteSkill(skill)">删除</a>
                    </div>
                    <a class="btn-add-item" @click="onTapAddSkill()">+</a>
                </div>
            </div>
        </div>
        <a class="btn" @click="_onTapConfirm()">完成</a>
        <a class="btn" @click="onTapPreview()">预览效果</a>
        <a class="btn" @click="onTapEmpty()">清空</a>
        <a class="btn" @click="_onTapCancel()">取消</a>
        <div class="pop-info" v-if="info">
            <p v-html="info"></p>
            <a class="btn btn-close" @click="info=''">关闭</a>
        </div>
        <div class="pop-level" v-if="randomLevelMode">
            <div class="inp">
                <label>默认{{['','人物','装备','技能'][randomLevelMode]}}等级</label>
                <div class="inp-wrap">
                    <input type="number" v-model="defaultLevel" placeholder="1到9" />
                </div>
            </div>
            <div class="btn-wrap">
                <a class="btn btn-confirm-rand" @click="onTapConfirmRandom()">生成</a>
                <a class="btn" @click="randomLevelMode=0">关闭</a>
            </div>
        </div>
        <div class="pop-preview" v-if="preview.name">
            <div class="preview">
                <div class="preview-basic">
                    <div class="title">人物</div>
                    <div class="member-name">
                        <b>{{preview.name}} <i :style="{'color':['#131313','#131313','#1E90FF','#FF0000','#FF0000'][preview.standpoint],'font-size':'14px','font-weight':'normal'}">[{{['路人','相识','友好','同道','在队'][preview.standpoint]}}]</i></b>
                        &nbsp;<span>{{preview.gender==1?'男':'女'}}</span>
                        &nbsp;<span>{{preview.age}}岁</span>
                    </div>
                    <div class="attr-wrap">
                        <div class="member-attr">生命：<b>{{preview.hp}}</b></div>
                        <div class="member-attr">意志：<b>{{preview.pow}}</b></div>
                        <div class="member-attr">力量：<b>{{preview.fixstr}}</b></div>
                        <div class="member-attr">精准：<b>{{preview.fixacr}}</b></div>
                        <div class="member-attr">速度：<b>{{preview.fixdex}}</b></div>
                    </div>
                    <!-- <div class="awareness">
                        <label>初始存在感</label>
                        <span>{{parseFloat(common.calcRoleAwareness(preview,game.allEquips)/100).toFixed(2)}}%</span>
                    </div> -->
                    <div class="detail-item">基础存在感：<b>{{parseFloat(preview.fixawareness/100).toFixed(2)}}%</b>（当前：<b>{{parseFloat(common.calcRoleAwarenessPurely(preview)/100).toFixed(2)}}%</b>）</div>
                    <div class="detail-item">状态抗性：<b>{{preview.imm}}%</b></div>
                    <div class="detail-item" v-if="preview.imm<CONFIG.humanMaxImm">状态抗性提升经验：<b>{{preview.immExp}} / {{common.getImmExpRequire(preview.imm)}}</b></div>
                    <br/>
                    <div>
                        <label>综合战力预估值：</label>
                        <b class="rankscore">{{preview.rankScore||'???'}}</b>
                    </div>
                </div>
                <div class="preview-equip">
                    <div class="title">装备</div>
                    <div class="equip-onbody" :class="'equip-type-'+index" v-for="(name,index) in ['头部','武器','上身','下身','脚部']">
                        <div v-if="!arole.equipments[CONFIG.equipItemNameMap[index]].name">
                            <i class="equip-name">{{name}}：无</i>
                        </div>
                        <i class="equip-name" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].name">
                            {{name}}：{{arole.equipments[CONFIG.equipItemNameMap[index]].name}}
                            <span v-if="arole.equipments[CONFIG.equipItemNameMap[index]].equipType==1&&arole.equipments[CONFIG.equipItemNameMap[index]].type==2"> (全)</span>
                        </i>
                        <div v-if="!arole.heroTeached&&arole.equipments[CONFIG.equipItemNameMap[index]].name">
                            <div class="equip-awareness">存在感：{{parseFloat(arole.equipments[CONFIG.equipItemNameMap[index]].fixawareness).toFixed(2)}}%</div>
                            <div class="equip-hp" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].hp">生命+{{arole.equipments[CONFIG.equipItemNameMap[index]].hp}}</div>
                            <div class="equip-pow" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].pow">意志+{{arole.equipments[CONFIG.equipItemNameMap[index]].pow}}</div>
                            <div class="equip-str" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].strOffset">力量+{{arole.equipments[CONFIG.equipItemNameMap[index]].strOffset}}</div>
                            <div class="equip-acr" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].acrOffset">精准+{{arole.equipments[CONFIG.equipItemNameMap[index]].acrOffset}}</div>
                            <div class="equip-dex" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].dexOffset">速度+{{arole.equipments[CONFIG.equipItemNameMap[index]].dexOffset}}</div>
                            <div class="equip-dmg-wrap" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].equipType==1">
                                <div class="equip-dmg" v-if="arole.equipments[CONFIG.equipItemNameMap[index]].dmg[index2]>0" v-for="(name2,index2) in ['割据','突刺','钝击','炮火','射击','抽击',]">
                                    {{name2}}：{{arole.equipments[CONFIG.equipItemNameMap[index]].dmg[index2]}} (消耗：{{arole.equipments[CONFIG.equipItemNameMap[index]].consume[index2]}}) (效果等级：{{arole.equipments[CONFIG.equipItemNameMap[index]].buffLevels[index2]}})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-skill">
                    <div class="title">技能</div>
                    <p class="skill" v-for="(skill,index) in preview.skills">
                        <b>{{skill.name}}[<span class="orange">{{skill.consume}}</span>]</b>
                        <br/>
                        <span v-html="common.genSkillTip(skill,1)"></span>
                    </p>
                </div>
            </div>
            <a class="btn btn-close" @click="preview={}">关闭</a>
        </div>
    </div>
</template>
<script>
const ROLE_TEMPLATE = {
    pid: 0,
    name: '', // 名字
    standpoint: 0, // 立场 [0:路人|1:相识|2:友好|3:同道|4:在队伍中]
    gender: 1, // 性别 [1:男|2:女]
    age: 13, // 年龄
    fixawareness: 5, // 固有存在感
    basehp: 1, // 固定生命值
    basepow: 1, // 固定意志
    basestr: 1, // 固定力量
    baseacr: 1, // 固定精准
    basedex: 1, // 固定速度
    consume: 1, // 基础意志消耗
    imm: 0,
    immExp: 0,
    baseAttack: 1, // 基础攻击力
    priceRatio: 100, // 价值取向
    level: 1,
    equipments: {
        head: {},
        hands: {},
        body: {},
        legs: {},
        foots: {},
    },
    bag: [], // 装备id数组
    brain: [], // 大脑
    brainLevel: 5, // 大脑等级
    halos: [], // 光环数组
    slots: [], // 光环槽数组
    skills: [], // 技能id数组
    basePrice: [], // 基础价值
    _import: false, // 加入世界
}
import { query, r, rr, bulbsort, shuffle, getParentNode, getMatchList, removeFromList, arrContains, removeFromNumberList, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import Bar1 from './Bar1';
import Bar2 from './Bar2';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        role: Object,
        mode: Number, // [1:新增|2:编辑]
        onTapCancel: Function,
        onTapConfirm: Function,
    },
    data() {
        return {
            equipTypeNames: ['头部','武器','上身','下身','脚部'],
            arole: ROLE_TEMPLATE,
            info: '',
            preview: {},
            randomLevelMode: 0, // [0:不显示随机等级弹窗|1:基本属性|2:装备|3:技能]
            defaultLevel: 1, // 默认填充的等级数值

            CONFIG,
            ai,
            common,
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){
            if(this.mode==1){ // 新增模式
                this.onTapEmpty();
            }
            else if(this.mode==2&&this.role&&this.role.pid){ // 编辑模式
                this.arole = this.genEditableRole(this.role);
            }
        },
        _onTapConfirm(){
            let res = this.autoValidate(this.arole);
            let errors = this.checkValidate(res);
            if(errors.length<=0){ // 有效
                let role = this.genFinalRole(res);
                this.onTapConfirm(role);
            }
            else{ // 无效
                this.info = `数据格式有误：<br/>`;
                for(let err of errors){
                    this.info += `${err}<br/>`;
                }
                console.error(errors);
            }
        },
        _onTapCancel(){
            this.onTapCancel();
        },
        onTapAddEquip(name,type){ // 点击【添加装备】按钮
            if(name=='hands'){ // 武器
                this.arole.equipments[name] = {
                    name: '',
                    hp: null,
                    pow: null,
                    strOffset: null,
                    acrOffset: null,
                    dexOffset: null,
                    dmg: [null,null,null,null,null,null,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
                    buffLevels: [null,null,null,null,null,null,], // 攻击对应buff等级
                    consume: [null,null,null,null,null,null,],
                    type: 1, // [1:攻击单人|2:攻击全体]
                    fixawareness: null,
                    price: 0, // 价格
                    equipType: type,
                    vice: {
                        id: 0,
                    },
                    exist: true,
                };
            }
            else{ // 其他装备
                this.arole.equipments[name] = {
                    name: '',
                    hp: null,
                    pow: null,
                    strOffset: null,
                    acrOffset: null,
                    dexOffset: null,
                    fixawareness: null,
                    price: 0, // 价格
                    equipType: type,
                    exist: true,
                };
            }
        },
        onTapDeleteEquip(name,type){ // 点击【删除装备】按钮
            this.arole.equipments[name] = {};
        },
        onTapAddSkill(){ // 点击【添加技能】按钮
            let sid = 1;
            if(this.arole.skills.length>0){
                let lastSkill = this.arole.skills[this.arole.skills.length-1];
                let lastSkillSid = lastSkill.sid;
                sid = lastSkillSid+1;
            }
            let newSkill = {
                sid,
                name: '',
                target: null, // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
                effects: [], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
                dmg: [null,null,null,null,null,null,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
                cure: null, // 治疗
                cureRate: null, // 比率治疗
                powShift: null, // 改变意志
                attrShift: 0, // 改变基础属性
                awaShift: null, // 改变存在感
                moveShift: null, // 改变行动力
                buffs: [], // buff序号
                buffLevels: [], // buff等级(1-9)
                goodImpact: 1, // 解除正面状态数
                badImpact: 1, // 解除负面状态数
                consume: null, // 意志消耗
                fixawareness: null,
                absolute: false, // 必中，无视对方存在感
                price: 0, // 价值（为 0 时代表固有技能，无法转让和售卖）
                canLearn: true, // 能否学习
            }
            this.arole.skills.push(newSkill);
        },
        onTapDeleteSkill(skill){ // 点击【删除技能】按钮
            this.arole.skills = removeFromList(skill.sid,'sid',this.arole.skills);
        },
        onTapSkillTarget(skillIndex,targetIndex){ // 点击【选择技能目标】按钮
            let skill = this.arole.skills[skillIndex];
            if(skill){
                skill.target = targetIndex;
            }
        },
        onTapAddSkillEffect(skillIndex,effectIndex){ // 点击【添加技能效果】按钮
            let skill = this.arole.skills[skillIndex];
            if(skill){
                skill.effects.push(effectIndex);
            }
        },
        onTapPreview(){ // 点击【预览效果】按钮
            let res = this.autoValidate(this.arole);
            let errors = this.checkValidate(res);
            if(errors.length<=0){ // 有效
                let role = this.genFinalRole(res);
                this.preview = role;
            }
            else{ // 无效
                this.info = `数据格式有误：<br/>`;
                for(let err of errors){
                    this.info += `${err}<br/>`;
                }
                console.error(errors);
            }
        },
        onTapMoveSkill(skill){ // 点击【上移】按钮
            let oskills = [...this.arole.skills];
            let nskills = [];
            let oldIndex = 0;
            for(let i=0;i<oskills.length;i++){
                if(oskills[i].sid==skill.sid){
                    oldIndex = i;
                    break;
                }
            }
            for(let i=0;i<oskills.length;i++){
                if(i==(oldIndex-1)){
                    nskills.push(oskills[i+1]);
                }
                else if(i==oldIndex){
                    nskills.push(oskills[i-1]);
                }
                else{
                    nskills.push(oskills[i]);
                }
            }
            this.arole.skills = nskills;
        },
        onTapHelp(flag){ // 点击【帮助】按钮
            if(flag==1){ // 状态
                this.info = '数字代表添加的状态效果：<br/>';
                for(let buff of CONFIG.buffs){
                    this.info += `${buff.id}-${buff.name}：${buff.desc}；<br/>`;
                }
            }
        },
        onTapEmpty(){ // 点击【清空】按钮
            this.arole = {...ROLE_TEMPLATE};
            for(let name of CONFIG.equipItemNameMap){
                this.arole.equipments[name].exist = false;
            }
            this.arole.skills = [];
        },
        onTapRandom(mode){ // 点击【随机】按钮
            this.randomLevelMode = mode;
        },
        onTapConfirmRandom(){ // 点击【确认随机】按钮
            let level = parseInt(this.defaultLevel);
            if(!isNaN(level)&&level>0&&level<12){
                if(this.randomLevelMode==1){ // 随机生成人物数据
                    let rAge = _ =>{
                        let r1 = r(1,100);
                        if(r1<5){ // 未成年
                            return r(12,17);
                        }
                        else if(r1<70){ // 青年
                            return r(18,29);
                        }
                        else if(r1<97){ // 壮年
                            return r(30,39);
                        }
                        else{ // 中老年
                            return r(40,80);
                        }
                    };
                    let age = rAge();
                    let imm = age-14;
                    if(imm>CONFIG.humanMaxImm){
                        imm = CONFIG.humanMaxImm;
                    }
                    if(imm<0){
                        imm = 0;
                    }
                    this.arole.gender = r(1,2);
                    this.arole.name = common.genRoleName(this.arole.gender);
                    this.arole.age = age;
                    this.arole.fixawareness = Math.round(r(14,28)*50/100);
                    this.arole.basehp = r(10,20)*5+r(level*level,level*level*10);
                    this.arole.basepow = r(5,25)+r(level,level*30);
                    this.arole.basestr = r(5,15)*5+r(1,level*10);
                    this.arole.baseacr = r(5,15)*5+r(1,level*10);
                    this.arole.basedex = 50+r(level*5,level*15);
                    this.arole.consume = 1;
                    this.arole.imm = imm;
                    this.arole.baseAttack = r(1,3)*level;
                    this.arole.brainLevel = r(4,8);
                    this.arole.basePrice = r(1,level*10)*100+500;
                    this.arole.priceRatio = (r(200,200+level*20)+level*20);
                }
                else if(this.randomLevelMode==2){ // 随机生成装备数据
                    this.arole.equipments = {...ROLE_TEMPLATE.equipments};
                    let bias = (this.arole.basestr>=this.arole.baseacr)?'str':'acr';
                    if(r(1,10)<=8){ // 80%概率穿戴头盔
                        this.arole.equipments.head = this.genEquipment({equipType:0,level,bias});
                    }
                    this.arole.equipments.hands = this.genEquipment({equipType:1,level:level+r(1,2),bias}); // 持有武器
                    this.arole.equipments.body = this.genEquipment({equipType:2,level,bias}); // 穿戴衣物
                    this.arole.equipments.legs = this.genEquipment({equipType:3,level,bias}); // 穿戴裤子
                    if(r(1,10)<=9){ // 90%概率穿戴鞋子
                        this.arole.equipments.foots = this.genEquipment({equipType:4,level,bias});
                    }
                }
                else if(this.randomLevelMode==3){ // 随机生成技能数据
                    let weapon = this.arole.equipments.hands;
                    let dmg = weapon.dmg||[0,0,0,0,0,0];
                    this.arole.skills = [...ROLE_TEMPLATE.skills];
                    this.arole.skills.push(this.genHideSkill(1));
                    let skillCount = r(0,level<3?3:level);
                    if(skillCount>9){
                        skillCount = 9;
                    }
                    for(let i=0;i<skillCount&&i<5;i++){
                        this.arole.skills.push(this.genSkill({level,dmg,ownerType:1}));
                    }
                }
            }
        },

        checkValidate(role){ // 检查数据有效性
            let errors = [];
            // 人物面板
            if(!role.name){
                errors.push('人物面板：无效姓名');
            }
            if(!role.age||role.age<13){
                errors.push('人物面板：无效年龄');
            }
            if(!role.fixawareness||role.fixawareness<0||role.fixawareness>100){
                errors.push('人物面板：无效存在感');
            }
            if(!role.basehp||role.basehp<0){
                errors.push('人物面板：无效生命值');
            }
            if(!role.basepow||role.basepow<0){
                errors.push('人物面板：无效意志值');
            }
            if(!role.basepow||role.basepow<0){
                errors.push('人物面板：无效力量');
            }
            if(!role.baseacr||role.baseacr<0){
                errors.push('人物面板：无效精准');
            }
            if(!role.basedex||role.basedex<0){
                errors.push('人物面板：无效速度');
            }
            if(!role.consume||role.consume<0||role.consume>3){
                errors.push('人物面板：无效意志消耗');
            }
            if(isNaN(role.imm)||role.imm<0||role.imm>100){
                errors.push('人物面板：无效抗性状态');
            }
            if(!role.baseAttack||role.baseAttack<0){
                errors.push('人物面板：无效攻击力');
            }
            if(!role.brainLevel||role.brainLevel<4||role.brainLevel>8){
                errors.push('人物面板：无效大脑等级');
            }
            if(isNaN(role.basePrice)||role.basePrice<0){
                errors.push('人物面板：无效基础价值');
            }
            // 装备面板
            let i=0;
            for(let name of CONFIG.equipItemNameMap){
                let equip = role.equipments[name];
                if(equip.exist){
                    if(!equip.name){
                        errors.push(`${this.equipTypeNames[i]}：无效名字`);
                    }
                    if(equip.hp&&equip.hp<0){
                        errors.push(`${this.equipTypeNames[i]}：无效生命值`);
                    }
                    if(equip.pow&&equip.pow<0){
                        errors.push(`${this.equipTypeNames[i]}：无效意志值`);
                    }
                    if(isNaN(equip.fixawareness)||equip.fixawareness<-25||equip.fixawareness>100){
                        errors.push(`${this.equipTypeNames[i]}：无效存在感`);
                    }
                    if(equip.strOffset&&equip.strOffset<0){
                        errors.push(`${this.equipTypeNames[i]}：无效力量`);
                    }
                    if(equip.acrOffset&&equip.acrOffset<0){
                        errors.push(`${this.equipTypeNames[i]}：无效精准`);
                    }
                    if(equip.dexOffset&&equip.dexOffset<0){
                        errors.push(`${this.equipTypeNames[i]}：无效速度`);
                    }
                    if(i==1){ // 是武器
                        let totalD = 0;
                        for(let d=0;d<6;d++){
                            let dmg = equip.dmg[d];
                            let buffLevel = equip.buffLevels[d];
                            let consume = equip.consume[d];
                            if(dmg<0){
                                errors.push(`${this.equipTypeNames[i]}：无效武器伤害`);
                            }
                            else if(dmg>0){
                                totalD += dmg;
                            }
                            if(buffLevel<0||buffLevel>9){
                                errors.push(`${this.equipTypeNames[i]}：无效武器效果等级`);
                            }
                            if(consume<0||consume>4){
                                errors.push(`${this.equipTypeNames[i]}：无效武器消耗`);
                            }
                        }
                        if(totalD<=0){
                            errors.push(`${this.equipTypeNames[i]}：武器伤害不能为0`);
                        }
                    }
                }
                i++;
            }
            // 技能面板
            for(let skill of role.skills){
                let suffix = skill.name?'（'+skill.name+'）':'';
                if(!skill.name){
                    errors.push(`技能面板：无效技能名`);
                }
                if(!skill.target||skill.target<1||skill.target>9){
                    errors.push(`技能面板：无效目标${suffix}`);
                }
                if(skill.effects.length<=0){
                    errors.push(`技能面板：效果不能为空${suffix}`);
                }
                if(skill.effects[1]&&(skill.effects[0]==skill.effects[1])){
                    errors.push(`技能面板：技能效果不能重复${suffix}`);
                }
                else if(skill.effects[2]&&(skill.effects[0]==skill.effects[1]||skill.effects[0]==skill.effects[2]||skill.effects[1]==skill.effects[2])){
                    errors.push(`技能面板：技能效果不能重复${suffix}`);
                }
                for(let effect of skill.effects){
                    if(isNaN(effect)&&(effect<1||(effect>3&&effect<7)||effect>11)){
                        errors.push(`技能面板：无效效果${suffix}`);
                    }
                }
                if(skill.cure&&skill.cure<0){
                    errors.push(`技能面板：无效治疗值${suffix}`);
                }
                if(skill.cureRate&&(skill.cureRate<0||skill.cureRate>100)){
                    errors.push(`技能面板：无效比率治疗值${suffix}`);
                }
                if(skill.powShift&&skill.powShift>0){
                    errors.push(`技能面板：无效意志提供值${suffix}`);
                }
                if(skill.awaShift&&(skill.awaShift>100||skill.awaShift<-100)){
                    errors.push(`技能面板：无效存在感提供值${suffix}`);
                }
                if(skill.moveShift&&(skill.moveShift>100||skill.moveShift<-100)){
                    errors.push(`技能面板：无效行动力提供值${suffix}`);
                }
                if(skill.consume<=0){
                    errors.push(`技能面板：无效消耗${suffix}`);
                }
                if(isNaN(skill.fixawareness)||skill.fixawareness>100||skill.fixawareness<-100){
                    errors.push(`技能面板：无效存在感${suffix}`);
                }
                let totalD = 0;
                for(let d=0;d<6;d++){
                    let dmg = skill.dmg[d];
                    if(dmg>0){
                        totalD += dmg;
                    }
                    else if(dmg<0){
                        errors.push(`技能面板：无效伤害${suffix}`);
                    }
                }
                if(totalD<=0&&arrContains(skill.effects,1)!=-1){
                    errors.push(`技能面板：伤害不能为0${suffix}`);
                }
                if(skill.badImpact<1||skill.badImpact>4){
                    errors.push(`技能面板：状态解除数量超出范围${suffix}`);
                }
                if(skill.goodImpact<1||skill.goodImpact>4){
                    errors.push(`技能面板：状态解除数量超出范围${suffix}`);
                }
                if(arrContains(skill.effects,9)!=-1){ // 含有添加状态效果
                    if(skill.buffs.length<=0){
                        errors.push(`技能面板：状态不能为空${suffix}`);
                    }
                    if(skill.buffs.length!=skill.buffLevels.length){
                        errors.push(`技能面板：无效状态等级${suffix}`);
                    }
                    for(let buff of skill.buffs){
                        if(buff<1||(buff>20&&buff<101)||buff>120){
                            errors.push(`技能面板：无效状态${suffix}`);
                        }
                    }
                    for(let buffLevel of skill.buffLevels){
                        if(buffLevel<1||buffLevel>9){
                            errors.push(`技能面板：无效状态等级${suffix}`);
                        }
                    }
                }
            }
            return errors;
        },
        autoValidate(role){ // 自我检查修复
            let res = {...role};
            if(!res.fixawareness){
                res.fixawareness = 0;
            }
            if(!res.basehp){
                res.basehp = 0;
            }
            if(!res.basepow){
                res.basepow = 0;
            }
            if(!res.basestr){
                res.basestr = 0;
            }
            if(!res.baseacr){
                res.baseacr = 0;
            }
            if(!res.basedex){
                res.basedex = 0;
            }
            if(!res.consume){
                res.consume = 0;
            }
            if(!res.imm){
                res.imm = 0;
            }
            if(!res.baseAttack){
                res.baseAttack = 0;
            }
            if(!res.brainLevel){
                res.brainLevel = 0;
            }
            if(!res.basePrice){
                res.basePrice = 0;
            }
            for(let name of CONFIG.equipItemNameMap){
                let equip = res.equipments[name];
                if(equip.exist){
                    if(!equip.fixawareness){
                        equip.fixawareness = 0;
                    }
                    if(!equip.hp){
                        equip.hp = 0;
                    }
                    if(!equip.pow){
                        equip.pow = 0;
                    }
                    if(!equip.strOffset){
                        equip.strOffset = 0;
                    }
                    if(!equip.acrOffset){
                        equip.acrOffset = 0;
                    }
                    if(!equip.dexOffset){
                        equip.dexOffset = 0;
                    }
                    if(name=='hands'&&equip.dmg){ // 是武器
                        for(let i=0;i<6;i++){
                            if(!equip.dmg[i]){
                                equip.dmg[i] = 0;
                            }
                            if(!equip.buffLevels[i]){
                                equip.buffLevels[i] = 0;
                            }
                            if(!equip.consume[i]){
                                equip.consume[i] = 0;
                            }
                        }
                    }
                }
            }
            for(let skill of res.skills){
                // 排除值为 0 的技能效果
                let neffects = [];
                for(let i=0;i<skill.effects.length;i++){
                    if(!isNaN(skill.effects[i])&&skill.effects[i]!=null&&skill.effects[i]!=0){
                        neffects.push(skill.effects[i]);
                    }
                }
                skill.effects = neffects;
                // 排除值为 0 的buff效果
                let nbuffs = [];
                for(let i=0;i<skill.buffs.length;i++){
                    if(!isNaN(skill.buffs[i])&&skill.buffs[i]!=null&&skill.buffs[i]!=0){
                        nbuffs.push(skill.buffs[i]);
                    }
                }
                skill.buffs = nbuffs;
                // 排除值为 0 的buff等级
                let nbuffLevels = [];
                for(let i=0;i<skill.buffs.length;i++){
                    if(!isNaN(skill.buffLevels[i])&&skill.buffLevels[i]!=null&&skill.buffLevels[i]!=0){
                        nbuffLevels.push(skill.buffLevels[i]);
                    }
                }
                skill.buffLevels = nbuffLevels;
                // 字符串转数字
                if(!skill.awaShift){
                    skill.awaShift = 0;
                }
                if(!skill.moveShift){
                    skill.moveShift = 0;
                }
                if(!skill.fixawareness){
                    skill.fixawareness = 0;
                }
                if(!skill.cure){
                    skill.cure = 0;
                }
                if(!skill.cureRate){
                    skill.cureRate = 0;
                }
                if(!skill.powShift){
                    skill.powShift = 0;
                }
                if(!skill.badImpact||isNaN(skill.badImpact)){
                    skill.badImpact = 1;
                }
                if(!skill.goodImpact||isNaN(skill.goodImpact)){
                    skill.goodImpact = 1;
                }
                for(let i=0;i<6;i++){
                    if(!skill.dmg[i]){
                        skill.dmg[i] = 0;
                    }
                }
            }
            return res;
        },
        genFinalRole(role){ // 生成最终数据格式
            let res = {...role};
            let parseMap1 = ['age','basehp','basepow','basestr','baseacr','basedex','imm','baseAttack','brainLevel','basePrice','consume',];
            for(let parse of parseMap1){
                res[parse] = parseInt(res[parse]);
            }
            res.fixawareness = Math.round(res.fixawareness*100);
            res.equipments = {};
            res.skills = [];
            for(let name of CONFIG.equipItemNameMap){
                let equip = {...role.equipments[name]};
                res.equipments[name] = equip;
                if(equip.exist){
                    let parseMap2 = ['hp','pow','strOffset','acrOffset','dexOffset',];
                    for(let parse of parseMap2){
                        if(res.equipments[name][parse]){
                            res.equipments[name][parse] = parseInt(res.equipments[name][parse]);
                        }
                    }
                    if(name=='hands'){
                        for(let i=0;i<6;i++){
                            let d = res.equipments[name].dmg[i];
                            let buffLevel = res.equipments[name].buffLevels[i];
                            let c = res.equipments[name].consume[i];
                            if(d){
                                res.equipments[name].dmg[i] = parseInt(d);
                            }
                            if(buffLevel){
                                res.equipments[name].buffLevels[i] = parseInt(buffLevel);
                            }
                            if(c){
                                res.equipments[name].consume[i] = parseInt(c);
                            }
                        }
                    }
                    res.equipments[name].fixawareness = Math.round(equip.fixawareness*100);
                    // 计算价格
                    res.equipments[name].price = common.calcEquipPrice(res.equipments[name]);
                }
                delete res.equipments[name].exist;
            }
            for(let i=0;i<role.skills.length;i++){
                let skill = {...role.skills[i]};
                let parseMap3 = ['target','cure','cureRate','powShift','attrShift','consume','badImpact','goodImpact',];
                for(let parse of parseMap3){
                    if(skill[parse]){
                        skill[parse] = parseInt(skill[parse]);
                    }
                }
                for(let i=0;i<skill.effects.length;i++){
                    skill.effects[i] = parseInt(skill.effects[i]);
                }
                for(let i=0;i<6;i++){
                    let d = skill.dmg[i];
                    if(d){
                        skill.dmg[i] = parseInt(d);
                    }
                }
                for(let i=0;i<skill.buffs.length;i++){
                    skill.buffs[i] = parseInt(skill.buffs[i]);
                }
                for(let i=0;i<skill.buffLevels.length;i++){
                    skill.buffLevels[i] = parseInt(skill.buffLevels[i]);
                }
                skill.awaShift = Math.round(role.skills[i].awaShift*100);
                skill.moveShift = Math.round(role.skills[i].moveShift*100);
                skill.fixawareness = Math.round(role.skills[i].fixawareness*100);
                let trends = ai.getSkillTrends(skill);
                skill.trends = trends;
                skill.trend = ai.getSkillTrend(skill,trends);
                if(skill.canLearn){ // 计算价格
                    skill.price = Math.ceil(ai.getSkillValue(skill)*30);
                }
                else{
                    skill.price = 0;
                }
                res.skills.push(skill);
            }
            // 计算角色最终数据
            let finalData = common.calcRoleFinalDataPurely(res);
            res.hp = finalData.hp;
            res.maxhp = finalData.maxhp;
            res.pow = finalData.pow;
            res.maxpow = finalData.maxpow;
            res.fixstr = finalData.fixstr;
            res.fixacr = finalData.fixacr;
            res.fixdex = finalData.fixdex;
            // 生命和意志赋值
            res.hp = res.maxhp;
            res.pow = res.maxpow;
            // 排行分数
            res.rankScore = common.calcRankScorePurely(res);
            return res;
        },
        genEditableRole(role){ // 生成可编辑数据格式
            let res = {...role};
            res.fixawareness = res.fixawareness/100;
            res.equipments = {};
            res.skills = [];
            for(let name of CONFIG.equipItemNameMap){
                let equip = {...role.equipments[name]};
                res.equipments[name] = equip;
                if(equip.name){
                    res.equipments[name].fixawareness = equip.fixawareness/100;
                    res.equipments[name].exist = true;
                }
                else{
                    res.equipments[name] = {};
                }
            }
            for(let i=0;i<role.skills.length;i++){
                let skill = {...role.skills[i]};
                skill.awaShift = role.skills[i].awaShift/100;
                skill.moveShift = role.skills[i].moveShift/100;
                skill.fixawareness = role.skills[i].fixawareness/100;
                skill.canLearn = skill.price!=0;
                skill.sid = i+1;
                res.skills.push(skill);
            }
            return res;
        },

        genHideSkill(sid){ // 生成隐藏技能
            let res = common.genHideSkill();
            res.sid = sid;
            res.awaShift = Math.round(res.awaShift/100);
            return res;
        },
        genSkill({level,dmg,bias,ownerType}){ // 生成技能
            let res = common.genSkill({level,dmg,bias,ownerType});
            res.sid = 1;
            if(this.arole.skills.length>0){
                let lastSkill = this.arole.skills[this.arole.skills.length-1];
                let lastSkillSid = lastSkill.sid;
                res.sid = lastSkillSid+1;
            }
            res.canLearn = true;
            res.awaShift = Math.round(res.awaShift/100);
            res.moveShift = Math.round(res.moveShift/100);
            res.fixawareness = Math.round(res.fixawareness/100);
            return res;
        },
        genEquipment({equipType,level,bias}){ // 生成装备
            let res = common.genEquipment({equipType,level,bias});
            res.exist = true;
            res.fixawareness = Math.round(res.fixawareness/100);
            return res;
        },
    },
    components:{
        Bar1,
        Bar2,
    },
};
</script>
<style scoped>
    .role-editor{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .title,.board-title{
        color: #717171;
        font-size: 18px;
        height: 26px;
        line-height: 26px;
        width: 100%;
        text-align: center;
    }
    .btn{
        display: inline-block;
        cursor: pointer;
        background-color: #131313;
        color: #fff;
        width: 90px;
        height: 30px;
        line-height: 30px;
        margin: 0 auto 6px auto;
    }
    .role{
        width: 100%;
        height: 760px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 4px;
    }
    .role-board{
        height: 100%;
        background-color: #f1f1f1;
        padding: 4px 10px;
        overflow-y: auto;
    }
    .role-board-1{
        width: 19.7%;
    }
    .role-board-2{
        width: 39.7%;
    }
    .role-board-3{
        width: 39.7%;
    }
    .board-title{
        font-size: 18px;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }
    .hr{
        padding: 0 6px;
        font-size: 14px;
        height: 20px;
        color: #888;
        line-height: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 6px;
        margin-top: 44px;
    }
    .inp{
        width: 220px;
        height: 30px;
        line-height: 30px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        margin-bottom: 14px;
    }
    .inp label{
        display: inline-block;
        margin-right: 6px;
        text-align: right;
        width: 100px;
    }
    .inp input{
        -webkit-appearance: none;
        border: none;
        border-bottom: 1px solid #131313;
        background-color: transparent;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 6px;
        font-size: 16px;
        color: #666;
        text-align: right;
    }
    input::placeholder{
        font-size: 14px;
        color: #bbb;
        font-style: italic;
    }
    .inp-wrap,.btn-wrap{
        height: 30px;
        width: 120px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .btn-wrap-4{
        flex-wrap: wrap;
    }
    .btn-wrap-4 .btn{
        width: 40%;
    }
    .btn-gender{
        width: 50px;
        height: 30px;
        line-height: 30px;
        margin: 0 4px;
        background-color: transparent;
        color: #666;
    }
    .btn-select{
        background-color: #fff;
        border: 1px solid #131313;
    }

    .equip-item{
        position: relative;
        padding-left: 35px;
        background-color: #eee;
        width: 100%;
        height: 132px;
        margin-bottom: 5px;
        box-shadow: 0 4px 4px #ddd;
        color: #666;
    }
    .equip-title{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        line-height: 30px;
        height: 100%;
        width: 35px;
        font-size: 16px;
        left: 0;
        top: 0;
        background-image: linear-gradient(to right, #ccc 0%, #eee 100%);
        z-index: 50;
    }
    .btn-add-item{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        right: 0;
        top: 0;
        background-color: #ddd;
        width: calc( 100% - 35px );
        height: 100%;
        z-index: 30;
    }
    .btn-add-item:hover{
        background-color: #c6c6c6;
    }
    .btn-del-equip,.btn-move-skill{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        right: 0;
        top: 0;
        width: 40px;
        height: 22px;
        line-height: 22px;
        color: #e81313;
        z-index: 40;
        cursor: pointer;
    }
    .btn-move-skill{
        right: 42px;
        color: blue;
    }
    .equip-form{
        width: 100%;
        height: 100%;
        padding: 3px;
    }
    .inp-row{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 20px;
        line-height: 20px;
        margin: 0;
        font-size: 14px;
        white-space: nowrap;
        word-break: keep-all;
    }
    .inp-wrap,.equip-form .btn-wrap{

    }
    .inp-12,.inp-6,.inp-4,.inp-3,.inp-2{
        text-align: left;
    }
    .inp-12 label,.inp-6 label,.inp-4 label,.inp-3 label,.inp-2 label{
        display: inline-block;
        text-align: left;
        font-size: 14px;
        margin-right: 2px;
    }
    .inp-12 input,.inp-6 input,.inp-4 input,.inp-3 input,.inp-2 input{
        font-size: 14px;
        -webkit-appearance: none;
        border: none;
        border-bottom: 1px solid #131313;
        background-color: transparent;
        width: 120px;
        height: 20px;
        line-height: 20px;
        padding: 0 6px;
        font-size: 14px;
        padding: 0 4px;
        color: #666;
        text-align: right;
    }
    .inp-12 input{
        width: 120px;
    }
    .inp-6 label{
        width: 120px;
    }
    .inp-2 input{
        width: 55px;
    }
    .inp-12{
        width: 33%;
    }
    .inp-6{
        width: 50%;
    }
    .inp-4{
        width: 33%;
    }
    .inp-3{
        width: 25%;
    }
    .inp-2{
        width: 16.6%;
    }

    .role-skill{

    }
    .role-skill-wrap{
        width: 100%;
        height: 100%;
    }
    .role-skill-wrap .btn-add-item,
    .role-skill-wrap .item{
        position: static;
        width: 100%;
        min-height: 132px;
        margin-bottom: 5px;
        color: #666;
    }
    .role-skill-wrap .btn-add-item{
        height: 132px;
        margin-bottom: 0;
    }
    .role-skill-wrap .btn-add-item{
    }
    .role-skill-wrap .btn-add-item:hover{
        background-color: #ccc;
    }
    .role-skill-wrap .item{
        position: relative;
        padding: 8px 10px;
        background-color: #eee;
        box-shadow: 0 4px 4px #ddd;
    }
    .role-skill-wrap .item .inp-3 label{
        display: inline-block;
        text-align: left;
    }
    .role-skill-wrap .item .inp-3 input{
        width: 90px;
    }
    .inp-row .btn-wrap-line{
        display: inline-block;
        min-width: 90px;
        height: 20px;
        line-height: 20px;
        white-space: nowrap;
        word-break: keep-all;
    }
    .btn-wrap-line .btn{
        height: 16px;
        width: auto;
        margin: 0;
        margin-right: 5px;
        line-height: 16px;
    }
    .btn-help{
        display: inline-block;
        border: 1px solid #131313;
        font-size: 12px;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        font-weight: bold;
        border-radius: 8px;
    }
    .pop-info,.pop-preview,.pop-level{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        padding: 8px;
        background-color: #fff;
        box-shadow: 0 0 12px #444;
        z-index: 60;
        font-size: 16px;
        color: #666;
    }
    .pop-info{
        min-width: 100px;
        min-height: 60px;
        max-width: 400px;
        max-height: 200px;
    }
    .pop-info p{
        width: 100%;
        height: 80%;
        text-align: left;
        overflow-y: auto;
    }
    .btn-close{
        position: absolute;
        right: 0;
        top: -32px;
        margin: 0 auto;
        width: 60px;
        height: 32px;
        line-height: 32px;
    }
    .pop-preview{
        width: 1200px;
        height: 400px;
    }
    .preview{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
    }
    .preview .title{
        margin-bottom: 6px;
        border-bottom: 1px solid #666;
    }
    .preview .preview-basic{
        width: 20%;
        height: 100%;
        padding: 6px;
        text-align: left;
        overflow-y: auto;
    }
    .preview .preview-equip{
        width: 40%;
        height: 100%;
        padding: 6px;
        text-align: left;
        overflow-y: auto;
    }
    .preview-equip .equip-onbody{
        position: relative;
        border: 1px solid #131313;
        padding: 6px;
        margin-bottom: 8px;
        box-shadow: 0 4px 4px #000;
        animation: item .25s ease-out forwards;
    }
    .equip-name{
        color: DarkSlateBlue;
        font-weight: bold;
        font-size: 18px;
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
    .preview .preview-skill{
        width: 40%;
        height: 100%;
        text-align: left;
        overflow-y: auto;
        padding: 6px;
    }
    .preview-skill .skill{
        width: 100%;
        padding: 6px 0;
        border-bottom: 1px solid #666;
    }
    .skill .orange{
        color: OrangeRed;
    }
    .rankscore{
        display: inline-block;
        height: 27px;
        margin-left: 2px;
        line-height: 1;
        background-color: FireBrick;
        color: #fff;
        font-size: 20px;
        padding: 3px 6px;
        box-shadow: 3px 3px 6px #000;
        transform: skewX(-20deg);
    }

    .btn-rand{
        border-radius: 6px;
        width: 24px;
        font-size: 14px;
        margin-left: 10px;
        height: 24px;
        line-height: 24px;
    }
    .pop-level{
        width: 380px;
        height: 100px;
    }
    .pop-level .btn-wrap{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .btn-confirm-rand{

    }
</style>
