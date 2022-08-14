<template>
    <a class="unit-icon" :class="{'dead':unit.dead}" @click="onClick(unit)" :style="{opacity:(this.unit.awareness<=0?`.6`:`1`)}">
        <div class="icon-wrap" :class="highlight?'hightlight':''">
            <b class="icon" :class="meClass+' '+calcIconColor()">
                <span class="icon-title" v-if="unit.title">{{unit.title}}</span>
                <span class="icon-name">{{unit.name}}</span>
                <span :class="`bonus-tags bonus-${tag}`" v-for="(tag,index) in bonusTags"></span>
            </b>
            <div class="weapon-name" v-if="unit.equipments.hands.name">{{unit.equipments.hands.name}}{{`${unit.equipments.hands.type==2?'(全)':''}`}}</div>
            <div class="cur" v-if="unit.cursor==1&&!meClass"></div>
            <div v-for="(animateClass,index) in animates" :class="animateClass"></div>
            <div class="float minus" v-for="(gold,index) in changes.gold">{{changeFormat(gold)}}</div>
            <div class="acttime" :class="unit.dead?'':'acttime-flash'" v-if="unit.actTimePerRound>1">{{['精英','神将精英'][unit.actTimePerRound-2]}}</div>
        </div>
        <Bar1 class="bar-1" title="生命" :type="1" :crt="unit.hp" :max="unit.maxhp" :changes="changes.hp" />
        <Bar1 class="bar-2" title="意志" :type="2" :crt="unit.pow" :max="unit.maxpow" :changes="changes.pow" :checkSuffix="!unit.dead&&!unit.me&&unit.isCreep" />
        <Bar1 class="bar-3" title="存在感" :type="3" :crt="unit.awareness" :changes="changes.awareness" />
        <Bar1 class="bar-4" title="行动力" :type="4" :crt="unit.move" :changes="changes.move" :checkSuffix="!unit.dead&&!unit.me&&unit.isCreep" />
        <Bar2 class="bar-5" title="力" :type="1" :crt="unit.str" :max="unit.fixstr" :changes="changes.str" />
        <Bar2 class="bar-6" title="准" :type="2" :crt="unit.acr" :max="unit.fixacr" :changes="changes.acr" />
        <Bar2 class="bar-7" title="速" :type="3" :crt="unit.dex" :max="unit.fixdex" :changes="changes.dex" />
        <div class="buff-wrap" v-if="!unit.dead">
            <BuffIcon :buff="buff" :key="index" :mouseon="showTip" :mouseoff="hideTip" v-for="(buff,index) in unit.buffs" />
            <span class="buff-tip" v-if="tip">{{tip}}<br/>{{tip2}}</span>
        </div>
        <div class="death-cover" v-if="unit.dead">战<br/>退</div>
        <div class="miss-cover" v-if="changes.miss">未捕获目标</div>
    </a>
</template>
<script>
import Bar1 from '../components/Bar1';
import Bar2 from '../components/Bar2';
import BuffIcon from '../components/BuffIcon';
import { query, r, bulbsort, getParentNode, getMatchList, removeFromList, } from '../tools/utils';
import * as common from '../tools/common';
import { DEBUG, CONFIG, CACHE } from '../config/config';
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
        },
        calcIconColor(){
            let res = '';
            let unit = this.unit;
            if((unit.isCreep&&!unit.isBoss&&unit.actTimePerRound==1)||(!unit.isCreep&&!unit.me)){
                res = 'grey';
            }
            else if(unit.isBoss){
                res = 'red';
            }
            else if(unit.isCreep&&unit.actTimePerRound==2){
                res = 'blue';
            }
            else if(unit.isCreep&&unit.actTimePerRound==3){
                res = 'darkblue';
            }
            else if(unit.me&&unit.standpoint!=4){
                res = 'white';
            }
            return res;
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
        Bar1,
        Bar2,
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
        left: 8px;
        height: 66px;
        width: 66px;
        z-index: 100;
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
        background-color: #111;
        color: #fff;
        box-shadow: 0 0 8px #fff;
        border-radius: 33px;
        z-index: 100;
    }
    .hightlight{
        border-radius: 33px;
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
    .grey{
        /* background-color: #444; */
    }
    .red{
        background-color: Crimson;
        border: 2px solid Orange;
        box-shadow: 0 0 12px 12px Purple;
        text-shadow: 0 0 10px #fff;
    }
    .blue{
        background-color: Purple;
        border: 1px solid Purple;
    }
    .darkblue{
        background-color: FireBrick;
        box-shadow: 0 0 4px 4px Orange;
    }
    .white{
        color: #111;
        border: 2px solid #111;
        background-color: #ddd;
    }
    .icon-title{
        display: block;
    }
    .weapon-name{
        position: absolute;
        top: -4px;
        left: 54px;
        height: 15px;
        line-height: 15px;
        width: auto;
        white-space: nowrap;
        word-break: keep-all;
        padding: 0 2px;
        text-align: left;
        color: #111;
        z-index: 101;
        font-weight: bold;
        text-shadow: 0 0 4px #fff;
        border-bottom: 1px solid #666;
    }
    .acttime{
        position: absolute;
        display: inline-block;
        top: -4px;
        right: -115px;
        height: 16px;
        line-height: 16px;
        max-width: 60px;
        padding: 0 4px;
        text-align: center;
        white-space: nowrap;
        word-break: keep-all;
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
        width: 120px;
        height: 120px;
        top: -27px;
        left: -27px;
        background-color: #333;
        opacity: 0;
        border-radius: 75px;
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
    .bar-1,.bar-2,.bar-3,.bar-4{
        position: absolute;
        left: 8px;
    }
    .bar-5,.bar-6,.bar-7{
        position: absolute;
        top: 30px;
    }
    .bar-1{
        top: 90px;
    }
    .bar-2{
        top: 110px;
    }
    .bar-3{
        top: 130px;
    }
    .bar-4{
        top: 150px;
    }
    .bar-5{
        left: 70px;
    }
    .bar-6{
        left: 107px;
    }
    .bar-7{
        left: 144px;
    }
    .buff-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 164px;
        /* bottom: 0; */
        padding: 4px;
        min-height: 72px;
        max-height: 136px;
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
        bottom: 70px;
        color: #fff;
        font-size: 12px;
        padding: 0 6px;
        z-index: 20;
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
        left: -25%;
        right: -25%;
        top: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 180%;
        height: 80px;
        color: #fff;
        font-size: 28px;
        font-weight: bold;
        background-image: linear-gradient(to right, rgba(0,0,0,0), #000, rgba(0,0,0,0));
        text-shadow: 0 0 10px #000;
        z-index: 90;
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
</style>
