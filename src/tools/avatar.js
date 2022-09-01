import { DEBUG, CONFIG } from '../config/config';
import { r, cloneObj, } from '../tools/utils';

export function genRandomAvatar(person){ // 随机生成肖像
    let res;
    let { personalities, gender, age, } = person;
    let emotion = Math.round(personalities[2]*.25+personalities[4]*.75); // 0-100
    let bald = (r(0,100)<5&&gender==1);
    // 生成发色
    let hairColor = genHairColor(gender);
    let { color, grd, } = hairColor;

    // 生成基本脸
    let faceData = genFaceData(gender,age,bald);
    // 生成双耳
    let earsData = genEarsData(faceData,gender,age);
    // 生成双眉
    let browsData = genBrowsData(faceData,gender,color);
    // 生成双眼
    let eyesData = genEyesData(faceData,gender,age,personalities);
    // 生成双眼皮
    let eyeskinsData;
    if(r(0,100)<90){
        eyeskinsData = genEyeSkinsData(eyesData,gender);
    }
    let lashData;
    if(gender==2){
        lashData = genLashData(eyesData,gender,age);
    }
    // 生成外双瞳
    let eyeoutballsData = genEyeoutballsData(eyesData,gender);
    let eyeinballsData;
    if(r(0,100)<90){ // 生成内双瞳
        eyeinballsData = genEyeinballsData(eyesData,gender);
    }

    // 生成鼻子
    let noseData = genNoseData(faceData,gender,age);
    // 生成嘴唇
    let lipData = genLipData(faceData,gender,age,emotion);
    let bottomLipData;
    if(!lipData.strokeColor){ // 生成下嘴唇
        bottomLipData = genBottomLipData(faceData,lipData,gender);
    }
    let topMoustacheData;
    if((r(0,100)<age&&age>=30&&gender==1)){ // 生成上胡子
        topMoustacheData = genTopMoustacheData(faceData,lipData,color,grd);
    }
    let nasoData;
    if(age>=50){ // 生成法令纹
        nasoData = genNasoData(faceData,eyesData);
    }
    let bracketsData;
    if(age>=60){ // 生成括号
        bracketsData = genBracketsData(faceData,lipData);
    }
    // 生成身体
    let bodyData = genBodyData(faceData,gender,age);

    let backHairData,foreHairData,bangsData;
    if(!bald){
        // 生成前发
        foreHairData = genForeHairData(faceData,gender,color,grd);
        // 生成刘海
        // if(r(0,100)<20){
        //     bangsData = genBangsData(faceData,gender,color,grd);
        // }
    }
    // 生成背发
    if(r(0,100)<50){
        backHairData = genBackHairData(faceData,gender,color,grd);
    }

    let eyeShadowData, eyeShadowData1, eyeShadowData2;
    // 生成眼影
    if(r(0,30)<(50-age)&&gender==2&&age>18){
        eyeShadowData = genEyeShadowData(faceData,eyesData);
        eyeShadowData1 = eyeShadowData.res1;
        eyeShadowData2 = eyeShadowData.res2;
    }

    let cheekData, cheekData1, cheekData2;
    // 生成腮红
    if(r(0,180)<(50-age)&&gender==2&&age>15){
        cheekData = genCheekData(faceData);
        cheekData1 = cheekData.res1;
        cheekData2 = cheekData.res2;
    }

    let glassData;
    // 生成眼镜
    if(r(0,100)<10){
        glassData = genGlassData(faceData,gender);
    }

    let clothData;
    // 生成衣服
    if(r(0,100)<0){
        clothData = genClothData(bodyData,gender);
    }

    res = {
        faceData,
        earsData,
        browsData,
        eyesData,
        eyeskinsData,
        lashData,
        eyeoutballsData,
        eyeinballsData,
        noseData,
        lipData,
        bottomLipData,
        topMoustacheData,
        bracketsData,
        nasoData,
        bodyData,
        backHairData,
        foreHairData,
        bangsData,
        clothData,
        eyeShadowData1,
        eyeShadowData2,
        cheekData1,
        cheekData2,
        glassData,
        hairColor,
    }
    return res;
}
export function paintAvatar(ctx,avatarData,canvasSize,showBg){ // 根据肖像数据进行绘制
    let fill = (data,flag) =>{ // 填充
        let {
            color, strokeColor, alpha,
            grd, topY, bottomY, leftX, rightX,
            rgrd, radial,
            noStroke,
        } = data;
        if(strokeColor){
            ctx.strokeStyle = `rgba(${strokeColor.r},${strokeColor.g},${strokeColor.b},${strokeColor.alpha||1})`;
        }
        else{
            ctx.strokeStyle = '#000';
        }
        if(!noStroke){
            ctx.stroke();
        }
        if(color){
            let grdStyle;
            if(grd){ // 线性渐变
                grdStyle = ctx.createLinearGradient(leftX||500,topY||0,rightX||500,bottomY||1000);
                grdStyle.addColorStop(0,grd);
                grdStyle.addColorStop(1,`rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`);
            }
            else if(rgrd){ // 扩散渐变
                grdStyle = ctx.createRadialGradient(radial.x1,radial.y1,radial.r1,radial.x2,radial.y2,radial.r2);
                grdStyle.addColorStop(0,rgrd);
                grdStyle.addColorStop(1,`rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`);
            }
            else{
                grdStyle = `rgba(${color.r},${color.g},${color.b},${color.alpha||alpha||1})`;
            }
            ctx.fillStyle = grdStyle;
            ctx.fill();
        }
    };
    let drawData = data =>{ // 画
        let { color, outline, topY, bottomY, grd, rgrd, radial, lineWidth, strokeColor, alpha, } = data;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidth||1;
        for(let option of outline){
            let mode = option[0];
            switch(mode){
                case 0: // 移动
                    ctx.moveTo(option[1],option[2],);
                break;
                case 1: // 直线
                    ctx.lineTo(option[1],option[2],);
                break;
                case 2: // 曲线
                    ctx.quadraticCurveTo(option[1],option[2],option[3],option[4],);
                break;
                case 3: // 圆
                    ctx.arc(option[2],option[3],option[1],0,4*Math.PI);
                break;
                // case 9: // 画
                //     ctx.closePath();
                //     fill(option[1]);
                // break;
            }
        }
        fill(data);
    }
    let transferedData = transferAvatarSize(avatarData,canvasSize);
    let {
        faceData,
        earsData,
        browsData,
        eyesData,
        eyeskinsData,
        lashData,
        eyeoutballsData,
        eyeinballsData,
        noseData,
        lipData,
        bottomLipData,
        topMoustacheData,
        bracketsData,
        nasoData,
        bodyData,
        backHairData,
        foreHairData,
        bangsData,
        clothData,
        eyeShadowData1,
        eyeShadowData2,
        cheekData1,
        cheekData2,
        glassData,
        hairColor,
    } = transferedData;

    ctx.clearRect(0,0,canvasSize,canvasSize);
    // 绘制BG
    if(showBg){
        let midWidth = canvasSize/2;
        let rd1 = canvasSize/5, rd2 = canvasSize*4/5;
        let bggrd = ctx.createRadialGradient(midWidth,midWidth,rd1,midWidth,midWidth,rd2);
        bggrd.addColorStop(0,`rgba(${hairColor.color.r},${hairColor.color.g},${hairColor.color.b},.1)`);
        bggrd.addColorStop(1,`rgba(${hairColor.color.r},${hairColor.color.g},${hairColor.color.b},.9)`);
        ctx.fillStyle = bggrd;
        ctx.fillRect(0,0,canvasSize,canvasSize);
    }

    if(backHairData){
        drawData(backHairData);
    }
    drawData(earsData);
    drawData(bodyData);
    drawData(faceData);


    ctx.save();
    drawData({ // 脸部裁剪
        outline: faceData.outline,
        noStroke: true,
    });
    ctx.clip();
    if(cheekData1){
        drawData(cheekData1);
    }
    if(cheekData2){
        drawData(cheekData2);
    }

    if(eyeShadowData1){
        drawData(eyeShadowData1);
    }
    if(eyeShadowData2){
        drawData(eyeShadowData2);
    }
    if(eyeskinsData){
        drawData(eyeskinsData);
    }
    if(lashData){
        drawData(lashData);
    }
    drawData(noseData);
    drawData(lipData);
    if(bottomLipData){
        drawData(bottomLipData);
    }
    if(topMoustacheData){
        drawData(topMoustacheData);
    }
    if(nasoData){
        drawData(nasoData);
    }
    if(bracketsData){
        drawData(bracketsData);
    }
    ctx.restore();

    drawData(eyesData);
    ctx.save();
    ctx.clip();
    drawData(eyeoutballsData);
    if(eyeinballsData){
        drawData(eyeinballsData);
    }
    ctx.restore();
    drawData(browsData);

    if(clothData){
        drawData(clothData);
    }

    ctx.save();
    drawData({ // 脸部裁剪
        outline: faceData.outline,
        noStroke: true,
    });
    ctx.clip();
    if(glassData){
        drawData(glassData);
    }
    ctx.restore();

    if(foreHairData){
        drawData(foreHairData);
    }
    if(bangsData){
        drawData(bangsData);
    }
}
function transferAvatarSize(data,canvasSize){
    let faceData = cloneObj(data.faceData);
    let earsData = cloneObj(data.earsData);
    let browsData = cloneObj(data.browsData);
    let eyesData = cloneObj(data.eyesData);
    let eyeskinsData = cloneObj(data.eyeskinsData);
    let lashData = cloneObj(data.lashData);
    let eyeoutballsData = cloneObj(data.eyeoutballsData);
    let eyeinballsData = cloneObj(data.eyeinballsData);
    let noseData = cloneObj(data.noseData);
    let lipData = cloneObj(data.lipData);
    let bottomLipData = cloneObj(data.bottomLipData);
    let topMoustacheData = cloneObj(data.topMoustacheData);
    let bracketsData = cloneObj(data.bracketsData);
    let nasoData = cloneObj(data.nasoData);
    let bodyData = cloneObj(data.bodyData);
    let backHairData = cloneObj(data.backHairData);
    let foreHairData = cloneObj(data.foreHairData);
    let bangsData = cloneObj(data.bangsData);
    let cheekData1 = cloneObj(data.cheekData1);
    let cheekData2 = cloneObj(data.cheekData2);
    let glassData = cloneObj(data.glassData);
    let eyeShadowData1 = cloneObj(data.eyeShadowData1);
    let eyeShadowData2 = cloneObj(data.eyeShadowData2);
    let clothData = cloneObj(data.clothData);
    let hairColor = cloneObj(data.hairColor);

    faceData.outline = formatPx(faceData.outline,canvasSize);
    faceData.radial.x1 = formatPx(faceData.radial.x1,canvasSize);
    faceData.radial.y1 = formatPx(faceData.radial.y1,canvasSize);
    faceData.radial.r1 = formatPx(faceData.radial.r1,canvasSize);
    faceData.radial.x2 = formatPx(faceData.radial.x2,canvasSize);
    faceData.radial.y2 = formatPx(faceData.radial.y2,canvasSize);
    faceData.radial.r2 = formatPx(faceData.radial.r2,canvasSize);

    earsData.outline = formatPx(earsData.outline,canvasSize);

    browsData.outline = formatPx(browsData.outline,canvasSize);

    eyesData.outline = formatPx(eyesData.outline,canvasSize);
    eyesData.lineWidth = formatPx(eyesData.lineWidth,canvasSize);

    if(eyeskinsData){
        eyeskinsData.outline = formatPx(eyeskinsData.outline,canvasSize);
        eyeskinsData.lineWidth = formatPx(eyeskinsData.lineWidth,canvasSize);
    }

    if(lashData){
        lashData.outline = formatPx(lashData.outline,canvasSize);
        lashData.lineWidth = formatPx(lashData.lineWidth,canvasSize);
    }

    eyeoutballsData.outline = formatPx(eyeoutballsData.outline,canvasSize);
    eyeoutballsData.topY = formatPx(eyeoutballsData.topY,canvasSize);
    eyeoutballsData.bottomY = formatPx(eyeoutballsData.bottomY,canvasSize);

    if(eyeinballsData){
        eyeinballsData.outline = formatPx(eyeinballsData.outline,canvasSize);
        eyeinballsData.topY = formatPx(eyeinballsData.topY,canvasSize);
        eyeinballsData.bottomY = formatPx(eyeinballsData.bottomY,canvasSize);
    }

    noseData.outline = formatPx(noseData.outline,canvasSize);

    lipData.outline = formatPx(lipData.outline,canvasSize);

    if(bottomLipData){
        bottomLipData.outline = formatPx(bottomLipData.outline,canvasSize);
    }

    if(topMoustacheData){
        topMoustacheData.outline = formatPx(topMoustacheData.outline,canvasSize);
    }

    if(nasoData){
        nasoData.outline = formatPx(nasoData.outline,canvasSize);
    }
    if(bracketsData){
        bracketsData.outline = formatPx(bracketsData.outline,canvasSize);
    }

    bodyData.outline = formatPx(bodyData.outline,canvasSize);
    bodyData.radial.x1 = formatPx(bodyData.radial.x1,canvasSize);
    bodyData.radial.y1 = formatPx(bodyData.radial.y1,canvasSize);
    bodyData.radial.r1 = formatPx(bodyData.radial.r1,canvasSize);
    bodyData.radial.x2 = formatPx(bodyData.radial.x2,canvasSize);
    bodyData.radial.y2 = formatPx(bodyData.radial.y2,canvasSize);
    bodyData.radial.r2 = formatPx(bodyData.radial.r2,canvasSize);

    if(foreHairData){
        foreHairData.outline = formatPx(foreHairData.outline,canvasSize);
        foreHairData.topY = formatPx(foreHairData.topY,canvasSize);
        foreHairData.bottomY = formatPx(foreHairData.bottomY,canvasSize);
    }

    if(bangsData){
        bangsData.outline = formatPx(bangsData.outline,canvasSize);
        bangsData.topY = formatPx(bangsData.topY,canvasSize);
        bangsData.bottomY = formatPx(bangsData.bottomY,canvasSize);
    }

    if(backHairData){
        backHairData.outline = formatPx(backHairData.outline,canvasSize);
        backHairData.topY = formatPx(backHairData.topY,canvasSize);
        backHairData.bottomY = formatPx(backHairData.bottomY,canvasSize);
    }

    if(glassData){
        glassData.outline = formatPx(glassData.outline,canvasSize);
    }

    if(eyeShadowData1){
        eyeShadowData1.outline = formatPx(eyeShadowData1.outline,canvasSize);
        eyeShadowData1.topY = formatPx(eyeShadowData1.topY,canvasSize);
        eyeShadowData1.bottomY = formatPx(eyeShadowData1.bottomY,canvasSize);
        eyeShadowData1.leftX = formatPx(eyeShadowData1.leftX,canvasSize);
        eyeShadowData1.rightX = formatPx(eyeShadowData1.rightX,canvasSize);
    }
    if(eyeShadowData2){
        eyeShadowData2.outline = formatPx(eyeShadowData2.outline,canvasSize);
        eyeShadowData2.topY = formatPx(eyeShadowData2.topY,canvasSize);
        eyeShadowData2.bottomY = formatPx(eyeShadowData2.bottomY,canvasSize);
        eyeShadowData2.leftX = formatPx(eyeShadowData2.leftX,canvasSize);
        eyeShadowData2.rightX = formatPx(eyeShadowData2.rightX,canvasSize);
    }

    if(cheekData1){
        cheekData1.outline = formatPx(cheekData1.outline,canvasSize);
        cheekData1.radial.x1 = formatPx(cheekData1.radial.x1,canvasSize);
        cheekData1.radial.y1 = formatPx(cheekData1.radial.y1,canvasSize);
        cheekData1.radial.r1 = formatPx(cheekData1.radial.r1,canvasSize);
        cheekData1.radial.x2 = formatPx(cheekData1.radial.x2,canvasSize);
        cheekData1.radial.y2 = formatPx(cheekData1.radial.y2,canvasSize);
        cheekData1.radial.r2 = formatPx(cheekData1.radial.r2,canvasSize);
    }

    if(cheekData2){
        cheekData2.outline = formatPx(cheekData2.outline,canvasSize);
        cheekData2.radial.x1 = formatPx(cheekData2.radial.x1,canvasSize);
        cheekData2.radial.y1 = formatPx(cheekData2.radial.y1,canvasSize);
        cheekData2.radial.r1 = formatPx(cheekData2.radial.r1,canvasSize);
        cheekData2.radial.x2 = formatPx(cheekData2.radial.x2,canvasSize);
        cheekData2.radial.y2 = formatPx(cheekData2.radial.y2,canvasSize);
        cheekData2.radial.r2 = formatPx(cheekData2.radial.r2,canvasSize);
    }

    if(clothData){
        clothData.outline = formatPx(clothData.outline,canvasSize);
    }

    return {
        faceData,
        earsData,
        browsData,
        eyesData,
        eyeskinsData,
        lashData,
        eyeoutballsData,
        eyeinballsData,
        noseData,
        lipData,
        bottomLipData,
        topMoustacheData,
        bracketsData,
        nasoData,
        bodyData,
        backHairData,
        foreHairData,
        bangsData,
        eyeShadowData1,
        eyeShadowData2,
        cheekData1,
        cheekData2,
        glassData,
        clothData,
        hairColor,
    };
}
function _scale(x,y,ox,oy,rate){
    let offset = [x-ox,y-oy];
    if(rate>=1){
        return [Math.round(x+offset[0]*(rate-1)),Math.round(y+offset[1]*(rate-1))];
    }
    else if(rate>0){
        return [Math.round(x-offset[0]*rate),Math.round(y-offset[1]*rate)];
    }
}
function formatPx(data,canvasSize){
    let rate = 1000/canvasSize;
    if(typeof data === 'object'){
        return Array.from(data,item=>{
            let res = [];
            if(item[0]==0||item[0]==1){
                res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate)];
            }
            else if(item[0]==2){
                res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate),parseInt(item[4]/rate)];
            }
            else if(item[0]==3){
                res = [item[0],parseInt(item[1]/rate),parseInt(item[2]/rate),parseInt(item[3]/rate)];
            }
            else{
                res = cloneObj(item);
            }
            return res;
        });
    }
    else{
        return parseInt(data/rate);
    }
}

export function genForeHairData(faceData,gender,color,grd,hairName){ // 生成前发型
    let res,rHair;
    if(hairName){
        let hairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.maleForeHairTemplates,...CONFIG.femaleForeHairTemplates,];
        for(let h of hairTemplates){
            if(h.name==hairName){
                rHair = h;
                break;
            }
        }
    }
    else{
        let maleForeHairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.maleForeHairTemplates,];
        let femaleForeHairTemplates = [...CONFIG.generalForeHairTemplates,...CONFIG.femaleForeHairTemplates,];
        if(gender==1){ // 男
            rHair = maleForeHairTemplates[r(0,maleForeHairTemplates.length-1)];
        }
        else{ // 女
            rHair = femaleForeHairTemplates[r(0,femaleForeHairTemplates.length-1)];
        }
    }
    let center = [...rHair.center];
    let const_outline = [...rHair.outline];
    let outline = Array.from(const_outline,item=>{
        let newItem = [...item];
        return newItem;
    });
    // 对准
    let a = faceData.a;
    let offset = [a[0]-center[0],a[1]-center[1]];
    for(let option of outline){
        if(option[0]!=2){
            option[1] += offset[0];
            option[2] += offset[1];
        }
        else{
            option[1] += offset[0];
            option[2] += offset[1];
            option[3] += offset[0];
            option[4] += offset[1];
        }
    }
    // 缩放
    let width = (500-faceData.c[0])*2; // 头部宽度
    let height = faceData.b[1]-faceData.a[1]; // 头部高度
    let widthScaleRate = width/400; // 水平缩放比率
    let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
    for(let option of outline){
        if(option[0]!=2){
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
        }
        else{
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
            option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
            option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
        }
    }
    // 随机造型
    if(!rHair.fixed){
        for(let option of outline){
            let dr = r(100,107)/100;
            if(option[0]!=2){
                let vector = _scale(option[1],option[2],center[0],center[1],dr);
                option[1] = vector[0];
                option[2] = vector[1];
            }
            else{
                let vector1 = _scale(option[1],option[2],center[0],center[1],dr);
                let vector2 = _scale(option[3],option[4],center[0],center[1],dr);
                option[1] = vector1[0];
                option[2] = vector1[1];
                option[3] = vector2[0];
                option[4] = vector2[1];
            }
        }
    }
    // 获取最高点和最低点
    let topY = Infinity, bottomY = 0;
    for(let option of outline){
        if(option[0]!=2){
            if(option[2]<topY){
                topY = option[2];
            }
            if(option[2]>bottomY){
                bottomY = option[2];
            }
        }
        else{
            if(option[3]<topY){
                topY = option[2];
            }
            if(option[4]>bottomY){
                bottomY = option[2];
            }
        }
    }

    // 输出
    res = {
        color,
        grd,
        topY: Math.round(topY*.2),
        bottomY: Math.round(bottomY*2),
        outline,
        name: rHair.name,
    }
    return res;
}
export function genBangsData(faceData,gender,color,grd,hairName){ // 生成刘海
    let res,rHair;
    if(hairName){
        let hairTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.maleBangsTemplates,...CONFIG.femaleBangsTemplates,];
        for(let h of hairTemplates){
            if(h.name==hairName){
                rHair = h;
                break;
            }
        }
    }
    else{
        let maleBangsTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.maleBangsTemplates,];
        let femaleBangsTemplates = [...CONFIG.generalBangsTemplates,...CONFIG.femaleBangsTemplates,];
        if(gender==1){ // 男
            rHair = maleBangsTemplates[r(0,maleBangsTemplates.length-1)];
        }
        else{ // 女
            rHair = femaleBangsTemplates[r(0,femaleBangsTemplates.length-1)];
        }
    }
    let center = [...rHair.center];
    let const_outline = [...rHair.outline];
    let outline = Array.from(const_outline,item=>{
        let newItem = [...item];
        return newItem;
    });
    // 对准
    let a = faceData.a, b = faceData.b, c = faceData.c;
    let offset = [b[0]-center[0],b[1]-center[1]];
    for(let option of outline){
        if(option[0]!=2){
            option[1] += offset[0];
            option[2] += offset[1];
        }
        else{
            option[1] += offset[0];
            option[2] += offset[1];
            option[3] += offset[0];
            option[4] += offset[1];
        }
    }
    // 缩放
    let width = (500-c[0])*2; // 头部宽度
    let height = b[1]-a[1]; // 头部高度
    let widthScaleRate = width/400; // 水平缩放比率
    let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
    for(let option of outline){
        if(option[0]!=2){
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
        }
        else{
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
            option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
            option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
        }
    }
    // 随机造型
    if(!rHair.fixed){
        for(let option of outline){
            let dr = r(100,104)/100;
            if(option[0]!=2){
                let vector = _scale(option[1],option[2],center[0],center[1],dr);
                option[1] = vector[0];
                option[2] = vector[1];
            }
            else{
                let vector1 = _scale(option[1],option[2],center[0],center[1],dr);
                let vector2 = _scale(option[3],option[4],center[0],center[1],dr);
                option[1] = vector1[0];
                option[2] = vector1[1];
                option[3] = vector2[0];
                option[4] = vector2[1];
            }
        }
    }
    // 获取最高点和最低点
    let topY = Infinity, bottomY = 0;
    for(let option of outline){
        if(option[0]!=2){
            if(option[2]<topY){
                topY = option[2];
            }
            if(option[2]>bottomY){
                bottomY = option[2];
            }
        }
        else{
            if(option[3]<topY){
                topY = option[2];
            }
            if(option[4]>bottomY){
                bottomY = option[2];
            }
        }
    }

    // 输出
    res = {
        color,
        grd,
        topY: Math.round(topY*.2),
        bottomY: Math.round(bottomY*2),
        outline,
        alpha: .96,
        name: rHair.name,
    }
    return res;
}
export function genBackHairData(faceData,gender,color,grd,hairName){ // 生成后发型
    let res,rHair;
    if(hairName){
        let hairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.maleBackHairTemplates,...CONFIG.femaleBackHairTemplates,];
        for(let h of hairTemplates){
            if(h.name==hairName){
                rHair = h;
                break;
            }
        }
    }
    else{
        let maleBackHairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.maleBackHairTemplates,];
        let femaleBackHairTemplates = [...CONFIG.generalBackHairTemplates,...CONFIG.femaleBackHairTemplates,];
        if(gender==1){ // 男
            rHair = maleBackHairTemplates[r(0,maleBackHairTemplates.length-1)];
        }
        else{ // 女
            rHair = femaleBackHairTemplates[r(0,femaleBackHairTemplates.length-1)];
        }
    }
    let center = [...rHair.center];
    let const_outline = [...rHair.outline];
    let outline = Array.from(const_outline,item=>{
        let newItem = [...item];
        return newItem;
    });
    // 对准
    let a = faceData.a;
    let offset = [a[0]-center[0],a[1]-center[1]];
    for(let option of outline){
        if(option[0]!=2){
            option[1] += offset[0];
            option[2] += offset[1];
        }
        else{
            option[1] += offset[0];
            option[2] += offset[1];
            option[3] += offset[0];
            option[4] += offset[1];
        }
    }
    // 缩放
    let width = (500-faceData.c[0])*2; // 头部宽度
    let height = faceData.b[1]-faceData.a[1]; // 头部高度
    let widthScaleRate = width/400; // 水平缩放比率
    let heightScaleRate = height/(gender==1?50:45); // 垂直缩放比率
    widthScaleRate *= r(90,110)/100;
    heightScaleRate *= r(80,120)/100;
    for(let option of outline){
        if(option[0]!=2){
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
        }
        else{
            option[1] = a[0]-Math.round((a[0]-option[1])*widthScaleRate);
            option[2] = a[1]-Math.round((a[1]-option[2])*heightScaleRate);
            option[3] = a[0]-Math.round((a[0]-option[3])*widthScaleRate);
            option[4] = a[1]-Math.round((a[1]-option[4])*heightScaleRate);
        }
    }
    // 随机造型
    if(!rHair.fixed){
        for(let option of outline){
            let dr = r(100,104)/100;
            if(option[0]!=2){
                let vector = _scale(option[1],option[2],center[0],center[1],dr);
                option[1] = vector[0];
            }
            else{
                let vector1 = _scale(option[1],option[2],center[0],center[1],dr);
                let vector2 = _scale(option[3],option[4],center[0],center[1],dr);
                option[1] = vector1[0];
                option[3] = vector2[0];
            }
        }
    }

    // 获取最高点和最低点
    let topY = Infinity, bottomY = 0;
    for(let option of outline){
        if(option[0]!=2){
            if(option[2]<topY){
                topY = option[2];
            }
            if(option[2]>bottomY){
                bottomY = option[2];
            }
        }
        else{
            if(option[3]<topY){
                topY = option[2];
            }
            if(option[4]>bottomY){
                bottomY = option[2];
            }
        }
    }

    // 输出
    res = {
        color,
        grd,
        topY: Math.round(topY*.2),
        bottomY: Math.round(bottomY*2),
        outline,
        name: rHair.name,
    }
    return res;
}
export function genGlassData(faceData,gender,glassName){ // 生成眼镜
    let res,rGlass;
    if(glassName){
        for(let glass of CONFIG.glassTemplates){
            if(glass.name==glassName){
                rGlass = glass;
                break;
            }
        }
    }
    else{
        rGlass = CONFIG.glassTemplates[r(0,CONFIG.glassTemplates.length-1)];
    }
    let center = [...rGlass.center];
    let lineWidthRange = rGlass.lineWidthRange;
    let const_outline = [...rGlass.outline];
    let outline = Array.from(const_outline,item=>{
        let newItem = [...item];
        return newItem;
    });
    // 对准
    let e = faceData.e;
    let offset = [0,e[1]-center[1]];
    for(let option of outline){
        if(option[0]==0||option[0]==1){
            option[1] += offset[0];
            option[2] += offset[1];
        }
        else if(option[0]==2){
            option[1] += offset[0];
            option[2] += offset[1];
            option[3] += offset[0];
            option[4] += offset[1];
        }
    }
    // // 缩放
    let width = (500-faceData.e[0])*2; // 脸宽
    let height = faceData.e[1]-faceData.d[1]; // 眼高
    let widthScaleRate = width/170; // 水平缩放比率
    let heightScaleRate = height/95; // 垂直缩放比率
    for(let option of outline){
        if(option[0]==0||option[0]==1){
            option[1] = 500-Math.round((500-option[1])*widthScaleRate);
            option[2] = e[1]-Math.round((e[1]-option[2])*heightScaleRate);
        }
        else if(option[0]==2){
            option[1] = 500-Math.round((500-option[1])*widthScaleRate);
            option[2] = e[1]-Math.round((e[1]-option[2])*heightScaleRate);
            option[3] = 500-Math.round((500-option[3])*widthScaleRate);
            option[4] = e[1]-Math.round((e[1]-option[4])*heightScaleRate);
        }
    }

    // 输出
    res = {
        outline,
        strokeColor: genGlassColor(gender),
        lineWidth: r(lineWidthRange[0],lineWidthRange[1]),
        name: rGlass.name,
    }
    return res;
}
export function genClothData(bodyData,gender,clothName){ // 生成衣服
    let res,rCloth;
    if(clothName){
        let clothTemplates = [...CONFIG.generalClothTemplates,...CONFIG.maleClothTemplates,...CONFIG.femaleClothTemplates,];
        for(let cloth of clothTemplates){
            if(cloth.name==clothName){
                rCloth = cloth;
                break;
            }
        }
    }
    else{
        let maleClothTemplates = [...CONFIG.generalClothTemplates,...CONFIG.maleClothTemplates,];
        let femaleClothTemplates = [...CONFIG.generalClothTemplates,...CONFIG.femaleClothTemplates,];
        if(gender==1){ // 男
            rCloth = maleClothTemplates[r(0,maleClothTemplates.length-1)];
        }
        else{ // 女
            rCloth = femaleClothTemplates[r(0,femaleClothTemplates.length-1)];
        }
    }
    let center = [...rCloth.center];
    let const_outline = [...rCloth.outline];
    let outline = Array.from(const_outline,item=>{
        let newItem = [...item];
        return newItem;
    });
    // 对准
    let g = bodyData.g;
    let offset = [g[0]-center[0],g[1]-center[1]];
    for(let option of outline){
        if(option[0]==0||option[0]==1){
            option[1] += offset[0];
            option[2] += offset[1];
        }
        else if(option[0]==2){
            option[1] += offset[0];
            option[2] += offset[1];
            option[3] += offset[0];
            option[4] += offset[1];
        }
    }
    // // 缩放
    let width = (500-bodyData.f[0])*2; // 肩宽
    let height = bodyData.f[1]-bodyData.a[1]; // 脖高
    let widthScaleRate = width/660; // 水平缩放比率
    let heightScaleRate = height/400; // 垂直缩放比率
    for(let option of outline){
        if(option[0]==0||option[0]==1){
            option[1] = g[0]-Math.round((g[0]-option[1])*widthScaleRate);
            option[2] = g[1]-Math.round((g[1]-option[2])*heightScaleRate);
        }
        else if(option[0]==2){
            option[1] = g[0]-Math.round((g[0]-option[1])*widthScaleRate);
            option[2] = g[1]-Math.round((g[1]-option[2])*heightScaleRate);
            option[3] = g[0]-Math.round((g[0]-option[3])*widthScaleRate);
            option[4] = g[1]-Math.round((g[1]-option[4])*heightScaleRate);
        }
    }

    // 输出
    res = {
        outline,
        name: rCloth.name,
    }
    return res;
}

function genHairColor(gender){ // 生成发色
    let color, grd;
    let basicColor = [{ // 黑
        r: r(10,30),
        g: r(10,30),
        b: r(10,30),
    },{ // 橙黄
        r: r(234,254),
        g: r(154,174),
        b: r(86,106),
    }];
    if(r(0,100)<50){
        color = basicColor[r(0,basicColor.length-1)];
    }
    else{
        color = {
            r: r(0,gender==1?50:255),
            g: r(0,gender==1?50:155),
            b: r(0,200),
        };
    }
    if(r(0,100)<90){
        let grds = ['#222','#fff','#A0522D'];
        grd = grds[r(0,grds.length-1)];
    }
    return { color, grd, };
}
function genEyeColor(flag){ // 生成瞳色
    let color, grd;
    let basicColor = [];
    if(flag==1){
        basicColor = [{
            r: r(40,60),
            g: r(40,60),
            b: r(40,60),
        },{
            r: r(240,250),
            g: r(240,250),
            b: r(240,250),
        },];
    }
    else if(flag==2){
        basicColor = [{
            r: r(40,60),
            g: r(40,60),
            b: r(40,60),
        },];
    }
    if(r(0,100)<90){
        color = basicColor[r(0,basicColor.length-1)];
    }
    else{
        color = {
            r: r(0,200),
            g: r(0,200),
            b: r(0,200),
        };
    }
    let grds = flag==1?['#777','#fff']:['#111','#777'];
    grd = grds[r(0,grds.length-1)];
    return { color, grd, };
}
function genGlassColor(gender){ // 生成瞳色
    let color;
    let basicColor = [{ // 黑
        r: r(10,30),
        g: r(10,30),
        b: r(10,30),
    },{ // 纯黑
        r: 0,
        g: 0,
        b: 0,
    }];
    if(r(0,100)<90){
        color = basicColor[r(0,basicColor.length-1)];
    }
    else{
        color = {
            r: r(0,gender==1?50:255),
            g: r(0,gender==1?50:155),
            b: r(0,200),
        };
    }
    return color;
}
function genLipColor(){ // 生成唇色
    let color = {
        r: r(255,255),
        g: r(89,109),
        b: r(61,81),
    };
    return { color, };
}
function genCheekColor(){ // 生成腮红色
    let color = {
        r: r(255,255),
        g: r(255,255),
        b: r(255,255),
        alpha: 0,
    };
    let rgrd = `rgba(${r(255,255)},${r(189,209)},${r(151,181)},${r(40,50)/100})`;
    return { color, rgrd };
}
function genEyeShadowColor(){ // 生成眼影色
    let grd = `rgba(${r(255,255)},${r(10,84)},${r(10,155)},${r(60,100)/100})`;
    return { grd };
}

function shrinkYoung(age){
    let pct;
    if(age>=18){
        pct = 100;
    }
    else if(age>=15){
        pct = age*5;
    }
    else{
        pct = age*4;
    }
    return pct/100;
}
function genFaceData(gender,age,bald){ // 生成脸
    let a,b,c,d,e,f,g,h,i;
    let color;
    let ysr = 1-shrinkYoung(age); // 年幼影响比率
    // let ysr = 0; // 年幼影响比率
    if(gender==2){ // 女
        a = [500,r(240,260)+ysr*145]; // 头顶 千分比
        b = [500,a[1]+r(47,53)]; // 刘海中心
        c = [r(310,330)+ysr*15,b[1]+r(125,145)]; // 脸左
        d = [r(425,445)+ysr*10,b[1]+r(145,165)]; // 左眉毛中心
        e = [d[0],d[1]+r(45,65-ysr*8)+ysr*20]; // 左眼下
        f = [500,e[1]+r(117,137-ysr*10)-ysr*30]; // 鼻下
        g = [500,f[1]+r(37,47-ysr*5)-ysr*30]; // 唇上
        h = [r(409,422-ysr*10)+ysr*12,c[1]+r(262,273-ysr*5)-ysr*30]; // 颊左
        i = [500,h[1]+r(40,50-ysr*5)-ysr*20]; // 下巴

        let colorDeep = r(2,7);
        color = {
            r: 255,
        };
        color.g = color.r-r(10,15)-colorDeep;
        color.b = color.g-10-colorDeep;
        if(r(0,100)<1){ // 黑人
            color.r -= 30;
            color.g /= 1.4;
            color.b /= 1.7;
        }
    }
    else{ // 男
        a = [500,r(240,260)+ysr*125]; // 头顶 千分比
        b = [500,a[1]+r(45,55)-ysr*1]; // 刘海中心
        c = [r(295,320)+ysr*25,b[1]+r(125,145)-ysr*10]; // 脸左
        d = [r(410,435)+ysr*20,b[1]+r(145,165)-ysr*10]; // 左眉毛中心
        e = [d[0],d[1]+r(45,65-ysr*8)+ysr*20]; // 左眼下
        f = [500,e[1]+r(134,152-ysr*8)-ysr*30]; // 鼻下
        g = [500,f[1]+r(42,52-ysr*5)-ysr*30]; // 唇上
        h = [r(374+ysr*16,397+ysr*15)+ysr*12,c[1]+r(265,285-ysr*15)-ysr*40]; // 颊左
        i = [500,h[1]+r(50+ysr*15,90-ysr*10)-ysr*25]; // 下巴

        let colorDeep = r(2,30);
        color = {
            r: 255,
        };
        color.g = color.r-r(10,15)-colorDeep;
        color.b = color.g-10-colorDeep;
        if(r(0,100)<3){ // 黑人
            color.r -= 30;
            color.g /= 1.4;
            color.b /= 1.7;
        }
    }
    let mirX = x =>{
        return x+2*(500-x);
    };
    let radialX, radialY;
    radialX = 500;
    radialY = a[1]-r(0,(i[1]-a[1])/10)-60;
    let res = {
        a,b,c,d,e,f,g,h,i,
        outline: [],
        color,
        radial: {
            x1: radialX,
            y1: radialY,
            r1: 1,
            x2: radialX,
            y2: radialY,
            r2: 300,
        },
    };
    if(bald){
        res.rgrd = `#fafafa`;
    }

    // 生成头部轮廓
    let cp1,cp2,cp3;
    if(gender==2){ // 女
        cp1 = [r(c[0]+5,c[0]+10),r(a[1],a[1]+20)];
        cp2 = [r(c[0]+0,c[0]+15-ysr*15),r(h[1]-90,h[1]-65+ysr*10)];
        cp3 = [r(h[0]+14,h[0]+23),r(h[1]+15,h[1]+27-ysr*20)];
    }
    else{ // 男
        cp1 = [r(c[0]+5,c[0]+10),r(a[1],a[1]+20)];
        cp2 = [r(c[0]+1,c[0]+10-ysr*9),r(h[1]-100,h[1]-130+ysr*20)];
        cp3 = [r(h[0]+34,h[0]+42),r(h[1]+40-ysr*20,h[1]+65-ysr*33)];
    }
    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 a-c1
    res.outline.push([2,cp2[0],cp2[1],h[0],h[1]]); // 曲线 c1-h1
    res.outline.push([2,cp3[0],cp3[1],i[0],i[1]]); // 曲线 h1-i
    res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(h[0]),h[1]]); // 曲线 i-h2
    res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 h2-c2
    res.outline.push([2,mirX(cp1[0]),cp1[1],a[0],a[1]]); // 曲线 c2-a

    return res;
}
function genBodyData(faceData,gender,age){ // 生成身体
    let a,b,c,d,e,f,g;
    let ysr = 1-shrinkYoung(age); // 年幼影响比率
    if(gender==2){ // 女
        a = [faceData.g[0],faceData.g[1]];
        b = [faceData.h[0]+r(3,10)+ysr*30,faceData.g[1]];
        c = [b[0]+(r(15,20)/100)*(500-b[0]),b[1]+r(70,80)-ysr*30];
        d = [b[0]-(r(15,30)/100)*60-80,c[1]+r(70,80)-ysr*30];
        e = [d[0]-(r(1,30)/100)*60-90+ysr*40,d[1]+r(0,5)];
        f = [e[0]-(r(1,40)/100)*60-80+ysr*25,e[1]+(r(1,80)/200)*90+80-ysr*50];
        g = [faceData.g[0],f[1]];
    }
    else{ // 男
        a = [faceData.g[0],faceData.g[1]];
        b = [faceData.h[0]+30+ysr*30,faceData.g[1]];
        c = [b[0]+(r(10,20)/100)*(500-b[0]),b[1]+r(90,120)-ysr*30];
        d = [b[0]-(r(10,30)/100)*60-80,c[1]+r(40,60)-ysr*30];
        e = [d[0]-(r(1,30)/100)*80-100+ysr*35,d[1]+r(0,10)];
        f = [e[0]-(r(1,40)/100)*80-100+ysr*25,e[1]+(r(1,80)/200)*90+80-ysr*50];
        g = [faceData.g[0],f[1]];
    }
    let mirX = x =>{
        return x+2*(500-x);
    };
    let res = {
        a,b,c,d,e,f,g,
        color: faceData.color,
        outline: [],
        rgrd: `#222`,
        radial: {
            x1: 500,
            y1: a[1]-100,
            r1: 1,
            x2: 500,
            y2: a[1]-100,
            r2: 220,
        },
    };

    // 生成身体轮廓
    let cp1,cp2,cp3;
    if(gender==2){ // 女
        cp1 = [r(c[0]-2,c[0]+10),r(b[1],b[1]+20)];
        cp2 = [r(c[0]-10,c[0]+5),r(d[1]-20,d[1])];
        cp3 = [r(f[0],f[0]+10),r(e[1],e[1]+20)];
    }
    else{ // 男
        cp1 = [r(c[0]-12,c[0]),r(b[1],b[1]+20)];
        cp2 = [r(c[0]-20,c[0]),r(d[1]-20,d[1])];
        cp3 = [r(f[0],f[0]+10),r(e[1],e[1]+20)];
    }
    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([1,b[0],b[1]]); // 直线 a-b1
    res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 b1-c1
    res.outline.push([2,cp2[0],cp2[1],d[0],d[1]]); // 曲线 c1-d1
    res.outline.push([1,e[0],e[1]]); // 直线 d1-e1
    res.outline.push([2,cp3[0],cp3[1],f[0],f[1]]); // 曲线 e1-f1
    res.outline.push([1,g[0],g[1]]); // 直线 f1-g
    res.outline.push([1,mirX(f[0]),f[1]]); // 直线 g-f2
    res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(e[0]),e[1]]); // 曲线 f2-e2
    res.outline.push([1,mirX(d[0]),d[1]]); // 直线 e2-d2
    res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 d2-c2
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 c2-b2
    res.outline.push([1,mirX(a[0]),a[1]]); // 直线 b2-a

    return res;
}
function genEarsData(faceData,gender,age){ // 生成双耳朵
    let a,b,c,d;
    let ysr = 1-shrinkYoung(age); // 年幼影响比率
    if(gender==2){ // 女
        a = [faceData.c[0]+5,faceData.c[1]+50];
        b = [faceData.c[0]-r(10,18),a[1]+r(5,20)];
        c = [faceData.c[0]+(faceData.h[0]-faceData.c[0])/3+ysr*20,a[1]+r(80,105)-ysr*40];
        d = [a[0]+30,a[1]+40];
    }
    else{ // 男
        a = [faceData.c[0]+5,faceData.c[1]+50];
        b = [faceData.c[0]-r(20,25),a[1]+r(15,25)];
        c = [faceData.c[0]+10+(faceData.h[0]-faceData.c[0])/4+ysr*20,a[1]+r(100,125)-ysr*40];
        d = [a[0]+30,a[1]+40];
    }

    let res = {
        a,b,c,d,
        color: faceData.color,
        outline: [],
    };
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双耳轮廓
    let cp1,cp2,cp3;
    cp1 = [r(a[0]-5,b[0]+5),r(a[1]-17,a[1]-22)];
    cp2 = [r(c[0]-5,b[0]+2),r(c[1]-10,c[1]+10)];
    cp3 = [r(c[0]+5,c[0]+20),r(c[1]-5,c[1]-20)];

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
    res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b1-c1
    res.outline.push([2,cp3[0],cp3[1],d[0],d[1]]); // 曲线 c1-d1
    res.outline.push([1,a[0],a[1]]); // 直线
    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
    res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 b2-c2
    res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(d[0]),d[1]]); // 曲线 c2-d2
    res.outline.push([1,mirX(a[0]),a[1]]); // 直线

    return res;
}
function genBrowsData(faceData,gender,color){ // 生成双眉
    let a,b,c,d;
    if(gender==2){ // 女
        a = [faceData.d[0]+r(25,35),faceData.d[1]+r(-5,20)];
        b = [faceData.d[0]+r(-5,5),faceData.d[1]-r(0,5)];
        c = [faceData.d[0]-r(50,55),faceData.d[1]+r(-15,5)];
        d = [faceData.d[0]+r(-5,5),faceData.d[1]+r(0,8)];
    }
    else{ // 男
        a = [faceData.d[0]+r(25,35),faceData.d[1]+r(-5,20)];
        b = [faceData.d[0]+r(-5,5),faceData.d[1]-r(0,10)];
        c = [faceData.d[0]-r(70,95),faceData.d[1]+r(-15,5)];
        d = [faceData.d[0]+r(-5,5),faceData.d[1]+r(0,8)];
    }

    let res = {
        a,b,c,d,
        outline: [],
        color,
        alpha: 1,
    };
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双眉轮廓
    let cp1,cp2,cp3;
    cp1 = [r(a[0]-10,a[0]-5),r(a[1]-8,a[1]-3)];
    cp2 = [r(c[0],c[0]+3),r(c[1]-10,c[1]-5)];
    cp3 = [r(d[0]-20,d[0]-10),r(d[1],c[1])];

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
    res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b1-c1
    res.outline.push([2,cp3[0],cp3[1],d[0],d[1]]); // 曲线 c1-d1
    res.outline.push([1,a[0],a[1]]); // 直线
    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
    res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(c[0]),c[1]]); // 曲线 b2-c2
    res.outline.push([2,mirX(cp3[0]),cp3[1],mirX(d[0]),d[1]]); // 曲线 c2-d2
    res.outline.push([1,mirX(a[0]),a[1]]); // 直线

    return res;
}
function genEyesData(faceData,gender,age,personalities){ // 生成双眼
    let a,b,c,lineWidth;
    let min,max;
    let calmness = personalities[3],
        libidinal = personalities[0];
    let ysr = 1-shrinkYoung(age); // 年幼影响比率
    if(gender==2){ // 女
        a = [faceData.e[0]+r(40,55),faceData.e[1]-r(-15,15)];
        b = [faceData.e[0]-r(50,70),faceData.e[1]-r(-10,10)];
        if(a[1]>b[1]){
            min = b[1];
            max = a[1];
        }
        else{
            min = a[1];
            max = b[1];
        }
        lineWidth = r(2,7);
    }
    else{ // 男
        a = [faceData.e[0]+r(45,60),faceData.e[1]-r(-15,15)];
        b = [faceData.e[0]-r(60,75),faceData.e[1]-r(-10,10)];
        if(a[1]>b[1]){
            min = b[1];
            max = a[1];
        }
        else{
            min = a[1];
            max = b[1];
        }
        lineWidth = r(1,4);
    }
    if(a[0]>485){
        a[0] = 485;
    }
    if(b[1]>a[1]){
        b[1] = a[1]-r(0,5);
    }
    c = [Math.round((a[0]+b[0])/2),min+Math.round((max-min)/2)];
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双眼轮廓
    let cp1,cp2;
    if(gender==2){ // 女
        let cpTop = r(b[1]-15,a[1]-35);
        let cpBottom = r(b[1]+15,a[1]+35);
        // 欲望值修正
        if(libidinal>70){
            cpTop += Math.round(15*r(15,45)/100);
            cpBottom -= Math.round(15*r(15,45)/100);
        }
        cp1 = [r(b[0]+15,a[0]-15),cpTop];
        cp2 = [r(b[0]+15,a[0]-15),cpBottom];
    }
    else{ // 男
        let cpTop = r(b[1]-25,a[1]-45);
        let cpBottom = r(b[1]+25,a[1]+45);
        // 欲望值修正
        if(libidinal>70){
            cpTop += Math.round(15*r(15,45)/100);
            cpBottom -= Math.round(15*r(15,45)/100);
        }
        cp1 = [r(b[0]+15,a[0]-15),cpTop];
        cp2 = [r(b[0]+15,a[0]-15),cpBottom];
    }
    if(cp1[0]<c[0]){
        cp1[0] = c[0]+r(5,15);
    }
    if(cp2[0]<c[0]){
        cp2[0] = c[0]+r(5,15);
    }

    let res = {
        a,b,c,
        cp1,cp2,
        outline: [],
        lineWidth,
        color: {
            r: 255,
            g: 255,
            b: 255,
        },
        alpha: 1,
    };

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
    res.outline.push([2,cp2[0],cp2[1],a[0],a[1]]); // 曲线 b1-a1
    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a2-b2
    res.outline.push([2,mirX(cp2[0]),cp2[1],mirX(a[0]),a[1]]); // 曲线 b2-a2

    return res;
}
function genEyeSkinsData(eyeData){ // 生成双眼皮
    let { lineWidth, cp1, cp2, a, b, c, } = eyeData;
    let d,e;
    let dw = r(3,9);
    let ew = dw+r(5,10);
    d = [a[0],a[1]-dw];
    e = [b[0],a[1]-ew];

    let res = {
        d,e,
        outline: [],
        lineWidth: Math.floor(lineWidth/2),
        alpha: 1,
    };
    if(res.lineWidth<1){
        res.lineWidth = 1;
    }
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双眼皮轮廓
    res.outline.push([0,d[0],d[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1]-dw,e[0],e[1]]); // 曲线 d1-e1
    res.outline.push([0,mirX(d[0]),d[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1]-dw,mirX(e[0]),e[1]]); // 曲线 d2-e2

    return res;
}
function genLashData(eyeData,gender,age){ // 生成睫毛
    let { lineWidth, cp1, cp2, a, b, c, } = eyeData;
    let eyeWidth = a[0]-b[0];
    let eyeHeight = cp2[1]-cp1[1];
    let lashMode = r(0,1); // [0:上部|1:下部]
    let lashCount;
    let ysr = 1-shrinkYoung(age); // 年幼影响比率
    if(age<=13){
        lashMode = 0;
    }
    if(lashMode==0){ // 睫毛在上部
        lashCount = r(6,9);
    }
    else{ // 睫毛在下部
        lashCount = r(2,3);
    }
    let xRange,yRange,xItv,yItv;
    if(lashMode==0){ // 睫毛在上部
        xRange = [b[0]-12,a[0]-5];
        yRange = [cp1[1]-eyeHeight/5,cp1[1]+eyeHeight/5];
    }
    else{ // 睫毛在下部
        xRange = [b[0]-12,c[0]];
        yRange = [c[1]+4,cp2[1]+5];
    }
    // 起始点为 a，终点为 ep
    let eps = [];
    if(lashMode==0){ // 睫毛在上部
        xItv = Math.round((xRange[1]-xRange[0])/(lashCount+0));
        yItv = Math.round((yRange[1]-yRange[0])/(lashCount+0));
        for(let i=0;i<lashCount;i++){
            let newEp = [xRange[1]-i*xItv-i*3,yRange[0]+i*yItv];
            eps.push(newEp);
        }
        for(let i=0;i<2;i++){
            eps[i][1] += Math.round((c[1]-eps[i][1])*.4);
        }
    }
    else{ // 睫毛在下部
        xItv = Math.round((xRange[1]-xRange[0])/(lashCount+0));
        yItv = Math.round((yRange[1]-yRange[0])/(lashCount+2));
        for(let i=0;i<lashCount;i++){
            let newEp = [xRange[0]+i*xItv,yRange[0]+i*yItv];
            eps.push(newEp);
        }
    }

    let res = {
        lashCount,
        outline: [],
        lineWidth: 1,
        alpha: .5,
    };
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成睫毛轮廓
    for(let i=0;i<eps.length;i++){
        let ep = eps[i];
        if(lashMode==0){ // 上部
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([2,c[0],c[1],ep[0],ep[1]]); // 曲线
        }
        else{ // 下部
            res.outline.push([0,a[0],a[1]]); // 移动
            res.outline.push([1,ep[0],ep[1]]); // 直线
        }
    }
    for(let i=0;i<eps.length;i++){
        let ep = eps[i];
        if(lashMode==0){ // 上部
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([2,mirX(c[0]),c[1],mirX(ep[0]),ep[1]]); // 曲线
        }
        else{ // 下部
            res.outline.push([0,mirX(a[0]),a[1]]); // 移动
            res.outline.push([1,mirX(ep[0]),ep[1]]); // 直线
        }
    }

    return res;
}
function genEyeoutballsData(eyeData,gender){ // 生成外双瞳
    let radius;
    let c = eyeData.c;
    if(gender==2){ // 女
        radius = r(18,25);
    }
    else{ // 男
        radius = r(17,24);
    }
    let eyeColor = genEyeColor(1);
    let {color,grd,} = eyeColor;

    let res = {
        radius,
        outline: [],
        color,
        grd,
        topY: c[1]-15,
        bottomY: c[1]+15,
        alpha: 1,
    };
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双瞳
    res.outline.push([0,c[0],c[1]]); // 移动
    res.outline.push([3,radius,c[0],c[1]]); // 左外瞳
    res.outline.push([0,mirX(c[0]),c[1]]); // 移动
    res.outline.push([3,radius,mirX(c[0]),c[1]]); // 右外瞳
    return res;
}
function genEyeinballsData(eyeData,gender){ // 生成内双瞳
    let radius;
    let c = eyeData.c;
    if(gender==2){ // 女
        radius = r(12,15);
    }
    else{ // 男
        radius = r(5,7);
    }
    let eyeColor = genEyeColor(2);
    let {color,grd,} = eyeColor;

    let res = {
        radius,
        outline: [],
        color,
        grd,
        topY: c[1]-5,
        bottomY: c[1]+5,
        alpha: 1,
    };
    let mirX = x =>{
        return x+2*(500-x);
    };

    // 生成双瞳
    res.outline.push([0,c[0],c[1]]); // 移动
    res.outline.push([3,radius,c[0],c[1]]); // 左内瞳
    res.outline.push([0,mirX(c[0]),c[1]]); // 移动
    res.outline.push([3,radius,mirX(c[0]),c[1]]); // 右内瞳
    return res;
}
function genNoseData(faceData,gender,age){ // 生成鼻子
    let a,b,c,lineWidth;
    let dir;
    let ysr = 1-shrinkYoung(age);
    if(gender==2){ // 女
        a = [faceData.f[0],faceData.e[1]+r(10,25)+ysr*50];
        b = [faceData.f[0]-r(-7,7),faceData.f[1]-r(0,5)-ysr*50];
        dir = b[0]<0?-1:1; // 鼻子方向：[0:向左|1:向右]
        c = [(faceData.f[0]+r(0,6))*dir,faceData.f[1]-ysr*40];
        lineWidth = 1;
    }
    else{ // 男
        a = [faceData.f[0],faceData.e[1]+r(10,30)+ysr*50];
        b = [faceData.f[0]-r(-9,9),faceData.f[1]-r(0,8)-ysr*50];
        dir = b[0]<0?0:1; // 鼻子方向：[0:向左|1:向右]
        c = [(faceData.f[0]+r(0,12))*dir,faceData.f[1]-ysr*40];
        lineWidth = 1;
    }
    if(b[0]==0){
        b[0] = 5;
    }
    if(b[0]<2&&b[0]>-2){
        b[0] *= 2;
    }
    // 生成鼻子轮廓
    let cp1,cp2;
    if(gender==2){ // 女
        cp1 = [r(a[0],(a[0]+9)*dir),r(b[1]-50,b[1])];
        cp2 = [r(c[0],(c[0]+4)*dir),r(b[1],b[1]+10)];
    }
    else{ // 男
        cp1 = [r(a[0],(a[0]+10)*dir),r(b[1]-50,b[1])];
        cp2 = [r(c[0],(c[0]+7)*dir),r(b[1],b[1]+16)];
    }

    let res = {
        a,b,c,
        outline: [],
        lineWidth,
        strokeColor: '#747443',
    };

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b
    res.outline.push([2,cp2[0],cp2[1],c[0],c[1]]); // 曲线 b-c

    return res;
}
function genLipData(faceData,gender,age,emotion){ // 生成嘴唇
    let a,b,lineWidth;
    let lipWidth;
    let lipColor = genLipColor();
    let strokeColor,color;
    let ysr = 1-shrinkYoung(age);
    if(gender==2){ // 女
        lipWidth = r(25,50-ysr*10);
        a = [faceData.g[0]+lipWidth,faceData.g[1]];
        b = [faceData.g[0]-lipWidth,faceData.g[1]];
        lineWidth = 1;
        if(age>=18&&r(0,100)<10){
            strokeColor = lipColor.color;
            lineWidth = r(1,3);
        }
        if(age>=16){
            color = {
                r: 255,
                g: 99,
                b: 71,
            };
        }
    }
    else{ // 男
        lipWidth = r(30,80-ysr*30);
        a = [faceData.g[0]+lipWidth,faceData.g[1]];
        b = [faceData.g[0]-lipWidth,faceData.g[1]];
        lineWidth = 1;
    }
    // 生成嘴唇轮廓
    if(!emotion){
        emotion = r(0,100);
    }
    let arcDeg = Math.round(emotion/100*24-9); // (-9 - 15)
    let cp1;
    if(gender==2){ // 女
        cp1 = [faceData.g[0]+r(-25,25),faceData.g[1]+arcDeg];
    }
    else{ // 男
        cp1 = [faceData.g[0]+r(-25,25),faceData.g[1]+arcDeg];
    }

    let res = {
        a,b,
        outline: [],
        lineWidth,
        lipWidth,
        strokeColor,
        color,
        emotion,
    };

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b

    return res;
}
function genBottomLipData(faceData,lipData,gender){ // 生成下嘴唇
    let a,b,lineWidth;
    let strokeColor = {
        r: 100,
        g: 100,
        b: 100,
    };
    let lipWidth = lipData.lipWidth/3+r(-4,4);
    let marginTop = r(9,15);
    if(gender==2){ // 女
        a = [faceData.g[0]+lipWidth,faceData.g[1]+marginTop];
        b = [faceData.g[0]-lipWidth,faceData.g[1]+marginTop];
        lineWidth = 1;
    }
    else{ // 男
        a = [faceData.g[0]+lipWidth,faceData.g[1]+marginTop];
        b = [faceData.g[0]-lipWidth,faceData.g[1]+marginTop];
        lineWidth = 1;
    }
    // 生成嘴唇轮廓
    let cp1;
    if(gender==2){ // 女
        cp1 = [faceData.g[0],r(a[1]-9,a[1]+4)];
    }
    else{ // 男
        cp1 = [faceData.g[0],r(a[1]-9,a[1]+4)];
    }

    let res = {
        a,b,
        outline: [],
        lineWidth,
        strokeColor,
    };

    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a-b

    return res;
}
function genTopMoustacheData(faceData,lipData,color,grd){ // 生成上胡子
    let { lineWidth, lipWidth, } = lipData;
    let halfLipWidth = lipWidth/2;
    let strokeColor = {
        r: 100,
        g: 100,
        b: 100,
    };
    let a,b,c;
    a = [faceData.g[0]-halfLipWidth-r(40,60),faceData.g[1]-r(14,22)];
    b = [a[0]+r(-7,0),a[1]+r(15,35)];
    c = [faceData.g[0]+r(-10,0),a[1]+r(-12,12)];

    let res = {
        a,b,c,
        outline: [],
        alpha: .8,
        color,
        strokeColor,
    };
    if(res.lineWidth<1){
        res.lineWidth = 1;
    }
    let mirX = x =>{
        return x+2*(500-x);
    };
    let cp1 = [r(b[0],b[0]+10),r(a[1],parseInt((b[1]+a[1])/2))];

    // 生成上胡子轮廓
    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([1,b[0],b[1]]); // 直线 a1-b1
    res.outline.push([2,cp1[0],cp1[1],c[0],c[1]]); // 曲线 b1-c1
    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
    res.outline.push([1,mirX(b[0]),b[1]]); // 直线 a2-b2
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(c[0]),c[1]]); // 曲线 b2-c2

    return res;
}
function genNasoData(faceData,eyeData){ // 生成法令纹
    let a,b;
    a = [eyeData.a[0]+r(0,10),eyeData.a[1]+r(5,20)];
    b = [a[0]-r(35,60),a[1]+r(70,100)];
    let strokeColor = {
        r: 100,
        g: 100,
        b: 100,
    };
    let res = {
        a,b,
        outline: [],
        alpha: .8,
        strokeColor,
    };
    let mirX = x =>{
        return x+2*(500-x);
    };
    let cp1 = [a[0]-r(0,15),a[1]+r(20,40)];

    // 生成上胡子轮廓
    res.outline.push([0,a[0],a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],b[0],b[1]]); // 曲线 a1-b1
    res.outline.push([0,mirX(a[0]),a[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(b[0]),b[1]]); // 曲线 a1-b1

    return res;
}
function genCheekData(faceData){ // 生成腮红
    let radial1 = {},radial2 = {};
    let { c, e, } = faceData;

    let mirX = x =>{
        return x+2*(500-x);
    };
    let xShift = e[0]-r(10,40);
    let yShift = e[1]+r(55,65);
    let radius = r(55,85);

    radial1.x1 = xShift;
    radial1.y1 = yShift;
    radial1.r1 = 0;
    radial1.x2 = radial1.x1;
    radial1.y2 = radial1.y1;
    radial1.r2 = radius;

    radial2.x1 = mirX(xShift);
    radial2.y1 = yShift;
    radial2.r1 = 0;
    radial2.x2 = radial2.x1;
    radial2.y2 = radial2.y1;
    radial2.r2 = radius;

    let cheeckColor = genCheekColor(2);
    let {color,rgrd,} = cheeckColor;

    let res1 = {
        radial: radial1,
        outline: [],
        color: faceData.color,
        rgrd,
        noStroke:true,
    };
    let res2 = {
        radial: radial2,
        outline: [],
        color: faceData.color,
        rgrd,
        noStroke:true,
    };

    // 生成双瞳
    res1.outline.push([0,radial1.x1,radial1.y1]); // 移动
    res1.outline.push([3,radial1.r2,radial1.x1,radial1.y1]); // 左内瞳
    res2.outline.push([0,radial2.x1,radial2.y1]); // 移动
    res2.outline.push([3,radial2.r2,radial2.x1,radial2.y1]); // 左内瞳
    return { res1, res2, };
}
function genEyeShadowData(faceData,eyeData){ // 生成眼影
    let res1 = {}, res2 = {};
    let { a, b, c, cp1, cp2, } = eyeData;
    let { color, } = faceData;

    let _a = [a[0],a[1]];
    let _b = [b[0]-r(15,25),b[1]+r(-7,7)];
    let _cp1 = [cp1[0],cp1[1]-r(-5,16)];
    let _cp2 = [cp2[0],cp2[1]+r(-5,16)];

    let leftX = _b[0];
    let rightX = _a[0];
    let topY = _cp1[1];
    let bottomY = _cp2[1];

    if(_b[0]<faceData.c[0]+10){
        _b[0] = faceData.c[0]+10;
    }

    let grd = genEyeShadowColor().grd;

    let mirX = x =>{
        return x+2*(500-x);
    };

    res1 = {
        outline: [],
        color,
        grd,
        leftX,
        rightX,
        topY,
        bottomY,
        noStroke: true,
    }
    res2 = {
        outline: [],
        color,
        grd,
        leftX: mirX(leftX),
        rightX: mirX(rightX),
        topY,
        bottomY,
        noStroke: true,
    }

    res1.outline.push([0,_a[0],_a[1]]); // 移动
    res1.outline.push([2,_cp1[0],_cp1[1],_b[0],_b[1]]); // 曲线 a1-b1
    res1.outline.push([2,_cp2[0],_cp2[1],_a[0],_a[1]]); // 曲线 b1-a1
    res2.outline.push([0,mirX(_a[0]),_a[1]]); // 移动
    res2.outline.push([2,mirX(_cp1[0]),_cp1[1],mirX(_b[0]),_b[1]]); // 曲线 a2-b2
    res2.outline.push([2,mirX(_cp2[0]),_cp2[1],mirX(_a[0]),_a[1]]); // 曲线 b2-a2

    return { res1, res2, };
}
function genBracketsData(faceData,lipData){ // 生成括号
    let res;
    let { a, b, } = lipData;
    let _a, _b, cp1;
    let strokeColor = {
        r: 100,
        g: 100,
        b: 100,
    };
    let halfHeight = r(10,15);
    _a = [a[0]+r(0,9),a[1]-halfHeight*2];
    _b = [_a[0],a[1]+halfHeight];
    cp1 = [_a[0]+r(25,35),a[1]];

    let mirX = x =>{
        return x+2*(500-x);
    };

    res = {
        outline: [],
        alpha: .8,
        strokeColor,
    }

    res.outline.push([0,_a[0],_a[1]]); // 移动
    res.outline.push([2,cp1[0],cp1[1],_b[0],_b[1]]); // 曲线 a1-b1
    res.outline.push([0,mirX(_a[0]),_a[1]]); // 移动
    res.outline.push([2,mirX(cp1[0]),cp1[1],mirX(_b[0]),_b[1]]); // 曲线 a2-b2

    return res;
}



























//
