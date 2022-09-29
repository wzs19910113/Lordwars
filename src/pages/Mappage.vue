<template>
    <div class="mappage" @click="onClickCloseOptionPop()">
        <div class="map" v-if="curMap">
            <a class="btn btn-open-worldmap" @click="onClickOpenWorldMap">世界地图</a>
            <div class="time-board">
                <small>{{game.time[0]}}年 {{game.time[1]}}月 {{game.time[2]}}日</small>
                <br/>
                <b>{{game.time[3]}}:00</b>
            </div>
            <div class="header-board">
                <h1>{{curMap.name}}</h1>
            </div>
            <div class="map-wrap">
                <div class="cells-wrap">
                    <a class="btn btn-cell" :class="calcCellClassName(cell)" @click="onClickCell($event,cell,index)" :style="{width:`${cellWidthPct}%`,height:`${cellHeightPct}%`,left:`${cell.x*cellWidthPct}%`,top:`${cell.y*cellHeightPct}%`}" v-for="(cell,index) in curMap.cells">
                        <h4 class="name">{{CONFIG.cellNameMap[cell.type]}}</h4>
                    </a>
                </div>
                <div class="roles-cell" :style="{width:`${cellWidthPct}%`,left:`${cell.x*cellWidthPct}%`,top:`${cell.y*cellHeightPct+.5*cellHeightPct}%`}" v-show="showRoleCells&&calcMapClickable()" v-for="(cell,index) in curMap.cells">
                    <a class="btn btn-role-icon" :style="{left:`calc( -30px + ${role.style.offsetX}% )`}" @click="onClickRoleIcon($event,role)" v-for="role in cell.roles">
                        <canvas class="cvs-icon-role" :ref="`cvsIconMe${role.id}`" width="58" height="60"></canvas>
                        <h5 class="cvs-role-name">{{role.name}}</h5>
                    </a>
                </div>
                <a class="btn btn-view-roles" @click="onClickViewRoles" v-if="calcMapClickable()" :title="`${showRoleCells?'隐藏':'显示'}人物头像`">
                    <i class="iconfont" v-if="showRoleCells">&#xe634;</i>
                    <i class="iconfont" v-else>&#xe633;</i>
                </a>
            </div>
            <div class="bottom-board">
                <a class="me" @click="onClickIconMe($event)">
                    <canvas class="cvs-icon-me" ref="cvsIconMe" width="220" height="220"></canvas>
                    <h4 class="name">{{me.name}}</h4>
                </a>
            </div>
        </div>
        <!-- 世界地图 -->
        <div class="worldmap" v-if="showWorldMap">
            <a class="btn btn-close" @click="onClickCloseWorldMap">关闭</a>
            <div class="world-wrap">
                <canvas class="cvs-world-bg" ref="cvsWorldBg" width="800" height="800" @click="onClickCvsWorldBg"></canvas>
                <a class="btn worldmap-item" :class="`${map.type?'worldmap-item-wild':''} ${map.id==choseMapID?'worldmap-item-choose':''}`" @click="onClickMap($event,map)" v-for="map in game.allMaps" :style="{left:map.position[0]+'px',top:map.position[1]+'px',width:Math.sqrt(map.size)*5+'px',height:Math.sqrt(map.size)*5+'px',backgroundColor:`rgba(${map.color.r},${map.color.g},${map.color.b},.3)`,}">
                    <!-- <canvas class="cvs-world-loc" ref="cvsWorldLoc" v-if="me.mapID==map.id" width="50" height="50"></canvas> -->
                    <i class="loc iconfont" v-if="me.mapID==map.id">&#xe647;</i>
                    <h3 class="worldmap-item-name">{{map.name}}</h3>
                </a>
            </div>
        </div>
        <!-- 选项弹窗 -->
        <div class="option-pop" v-if="optionPopTitle" ref="options" :class="`${optionPopNeedFlip?'option-pop-flip':''}`" :style="{left:popPosition[0]+'px',top:popPosition[1]+'px'}">
            <h4 class="option-pop-title">{{optionPopTitle}}：</h4>
            <div class="option-wrap">
                <a class="btn btn-option" v-for="(option,index) in options" @click="onClickOption($event,option)">{{option.name}}</a>
            </div>
        </div>
        <!-- 测试按钮 -->
        <a class="btn btn-test" @click="onClickTest" v-if="DEBUG">TEST</a>
    </div>
</template>

<script>
import Scenepage from './Scenepage';
import { query, r, rr, bulbsort, shuffle, getParentNode, getMatchList, removeFromList, arrContains, removeFromNumberList, cloneObj, } from '../tools/utils';
import * as common from '../tools/common';
import * as ai from '../tools/ai';
import { genRandomAvatar, paintAvatar, genForeHairData, genBangsData, genBackHairData, formatPx, } from '../tools/avatar';
import { DEBUG, CONFIG, CACHE } from '../config/config';
export default {
    name: 'Map',
    props:{
        game: Object,
        saveGame: Function,
    },
    data(){
        return {
            curMap: null, // 当前显示的地图
            canInteract: false, // 当前地图可交互
            cellWidthPct: 0, // 格子宽度像素百分比
            cellHeightPct: 0, // 格子高度像素百分比
            choseCellIndex: -1, // 选中的格子序号
            choseRole: null, // 选中的人物
            showRoleCells: true, // 地图上显示人物

            me: {},

            showWorldMap: false,
            choseMapID: 0, // 世界地图选中的地图 ID

            optionPopTitle: '',
            option: [], // 选项弹窗的选项列表
            popPosition: [0,0,], // 选项弹窗坐标
            optionPopNeedFlip: false, // 选项弹窗样式翻转

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
            this.me = this.game.allRoles[0];
            this.$nextTick(_=>{
                this.printAvatar('cvsIconMe',this.me.avatarData);
            });
            this.renderMap(this.me.mapID);
        },
        printAvatar(ref,data,showBg=0){
            let ele = this.$refs[ref];
            if(!ele.getContext){
                ele = ele[0];
            }
            let ctx = ele.getContext(`2d`);
            ctx.width = ele.clientWidth;
            ctx.height = ele.clientHeight;
            paintAvatar(ctx,data,ele.clientWidth,ele.clientHeight,0);
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
                    let toMapID = fromMap.roads[j][0];
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
                    let toMapID = roads[i][0];
                    toMap = getMatchList(this.game.allMaps,[['id',toMapID]])[0];
                    if(toMap){
                        this.ctxWorldBg.moveTo(fromMap.position[0],fromMap.position[1]);
                        this.ctxWorldBg.lineTo(toMap.position[0],toMap.position[1]);
                    }
                }
                this.ctxWorldBg.stroke();
                this.ctxWorldBg.closePath();
            }
            // this.printAvatar('cvsWorldLoc',this.me.avatarData);
        },
        passTime(){ // 经历时间
            let time = this.game.time;
            let calcDaycount = _ =>{
                let mdMap = [31,28,31,30,31,30,31,31,30,31,30,31,];
                if(time[0]%4==0){ // 闰年
                    mdMap[1] = 29;
                }
                return mdMap[time[1]-1];
            }
            time[3] += 1;
            if(time[3]>23){ // 时
                time[3] = 0;
                time[2] += 1;
                if(time[2]>calcDaycount()){ // 天
                    time[2] = 1;
                    time[1] += 1;
                    if(time[1]>12){ // 月
                        time[1] = 1;
                        time[0] += 1;
                    }
                }
            }
            this.$forceUpdate();
        },

        calcMapClickable(){ // 判断是否可交互
            return this.curMap.id==this.me.mapID;
        },
        calcCellClassName(cell){ // 计算格子元素的类名
            let res;
            res = `${cell.type!=1?'btn-cell-bd':''}`;
            return res;
        },

        onClickOpenWorldMap(){ // 点击【打开世界地图】按钮
            this.showWorldMap = true;
            this.$nextTick(_=>{
                this.updateCvsWorldBg();
            });
        },
        onClickCloseWorldMap(){ // 点击【关闭世界地图】按钮
            this.choseMapID = 0;
            this.showWorldMap = false;
        },
        onClickCvsWorldBg(){ // 点击【世界地图背景画板】
            // this.choseMapID = 0;
            // this.updateCvsWorldBg();
        },
        onClickCloseOptionPop(){ // 点击【关闭选项弹窗】
            this.optionPopTitle = '';
            this.options = [];
            this.popPosition = [0,0,];
            this.optionPopNeedFlip = false;
        },
        onClickViewRoles(){ // 点击【显示人物图标】按钮
            if(!this.calcMapClickable()){
                return ;
            }
            this.showRoleCells = !this.showRoleCells;
            if(this.showRoleCells){
                this.$nextTick(_=>{
                    this.printMapRoleAvatars();
                });
            }
        },

        onClickIconMe(evt){ // 点击【图标-我】 TODO
            this.popOption(evt,1);
        },
        onClickCell(evt,cell,index){ // 点击【格子】 TODO
            if(!this.calcMapClickable()){
                return ;
            }
            this.choseCell = cell;
            if(cell.type>=50||cell.type==0){
                this.popOption(evt,2);
            }
            else{
                this.onClickCloseOptionPop();
            }
        },
        onClickRoleIcon(evt,role){ // 点击【人物图标】 TODO
            if(!this.calcMapClickable()){
                return ;
            }
            this.choseRole = cloneObj(role);
            this.popOption(evt,3);
        },
        onClickMap(evt,map){ // 点击【世界地图上的地图】 TODO
            if(this.choseMapID!=map.id){
                this.choseMapID = map.id;
                this.updateCvsWorldBg(map.id);
                this.popOption(evt,4);
            }
            else{
                this.choseMapID = 0;
                this.updateCvsWorldBg();
                this.onClickCloseOptionPop();
            }
        },

        popOption(evt,type){ // 弹出选项弹窗 TODO
            evt.stopPropagation();
            evt.preventDefault();
            let { pageX, pageY, } = evt;
            let options = [];
            let title;
            switch(type){
                case 1: // 我
                    title = `${this.me.name}`;
                    options = [
                        { id:101, name:'我的位置', callback: _=>{
                            let curMap = getMatchList(this.game.allMaps,[['id',this.me.mapID]])[0];
                            if(curMap){ // 回到我所在的地图
                                this.curMap = curMap;
                                this.renderMap(curMap.id);
                            }
                        }},
                        { id:102, name:'查看状态', callback: _=>{
                            console.log(`我-查看状态`,title,this.me);
                        }},
                        { id:103, name:'查看背包', callback: _=>{
                            console.log(`我-查看背包`,title,this.me);
                        }},
                    ];
                break;
                case 2: // 格子
                    title = `${CONFIG.cellAllNameMap[this.choseCell.type]}`;
                    options = [
                        { id:201, name:'建造', callback: _=>{
                            console.log(`格子-建造`,title,this.choseCell);
                        }},
                        { id:202, name:'购买', callback: _=>{
                            console.log(`格子-购买`,title,this.choseCell);
                        }},
                    ];
                break;
                case 3: // 人物图标
                    title = `${this.choseRole.name}`;
                    options = [
                        { id:301, name:'闲聊', callback: _=>{
                            console.log(`人物-闲聊`,title,this.choseRole);
                        }},
                        { id:302, name:'偷袭', callback: _=>{
                            console.log(`人物-偷袭`,title,this.choseRole);
                        }},
                        { id:303, name:'决斗', callback: _=>{
                            console.log(`人物-决斗`,title,this.choseRole);
                        }},
                        { id:304, name:'请求', callback: _=>{
                            console.log(`人物-请求`,title,this.choseRole);
                        }},
                    ];
                break;
                case 4: // 世界地图
                    let toMap = getMatchList(this.game.allMaps,[['id',this.choseMapID]])[0];
                    title = toMap.name;
                    options = [
                        { id:401, name:'查看', callback: _=>{
                            this.renderMap(toMap.id);
                            this.onClickCloseWorldMap();
                        }},
                        { id:402, name:'移动至此', callback: _=>{

                        }},
                    ];
                break;
            }
            this.optionPopTitle = title;
            this.popPosition = [pageX,pageY,];
            this.options = options;
            // 检查是否样式翻转
            this.$nextTick(_=>{
                let optionEle = this.$refs.options;
                let { offsetWidth: width, offsetHeight: height, } = optionEle;
                let { clientWidth, clientHeight, } = document.body;
                if((pageX+width)>clientWidth||(pageY+height)>clientHeight){
                    this.optionPopNeedFlip = true;
                }
                else{
                    this.optionPopNeedFlip = false;
                }
            });
        },
        onClickOption(evt,option){ // 点击选项
            evt.stopPropagation();
            evt.preventDefault();
            option.callback&&option.callback();
            this.onClickCloseOptionPop();
        },

        renderMap(mapID){ // 渲染地图
            let map = getMatchList(this.game.allMaps,[['id',mapID]])[0];
            if(map){
                let len = Math.ceil(Math.sqrt(map.size)/2);
                this.curMap = cloneObj(map);
                this.cellWidthPct = 100/len;
                this.cellHeightPct = 100/len;
                this.canInteract = this.me.mapID==map.id;
                let mapRoles = [];
                for(let i=0;i<this.curMap.cells.length;i++){ // 获取并渲染人物
                    this.curMap.cells[i].roles = [];
                    let roles = getMatchList(this.game.allRoles,[['mapID',this.curMap.id],['cellIndex',i]]);
                    if(roles.length>0){
                        let offsetXRange = 1/(roles.length+1)*100;
                        for(let j=0;j<roles.length;j++){
                            let style = {};
                            style.offsetX = offsetXRange*(j+1);
                            roles[j].style = style;
                            this.curMap.cells[i].roles.push(roles[j]);
                            mapRoles.push(roles[j]);
                        }
                    }
                }
                this.curMap.roles = mapRoles;
                this.$nextTick(_=>{
                    this.printMapRoleAvatars();
                });
            }
        },
        printMapRoleAvatars(){ // 绘制地图中的人物
            for(let role of this.curMap.roles){
                this.printAvatar(`cvsIconMe${role.id}`,role.avatarData);
            }
        },

        onClickTest(){ // 点击【测试】按钮
            this.passTime();
            this.saveGame();
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
        overflow: hidden;
    }
    .map{
        position: relative;
        background-color: #343434;
        width: 100%;
        height: 100%;
    }
    /* 时间面板 */
    .time-board{
        position: absolute;
        left: 40px;
        top: 0;
        width: 160px;
        height: 85px;
        padding: 10px;
        line-height: 30px;
        color: #c7d047;
        font-size: 20px;
        text-shadow: 0 0 12px #000;
    }
    .time-board b{
        font-size: 40px;
        text-shadow: 0 0 8px #000;
    }
    /* 头部面板 */
    .header-board{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        margin: 0 auto;
        color: #fff;
        height: 50px;
        text-align: center;
        padding-top: 10px;
        letter-spacing: 10px;
        line-height: 50px;
        font-size: 20px;
        text-shadow: 0 0 12px #000;
    }
    .header-board h1{

    }
    /* 地图 */
    .map-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 100px;
        margin: 0 auto;
        width: 80%;
        height: calc( 100% - 320px );
        box-shadow: 0 0 12px 12px #131313;
        /* border: 2px solid #a81313; */
    }
    .btn-view-roles{
        position: absolute;
        top: 0;
        right: -60px;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }
    .cells-wrap{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }
    .btn-cell{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin: 0;
        text-shadow: 0 0 8px #000;
    }
    .btn-cell-bd{
        border: 1px dashed rgba(255,255,255,.3);
    }
    .roles-cell{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        height: 0;
        margin: 0;
    }
    .btn-cell .role-icon{
        position: absolute;
    }
    .btn-role-icon{
        position: absolute;
        display: block;
        margin: 0;
        width: 60px;
        height: 60px;
        background-color: transparent;
        transform: translate(0,-55px);
    }
    .btn-role-icon:hover{
        opacity: 1;
    }
    .btn-role-icon::after{
        content: '';
        position: absolute;
        height: 25px;
        width: 2px;
        border-radius: 1px;
        background-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%);
        bottom: -25px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    .cvs-icon-role{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: rgba(0,0,0,.4);
        border: 1px solid #fff;
        /* box-shadow: 0 0 4px 4px #fff; */
    }
    .cvs-role-name{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: baseline;
        width: 60px;
        height: 15px;
        background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, #000 15%, #000 85%, rgba(255,255,255,0) 100%);
        line-height: 15px;
        white-space: nowrap;
        word-break: keep-all;
        text-align: center;
        font-size: 11px;
    }
    /* 世界地图 */
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
        z-index: 350;
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
        z-index: 300;
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
        position: absolute;
        z-index: 110;
        border-radius: 50%;
        border: 2px solid #ddd;
        transform: translate(-50%,-50%);
    }
    .worldmap-item h3{
        font-size: 18px;
        line-height: 30px;
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
    .worldmap-item-name{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: auto;
        z-index: 55;
    }
    .loc{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 40px;
        text-shadow: 0 0 10px #000;
        color: OrangeRed;
        z-index: 54;
        animation: ani-cvs-world-loc .4s ease-in-out infinite alternate;
    }
    @keyframes ani-cvs-world-loc{
        100%{
            box-shadow: 0 0 8px 8px OrangeRed;
        }
    }
    /* 底部面板 */
    .bottom-board{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 220px;
        overflow-x: auto;
        background-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #131313 100%);
        background-color: transparent;
        z-index: 100;
    }
    .me{
        display: block;
        position: relative;
        left: 40px;
        width: 220px;
        height: 220px;
        background-color: transparent;
        cursor: pointer;
        transform-origin: 50% 100% 0;
        transition: all .15s;
    }
    .me:hover{
        transform: scale(1.1);
    }
    .cvs-icon-me{
        position: absolute;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 220px;
        height: 220px;
        z-index: 101;
    }
    .me .name{
        position: absolute;
        bottom: 6px;
        left: 0;
        right: 0;
        margin: 0 auto;
        text-shadow: 0 0 8px #000;
        background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, #131313 20%, #131313 80%,rgba(255,255,255,0) 100%);
        font-weight: bold;
        font-size: 20px;
        color: #fff;
        text-align: center;
        width: 100%;
        height: 30px;
        line-height: 30px;
        z-index: 102;
    }
    /* 选项弹窗 */
    .option-pop{
        position: absolute;
        width: 150px;
        min-height: 30px;
        min-width: 100px;
        background-color: transparent;
        z-index: 10000;
    }
    .option-pop-flip{
        transform: translate(-100%,-100%);
    }
    .option-pop-title{
        display: inline-block;
        color: #aaa;
        font-size: 15px;
        font-weight: normal;
        height: 20px;
        line-height: 20px;
        margin-bottom: 2px;
        background-image: linear-gradient(to right, #131313 0%, #131313 70%, rgba(255,255,255,0) 100%);
        width: auto;
        padding: 0 6px;
        text-shadow: 0 0 4px #000;
    }
    .option-pop .btn-option{
        display: inline-block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: rgba(0,0,0,.8);
        text-align: center;
        /* border: 1px outset #555; */
        color: #fff;
        text-shadow: 0 0 4px #000;
        font-weight: normal;
        font-size: 17px;
        white-space: nowrap;
        word-break: keep-all;
        margin: 0;
        margin-bottom: 2px;
        box-shadow: 0 0 12px 2px #000;
    }
    .option-pop .btn-option:hover{
        background-color: OrangeRed;
    }
    /* test */
    .btn-test{
        position: absolute;
        right: 0;
        top: 20px;
        width: 50px;
        height: 20px;
        line-height: 20px;
    }

</style>
