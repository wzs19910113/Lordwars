<template>
    <div class="main">
        <div v-if="mode==1">
            <Header />
            <h1>首页TEST</h1>
            <div class="banner">
                <div class="block user-wrap">
                    <a class="btn"><img src="" /></a>
                </div>
            </div>
            <div class="act-list-wrap">
                <ol class="block act-list">
                    <li class="block act" v-for="act in actList">
                        <a class="btn">
                            <div class="act-icon">
                                <img :src="act.icon" />
                            </div>
                            <div class="act-detail">
                                <h3>{{act.name}}</h3>
                                <div>{{act.desc}}</div>
                            </div>
                        </a>
                    </li>
                </ol>
            </div>
            <Nav />
        </div>
        <div v-if="mode==2">
            <div class="cell-wrap" :style="`width:${WI*15}px;height:${WI*15}px`">
                <a class="cell" :class="{'cell-on':cell.stat==1,'cell-off':cell.stat==0,'cell-water':cell.stat==2,'cell-cross':cell.isCross,'cell-corner':isCorner(index)}" v-for="(cell,index) in cellList" @click="onClickCell(index)"></a>
            </div>
            <div class="btn-wrap">
                <a class="btn btn-save" @click="onClickSave()">save</a>
                <a class="btn btn-load" @click="onClickLoad()">load</a>
                <a class="btn btn-adjust" @click="onClickAdjust()">adjust</a>
            </div>
        </div>
        <div v-if="mode==3">
            <div class="gamer-wrap">
                <div class="gamer" v-for="(player,index1) in game.playerList">
                    <div class="gamer-name">{{player.name}}：</div>
                    <div class="word-wrap">
                        <a class="btn word" v-for="(word,index2) in player.words" @click="onClickWord(player,word,index2)">{{word}}</a>
                    </div>
                    <div class="info-wrap">
                        <input v-model="player.score" @change="onChangeScore" type="number" min="0" />
                    </div>
                    <div class="btn-wrap">
                        <a class="btn btn-draw" @click="onClickDraw(player,index1,true)">draw</a>
                    </div>
                </div>
            </div>
            <div class="op-wrap">
                <a class="btn btn-redo" @click="onClickRedo()" v-if="history.length>0">redo</a>
            </div>
            <div class="used-word-wrap">
                <a class="btn used-word" v-for="(word,index) in game.usedWordList">{{word}}</a>
            </div>
        </div>
        <div v-if="mode==4">
            <div class="name-wrap">
                <a class="name" v-for="name in nameList">
                    {{name.name}}：{{name.score}}
                </a>
            </div>
        </div>
        <div v-if="mode==5">
            <div class="stock-wrap">
                <div class="loading" v-if="data5.step==2||data5.step==4">{{data5.tip}}</div>
                <div class="title">第 {{data5.round}} 回合</div>
                <div class="team">
                    <div class="player" v-for="(player,index1) in data5.team2">
                        <div class="player-name">{{player.name}}（ID:{{player.id}}）</div>
                        <div class="player-hand card-area">
                            <label class="number">{{player.handStock.length}}张</label>
                            <a class="card" v-for="(card,index2) in player.handStock"></a>
                        </div>
                        <div class="player-table card-area">
                            <label class="number">{{player.tableStock.length}}张</label>
                            <a class="card" :class="`card-${getCardType(card.type)}`" v-for="(card,index2) in player.tableStock">
                                {{getCardName(card.type)}}<br/>{{card.id}}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="info-board" ref="infoboard">
                    <p class="info" v-for="(notice) in data5.info">{{notice}}</p>
                </div>
                <div class="team">
                    <div class="player" :class="`${(data5.target&&(data5.target.id==player.id))?'player-cur':''}`" :style="{'width':`${Math.floor(100/data5.team1.length)}%`}" v-for="(player,index1) in data5.team1">
                        <div class="player-name">{{player.name}}（ID:{{player.id}}）</div>
                        <div class="player-hand card-area">
                            <label class="number">{{player.handStock.length}}张</label>
                            <a class="btn card" :class="`${data5.step==3?'btn-del':''} card-${getCardType(card.type)}`" @click="onClickCard(player,card,0)" v-for="(card,index2) in player.handStock">
                                {{getCardName(card.type)}}<br/>{{card.id}}
                            </a>
                        </div>
                        <div class="player-table card-area">
                            <label class="number">{{player.tableStock.length}}张</label>
                            <a :class="`card ${data5.step==3?'btn btn-del':''} card-${getCardType(card.type)}`" @click="onClickCard(player,card,1)" v-for="(card,index2) in player.tableStock">
                                {{getCardName(card.type)}}<br/>{{card.id}}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mode==6">
            <div class="panel">
                <input v-model="data6.word" placeholder="预设文字" />
                <a class="btn btn-word" @click="onClickPresetWord(index)" v-for="index in [0,1,2,3,4,5]">{{PRESET_WORDS[index]}}</a>
                <br/>
                <a class="btn btn-cell" :class="`cell-${index} ${data6.color==index?'cell-sel':''}`" @click="onClickCellColor(index)" v-for="index in [0,1,2,3,4]"></a>
            </div>
            <div class="cell-wrap cell2-wrap" :style="`width:${WI2*30}px;height:${HI2*30}px`">
                <a :class="`cell cell-on cell2 cell-${cell.color}`" v-for="(cell,index) in data6.cellList" @click="onClickCell2(index)">{{cell.word}}</a>
            </div>
        </div>
    </div>
</template>

<script>
// Copyright (c) 2018 Copyright Holder All Rights Reserved.
import { query, r, exptr, shuffle, bulbsort, cloneObj, getParentNode, getMatchList, removeFromList, arrContains, rr, fullScreen, exitFullScreen, isFullScreen, calcDistance, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE } from '../config/config';
import Header from '../components/Header';
import Nav from '../components/Nav';
// mode2
const WI = 51;
const CACHE2 = 'MD2';
// mode3
const articleWordList = ['花盆','房卡','夜视仪','手套','电脑','文件','衣柜','大衣','商标','手机','桌子','椅子','床','床头柜','针头','莲花','窗帘','油笔','通风管道','轿车','柜子','公文包','耳机','自动贩卖机','咖啡','三明治','沙拉','扑克牌','办公椅','出租车','面包车','风衣','墨镜','口袋','药瓶','信封','蛋糕','玩具熊','购物袋','长椅','灌木','生日礼物','私家车','书包','书本','制服','学生证','照片','书页','储物柜','手帕','充电器','饭盒','口红','网球','球拍','卡片相机','酒精','创可贴','录音笔','抽屉','伸缩梯','嘴唇','西装','会议桌','电线','盆栽','饮水机','投影仪','幕布','壁纸','鹦鹉','面庞','手指','办公桌','显示器','键盘','设计稿','烟灰','圆珠笔','钟表','甜品','曲奇','钥匙','马甲','酒瓶','纹身','车辆','十字路口','口香糖','水坑','烟蒂','狗','匕首','骨头','香烟','塑料袋','挂牌','裤子','棒棒糖','衣领','路障','警笛','子弹','霓虹灯','鸭舌帽','摄像头','拖鞋','茶几','报纸','遥控器','衣架','跑步机','茶杯','冰箱','鸡蛋','保险柜','被子','梳妆台','盔甲','人体模型','古董','洗衣机','浴缸','刮胡刀','发丝',];
const wordList = ['合约','瓷器','灭火器','蚊香','门','窗户','电视机','电视柜','音响','电灯','电灯泡','水壶','纱布','吊灯','垃圾桶','扫帚','扫地机器人','牙刷','肥皂','花瓶','体重仪','天花板','墙壁','钢笔','打印机','咖啡机','路由器','游戏机','板凳','摇椅','符咒','圣经','鼠标','老鼠夹','垃圾袋','砧板','发电机','服务器','购物车','汉堡','可乐','骨灰盒','饼干盒','收纳盒','毛巾','热水器','电热毯','手提箱','开瓶器','耳塞','镜子','脸盆','洗发水','毛毯','枕头','光碟','收音机','水果刀','胡椒粉','地板','窃听器','钢琴','微波炉','笼子','剪刀','碗','绳子','电梯','筹码','剃须刀','高尔夫球杆','标签','抹布','金砖','吹风机','粉笔','勺子','吸管','马桶','开关','牛奶','麦克风','火炉','网','晾衣杆','把手','螺丝','尺子','扳手','乐谱','漏斗','沙漏','账单','毒品','炸弹','面粉','沙发','哑铃','油画','汽油','叉子','温度计','冰块','水表','电闸','地毯','麻绳','平底锅','空调','电风扇','门铃','海报','胶带','烟灰缸','电击棒','纸巾','平板电脑','人字拖','十字架','易拉罐','卫衣','连衣裙','高礼帽','眼睛','耳朵','鼻子','牙齿','舌头','毛孔','耳环','护腕','头盔','剑','手枪','机枪','皮带','伤疤','手表','围巾','香水','发夹','皮鞋','高跟鞋','毛衣','内衣','戒指','移动硬盘','驾驶证','护照','钞票','放大镜','记事本','冰淇淋','面具','口罩','毛线','名信片','扩音器','拐杖','背包','鱼竿','铃铛','雨伞','钱包','地图','速效救心丸','硬币','盘子','指甲刀','鞋垫','狗带','贺卡','项链','优惠券','电影票','手电筒','眼镜','口哨','眼罩','夹子','糖果','袜子','蝴蝶结','信用卡','弓箭','手铐','流星锤','扇子','药片','对讲机','手机壳','梳子','猫','仙人掌','玫瑰','鸽子','鱼','老虎','树','甲虫','番茄','卷心菜','蘑菇','苹果','棉花','螃蟹','植物油','茶叶','鲜花','霸王龙','西瓜皮','围栏','自动提款机','信号灯','公交车','摩托车','直升机','游艇','自行车','气球','墓碑','路灯','公用电话亭','消防栓','灵车','坦克','油漆','轮椅','轮胎','警车','救护车','井盖','无人机','路标','篮球','轻轨','电线杆','滑板','草垛','铁轨','人行道','救生圈','雕像','石头','棺材','瓦片','水管','砖块','混凝土','钢管','钢丝','滑滑梯','纸箱','天桥','地下通道','旗子','风筝','喷泉','电池','空投箱','万能胶','字典','硫酸','拉链','外卖','邮件','弹簧','齿轮','背景','注射器','瓶盖','烟雾','脂肪肝','橡皮绳','氧气瓶','计算器','草稿','牌匾','玻璃碎片','泡面','警示牌','奖杯','木桶','香囊','导弹','领带','木桩','玩偶','摄影机','雷达','徽章','纽扣','棍子',];
// const wordList = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51',];
const CH1 = `ch-word-list-v001`;
// mode6
const WI2 = 9;
const HI2 = 9;
const PRESET_WORDS = ['','攻','闪','蓄','旗','控'];

const names = ``;
export default {
    name: 'Canvas1',
    data(){
        return {

            loading: false,
            mode: 6,

            /* mode 1 */
            actList: [],

            /* mode 2 */
            cellList: [],
            bugList: [],

            /* mode 3 */
            game: {
                wordList: [],
                playerList: [],
                usedWordList: [],
                playerCount: 5, // 玩家人数
            },
            history: [], // 历史记录

            /* mode 4 */
            nameList: [],

            /* mode 5 */
            /*
            player:{
                id: 1,
                name: '树妖',
                baseAttack: 1,
                handStock: [{
                    id: 1,
                    type: 100, // [100:攻|200:闪|300:蓄|400:累]
                }],
                tableStock: [],
            }
            */
            data5: {
                team1: [],
                team2: [],
                info: [],
                tip: '',
                target: null, // 敌方当前锁定的目标
                round: 0,
                discardCount: 0, // 弃牌剩余数
                step: 0, // [0:准备阶段|1:出牌阶段|2:结算阶段|3:弃牌阶段|4:游戏结束]
                playerIDCounter: 0,
                cardIDCounter: 0,
            },

            /* mode 6 */
            data6: {
                cellList: [],
                word: '',
                color: 0,
            },

            WI,
            WI2,
            HI2,
            PRESET_WORDS,
            CONFIG,
        };
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            /* mode 1 */
            this.actList = [];
            for(let i=0;i<48;i++){
                this.actList.push({
                    name: `活动${i}`,
                    desc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                });
            }

            /* mode 2 */
            let _cellList = localStorage.getItem(CACHE2);
            if(_cellList){
                let cellList = JSON.parse(_cellList);
                this.cellList = cellList;
            }
            else{
                this.cellList = [];
                let amount = WI*WI;
                for(let i=0;i<amount;i++){
                    this.cellList.push({
                        stat: r(0,1),
                    });
                }
            }

            /* mode 3 */
            let s_game = localStorage.getItem(CH1);
            if(s_game){ // 有缓存
                let tgame = JSON.parse(s_game);
                this.game = tgame;
            }
            else{ // 无缓存','重新读取
                this.game.wordList = shuffle(wordList);
                // this.game.wordList = [...wordList];
                for(let i=0;i<this.game.playerCount;i++){
                    this.game.playerList.push({
                        index: i,
                        words: [],
                        score: 0,
                        name: `Player${i+1}`,
                    });
                }
                // for(let i=0;i<this.game.playerList.length;i++){
                //     this.onClickDraw(this.game.playerList[i],i,false);
                // }
                this.saveCh();
            }
            // console.log(this.game);




            let tList = [...articleWordList,...wordList];
            let dup = [];
            for(let i1=0;i1<tList.length;i1++){
                for(let i2=0;i2<tList.length;i2++){
                    let t1 = tList[i1], t2 = tList[i2];
                    if(t1==t2&&i1!=i2){
                        dup.push(t1);
                        break;
                    }
                }
            }
            // console.log(`共 ${wordList.length} + ${articleWordList.length} = ${tList.length} 张单词卡片`);
            // console.log(`重复项：`,dup);

            /* mode 4 */
            let nameList = names.split('|');
            for(let name of nameList){
                let score = 1;
                let letterList = name.split('+');
                for(let i=1;i<letterList.length;i++){
                    score += parseInt(letterList[i]);
                    // console.log(letterList[i]);
                }
                let onameIndex = -1;
                for(let i=0;i<this.nameList.length;i++){
                    if(this.nameList[i].name==letterList[0]){
                        onameIndex = i;
                        break;
                    }
                }
                if(onameIndex==-1){ // 原列表不包含名字
                    this.nameList.push({
                        name: letterList[0],
                        score,
                    });
                }
                else{
                    this.nameList[onameIndex].score += score;
                }
            }

            /* mode 5 */
            this.initGame();
            // this.createAplayer('树妖',[100,200,300,400,],2,2);
            // this.createAplayer('大树妖',[100,100,200,200,300,300,400,],1,2);
            // this.createAplayer('女贼',[100,100,100,200,300,400,],1,1);
            this.createAplayer('考古学者',[100,100,100,100,200,200,200,200,200,300,300,400,],1,1);
            // this.createAplayer('退役海军',[100,200,300,300,300,400,],1,1);
            // this.createAplayer('毒药师',[100,100,200,300,300,400,],1,1);
            this.createAplayer('赏金猎人',[100,100,100,100,100,200,200,200,300,300,300,400,],1,2);
            // this.createAplayer('守墓人',[100,100,200,300,400,],2,1);

            /* mode 6 */
            this.data6.cellList = [];
            let amount = WI2*HI2;
            for(let i=0;i<amount;i++){
                this.data6.cellList.push({
                    color: 0,
                    word: '',
                });
            }
        },

        onClickCell(index){ // mode2
            let cell = this.cellList[index];
            // if(this.isCorner(index)&&cell.stat==1){
            //     return ;
            // }
            if(cell.stat==1){
                cell.stat = 0;
            }
            else if(cell.stat==0){
                cell.stat = 1;
            }
            // this.onClickSave();
        },
        onClickSave(){ // mode 2
            let _cellList = JSON.stringify(this.cellList);
            localStorage.setItem(CACHE2,_cellList);
        },
        onClickLoad(){ // mode 2
            let _cellList = localStorage.getItem(CACHE2);
            let cellList = JSON.parse(_cellList);
            this.cellList = cellList;
        },
        onClickAdjust(){ // mode2

            // let neb = this.runBug(52); // top-left
            // let neb = this.runBug(51); // top-left
            // let neb = this.runBug(1147); // top
            // let neb = this.runBug(1199); // right
            // let neb = this.runBug(1249); // bottom
            let neb = this.runBug(1197); // left

            // for(let i=0;i<this.cellList.length;i++){
            //     if(this.cellList[i].stat==2){
            //         this.cellList[i].stat = 1;
            //     }
            //     this.cellList[i].isCross = false;
            // }

            for(let i=0;i<this.cellList.length;i++){
                if(this.isCross(i)){
                    this.cellList[i].isCross = true;
                }
            }
        },
        isCross(index){ // mode2
            let nebs = [];
            for(let dir=0;dir<4;dir++){
                let neb = this.getNeb(index,dir+1);
                if(neb){
                    nebs.push(neb);
                }
            }
            let crossNebCount1 = 0;
            let crossNebCount2 = 0;
            for(let neb of nebs){
                if(neb.cell.stat==0){
                    crossNebCount1 += 1;
                }
                if(neb.cell.stat==1){
                    crossNebCount2 += 1;
                }
            }
            if(crossNebCount1>=4||crossNebCount2>=4){
                return true;
            }
            return false;
        },
        isCorner(index){ // mode2
            let ri = Math.ceil(index/WI);
            let ci = index%WI;
            let res = false;
            if(((ri-0)%2==0)&&((ci-1)%2==0)){
                res = true;
            }
            return res;
        },
        getNeb(index,dir){ // mode2
            let tIndex = -1;
            if(dir==1&&index-WI>=0){ // 上
                tIndex = index-WI;
            }
            else if(dir==2&&index+1<this.cellList.length&&((index+1)%WI!=0)){ // 右
                tIndex = index+1;
            }
            else if(dir==3&&index+WI<this.cellList.length){ // 下
                tIndex = index+WI;
            }
            else if(dir==4&&index-1>=0&&(index%WI!=0)){ // 左
                tIndex = index-1;
            }
            if(tIndex!=-1){
                return {index:tIndex,cell:this.cellList[tIndex]};
            }
            return null;
        },
        runBug(index){ // mode2
            let initStat = this.cellList[index].stat;
            this.bugList.push({
                index,
                alive: 1,
            });
            this.cellList[index].stat = 2;
            let moveCount = 0;
            let move = bug =>{
                let aims = [];
                for(let dir=1;dir<5;dir++){
                    let aim = this.getNeb(bug.index,dir);
                    if(aim&&aim.cell.stat==initStat){
                        aims.push(aim);
                    }
                }
                if(aims.length>1){ // 分裂
                    bug.alive = 0;
                    for(let i=0;i<aims.length;i++){
                        this.bugList.push({
                            index: aims[i].index,
                            alive: 1,
                        });
                        this.cellList[aims[i].index].stat = 2;
                    }
                }
                else if(aims.length==1){ // 移动
                    bug.index = aims[0].index;
                    this.cellList[aims[0].index].stat = 2;
                    moveCount += 1;
                }
                else{ // 死路
                    bug.alive = 0;
                }
            }
            let timer = 0;
            let itv = setInterval(_=>{
                let l = this.bugList.length;
                for(let i=0;i<l;i++){
                    if(this.bugList[i].alive){
                        move(this.bugList[i]);
                    }
                }
                timer += 10;
                console.log(moveCount);
                if(timer>=5000){
                    clearInterval(itv);
                }
            },10);
        },

        onClickWord(player,word,index){ // mode3 使用词牌
            let words = player.words;
            let nextWords = [];
            this.history.push(JSON.stringify(this.game));
            for(let i=0;i<words.length;i++){
                if(words[i]!=word){
                    nextWords.push(words[i]);
                }
            }
            this.game.playerList[player.index].words = nextWords;
            this.game.usedWordList.push(word);
            this.saveCh();
        },
        onClickDraw(player,index,setRedo){ // mode3 补充手牌
            if(setRedo){
                this.history.push(JSON.stringify(this.game));
            }
            let newWord = this.game.wordList.shift();
            this.game.playerList[index].words.push(newWord);
            this.saveCh();
        },
        saveCh(){ // mode3
            this.$nextTick(_=>{
                localStorage.setItem(CH1,JSON.stringify(this.game));
            });
        },
        onClickRedo(){ // mode3 撤销
            if(this.history.length>0){
                let s_game = this.history.pop();
                this.game = JSON.parse(s_game);
                this.saveCh();
            }
        },
        onChangeScore(){ // mode3
            this.saveCh();
        },

        /* mode 5 */
        initGame(){
            this.data5 = {
                team1: [],
                team2: [],
                info: ['游戏开始'],
                tip: '',
                target: null,
                round: 1,
                discardCount: 0, // 弃牌剩余数
                step: 1,
                playerIDCounter: 1,
                cardIDCounter: 1,
            }
        },
        createAplayer(name,cardList,baseAttack,team){ // 创建玩家
            let newPlayer = {
                id: this.data5.playerIDCounter++,
                name,
                baseAttack,
                handStock: Array.from(cardList,type=>{
                    return {
                        id: this.data5.cardIDCounter++,
                        type,
                    };
                }),
                tableStock: [],
            }
            this.data5[`team${team}`].push(newPlayer);
            return newPlayer;
        },
        getCardType(type){ // 根据类型数字获得卡牌类型
            return Math.floor(type/100);
        },
        getCardName(type){ // 根据类型数字获得卡牌名字
            let index = this.getCardType(type)-1;
            return ['攻','闪','蓄','累'][index];
        },
        getPlayerAttack(player){ // 获取玩家攻击力
            let res = player.baseAttack;
            let accum = 0;
            for(let card of player.tableStock){
                if(this.getCardType(card.type)==3){
                    accum += 1;
                }
            }
            res += accum;
            return res;
        },
        onClickCard(player,card,stock){ // 点击【卡牌】按钮
            let enemy = this.data5.team2[0]; // TODO
            if(this.data5.step==1&&stock==0){ // 出牌
                this.data5.target = player;
                 // 敌方出牌
                let enemyCard = this.issue(enemy,this.enemyMakeIssue(enemy));
                this.pushInfo(`${enemy.name}出牌：${this.getCardName(enemyCard.type)}。`);
                 // 我方出牌
                let playerCard = this.issue(player,card);
                this.pushInfo(`${player.name}出牌：${this.getCardName(playerCard.type)}。`);

                this.data5.step = 2;
                this.data5.tip = `计算中...`;
                setTimeout(_=>{
                    let card1 = this.getCardType(playerCard.type);
                    let card2 = this.getCardType(enemyCard.type);
                    let playerAttack = this.getPlayerAttack(player);
                    let enemyAttack = this.getPlayerAttack(enemy);
                    // ------敌攻四项--------
                    if(card1==1&&card2==1){ // 我攻 vs 敌攻
                        if(playerAttack>enemyAttack){ // 我方胜
                            this.pushInfo(`${player.name} 赢了（${playerAttack}>${enemyAttack}）。`);
                            this.attack(player,enemy,playerAttack,1);
                        }
                        else if(playerAttack<enemyAttack){ // 敌方胜
                            this.pushInfo(`${player.name} 输了（${playerAttack}<${enemyAttack}）。`);
                            this.attack(enemy,player,enemyAttack,0);
                        }
                        else{
                            this.pushInfo(`攻击抵消，无事发生（${playerAttack}=${enemyAttack}）。`);
                            this.goStep1();
                        }
                    }
                    else if(card1==2&&card2==1){ // 我闪 vs 敌攻
                        this.pushInfo(`${player.name} 闪掉了 ${enemy.name} 的攻击。`);
                        this.goStep1();
                    }
                    else if(card1==3&&card2==1){ // 我蓄 vs 敌攻
                        this.pushInfo(`${player.name} 被 ${enemy.name} 攻击。`);
                        this.attack(enemy,player,enemyAttack,0);
                    }
                    else if(card1==4&&card2==1){ // 我累 vs 敌攻
                        this.pushInfo(`${player.name} 回收了所有卡牌。`);
                        this.pushInfo(`${player.name} 被 ${enemy.name} 攻击。`);
                        this.attack(enemy,player,enemyAttack,0);
                        this.restore(player);
                    }
                    // ------敌闪四项--------
                    else if(card1==1&&card2==2){ // 我攻 vs 敌闪
                        this.pushInfo(`${enemy.name} 闪掉了 ${player.name} 的攻击。`);
                        this.goStep1();
                    }
                    else if(card1==2&&card2==2){ // 我闪 vs 敌闪
                        this.pushInfo(`无事发生。`);
                        this.goStep1();
                    }
                    else if(card1==3&&card2==2){ // 我蓄 vs 敌闪
                        this.pushInfo(`无事发生。`);
                        this.goStep1();
                    }
                    else if(card1==4&&card2==2){ // 我累 vs 敌闪
                        this.pushInfo(`${player.name} 回收了所有卡牌。`);
                        this.restore(player);
                        this.goStep1();
                    }
                    // ------敌蓄四项--------
                    else if(card1==1&&card2==3){ // 我攻 vs 敌蓄
                        this.pushInfo(`${player.name} 对 ${enemy.name} 进行攻击。`);
                        this.attack(player,enemy,playerAttack,1);
                    }
                    else if(card1==2&&card2==3){ // 我闪 vs 敌蓄
                        this.pushInfo(`无事发生。`);
                        this.goStep1();
                    }
                    else if(card1==3&&card2==3){ // 我蓄 vs 敌蓄
                        this.pushInfo(`无事发生。`);
                        this.goStep1();
                    }
                    else if(card1==4&&card2==3){ // 我累 vs 敌蓄
                        this.pushInfo(`${player.name} 回收了所有卡牌。`);
                        this.restore(player);
                        this.goStep1();
                    }
                    // ------敌累四项--------
                    else if(card1==1&&card2==4){ // 我攻 vs 敌累
                        this.pushInfo(`${player.name} 对 ${enemy.name} 进行攻击。`);
                        this.attack(player,enemy,playerAttack,1);
                        this.restore(enemy);
                    }
                    else if(card1==2&&card2==4){ // 我闪 vs 敌累
                        this.pushInfo(`无事发生。`);
                        this.restore(enemy);
                        this.goStep1();
                    }
                    else if(card1==3&&card2==4){ // 我蓄 vs 敌累
                        this.pushInfo(`无事发生。`);
                        this.restore(enemy);
                        this.goStep1();
                    }
                    else if(card1==4&&card2==4){ // 我累 vs 敌累
                        this.pushInfo(`${player.name} 回收了所有卡牌。`);
                        this.pushInfo(`${enemy.name} 回收了所有卡牌。`);
                        this.restore(player);
                        this.restore(enemy);
                        this.goStep1();
                    }
                },200);
            }
            else if(this.data5.step==3){ // 弃牌
                this.discard(player,[card.id]);
                this.data5.discardCount -= 1;
                if(this.data5.discardCount==0){
                    this.goStep1();
                }
            }
        },
        issue(player,card){ // 打出一张牌
            let newHandStock = [];
            player.tableStock.push(card);
            for(let hcard of player.handStock){
                if(hcard.id!=card.id){
                    newHandStock.push(hcard);
                }
            }
            player.handStock = newHandStock;
            return card;
        },
        discard(player,ids=[]){ // 弃诺干张牌
            let info1 = ``,count1 = 0;
            let info2 = ``,count2 = 0;
            let newHandStock = [];
            let newTableStock = [];
            for(let card of player.handStock){
                if(arrContains(ids,card.id)==-1){
                    newHandStock.push(card);
                }
                else{
                    info1 += `${this.getCardName(card.type)}，`;
                    count1 += 1;
                }
            }
            for(let card of player.tableStock){
                if(arrContains(ids,card.id)==-1){
                    newTableStock.push(card);
                }
                else{
                    info2 += `${this.getCardName(card.type)}，`;
                    count2 += 1;
                }
            }
            player.handStock = newHandStock;
            player.tableStock = newTableStock;
            if(count1>0){
                this.pushInfo(`${player.name} 从手牌中弃置了 ${info1} 共 ${count1} 张牌。`);
            }
            if(count2>0){
                this.pushInfo(`${player.name} 从出牌区中弃置了 ${info2} 共 ${count2} 张牌。`);
            }
        },
        findCard(stock,id){ // 根据 ID 查找卡牌
            for(let i=0;i<stock.length;i++){
                if(stock[i].id==id){
                    return stock[i];
                }
            }
            return null;
        },
        restore(player){ // 回收卡牌
            let newHandStock = [...player.handStock,...player.tableStock];
            newHandStock = bulbsort(newHandStock,'type',0);
            player.handStock = newHandStock;
            player.tableStock = [];
        },
        goStep1(){ // 回到出牌阶段
            setTimeout(_=>{
                if(!this.checkEnd()){
                    this.data5.step = 1;
                    this.data5.round += 1;
                    this.pushInfo(`-----------进入下一回合-----------`);
                }
            },300);
        },
        attack(player1,player2,damage,flag){ // 造成伤害 flag:[0:我方受到伤害|1:敌方受到伤害]
            if(flag==0){ // 我方受到伤害
                this.pushInfo(`${player1.name} 对 ${player2.name} 造成 ${damage} 点伤害，请弃牌（剩余 ${damage} 张）。`);
                this.data5.discardCount = damage;
                this.data5.step = 3;
            }
            else{ // 敌方受到伤害
                this.pushInfo(`${player1.name} 对 ${player2.name} 造成 ${damage} 点伤害，正在弃牌中。`);
                let discardResult = this.enemyMakeDiscard(player2,damage);
                this.discard(player2,discardResult);
                this.goStep1();
            }
        },
        pushInfo(text){ // 输出日志
            this.data5.info.push(text);
            this.$refs.infoboard.scrollTo(0,9999);
        },
        enemyMakeIssue(player){ // 敌方思考出牌策略
            let youcards = [[],[],[],[],[],], mycards = [[],[],[],[],[],];
            let youAttack = this.getPlayerAttack(this.data5.target);
            let myAttack = this.getPlayerAttack(player);
            let trends = []; // 倾向数组 [1,1,1,1,2,3,3,3,4,]
            let targetCards = [];
            let batchpush = (type,amount) =>{ // 批量加入倾向数组
                for(let i=0;i<amount;i++){
                    trends.push(type);
                }
            }
            let batchdel = (type) =>{ // 批量从倾向数组删除
                let res = []
                for(let i=0;i<trends.length;i++){
                    if(trends[i]!=type){
                        res.push(trends[i]);
                    }
                }
                trends = res;
            }
            for(let card of this.data5.target.handStock){
                let type = this.getCardType(card.type);
                youcards[type].push(card);
            }
            for(let card of player.handStock){
                let type = this.getCardType(card.type);
                mycards[type].push(card);
            }

            // 计算攻倾向
            batchpush(1,mycards[1].length);
            if(myAttack>youAttack){
                batchpush(1,mycards[1].length);
            }
            // 计算闪倾向
            if(youcards[1].length>0){ // 若你有攻
                batchpush(2,mycards[2].length);
            }
            // 计算蓄倾向
            batchpush(3,mycards[3].length);
            // 计算累倾向
            if(mycards[1].length<=0){ // 若我没攻
                batchpush(4,mycards[4].length);
            }

            // 确定倾向
            if(youcards[2].length<=0&&mycards[1].length>0&&myAttack>youAttack){ // 若我有攻你无闪，且我的攻击大于你，则必攻
                trends = [1];
                console.log(`>>> 1 若我有攻你无闪，且我的攻击大于你，则必攻`);
            }
            if(youcards[2].length<=0&&mycards[1].length>0&&youcards[1].length<=0){ // 若我有攻你无闪也无攻，则必攻
                trends = [1];
                console.log(`>>> 2 若我有攻你无闪，且我的攻击大于你，则必攻`);
            }
            if(youcards[1].length>0&&myAttack<youAttack){ // 若我的攻击小于你，且你有攻，则必不攻
                batchdel(1);
                console.log(`>>> 3 若我的攻击小于你，且你有攻，则必不攻`);
            }
            if(youcards[1].length>0&&youcards[2].length<=0&&youcards[3].length<=0&&mycards[2].length>0&&myAttack<youAttack){ // 若你只有攻，而我有闪，且我的攻击小于你，则必闪
                trends = [2];
                console.log(`>>> 4 若你只有攻，而我有闪，且我的攻击小于你，则必闪`);
            }
            if(mycards[1].length<=0){ // 若我没攻，则必不蓄
                batchdel(3);
                console.log(`>>> 5 若我没攻，则必不蓄`);
            }
            if(mycards[1].length<=0&&mycards[4].length>0&&youcards[1].length<=0){ // 若我没攻，且我有累，且你没攻，则必累
                trends = [4];
                console.log(`>>> 6 若我没攻，且我有累，且你没攻，则必累`);
            }
            console.log(trends);

            // 根据倾向结算最终结果
            let trendType = trends[r(0,trends.length-1)]; // 倾向卡牌类型 (1,2,3,4,)
            if(trendType){
                targetCards = mycards[trendType];
            }
            if(targetCards.length<=0){
                targetCards = player.handStock;
            }
            return targetCards[r(0,targetCards.length-1)];
        },
        enemyMakeDiscard(player,count){ // 敌方思考弃牌策略
            let delids = [];
            let rcard;
            let tempStock = [...player.handStock,...player.tableStock,];
            let mycards = [[],[],[],[],[],]; // 我的牌组分类
            let stock = []; // 要删除的牌组
            for(let card of tempStock){
                let type = this.getCardType(card.type);
                mycards[type].push(card);
            }
            let leftCard1;
            if(mycards[1].length>0){ // 保留攻牌，并从 mycards 中删除该攻牌
                leftCard1 = mycards[1][0];
                let myNewCard1s = []
                for(let card of mycards[1]){
                    if(card.id!=leftCard1.id){
                        myNewCard1s.push(card);
                    }
                }
                mycards[1] = myNewCard1s;
            }

            stock = [...shuffle([...mycards[3],...mycards[2],...mycards[1]])];

            if(leftCard1){
                stock.push(leftCard1);
            }

            stock.push(...mycards[4]);

            if(stock.length==2){ // 若只剩两张牌，则弃置累牌
                stock = [stock[1],stock[0]];
            }

            for(let i=0;i<count&&i<stock.length;i++){
                delids.push(stock[i].id);
            }

            return delids;
        },
        checkEnd(){ // 检查获胜
            let player = this.data5.target;
            let enemy = this.data5.team2[0];
            let playerCardCount = player.handStock.length;
            let enemyCardCount = enemy.handStock.length;
            let res = 0; // [0：未结束|1：平局|2：你输了|3：你赢了]
            if(playerCardCount==0&&enemyCardCount==0){
                this.pushInfo(`平局。`);
                this.data5.tip = 'DRAW.'
                this.data5.step = 4;
                res = 1;
            }
            else if(playerCardCount==0){
                this.pushInfo(`你输了！`);
                this.data5.tip = 'YOU LOSE...'
                this.data5.step = 4;
                res = 2;
            }
            else if(enemyCardCount==0){
                this.pushInfo(`你赢了！`);
                this.data5.tip = 'YOU WIN!'
                this.data5.step = 4;
                res = 3;
            }
            return res;
        },
        /* mode 6 */
        onClickCellColor(index){
            this.data6.color = index;
        },
        onClickCell2(index){
            let cell = this.data6.cellList[index];
            if(cell.word==''&&cell.color==0){
                cell.word = this.data6.word;
                cell.color = this.data6.color;
            }
            else{
                cell.word = '';
                cell.color = 0;
            }
        },
        onClickPresetWord(index){
            this.data6.word = PRESET_WORDS[index];
        },
    },
    components:{
        Header,
        Nav,
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn{
        display: inline-block;
        cursor: pointer;
        text-align: center;
        border: 1px solid #131313;
        font-weight: bold;
    }
    .btn:hover{
        opacity: .8;
    }
    .main{
        position: relative;
        padding-top: 20px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: #fff;
    }
    .block{
        border: 1px solid #aaa;
    }
    .banner{
        height: 130px;
        background-color: pink;
        margin-bottom: 12px;
    }
    .search-wrap{
        width: 75%;
    }
    .act{
        width: 100%;
        height: 65px;
    }
    .act .btn{
        width: 100%;
        height: 65px;
        padding: 10px 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .act-icon{
        height: 55px;
        width: 55px;
        border: 1px solid #e81313;
        margin-right: 6px;
    }
    .act-detail{
        width: 100%;
        height: 100%;
    }
    /* mode2 */
    .cell-wrap{
        margin: 0 auto;
        padding: 0;
        line-height: 0;
        background-color: #aaa;
        /* box-shadow: 0 0 20px #a3a; */
    }
    .cell{
        position: relative;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin: 0;
        padding: 0;
    }
    .cell:hover{
        opacity: .5;
    }
    .cell-off{
        background-color: #000;
    }
    .cell-on{
        background-color: #fff;
        box-shadow: 0 0 2px #444 inset;
    }
    .cell-water{
        background-color: LightSkyBlue;
    }
    .cell-cross{
        background-color: green;
    }
    /* .cell-corner::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: red;
        opacity: .2;
    } */
    .btn-wrap{
        position: absolute;
        right: 0;
        top: 100px;
        text-align: right;
        width: 150px;
        height: 150px;
    }
    .btn-wrap .btn{
        display: block;
        width: 100%;
        height: 65px;
        line-height: 65px;
        margin-bottom: 5px;
        border: 1px solid red;
    }
    /* mode3 */
    .gamer-wrap{
        position: relative;
        width: 100%;
        padding: 10px;
    }
    .gamer{
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .gamer .gamer-name{
        width: 60px;
    }
    .gamer .word-wrap{
        width: 750px;
    }
    .gamer .info-wrap{
        width: 50px;
    }
    .gamer .info-wrap input{
    	display: inline-block;
    	height: 30px;
    	line-height: 30px;
    	width: 50px;
        text-align: center;
        font-weight: bold;
    	vertical-align: middle;
    }
    .gamer .btn-wrap{
        text-align: right;
        width: 150px;
    }
    .word-wrap .word,
    .used-word-wrap .used-word{
        background-color: #fff;
        width: 80px;
        line-height: 30px;
        height: 30px;
        margin: 2px 10px;
        white-space: nowrap;
        word-break: break-all;
    }
    .btn-draw{
        width: 100px;
        height: 30px;
        line-height: 30px;
    }
    .used-word-wrap{
        padding: 4px;
        margin-top: 10px;
        background-color: grey;
    }
    .used-word-wrap .used-word{

    }
    .op-wrap{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 1030px;
        height: 80px;
        margin-top: 10px;
        padding: 0 10px;
    }
    .btn-redo{
        width: 100px;
        height: 30px;
        line-height: 30px;
    }

    /* mode4 */
    .name-wrap{
        width: 300px;
        padding: 10px;
    }
    .name-wrap .name{
        user-select: text;
        display: block;
        width: 100%;
        line-height: 20px;
        height: 20px;
        padding: 0;
        border: none;
        color: #000;
        font-size: 16px;
    }

    /* mode5 */
    .stock-wrap{
        width: 100%;
    }
    .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        text-shadow: 0 0 18px #000;
        font-weight: bold;
        font-size: 80px;
        color: #fff;
    }
    .info-board{
        position: absolute;
        right: 10px;
        top: 10px;
        width: 280px;
        height: 350px;
        padding: 10px;
        padding-bottom: 0;
        overflow-y: auto;
        background-color: DarkOrchid;
        margin-bottom: 20px;
    }
    .info-board .info{
        color: #fff;
    }
    .team{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 20px;
    }
    .team .player{
        padding: 10px;
        min-width: 190px;
        height: 350px;
        margin: 0 6px;
        background-color: pink;
    }
    .team .player-cur{
        box-shadow: 0 0 6px 12px orange;
    }
    .team .player .player-name{
        font-size: 18px;
        font-weight: bold;
    }
    .team .player .card-area{
        width: 100%;
        height: 128px;
        padding: 6px;
        overflow-x: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .team .player .player-hand{
        background-color: grey;
    }
    .team .player .card-area .number{

    }
    .team .player .card-area .card{
        position: relative;
        background-color: #333;
        margin: 0 8px;
        color: white;
        font-weight: bold;
        font-size: 25px;
        width: 50px;
        height: 80px;
        text-align: center;
        border: 4px solid lightblue;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .team .player .card-area .card-1{
        color: HotPink;
    }
    .team .player .card-area .card-2{
        color: SeaGreen;
    }
    .team .player .card-area .card-3{
        color: RoyalBlue;
    }
    .team .player .card-area .card-4{
        color: DarkOrange;
    }
    .team .player .card-area .btn-del{
        border-color: #e81313;
    }
    .team .player .card-area .btn-del:hover::after{
        content: '删';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        text-shadow: 0 0 4px #000;
        font-weight: bold;
        color: #e81313;
        font-size: 30px;
        opacity: .6;
    }
    .team .player .card-area .btn:hover{
        transform: scale(1.05);
    }
    /* mode 6 */
    .cell2-wrap{
        /* border: 1px solid #000; */
    }
    .btn-cell{
        width: 40px;
        height: 40px;
        margin: 4px;
    }
    .cell-0{
        background-color: #fff;
    }
    .cell-1{
        background-color: orange;
    }
    .cell-2{
        background-color: pink;
    }
    .cell-3{
        background-color: lightblue;
    }
    .cell-4{
        background-color: #000;
        color: #fff;
    }
    .cell-sel{
        box-shadow: 0 0 6px red;
    }
    .cell2{
        text-align: center;
        line-height: 30px;
        font-size: 18px;
        vertical-align: middle;
        white-space: nowrap;
        word-break: keep-all;
        width: 30px;
        height: 30px;
    }
    .btn-word{
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-right: 4px;
        vertical-align: middle;
    }
</style>
