<template>
    <div class="skillboard" :class="'st-'+type">
        <div class="head">
            <a class="btn" @click="onClickCancel">返回</a>
            <p class="tip" v-show="tip!=''" v-html="tip"></p>
        </div>
        <div class="board">
            <a class="btn" @mouseenter="showTip(skill,index)" @mouseleave="hideTip()" :class="{'ban':skill.ban}" v-for="(skill,index) in unit.skills" @click="_onClickSkill(skill)">{{skill.name}}(<span class="pow">{{common.calcSkillConsume(unit,skill)}}</span>)</a>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort, getMatchList, } from '../tools/utils';
import * as common from '../tools/common';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        unit: Object,
        onClickCancel: Function,
        onClickSkill: Function,
        type: Number,
        mode: Number,
    },
    data() {
        return {
            tip: '',

            common,
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){
            let unit = this.unit,
                skills = unit.skills;
            for(let i=0;i<skills.length;i++){
                let skill = skills[i],
                    { effects, target, consume, } = skill;
                let buffObj;
                if(buffObj=common.getBuffObj(unit,3)){ // 如果有专注bufff
                    let { increment, buff, } = buffObj;
                    consume -= Math.ceil(consume*increment);
                }
                if((consume)>unit.pow){

                    let name = skill.name;
                    skill.name = 'JK';
                    skill.name = name;

                    skill.ban = 1;
                }
                else{
                    skill.ban = 0;
                }
            }
        },
        _onClickSkill(skill){
            if(!skill.ban){
                this.onClickSkill(skill);
            }
        },
        showTip(skill,index){
            this.tip = this.genTip(skill,index);
        },
        hideTip(){
            this.tip = '';
        },
        genTip(skill,index){
            let res = `『键盘<b>${index+1}</b>』${common.genSkillTip(skill)}`;
            return res;
        },
    },
};
</script>
<style scoped>
    @import '../style/board.css';
    .skillboard{
    }
</style>
