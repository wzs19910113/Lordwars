<template>
    <div class="mappage">
        <div class="map">
            <a class="btn btn-open-worldmap" @click="onClickOpenWorldMap">世界地图</a>
        </div>
        <div class="worldmap" v-if="showWorldMap">
            <a class="btn btn-close" @click="onClickCloseWorldMap">关闭</a>
            <div class="world-wrap">
                <canvas class="cvs-world-bg" ref="cvsWorldBg" width="800" height="800" @click="onClickCvsWorldBg"></canvas>
                <a class="btn worldmap-item" :class="`${map.type?'worldmap-item-wild':''} ${map.id==choseMapID?'worldmap-item-choose':''}`" @click="onClickMap(map)" v-for="map in game.allMaps" :style="{left:map.position[0]+'px',top:map.position[1]+'px',width:Math.sqrt(map.size)*5+'px',height:Math.sqrt(map.size)*5+'px',backgroundColor:`rgba(${map.color.r},${map.color.g},${map.color.b},.3)`,}">
                    <h3>{{map.name}}</h3>
                </a>
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
    name: 'Map',
    props:{
        game: Object,
    },
    data(){
        return {
            showWorldMap: false,
            choseMapID: 0,

            ctxWorldBg: null,

            DEBUG,
            CONFIG,
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

        },
        updateCvsWorldBg(mapID){ // 同步世界地图背景画板
            this.ctxWorldBg = this.$refs.cvsWorldBg.getContext(`2d`);
            this.ctxWorldBg.width = 800;
            this.ctxWorldBg.height = 800;
            this.ctxWorldBg.clearRect(0,0,800,800);
            this.ctxWorldBg.beginPath();
            this.ctxWorldBg.lineCap = 'round';
            this.ctxWorldBg.lineWidth = 5;
            this.ctxWorldBg.strokeStyle = `rgba(205,205,205,.4)`;
            if(mapID){
                this.ctxWorldBg.strokeStyle = `rgba(105,105,105,.4)`;
            }
            let fromMap,toMap;
            for(let i=0;i<this.game.allMaps.length;i++){
                fromMap = this.game.allMaps[i];
                for(let j=0;j<fromMap.roads.length;j++){
                    let toMapID = fromMap.roads[j];
                    toMap = getMatchList(this.game.allMaps,[['id',toMapID]])[0];
                    if(toMap){
                        this.ctxWorldBg.moveTo(fromMap.position[0],fromMap.position[1]);
                        this.ctxWorldBg.lineTo(toMap.position[0],toMap.position[1]);
                    }
                }
            }
            this.ctxWorldBg.stroke();
            this.ctxWorldBg.closePath();
            if(mapID){
                this.ctxWorldBg.beginPath();
                fromMap = getMatchList(this.game.allMaps,[['id',mapID]])[0];
                let roads = fromMap.roads;
                this.ctxWorldBg.strokeStyle = `rgba(55,190,234,1)`;
                for(let i=0;i<roads.length;i++){
                    let toMapID = roads[i];
                    toMap = getMatchList(this.game.allMaps,[['id',toMapID]])[0];
                    if(toMap){
                        this.ctxWorldBg.moveTo(fromMap.position[0],fromMap.position[1]);
                        this.ctxWorldBg.lineTo(toMap.position[0],toMap.position[1]);
                    }
                }
                this.ctxWorldBg.stroke();
                this.ctxWorldBg.closePath();
            }
        },
        onClickOpenWorldMap(){ // 点击【打开世界地图】按钮
            this.showWorldMap = true;
            setTimeout(_=>{
                this.updateCvsWorldBg();
            },50);
        },
        onClickCloseWorldMap(){ // 点击【关闭世界地图】按钮
            this.choseMapID = 0;
            this.showWorldMap = false;
        },
        onClickMap(map){ // 点击【世界地图上的地图】
            this.choseMapID = map.id;
            this.updateCvsWorldBg(map.id);
        },
        onClickCvsWorldBg(){ // 点击【世界地图背景画板】
            this.choseMapID = 0;
            this.updateCvsWorldBg();
        },
    },
    components:{

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../style/common.css';
    .mappage{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .map{
        background-color: #343434;
        width: 100%;
        height: 100%;
    }
    .worldmap{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        transform: scaleX(0);
        transform-origin: -50% 0 0;
        background-color: #343434;
        animation: worldmap .15s ease-out forwards;
    }
    @keyframes worldmap {
        to{
            transform: scaleX(1);
        }
    }
    .worldmap .btn-close,
    .btn-open-worldmap{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 40px;
        font-size: 24px;
        text-align: center;
    }
    .world-wrap{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background-color: #343434;
        width: 800px;
        height: 800px;
    }
    .cvs-world-bg{
        position: absolute;
        z-index: 105;
        width: 800px;
        height: 800px;
        background-color: #343434;
    }
    .worldmap-item{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        z-index: 110;
        border-radius: 50%;
        border: 2px solid #ddd;
        transform: translate(-50%,-50%);
    }
    .worldmap-item h3{
        font-size: 18px;
        line-height: 18px;
        white-space: nowrap;
        word-break: keep-all;
        color: #ddd;
        text-align: center;
        text-shadow: 0 0 8px #000;
    }
    .worldmap-item-wild{
        border: 2px solid #e81313;
    }
    .worldmap-item-wild h3{
        color: #e81313;
    }
    .worldmap-item-choose{
        border-width: 10px;
        border-style: dashed;
    }


</style>
