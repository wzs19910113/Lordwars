<template>
    <div class="otherboard">
        <div class="head">
            <a class="btn" @click="onClickCancel">返回</a>
            <p class="tip" v-show="tip!=''" v-html="tip"></p>
        </div>
        <div class="board">
            <a class="btn" @mouseenter="showTip(action)" @mouseleave="hideTip()" :class="{'ban':action.ban}" v-for="(action,index) in actions" @click="_onClickAction(action)">
                {{action.name}}
                <span v-if="consumeMap[action.id]">(<span class="pow">{{consumeMap[action.id]}}</span>)</span>
            </a>
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
        mode: Number,
        round: Number,
        onClickCancel: Function,
        onClickAction: Function,
    },
    data() {
        return {
            actions: [{
                    name: '集中',
                    id: 0,
                    desc: `『键盘<b>F</b>』在意志低于 ${CONFIG.powRechargeTreshold} 点的条件下恢复 ${CONFIG.powRechargeValue} 点意志`,
                },{
                    name: '探查',
                    id: 1,
                    desc: `『键盘<b>T</b>』提高敌方存在感最高的单位 ${Math.round(CONFIG.observeValue/100)}% 的存在感`,
                },{
                    name: '置后',
                    id: 2,
                    desc: `『键盘<b>B</b>』跳过此回合，并以 ${Math.round(CONFIG.laterMove/100)}% 为起点开始下一回合的行动力增长`,
                },{
                    name: '切换武器',
                    id: 3,
                    desc: `『键盘<b>X</b>』切换至另一个武器，并以 ${Math.round(CONFIG.switchWeaponMove/100)}% 为起点开始下一回合的行动力增长`,
                },{
                    name: this.mode==1?'认输':'逃跑',
                    id: this.mode==1?5:4,
                    desc: this.mode==1?`结束战斗（回合数大于3时可用）`:`逃脱战斗`,
                },],
            tip: '',
            consumeMap: [null,CONFIG.observeConsume,null,CONFIG.switchConsume,CONFIG.escapeConsume],
            CONFIG,
        };
    },
    computed: {},
    mounted(){
        this.init();
    },
    methods: {
        init(){
            let pow = this.unit.pow;
            if(pow<CONFIG.observeConsume){
                this.actions[1].ban = 1;
            }
            if(pow<CONFIG.switchConsume){
                this.actions[3].ban = 1;
            }
            if(pow<CONFIG.escapeConsume){
                this.actions[4].ban = 1;
            }
            if(this.round<3&&this.mode==1){
                this.actions[4].ban = 1;
            }

            let name = this.actions[1].name;
            this.actions[1].name = 'JK';
            this.actions[1].name = name;
        },
        _onClickAction(action){
            if(!action.ban){
                this.onClickAction(action);
            }
        },
        showTip(action){
            this.tip = action.desc;
        },
        hideTip(){
            this.tip = '';
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
