<template>
    <div class="mappage" :class="`${isNight()?'mappage-night':''}`" @click="onClickCloseOptionPop()">
        <!-- 时间 -->
        <a class="btn time-board" :class="`${this.gameTimeAcc>0?'timer-elapsing':''}`" @click="onClickTimer">
            <span class="btn-timer" :class="this.gameTimeAcc>0?'btn-timer-elapsing':'btn-timer-paused'">
                <i class="iconfont">&#xe638;</i>
                <span class="timer-stat">{{this.gameTimeAcc>0?'时光流逝':'暂停'}}</span>
            </span>
            <span class="time">
                <small>{{game.time[0]}}年 {{game.time[1]}}月 {{game.time[2]}}日</small>
                <br/>
                <b>{{game.time[3]}}:00</b>
            </span>
        </a>
        <!-- 余额 -->
        <div class="tag-board">
            <h1>$</h1><b v-html="common.moneyFormat(me.balance)"></b>
        </div>
        <!-- 主界面 -->
        <div class="map" v-if="curMap">
            <a class="btn btn-open-worldmap" @click="onClickOpenWorldMap">世界地图</a>
            <div class="header-board">
                <h1>{{curMap.name}}</h1>
            </div>
            <!-- 主界面-地面 -->
            <div class="map-wrap">
                <div class="cells-wrap">
                    <a class="btn btn-cell" :class="calcCellClassName(cell)" @click="onClickCell($event,cell,index)" :style="{width:`${cellWidthPct}%`,height:`${cellHeightPct}%`,left:`${cell.x*cellWidthPct}%`,top:`${cell.y*cellHeightPct}%`}" v-for="(cell,index) in curMap.cells">
                        <h4 class="name">{{CONFIG.cellNameMap[cell.type]}}</h4>
                    </a>
                </div>
                <div class="roles-cell" :style="{width:`${cellWidthPct}%`,left:`${cell.x*cellWidthPct}%`,top:`${cell.y*cellHeightPct+.5*cellHeightPct}%`}" v-show="showRoleCells&&calcMapClickable()" v-for="(cell,index) in curMap.cells">
                    <a class="btn btn-role-icon" v-if="role.id!=me.id" :style="{left:`calc( -30px + ${role.style.offsetX}% )`}" @click="onClickRoleIcon($event,role,cell,index)" v-for="role in cell.roles">
                        <canvas class="cvs-icon-role" :ref="`cvsIconMe${role.id}`" width="58" height="60"></canvas>
                        <h5 class="cvs-role-name">{{role.name}}</h5>
                    </a>
                </div>
                <a class="btn btn-view-roles" @click="onClickViewRoles" v-if="calcMapClickable()" :title="`${showRoleCells?'隐藏':'显示'}人物头像`">
                    <i class="iconfont" v-if="showRoleCells">&#xe634;</i>
                    <i class="iconfont" v-else>&#xe633;</i>
                </a>
            </div>
            <!-- 主界面-底部面板 -->
            <div class="bottom-board">
                <a class="bottom-role" @click="onClickIconCellRole($event,role)" v-for="(role,index) in cellRoles">
                    <canvas class="cvs-icon-cellrole" :ref="`cvsIconCellRole${index}`" width="220" height="220"></canvas>
                    <h4 class="name">{{role.name}}</h4>
                </a>
            </div>
        </div>
        <!-- 世界地图 -->
        <div class="worldmap" v-show="showWorldMap">
            <a class="btn btn-close" @click="onClickCloseWorldMap">关闭</a>
            <div class="world-wrap">
                <canvas class="cvs-world-bg" ref="cvsWorldBg" width="800" height="800" @click="onClickCvsWorldBg"></canvas>
                <a class="btn worldmap-item" :class="`${map.type?'worldmap-item-wild':''} ${map.id==choseMapID?'worldmap-item-choose':''}`" @click="onClickMap($event,map)" v-for="map in game.allMaps" :style="{left:map.position[0]+'px',top:map.position[1]+'px',width:Math.sqrt(map.size)*5+'px',height:Math.sqrt(map.size)*5+'px',backgroundColor:`rgba(${map.color.r},${map.color.g},${map.color.b},.3)`,}">
                    <!-- <canvas class="cvs-world-loc" ref="cvsWorldLoc" v-if="me.mapID==map.id" width="50" height="50"></canvas> -->
                    <h3 class="worldmap-item-name">{{map.name}}</h3>
                </a>
                <i class="loc iconfont" :style="{left:meMap.position[0]+'px',top:meMap.position[1]+'px'}">&#xe647;</i>
            </div>
        </div>
        <!-- 选项弹窗 -->
        <div class="option-pop" v-if="optionPopTitle" ref="options" :class="`${optionPopNeedFlip?'option-pop-flip':''}`" :style="{left:popPosition[0]+'px',top:popPosition[1]+'px'}">
            <h4 class="option-pop-title">{{optionPopTitle}}</h4>
            <div class="option-wrap">
                <a class="btn btn-option" v-for="(option,index) in options" v-if="!option.hide" @click="onClickOption($event,option)">{{option.name}}</a>
            </div>
        </div>
        <!-- alert弹窗 -->
        <a class="btn alert-pop" v-if="alertMsg" @click="onClickAlert" v-html="alertMsg">
        </a>
        <!-- confirm弹窗 -->
        <a class="confirm-pop" v-if="confirmMsg">
            <div class="confirm-pop-title" v-html="confirmMsg"></div>
            <a class="btn btn-confirm" @click="onClickConfirm">确认</a>
            <a class="btn btn-cancel" @click="onClickCancelConfirm">取消</a>
        </a>
        <!-- 测试按钮 -->
        <a class="btn btn-test" @click="onClickTest" v-if="DEBUG">TEST</a>
    </div>
</template>

<script>
import Scenepage from './Scenepage';
import { query, r, rr, dijkstra, bulbsort, shuffle, getParentNode, getMatchList, filterList, removeFromList, arrContains, removeFromNumberList, cloneObj, } from '../tools/utils';
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
            cellRoles: [], // 选中的格子中的人物列表
            choseRole: null, // 选中的人物
            showRoleCells: true, // 地图上显示人物

            me: {},
            meMap: {},

            showWorldMap: false,
            choseMapID: 0, // 世界地图选中的地图 ID

            optionPopTitle: '',
            option: [], // 选项弹窗的选项列表
            popPosition: [0,0,], // 选项弹窗坐标
            optionPopNeedFlip: false, // 选项弹窗样式翻转

            ctxWorldBg: null,

            confirmMsg: '', // confirm信息
            alertMsg: '', // alert信息

            gameItv: null, // 游戏计时器
            gameTime: 0, // 一小时内的游戏时间
            gameTimeAcc: 0, // 游戏时间增量

            DEBUG,
            CONFIG,
            common,
        };
    },
    destroyed(){
        this.gameItv&&clearInterval(this.gameItv);
    },
    created(){
        this.init();
    },
    mounted(){
    },
    methods: {
        init(){
            this.me = this.game.allRoles[0];
            this.renderMap(this.me.mapID);
            this.meMap = getMatchList(this.game.allMaps,[['id',this.me.mapID]])[0];
            this.initGameItv();
            this.initKeyboard();
        },
        initKeyboard(){ // 初始化键盘事件
            if(!document.onkeyup){
                document.onkeyup = event =>{
                    let e = event||window.event||arguments.callee.caller.arguments[0];
                    if(e&&(e.keyCode==32)){ // 按 回车 或 空格
                        this.onKeyupSpace();
                    }
                };
            }
        },
        initGameItv(){ // 启动游戏计时器
            this.gameItv = setInterval(_=>{
                this.gameTime += this.gameTimeAcc;
                if(this.gameTime>=1000){
                    this.gameTime = 0;
                    this.everyHour();
                }
            },100);
        },
        printAvatar(ref,data,showBg=0){
            let ele = this.$refs[ref];
            if(!ele){
                return;
            }
            if(!ele.getContext){
                ele = ele[0];
            }
            let ctx = ele.getContext(`2d`);
            ctx.width = ele.clientWidth;
            ctx.height = ele.clientHeight;
            paintAvatar(ctx,data,ele.clientWidth,ele.clientHeight,0);
        },
        updateCvsWorldBg({mapID,indexPath}={}){ // 同步世界地图背景画板
            this.ctxWorldBg = this.$refs.cvsWorldBg.getContext(`2d`);
            this.ctxWorldBg.width = 800;
            this.ctxWorldBg.height = 800;
            this.ctxWorldBg.clearRect(0,0,800,800);
            this.ctxWorldBg.beginPath();
            this.ctxWorldBg.lineCap = 'round';
            this.ctxWorldBg.lineWidth = 5;
            this.ctxWorldBg.strokeStyle = `rgba(205,205,205,.4)`;
            if(mapID||indexPath){
                this.ctxWorldBg.strokeStyle = `rgba(105,105,105,.1)`;
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
            if(mapID){ // 选中地图模式
                this.ctxWorldBg.beginPath();
                fromMap = getMatchList(this.game.allMaps,[['id',mapID]])[0];
                let roads = fromMap.roads;
                this.ctxWorldBg.strokeStyle = `rgba(59,190,234,1)`;
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
            if(indexPath){ // 显示路径模式
                this.ctxWorldBg.beginPath();
                this.ctxWorldBg.strokeStyle = `rgba(225,53,6,1)`;
                let fromMap, toMap;
                for(let i=0;i<indexPath.length;i++){
                    fromMap = this.game.allMaps[indexPath[i]];
                    toMap = this.game.allMaps[indexPath[i+1]];
                    if(fromMap&&toMap){
                        this.ctxWorldBg.moveTo(fromMap.position[0],fromMap.position[1]);
                        this.ctxWorldBg.lineTo(toMap.position[0],toMap.position[1]);
                    }
                }
                this.ctxWorldBg.stroke();
                this.ctxWorldBg.closePath();
            }
            // this.printAvatar('cvsWorldLoc',this.me.avatarData);
        },
        isNight(){ // 判断当前是否为晚上
            let hour = this.game.time[3];
            return hour>=18||hour<=6;
        },
        adjustOrderList(role){ // 清理指令列表
            let adjust = orderList =>{
                let res;
                let listFrags = [[],[],[],];
                for(let order of orderList){
                    listFrags[order.stat].push(order);
                }
                res = [...listFrags[0],];
                return res;
            }
            role.privateOrders = adjust(role.privateOrders);
            role.publicOrders = adjust(role.publicOrders);
        },
        everyHour(){ // 每过一小时
            let time = this.game.time;
            let calcDaycount = _ =>{
                if(time[0]%4==0){ // 闰年
                    CONFIG.monthDayMap[1] = 29;
                }
                return CONFIG.monthDayMap[time[1]-1];
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
            // 每个人物执行命令
            for(let role of this.game.allRoles){
                let order = role.privateOrders[0];
                if(order){
                    if(order.type==1){ // 移动至地图
                        this.moveToMapByOrder({role,order});
                    }
                }
                // 清理指令列表
                this.adjustOrderList(role);
            }
            this.$forceUpdate();
        },
        moveToMapByOrder({role,order}){ // 执行指令：移动至地图
            let step = order.path[order.pathProgress];
            let { map, cost, } = step;
            if(role.balance>=cost){ // 移动
                role.balance -= cost;
                order.pathProgress += 1;
                role.mapID = map.id;
                role.cellIndex = r(0,map.cells.length-1);
                if(role.id==this.me.id){
                    this.meMap = map;
                    this.renderMap(map.id);
                }
            }
            else{
                order.stat = 2;
                if(role.id==this.me.id){
                    this._alert(`旅途中断：金币不足以完成此次旅途！`);
                    this.pauseTime();
                }
            }
            if(order.pathProgress>=order.path.length){
                order.stat = 1;
                if(role.id==this.me.id){
                    this._alert(`已到达「${map.name}」`);
                    this.pauseTime();
                }
            }
        },

        _alert(msg){ // alert弹窗
            this.alertMsg = '';
            this.$nextTick(_=>{
                this.alertMsg = msg;
            })
        },
        _confirm(msg,onClickConfirm){
            this.confirmMsg = '';
            this.alertMsg = '';
            this.$nextTick(_=>{
                this.confirmMsg = msg;
                this.onClickConfirm = onClickConfirm;
            })
        },

        calcMapClickable(){ // 判断是否可交互
            return this.curMap.id==this.me.mapID;
        },
        calcCellClassName(cell){ // 计算格子元素的类名
            let res;
            res = `${cell.type!=1?'btn-cell-bd':''}`;
            return res;
        },

        onKeyupSpace(){ // 按下【空格】事件
            this.onClickTimer();
        },

        onClickAlert(){ // 点击【alert】按钮
            this.pauseTime();
            this.alertMsg = '';
        },
        onClickConfirm(){ // 点击弹窗【确认】按钮
            this.pauseTime();
        },
        onClickCancelConfirm(){ // 点击弹窗【取消确认】按钮
            this.pauseTime();
            this.confirmMsg = '';
        },
        onClickTimer(){ // 点击【时间】按钮
            if(this.gameTimeAcc>0){
                this.pauseTime();
            }
            else{
                this.resumeTime();
            }
        },
        onClickOpenWorldMap(){ // 点击【打开世界地图】按钮
            this.pauseTime();
            this.showWorldMap = true;
            this.$nextTick(_=>{
                this.updateCvsWorldBg();
            });
        },
        onClickCloseWorldMap(){ // 点击【关闭世界地图】按钮
            this.pauseTime();
            this.choseMapID = 0;
            this.showWorldMap = false;
        },
        onClickCvsWorldBg(){ // 点击【世界地图背景画板】
            this.pauseTime();
        },
        onClickCloseOptionPop(){ // 点击【关闭选项弹窗】
            this.pauseTime();
            this.optionPopTitle = '';
            this.options = [];
            this.popPosition = [0,0,];
            this.optionPopNeedFlip = false;
        },
        onClickViewRoles(){ // 点击【显示人物图标】按钮
            if(!this.calcMapClickable()){
                return ;
            }
            this.pauseTime();
            this.showRoleCells = !this.showRoleCells;
            if(this.showRoleCells){
                this.$nextTick(_=>{
                    this.printMapRoleAvatars();
                });
            }
        },

        onClickIconCellRole(evt,role){ // 点击【图标-底部人物】 TODO
            this.pauseTime();
            if(role.id==this.me.id){ // 点击我
                this.popOption(evt,1,role);
            }
            else{ // 点击其他人物
                this.choseRole = role;
                this.popOption(evt,3);
            }
        },
        onClickCell(evt,cell,index,hidePop){ // 点击【格子】 TODO
            if(!this.calcMapClickable()){
                return ;
            }
            this.pauseTime();
            this.choseCell = cell;

            // 同步格子人物列表
            let cellRoles = filterList(this.game.allRoles,role=>{
                return role.mapID==this.curMap.id&&role.cellIndex==index&&role.id!=this.me.id;
            });
            this.cellRoles = [this.me,...cellRoles];
            this.$nextTick(_=>{
                this.renderCellRoles();
            });

            // 选项弹窗
            if(!hidePop){
                if(cell.type>=50||cell.type==0){
                    this.popOption(evt,2);
                }
                else{
                    this.onClickCloseOptionPop();
                }
            }
        },
        onClickRoleIcon(evt,role,cell,index){ // 点击【人物图标】 TODO
            if(!this.calcMapClickable()){
                return ;
            }
            this.pauseTime();
            this.choseRole = cloneObj(role);
            this.popOption(evt,3);
            this.onClickCell(evt,cell,index,1);
        },
        onClickMap(evt,map){ // 点击【世界地图上的地图】
            this.pauseTime();
            if(this.choseMapID!=map.id){
                this.choseMapID = map.id;
                this.onClickCancelConfirm();
                this.updateCvsWorldBg({mapID:map.id});
                this.popOption(evt,4);
            }
            else{
                this.choseMapID = 0;
                this.updateCvsWorldBg();
                this.onClickCloseOptionPop();
            }
        },
        onClickOption(evt,option){ // 点击选项
            evt.stopPropagation();
            evt.preventDefault();
            this.pauseTime();
            option.callback&&option.callback();
            this.onClickCloseOptionPop();
        },

        getDistance(fromMap,toMap){ // 获取与相邻地图的距离
            let res = -1;
            let roads = fromMap.roads;
            for(let road of roads){
                if(road[0]==toMap.id){
                    res = road[1];
                    break;
                }
            }
            return res;
        },
        popOption(evt,type,data){ // 弹出选项弹窗 TODO
            evt.stopPropagation();
            evt.preventDefault();
            let { pageX, pageY, } = evt;
            let options = [];
            let title;
            switch(type){
                case 1: // 底部人物
                    title = `${data.name}：`;
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
                    title = `${CONFIG.cellAllNameMap[this.choseCell.type]}：`;
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
                    title = `${this.choseRole.name}：`;
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
                    title = `${toMap.name}：`;
                    options = [
                        { id:401, name:'查看', callback: _=>{
                            this.renderMap(toMap.id);
                            this.onClickCloseWorldMap();
                        }},
                        { id:402, name:'移动至此', hide:toMap.id==this.me.mapID, callback: _=>{
                            this.onClickMoveToByPop(toMap);
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
                if(optionEle){
                    let { offsetWidth: width, offsetHeight: height, } = optionEle;
                    let { clientWidth, clientHeight, } = document.body;
                    if((pageX+width)>clientWidth||(pageY+height)>clientHeight){
                        this.optionPopNeedFlip = true;
                    }
                    else{
                        this.optionPopNeedFlip = false;
                    }
                }
            });
        },
        onClickMoveToByPop(toMap){ // 点击【弹窗选项：移动至此】按钮
            let graph = [];
            let fromMapIndex = -1;
            let toMapIndex = -1;
            for(let i=0;i<this.game.allMaps.length;i++){
                if(this.game.allMaps[i].id==this.me.mapID){
                    fromMapIndex = i;
                }
                else if(this.game.allMaps[i].id==toMap.id){
                    toMapIndex = i;
                }
            }
            for(let x=0;x<this.game.allMaps.length;x++){
                let xMap = this.game.allMaps[x];
                let line = [];
                for(let y=0;y<this.game.allMaps.length;y++){
                    let distance = 0;
                    let yMap = this.game.allMaps[y];
                    for(let i=0;i<yMap.roads.length;i++){
                        if(yMap.roads[i][0]==xMap.id){
                            distance = yMap.roads[i][1];
                        }
                    }
                    line.push(distance);
                }
                graph.push(line);
            }
            let { paths } = dijkstra(graph,fromMapIndex);
            let indexPath = paths[toMapIndex];
            if(indexPath[0]==fromMapIndex){
                let meMap = getMatchList(this.game.allMaps,[['id',this.me.mapID]])[0];
                let isConnected = this.getDistance(meMap,toMap)!=-1;
                if(isConnected){
                    this.pushOrder({roleID:this.me.id,type:1,data:indexPath});
                    this.resumeTime();
                }
                else{
                    this.updateCvsWorldBg({indexPath});
                    let { step, cost, } = this.predictPathCost(indexPath);
                    this._confirm(`共需花费 ${cost} 金钱，${step} 个小时<br/>确定按照此路线移动至「${toMap.name}」吗？`,_=>{
                        this.pushOrder({roleID:this.me.id,type:1,data:indexPath});
                        this.onClickCancelConfirm();
                        this.resumeTime();
                    });
                }
            }
            else{
                this._alert(`无法抵达`);
            }
        },

        predictPathCost(indexPath){ // 计算路径消耗 [3,1,5]
            let step = 0, cost = 0;
            let path = [];
            for(let i=1;i<indexPath.length;i++){
                let fromMap = this.game.allMaps[indexPath[i-1]];
                let toMap = this.game.allMaps[indexPath[i]];
                let distance = this.getDistance(fromMap,toMap);
                cost += Math.ceil(distance/5);
                step += 1;
            }
            return { step, cost, };
        },
        pushOrder({roleID,isPublic,type,data}){ // 添加指令
            let role = getMatchList(this.game.allRoles,[['id',roleID]])[0];
            if(role){
                let newOrder = {};
                if(type==1){ // 添加【按照路径移动到地图】指令，data=[3,1,5,]
                    let path = [];
                    for(let i=1;i<data.length;i++){
                        let { cost } = this.predictPathCost([data[i-1],data[i]]);
                        let toMap = this.game.allMaps[data[i]];
                        path.push({
                            map: toMap,
                            cost,
                        })
                    }
                    newOrder = {
                        type: 1, // 移动到地图
                        stat: 0,
                        path,
                        pathProgress: 0,
                    }
                }
                else if(type==2){ // TODO

                }
                // 添加到对应的指令列表
                if(isPublic){
                    role.publicOrders.push(newOrder);
                }
                else{
                    role.privateOrders.push(newOrder);
                }
            }
        },

        resumeTime(){ // 时间流逝
            this.onClickCancelConfirm();
            this.onClickAlert();
            this.$nextTick(_=>{
                this.gameTimeAcc = 100;
            });
        },
        pauseTime(){ // 时间暂停
            this.gameTimeAcc = 0;
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
        renderCellRoles(){ // 渲染格子人物列表
            for(let i=0;i<this.cellRoles.length;i++){
                let role = this.cellRoles[i];
                this.printAvatar(`cvsIconCellRole${i}`,role.avatarData);
            }
        },
        printMapRoleAvatars(){ // 绘制地图中的人物
            for(let role of this.curMap.roles){
                this.printAvatar(`cvsIconMe${role.id}`,role.avatarData);
            }
        },

        onClickTest(){ // 点击【测试】按钮
            this.game.allRoles[0].balance = 100;
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
    @import './mappage.css';


</style>
