<template>
    <div class="home">
        <Mappage ref="map" v-if="state==1" :game="game" :saveGame="saveGame" />
        <Scenepage ref="scene" v-if="state==2" :data="sceneData" :game="game" :onEnd="onBattleEnd" />
        <div class="alert" v-for="(alertMsg,index) in alertMsgs" v-if="alertMsgs.length>0">{{alertMsg}}</div>
        <div class="confirm" v-if="confirmTip">
            <h4 class="confirm-title" v-html="confirmTip"></h4>
            <div class="btn-wrap">
                <a class="btn" @click="onClickConfirm()">确定</a>
                <a class="btn" @click="onClickCancel()" v-if="!hideConfirmCancel">取消</a>
            </div>
        </div>
        <div class="loading" v-if="loading">
            <i class="iconfont">&#xe65c;</i>
        </div>
    </div>
</template>

<script>
import Mappage from './Mappage';
import Scenepage from './Scenepage';
import { query, r, rr, bulbsort, shuffle, getParentNode, getMatchList, removeFromList, arrContains, removeFromNumberList, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import * as IDB from '../tools/indexedDB';
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
                map: null,
            },

            hideConfirmCancel: false,
            confirmTip: '', // 确认文本
            alertMsgs: [],

            game: { // 游戏数据

            },


            loading: false,
            itv: null,
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
            try{
                this.loading = true;
                IDB.initIDB({callback: event=>{
                    IDB.readIDB({
                        success: game=>{
                            console.log(`初始化`,game);
                            this.game = game;
                            this.state = 1;
                        },
                        callback: event=>{
                            this.loading = false;
                        },
                        error: event=>{
                            console.error(event);
                            this.$router.push('/');
                        }
                    });
                }});
            }
            catch(err){
                console.error(err);
                this.$router.push('/');
            }
        },
        saveGame(){ // 保存游戏数据
            try{
                this.loading = true;
                IDB.initIDB({callback: event=>{
                    IDB.updateIDB({
                        game: this.game,
                        success: event=>{
                            console.log(`保存游戏数据`,this.game);
                        },
                        callback: event=>{
                            this.loading = false;
                        },
                        error: event=>{
                            console.error(event);
                            this.$router.push('/');
                        }
                    });
                }});
            }
            catch(err){
                console.error(err);
                this.$router.push('/');
            }
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
        Mappage,
        Scenepage,
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../style/common.css';
    .home{
        position: relative;
        width: 100%;
        height: 100%;
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
