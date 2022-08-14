<template>
    <div class="attackboard" :class="'st-'+type">
        <div class="head">
            <a class="btn" @click="onClickCancel">返回</a>
            <p class="tip">{{unit.equipments.hands.name||'徒手'}}</p>
        </div>
        <div class="board">
            <a class="btn" :class="{'ban':attack.ban}" v-for="(attack,index) in attackTypeArray" @click="_onClickAttack(attack)">{{attack.name}}:<span class="dmg">{{attack.dmg}}</span> (<span class="pow">{{attack.consume}}</span>)</a>
        </div>
    </div>
</template>
<script>
import { query, r, bulbsort } from '../tools/utils';
import * as common from '../tools/common';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    props:{
        unit: Object,
        onClickCancel: Function,
        onClickAttack: Function,
        type: Number,
    },
    data() {
        return {
            attackTypeArray: [],
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){
            let hands = this.unit.equipments.hands,
                attackTypes = hands.dmg,
                banAttackTypes = hands.banAttacks;
            if(!hands.dmg){
                attackTypes = common.dmgWithoutWeapon(this.unit);
            }
            for(let i=0;i<attackTypes.length;i++){
                let dmg = attackTypes[i],
                    ban = banAttackTypes[i]==1;
                if(dmg>0){
                    let name = (i==3?'必中·':'')+(hands.type==2?'全·':'')+CONFIG.attackTypeNameMap[i];
                    this.attackTypeArray.push({
                        type: i,
                        name,
                        dmg,
                        ban,
                        consume: common.calcAttackConsume(this.unit,i),
                    });
                }
            }
        },
        _onClickAttack(attack){
            if(!attack.ban){
                this.onClickAttack(attack);
            }
        },
    },
};
</script>
<style scoped>
    @import '../style/board.css';
    .attackboard{
        overflow: hidden;
    }
</style>
