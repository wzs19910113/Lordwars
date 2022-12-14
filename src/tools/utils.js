import { DEBUG, CONFIG } from '../config/config';
/*
  获取随机整数
  random(3,8) 的随机区间为 3-8
 */
export function r(min,max){
    return Math.floor(Math.random()*(min-max-1)+max+1);
}
export function exptr(min,max,exp){ // 指数随机
    let v = r(min,max);
    return Math.round((v-min)*Math.pow(v/(max-min),exp||1)+min);
}
/*
  冒泡排序
  @Param arr {Array} 要进行排序的数组 [{val:30,...},{val:10,...},{val:20,...},...]
  @Param valname? {String} 索引变量名（默认为'val'）
  @Return arr {Array} 排好序的数组

  Example:
  let oldarr = [{
        vote: 30, id: 'A',
    },{
        vote: 10, id: 'B',
    },{
        vote: 20, id: 'C',
    }];
    let newarr = bulbsort(oldarr,'vote');
 */
export function bulbsort(arr,valname='val',type=1){
    let res = [...arr];
    for(let i=0;i<res.length-1;i++){
        for(let j=0;j<res.length-1-i;j++){
            if(type){
                if((res[j][valname]<res[j+1][valname])){
                    let temp=res[j];
                    res[j] = res[j+1];
                    res[j+1] = temp;
                }
            }
            else{
                if((res[j][valname]>res[j+1][valname])){
                    let temp=res[j];
                    res[j] = res[j+1];
                    res[j+1] = temp;
                }
            }
        }
    }
    return res;
}
/* 最短路径算法 */
export function dijkstra(graph,src) {
    let paths = []; // 路径
    let lastNode = []; // 最后一个节点
    let dist = []; // dist 用来存储路径值(权)
    let visited = []; // visited 用来存储顶点是否访问
    const length = graph.length;
    const INF = Number.MAX_SAFE_INTEGER;
    // 初始化dist 和 visited 列表
    for(let i=0;i<length;i++){
        dist[i] = INF;
        lastNode[i] = '';
        visited[i] = false;
    }
    // 选择第一个节点 进入循环
    dist[src] = 0;
    let i = 0;
    while(i<length-1){
        if(src>=0){
            visited[src] = true; // 此时对应节点 已经访问设置 true
            let currentEdges = graph[src]; // 找到对应节点 的 对应的边集合
            for(let i=0;i<currentEdges.length;i++){ // 遍历边,更新路径
                if(currentEdges[i]!==0){ // 存在边 , 找到最短路径
                    if(dist[src]+currentEdges[i]<dist[i]){ // 符合上面条件 更新dist[i] 保证dist[i]是每次探路的最短路径
                        dist[i] = currentEdges[i]+dist[src];
                        lastNode[i] = src;
                    }
                }
            }
            // 迪杰斯特拉的核心算法 , 找到最短路径 重新探路.
            // 选择最短路径
            let min = INF;
            let minIndex = -2;
            for(let i=0;i<dist.length;i++) {
                if(!visited[i]&&dist[i]<min) {
                    min = dist[i];
                    minIndex = i;
                }
            }

            src = minIndex;
        }
        i++;
    }
    // 计算 paths
    for(let j=0;j<length;j++){
        let jpaths = [];
        let tNo = lastNode[j];
        let k = 0;
        while((!isNaN(tNo)&&tNo!=src)&&k++<1000){
            jpaths.push(tNo);
            tNo = lastNode[tNo];
        }
        jpaths.reverse().shift();
        jpaths.push(j);
        paths.push(jpaths);
    }
    return {dist,paths};
}

/* 随机排序 */
export function shuffle(arr){
    let res = [...arr];
    let len = res.length;
    for(let i=0;i<len-1;i++){
        let index = parseInt(Math.random()*(len-i));
        let temp = res[index];
        res[index] = res[len-i-1];
        res[len-i-1] = temp;
    }
    return res;
}
/*
 获取离元素ele最近的父级 tagname 标签
 */
export function getParentNode(ele,tagname='a'){
    if((ele&&((ele.nodeName||ele.tagName).toUpperCase())===tagname.toUpperCase()||ele.parentNode===null))
        return ele;
    else if(ele)
        return getParentNode(ele.parentNode,tagname);
    return false;
}
export function cloneObj(obj,und){ // 深度复制数据对象
    if(!obj){
        return und;
    }
    let newObj = {};
    if(obj instanceof Array){
       newObj = [];
    }
    for(let key in obj){
       let val = obj[key];
       newObj[key] = typeof val==='object'?cloneObj(val):val;
    }
    return newObj;
    // return JSON.parse(JSON.stringify(obj));
}
/*
 计算文本长度（汉字为2，英文和字符为1）
 */
export function getLength(str) {
    let realLength = 0,
        len = str.length,
        charCode = -1;
    for(let i=0;i<len;i++) {
        charCode = str.charCodeAt(i);
        if(charCode>=0&&charCode<=128) // 英文字符
            realLength+=1;
        else // 其他字符
            realLength+=2;
    }
    return realLength;
}
export function timestampToTime(timestamp) {
    let date = new Date(timestamp*1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    strDate = Y+M+D+h+m+s;
    return strDate;
}
export function getQueryVariable(variable){
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i=0;i<vars.length;i++) {
           let pair = vars[i].split('=');
           if(pair[0] == variable){
               return pair[1];
           }
    }
    return false;
}
export function query(url,success,fail,type=0,data={}){ // 通用ajax请求
    $.ajax({
        url,
        type: type?'POST':'GET',
        data,
        success: function(result){
            if(result.code==0){
                success&&success(result);
            }
            else{
                console.error(result);
                fail&&fail(result||{msg:'请求失败'});
            }
        },
        error: function(e){
            console.error(e);
            fail&&fail(e);
        },
        complete: function(e){
        },
    });
    return true;
}
export function avg(arr,valname){ // 数组平均值
    let total = 0;
    if(valname){
        for(let i of arr){
            total += i[valname];
        }
    }
    else{
        for(let i of arr){
            total += i;
        }
    }
    if(total==0)
        return 0;
    else
        return Math.ceil(total/arr.length);
}
export function percent(val,max){ // 百分比显示
    return Math.floor(val*100/max);
}
export function calcDistance(x1,y1,x2,y2){ // 计算两点距离
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function genName(arr1,arr2,arr3){ // 生成名字
    let c1 = arr1[r(0,arr1.length-1)], c2 = '', c3 = '';
    if(arr2){
        c2 = arr2[r(0,arr2.length-1)];
    }
    if(arr3){
        c3 = arr3[r(0,arr3.length-1)];
    }
    return c1+c2+c3;
}
export function genRandomWorkerName(){ // 随机生成工人名字
    return r(0,2)?genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2,CONFIG.namespace.worker2):genName(CONFIG.namespace.worker1,CONFIG.namespace.worker2);
}
export function genRandomRoomName(){ // 随机生成房间名字
    return genName(CONFIG.namespace.common,CONFIG.namespace.common,CONFIG.namespace.room);
}
export function getMatchList(arr,matchList){ // 根据匹配获取列表 matchList = [['id',1],['job',2]]
    let res = [];
    Array.from(arr,inst=>{
        let isMatch = true;
        for(let m of matchList){
            if(inst[m[0]]!=m[1]){
                isMatch = false;
                break;
            }
        }
        if(isMatch){
            res.push(inst);
        }
    });
    return res;
}
export function filterList(arr,func){ // 根据方法获取列表中的所有匹配元素
    let res = [];
    Array.from(arr,(data,index)=>{
        if(func(data,index)){
            res.push(data);
        }
    });
    return res;
}
export function removeFromList(value,valueName,arr){ // 从列表中移除
    let res = [];
    Array.from(arr,inst=>{
        if(inst[valueName]!=value){
            res.push(inst);
        }
    });
    return res;
}
export function removeFromNumberList(number,arr){ // 从数字列表中移除
    let res = [];
    Array.from(arr,inst=>{
        if(inst!=number){
            res.push(inst);
        }
    });
    return res;
}
export function arrContains(arr,number){ // 判断数字数组中是否含有数字
    let res = -1;
    Array.from(arr,(item,index)=>{
        if(item==number){
            res = index;
        }
    });
    return res;
}
export function rr(r1,r2,r3){ // 双随机：以1/r1的概率生成一个(r2-r3)的随机数值
    return r(0,r1-1)?0:r(r2,r3);
}

export function isFullScreen(){ // 判断当前是否为全屏模式
    return !!(document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement||document.fullscreenElement
    );
}
export function fullScreen(callback){ // 进入全屏模式
    let element = document.documentElement;
    if(element.requestFullscreen){
        element.requestFullscreen();
        callback&&callback();
    }
    else if(element.msRequestFullscreen){
        element.msRequestFullscreen();
        callback&&callback();
    }
    else if(element.mozRequestFullScreen){
        element.mozRequestFullScreen();
        callback&&callback();
    }
    else if(element.webkitRequestFullscreen){
        element.webkitRequestFullscreen();
        callback&&callback();
    }
}
export function exitFullScreen(callback){ // 退出全屏模式
    if(document.exitFullscreen){
        document.exitFullscreen();
        callback&&callback();
    }
    else if(document.msExitFullscreen){
        document.msExitFullscreen();
        callback&&callback();
    }
    else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
        callback&&callback();
    }
    else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
        callback&&callback();
    }
}




























//
