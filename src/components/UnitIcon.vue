<template>
    <a class="unit-icon" :class="{'dead':unit.dead}" @click="onClick(unit)" :style="{opacity:(this.unit.awareness<=0?`.6`:`1`)}">
        <div class="icon-wrap" :class="highlight?'hightlight':''">
            <div class="icon" :class="meClass">
                <canvas class="cvs" width="141" height="141" ref="cvs" />
                <span :class="`bonus-tags bonus-${tag}`" v-for="(tag,index) in bonusTags"></span>
                <div class="icon-name">{{unit.name}}</div>
            </div>
            <div class="weapon-name" v-if="unit.weapon.name">{{unit.weapon.name}}{{`${unit.weapon.type==2?'(全)':''}`}}</div>
            <div class="cur" v-if="unit.cursor==1&&!meClass"></div>
            <div v-for="(animateClass,index) in animates" :class="animateClass"></div>
            <div class="float minus" v-for="(gold,index) in changes.gold">{{changeFormat(gold)}}</div>
            <div class="acttime" :class="unit.dead?'':'acttime-flash'" v-if="unit.actTimePerRound>1">{{['精英','神将精英'][unit.actTimePerRound-2]}}</div>
        </div>
        <bar4 class="bar-1" title="存在感" :type="1" :crt="unit.awareness" :changes="changes.awareness" />
        <Bar4 class="bar-2" title="行动力" :type="2" :crt="unit.move" :changes="changes.move" :checkSuffix="!unit.dead&&!unit.me&&unit.isCreep" />
        <div class="cirtip cirtip1" :class="(!unit.dead&&unit.hp<unit.maxhp/4)?'critical-cirtip':''" v-if="unit.hp<unit.maxhp/2">危</div>
        <div class="cirtip cirtip2" :class="(!unit.dead&&unit.pow<unit.maxpow/4)?'critical-cirtip':''" v-if="unit.pow<unit.maxpow/2">疲</div>
        <div class="buff-wrap" v-if="!unit.dead">
            <BuffIcon :buff="buff" :key="index" :mouseon="showTip" :mouseoff="hideTip" v-for="(buff,index) in unit.buffs" />
            <span class="buff-tip" v-if="tip">{{tip}}<br/>{{tip2}}</span>
        </div>
        <div class="death-cover" v-if="unit.dead">战<br/>退</div>
        <div class="miss-cover" v-if="changes.miss">未命中</div>
    </a>
</template>
<script>
import Bar4 from '../components/Bar4';
import BuffIcon from '../components/BuffIcon';
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, } from '../tools/utils';
import * as common from '../tools/common';
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, } from '../tools/avatar';
import { DEBUG, CONFIG, CACHE } from '../config/config';
const CVSLEN = 141;
export default {
    props:{
        state: Number, // 战场状态
        unit: {
            type: Object,
            default: {},
        },
        highlight: Boolean,
        onClick: Function,
    },
    data() {
        return {
            meClass: '',
            iconColor: '',
            bonusTags: [],
            animates: [],

            changes: {
                hp: [],
                pow: [],
                awareness: [],
                move: [],
                str: [],
                acr: [],
                dex: [],
                gold: [],
                miss: 0,
            },

            ctx: null,

            tip: '',
            tip2: '',

            time: 0,
            itv: null,
            common,

            CONFIG,
        };
    },
    computed: {},
    destroyed(){
        clearInterval(this.itv);
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.ctx = this.$refs.cvs.getContext(`2d`);
            paintAvatar(this.ctx,this.unit.avatarData,CVSLEN);
        },
        showTip(buff){
            this.tip = `${buff.name} [等级 ${buff.level}]：${buff.desc}`;
            this.tip2 = `剩 ${parseFloat(buff.time/CONFIG.maxEnviorTime).toFixed(2)} 回合`;
        },
        hideTip(){
            this.tip = '';
            this.tip2 = '';
        },
        resetAnimation(){
            this.meClass = '';
            this.animates = [];
        },
        playAnimation(animationData,isTarget){
            let meClass = '',
                animates = [];
            if(!isTarget){ // 我是发动者
                meClass = 'caster'+'-'+(animationData.side==2?'me':'you');
            }
            else{ // 我是接收者
                if(animationData.dmg&&animationData.dmg.length>0){
                    for(let i=0;i<animationData.dmg.length;i++){
                        if(animationData.dmg[i]){
                            animates.push(['cut','stab','melee-punch','blast','shot','range-punch'][i]+'-'+(animationData.side==2?'me':'you'));
                        }
                    }
                }
                if(!animationData.changes.miss){
                    let hurt = 0;
                    let valueMap = ['hp','pow','awareness','move','str','acr','dex'];
                    let bonusTip = animationData.changes.bonusTip;
                    for(let i of valueMap){
                        let valueChange = animationData.changes[i];
                        if(valueChange<0){
                            hurt = 1;
                        }
                    }
                    if(animationData.changes.headshot){
                        animates.push('headshot');
                    }
                    if(isTarget==2){ // 我是发动者，也是接收者
                        meClass += 'caster'+'-'+(animationData.side==2?'me':'you');
                    }
                    else if(animationData.changes.search){
                        meClass = 'searched';
                    }
                    else if(!hurt){
                        meClass = 'common';
                    }
                    else{
                        meClass = 'attacked';
                    }
                }
                else{
                    this.changes.miss = 0;
                    setTimeout(_=>{
                        this.changes.miss = 1;

                        let name = this.name;
                        this.name = 'JK';
                        this.name = name;
                        setTimeout(_=>{
                            this.changes.miss = 0;

                            let name = this.name;
                            this.name = 'JK';
                            this.name = name;
                        },3500);
                    },10);
                }
            }
            this.meClass = meClass;
            this.animates = animates;
            // console.log('play animation',this.unit.name,animationData,isTarget);
        },
        playNumberAnimation(animationData){
            let changes = animationData.changes;
            let bonusTips = changes.bonusTips;
            // console.log('play number animation',animationData);
            if(changes){
                let valueMap = ['hp','pow','awareness','move','str','acr','dex','gold',];
                for(let name of valueMap){
                    if(changes[name]){
                        this.changes[name].push(changes[name]);
                        // setTimeout(_=>{
                        //     this.changes[name].shift();
                        // },2500);
                    }
                }
            }
            // 击杀奖励
            if(bonusTips&&bonusTips.length>0){
                // console.log(`击杀奖励`,bonusTips[0],bonusTips[1]);
                this.bonusTags = [];
                for(let tip of bonusTips){
                    this.bonusTags.push(tip);
                }
            }
        },
        changeFormat(change){
            return `-${Math.abs(change)}`;
        },
    },
    components:{
        Bar4,
        BuffIcon,
    },
};
</script>
<style scoped>
    @import '../style/animation.css';
    .unit-icon{
        position: relative;
        width: 200px;
        height: 240px;
        display: block;
    }
    .icon-wrap{
        position: absolute;
        top: 12px;
        left: 20px;
        height: 80px;
        width: 80px;
        z-index: 100;
        /* border: 1px solid #000; */
    }
    .icon{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        background-color: transparent;
        border-radius: 40px;
        z-index: 102;
    }
    .cvs{
        width: 141px;
        height: 141px;
    }
    .hightlight{
        border-radius: 50px;
        animation: intervalShadow .5s ease-in-out alternate infinite;
        z-index: 10001;
    }
    @keyframes intervalShadow {
        from{
            box-shadow: 0 0 20px 5px #000;
        }
        to{
            box-shadow: 0 0 50px 10px #000;
        }
    }
    .icon-name{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -28px;
        left: 0;
        right: 0;
        width: auto;
        margin: 0 auto;
        height: 20px;
        line-height: 20px;
        white-space: nowrap;
        word-break: keep-all;
        padding: 0 6px;
        text-align: center;
        font-size: 22px;
        color: #111;
        z-index: 103;
        font-weight: bold;
        text-shadow: 0 0 10px #fff;
        /* background-color: #aaa; */
    }
    .weapon-name{
        position: absolute;
        top: 115px;
        left: 0;
        width: 100%;
        height: 15px;
        line-height: 15px;
        white-space: nowrap;
        word-break: keep-all;
        padding: 0 2px;
        text-align: center;
        font-size: 14px;
        color: #666;
        z-index: 101;
        text-shadow: 0 0 4px #fff;
    }
    .acttime{
        position: absolute;
        display: inline-block;
        top: -4px;
        left: -20px;
        max-height: 74px;
        line-height: 16px;
        writing-mode: horizontal-tb;
        max-width: 20px;
        padding: 4px 0;
        text-align: center;
        white-space: wrap;
        word-break: break-all;
        background-color: Orange;
        color: #fff;
        z-index: 100;
    }
    .acttime-flash::before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: .8;
        z-index: 101;
        background-color: Orange;
        animation: tip-flash 1s linear forwards infinite;
    }
    @keyframes tip-flash {
        to{
            transform: scale(2);
            opacity: 0;
        }
    }
    .cur{
        position: absolute;
        z-index: 90;
        width: 140px;
        height: 140px;
        top: -32px;
        left: -30px;
        background-color: #333;
        opacity: 0;
        border-radius: 70px;
        animation: cur .5s infinite alternate;
    }
    @keyframes cur {
        to{
            transform: scale(66%);
            opacity: .8;
        }
    }
    .unit-icon:not(.dead):hover .icon{
        transition: .1s all;
        transform: scale(1.22);
    }
    .bar-1,.bar-2{
        position: absolute;
        top: 10px;
    }
    .bar-1{
        right: 62px;
    }
    .bar-2{
        right: 32px;
    }
    .buff-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 142px;
        /* bottom: 0; */
        padding: 0;
        height: 96px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .buff-tip{
        position: absolute;
        line-height: 25px;
        width: 100%;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: hidden;
        background-color: #131313;
        border: 1px solid #131313;
        left: 0;
        bottom: 90px;
        color: #fff;
        font-size: 12px;
        padding: 0 6px;
        z-index: 120;
    }
    .death-cover{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 60px;
        font-weight: bold;
        color: #f00;
        text-shadow: 0 0 20px #000;
        z-index: 100;
    }
    .miss-cover{
        position: absolute;
        left: -35%;
        top: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 170%;
        height: 80px;
        color: #fff;
        font-size: 28px;
        font-weight: bold;
        background-image: linear-gradient(to right, rgba(0,0,0,0), #000, rgba(0,0,0,0));
        text-shadow: 0 0 10px #000;
        z-index: 130;
        animation: miss 2.5s ease-out forwards;
    }
    @keyframes miss{
        70%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }

    /* 击杀奖励 */
    .bonus-tags{
        position: absolute;
        z-index: 105;
        width: 100%;
        height: 30px;
        line-height: 30px;
        right: 0;
        left: 0;
        margin: auto;
    }
    .bonus-tags::after{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        line-height: 30px;
        color: yellow;
        font-size: 20px;
        text-shadow: 0 0 4px #000;
        text-align: center;
        white-space: nowrap;
        word-break: keep-all;
        letter-spacing: 4px;
    }
    .bonus-burst::after{
        content: '破绽击杀';
        animation: bonustip 3.5s ease-out forwards;
        top: -65%;
    }
    .bonus-rampage::after{
        content: '联合击杀';
        animation: bonustip 4s ease-out forwards;
        top: 0;
    }
    .bonus-timid::after{
        content: '疲惫击杀';
        animation: bonustip 4.5s ease-out forwards;
        top: 65%;
    }
    @keyframes bonustip{
        10%{
            transform: scale(1.5);
        }
        13%{
            transform: scale(1.1);
        }
        30%{
            transform: scale(1.1);
        }
        100%{
            transform: scale(1.1);
            opacity: 0;
        }
    }

    /* bonus */
    .float{
        position: absolute;
        top: 0;
        right: 0;
        font-size: 25px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        width: 60px;
        color: Gold;
        white-space: nowrap;
        text-shadow: 0 0 4px #fff;
        word-break: keep-all;
        z-index: 106;
    }
    .plus{
        animation: fl1 1s ease-out forwards;
    }
    .minus{
        animation: fl2 1s ease-out forwards;
    }
    @keyframes fl1 {
        50%{
            opacity: 1;
            transform: translateY(-15%);
        }
        100%{
            opacity: 0;
            transform: translateY(-30%);
        }
    }
    @keyframes fl2 {
        50%{
            opacity: 1;
            transform: translateY(15%);
        }
        100%{
            opacity: 0;
            transform: translateY(30%);
        }
    }

    /* 危和疲 */
    .cirtip{
        position: absolute;
        right: 5px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: bold;
        font-size: 24;
        color: #fff;
        border-radius: 15px;
        opacity: .5;
    }
    .cirtip1{
        top: 20px;
        background-color: Red;
    }
    .cirtip2{
        top: 58px;
        background-color: RoyalBlue;
    }
    .critical-cirtip{
        opacity: 1;
        animation: critical 1.2s ease-in-out infinite;
    }
    @keyframes critical {
        69%{
            transform: scale(1);
        }
        70%{
            transform: scale(1.3);
        }
        80%{
            transform: scale(1);
        }
        90%{
            transform: scale(1.3);
        }
        100%{
            transform: scale(1);
        }
    }
</style>
