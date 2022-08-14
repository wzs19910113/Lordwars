import { DEBUG, CONFIG } from '../config/config';
import { query, r, rr, bulbsort, shuffle, getParentNode, getMatchList, removeFromList, arrContains, removeFromNumberList, } from '../tools/utils';
import * as ai from './ai';

const BASE_NAMES_1 = ['龙','魔','子','核','远','古','金','死','神','芒','宝','祖','狼','泉','权','定','军','异','罗','秀','封','血','雪','热','冷','近','御','儒','尸','离子','雾','灰','毒','东','南','西','北','中','亡','哭','苦','问','潮','暗','明','光','雨','鬼','油','烟','大','巨','剑','镜','机','若','虫','马','树','草','花','问'];
const BASE_NAMES_2 = ['热','马','湖','金','大','美','腾','万','奇','育','小','福','田','新','宇','通','长','尚','仁','德','成','恒','亚','雅','卓','星','宝','牛','飞','西','龙','合','世','界','曲','文','花','华','庆','丰','中','北','南','东','苏','资','耀','光','雷','民','银','宜','日','维','林','生','电','联','古','宫','鸿','宏','吉','基','蓝','百','顺','多','利','立','力','丽','特','矿','春','法','京','紫','井','汇','河','山','江','泽','科','柯','邦','意','奥','晨','知','达','英','阳','洋','喜','飞','三','五','八','九','洲','申','谷','内','渚','尔','太','空','全','托','思','速','道','艾','嘉','索','天','风','云','贵','米','明','网','讯','狗','昆','财','富','复','莱','能','语','射','重','辉','惠','慧','韩','涵','唐','堂','老','岚','漫','泉','加','它','安','鲁','香','凡','秋','夏','渡','千','朝','乐','贤','如','雪','学','上','本','秀','汉','菲','普','瑞','悦','钢','铁','荣','一','康','加','佳','领','尼','格','杰','洛','凡','艺','燕','国','果','简','建','宁','巨','菊','聚','章','城','雄','登','图','途','昂','海','黑','和','知','直','深','鱼','舒','露','真','众','想','初','车','保','晓','门','心','鼎','定','丁','宾','体','永','旺','平','品','朋','岛','友','优','麦','崇','围','伟','卫','松','孙','角','莎','梦','皇','环','欧','典','卡','酷','展','强','媒','甲','怡','外',];
const BASE_NAMES_3 = ['红','黄','绿','蓝','紫','白','黑','褐','灰','银','金','碧','赤','青'];
const BASE_NAMES_4 = ['一','双','三','七','九','十一','十二','零','百','千','万',];
const BASE_NAMES_5 = ['火','冰','炎','风','雷','电','岩','光','暗','日','月','木','土','岚',];
const BASE_NAMES_6 = ['赵','赵','赵','赵','赵','赵','赵','赵','赵','赵','赵','钱','钱','钱','钱','钱','孙','孙','孙','孙','孙','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','李','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','周','吴','吴','吴','吴','吴','吴','郑','郑','郑','郑','郑','郑','郑','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','王','冯','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','陈','方','方','方','范','范','范','范','范','褚','卫','蒋','蒋','蒋','蒋','蒋','沈','沈','沈','沈','沈','沈','沈','韩','韩','韩','韩','韩','韩','韩','韩','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','杨','朱','朱','朱','朱','朱','朱','秦','秦','秦','秦','秦','尤','许','许','许','许','许','许','许','何','何','何','何','何','吕','吕','吕','吕','吕','施','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','张','孔','孔','孔','曹','曹','曹','曹','曹','严','华','金','金','金','魏','魏','陶','陶','姜','姜','戚','谢','谢','谢','邹','喻','柏','水','窦','章','云','苏','潘','潘','潘','潘','葛','奚','彭','彭','彭','彭','彭','郎','鲁','韦','昌','马','马','马','马','马','马','马','苗','苗','凤','花','方','俞','任','任','任','任','袁','袁','袁','袁','袁','柳','鲍','史','唐','唐','唐','唐','唐','唐','唐','唐','唐','唐','唐','费','廉','岑','薛','薛','薛','雷','贺','贺','贺','贺','贺','倪','汤','滕','殷','罗','罗','罗','罗','罗','罗','毕','郝','邬','安','常','乐','于','时','傅','皮','卞','齐','康','伍','余','元','顾','顾','顾','顾','孟','平','黄','黄','黄','黄','黄','黄','和','穆','萧','尹','姚','姚','姚','姚','姚','姚','邵','湛','汪','汪','汪','汪','祁','毛','毛','毛','毛','毛','禹','狄','米','贝','明','计','伏','成','戴','戴','戴','戴','戴','戴','谈','宋','宋','宋','宋','宋','宋','宋','宋','宋','茅','庞','庞','庞','熊','纪','舒','舒','舒','舒','屈','项','祝','董','董','董','董','董','梁','梁','梁','梁','杜','杜','杜','杜','杜','阮','蓝','闵','席','季','麻','强','贾','路','娄','危','江','江','江','江','江','江','江','江','江','江','江','童','童','童','颜','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','郭','梅','盛','林','林','林','林','林','林','林','林','林','林','林','林','林','林','林','林','林','刁','钟','徐','徐','徐','徐','徐','徐','徐','徐','邱','邱','骆','高','高','夏','夏','夏','夏','夏','夏','夏','蔡','蔡','蔡','蔡','蔡','蔡','田','樊','胡','胡','胡','胡','胡','胡','胡','凌','霍','虞','万','支','柯','管','卢','莫','莫','莫','莫','经','房','裘','缪','干','解','应','宗','丁','宣','邓','邓','邓','邓','邓','邓','郁','单','杭','洪','包','诸','左','石','崔','吉','龚','程','邢','滑','裴','陆','陆','陆','陆','陆','陆','陆','陆','陆','荣','翁','荀','羊','於','惠','甄','曲','家','封','芮','羿','储','靳','汲','糜','松','井','段','富','巫','乌','焦','巴','弓','牧','山','谷','车','侯','蓬','全','班','仰','秋','仲','伊','宫','宁','仇','暴','甘','厉','戎','祖','武','符','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','刘','景','詹','束','龙','龙','龙','叶','幸','司','韶','黎','薄','印','宿','白','怀','蒲','从','鄂','索','咸','籍','赖','卓','蔺','屠','蒙','池','乔','阴','能','苍','双','闻','莘','党','翟','谭','贡','劳','逄','姬','申','扶','堵','冉','宰','郦','雍','卻','桑','桂','濮','牛','寿','通','边','燕','冀','浦','尚','农','温','别','庄','晏','柴','瞿','阎','充','慕','连','茹','习','宦','艾','鱼','容','向','古','易','易','易','易','易','易','易','慎','戈','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','廖','庾','终','居','衡','步','都','耿','满','弘','匡','国','文','寇','广','禄','东','欧','沃','利','越','隆','哈','欧阳','欧阳','欧阳','欧阳','欧阳','欧阳','上官','慕容','司马','皇甫','东方','夏侯','公孙','司徒','轩辕','令狐','漆雕','淳于','宇文',];
const COMMON_NAMES = ["良","嘉","懿","翟","雪","枫","洋","以","雨","竹","关","烨","姜","叶","帆","玄","冰","菱","隽","颖","中","瑞","羿","名","郸","华","歌","闵","意","景","晨","风","占","丹","云","招","优","扬","如","昌","小","师","位","寒","向","南","豆","孟","桂","德","明","李","吉","月","尹","思","九","恬","蒿","煜","都","岚","方","访","冬","光","盼","欧","勤","羊","清","韦","宁","酒","昕","海","詹","文","晋","觅","仇","余","陶","维","路","晶","辉","贸","听","祢","吹","郝","念","潮","祺","褚","迎","简","安","居","觉","濮","和","顺","洛","虹","旋","桑","高","爽","皮","乐","法","琼","贵","衍","鲍","语","雁","孙","天","纵","璧","郁","绍","焦","书","双","硕","水","折","怀","田","达","系","又","凌","凡","蒲","乾","艳","京","逸","致","滨","买","泽","飞","淡","希","白","夏","季","元","绿","乘","澄","邈","鸿","字","昔","女","端","献","仪","苗","史","筠","丙","烟","求","俞","野","谌","平","虞","营","恨","董","痴","春","黄","巧","沙","考","计","问","玉","闭","紫","丝","韶","熙","马","远","慕","漆","雕","谭","蚁","邢","燕","修","永","沃","班","今","支","珊","兆","超","竺","鹿","千","储","肇","康","针","赖","智","佘","任","友","堵","心","鞠","贺","那","焱","柳","喜","悦","宜","独","仆","局","之","桃","回","茂","卢","板","羽","化","祈","欣","笑","理","赫","连","诚","舒","澈","孔","吕","前","曜","淳","于","亥","褒","楠","尾","第","檀","星","晓","奉","涵","映","易","其","半","多","蒋","荷","冷","倚","廖","太","合","锺","英","允","潭","操","冠","扶","夕","深","用","善","波","诸","侯","才","司","答","代","西","红","旭","丑","朱","晖","委","纳","仁","溪","巢","全","厍","仵","轩","辕","秘","喻","家","晏","旅","亦","老","咏","市","卿","党","穆","容","接","霍","秀","休","范","张","礼","尔","费","丰","为","梁","丘","原","越","环","苏","离","瑜","镜","畅","但","可","佳","金","乌","图","桐","朗","涂","然","单","塞","藤","谬","束","鄂","庄","卑","石","毕","逄","闻","人","幻","侍","蒙","朝","赤","幼","楼","亘","时","莹","何","空","墨","从","霜","福","行","沐","央","让","信","咸","谏","植","裔","暮","悠","苦","呼","延","艺","商","生","长","琴","兴","勾","辰","沛","迟","弥","隐","牟","不","瓮","牧","乔","唱","保","枝","荣","潜","禽","典","暄","布","初","惜","赛","成","徐","彭","湃","边","经","好","融","毛","姓","律","别","斯","学","林","左","新","萨","梓","侨","奥","曲","车","佼","岑","含","岳","万","相","伯","尤","栋","古","馥","吴","实","频","子","皎","靖","世","通","恩","井","萧","庚","河","漫","邓","泉","冉","润","潘","侬","止","言","建","寻","狄","载","朋","尚","丁","检","江","奇","迈","蓬","若","道","辜","盘","乙","钞","彦","游","东","杜","改","伊","洲","巫","禾","斋","歆","程","台","勋","滢","锐","琦","拜","阿","贾","曾","震","顿","亢","银","施","裕","熊","謇","祝","会","捷","籍","席","影","崇","黎","闽","令","艾","树","仲","驰","完","颜","笛","汲","圭","彩","民","召","倩","夷","真","孤","琰","习","仰","帛","藩","贝","邱","随","韩","严","六","吟","普","醉","势","栗","逢","谯","所","斐","粟","槐","官","铁","澜","谢","危","曹","犁","温","舌","君","贤","说","钦","告","斌","慎","次","铭","鱼","况","来","许","唐","养","晗","谈","廉","流","於","盛","桓","磬","繁","义","骆","画","始","薄","宋","楚","戴","及","罗","奈","须","蓝","速","羲","同","举","宿","解","祥","塔","展","爵","辛","木","杭","洪","利","青","航","权","伦","吾","音","暖","丛","邹","庆","浮","莫","望","陆","在","竭","袁","蔡","津","鲜","齐","牵","钟","源","仍","宫","申","米","却","进","陈","泣","胡","跃","悟","上","伏","肖","睿","衣","螺","昭","麻","牢","饶","阔","宣","撒","仙","知","终","阴","堂","印","微","贰","留","禄","戈","函","过","芒","浦","首","税","性","杉","郑","荤","宾","湛","续","帖","年","寸","益","棠","房","稽","朴","格","剑","冒","葛","铃","锦","拉","悉","五","殷","步","管","闪","满","伍","沈","拱","度","幸","夜","壬","练","池","珠","傅","立","冀","樊","湘","查","线","桥","祭","迪","尉","后","归","凭","姚","冶","校","卷","广","辟","由","错","衷","项","聂","雍","粘","章","包","果","漠","称","璞","段","北","睦","应","纶","胜","开","揭","雷","滑","偶","薛","茅","冯","自","菁","干","常","己","能","珂","集","寿","疏","锁","出","务","柴","厉","是","秦","绪","圣","纪","藉","汗","鸾","充","阚","顾","崔","介","脱","巴","机","谊","杨","佛","魁","守","诺","苍","三","七","久","数","或","获","角","未","克","群","药","宝","童","先","备","处","喜","空","米","瞬","索","迷","家","早","玩","阵","湖","命","尘","难","哭","往","无","晚","围","网","弯","请","缺","去","钱","起","气","轻","热","忍","认","染","儒","他","也","贪","右","页","亚","育","赢","要","一","与","因","约","异","鸥","怕","骗","普","飘","案","暗","事","杀","四","声","输","神","算","色","术","伤","酸","送","私","审","岁","售","视","得","当","毒","懂","等","灯","动","呆","敌","赌","非","烦","分","负","肺","反","否","富","复","罚","该","鬼","功","互","还","黑","花","很","灰","户","候","欢","悔",];
const MALE_NAMES = ["大","犹","有","裘","渊","勇","皓","庞","羿","皇","甫","肥","辉","少","松","基","业","剧","寄","卫","公","甘","定","杰","森","谷","山","寇","坚","隆","本","宰","敖","龙","雄","贯","昂","伟","傲","阳","叔","坤","运","汉","宗","卓","武","磨","正","志","翁","弘","俊","昆","鹏","狂","昊","朔","泰","柯","博","孝","刑","门","种","威","彬","旷","城","励","骑","军","瀚","荆","府","峻","宏","督","刚","毅","凯","腾","骏","刁","强","宇","郎","掌","士","喆","牛","夫","资","抗","豪","钊","虎","帅","厚","藏","衡","盖","镇","拓","磊","政","父","宦","僧","巨","力","将","屠","鲁","侠","玮","屈","御","泥","苟","愚","登","革","工","暴","耀","百","晟","龚","夹","喇","哲","直","洗","浩","国","岩","盾","冲","日","土","枪","欠","恶","肉","油","盐","派","岸","死","受","寿","升","刀","东","蛋","更","狗","敢","火","虎","恒",];
const FEMALE_NAMES = ["娥","秋","莲","曼","凝","芷","蝶","姝","麴","凝","碧","灵","丽","娜","梅","豆","萱","晴","夙","梦","素","馨","妍","柔","彤","梦","妙","菡","曼","妮","蝶","凝","碧","灵","依","曼","莲","芷","贞","韵","露","静","雅","蕊","爱","夙","萱","妍","妮","雯","芳","鄢","琪","芮","美","花","芸","柏","瑰","瑶","倪","婉","蓉","香","霞","雅","姿","莞","骄","诗","蕊","苑","珍","蛾","采","焉","兰","慧","敏","淑","朵","怜","盈","儿","萦","怡","玥","菀","洁","芹","漪","娴","绮","婷","萍","蕾","芬","薇","凤","奕","翠","琳","莉","璇","蕙","蓓","汝","芙","芝","媛","芊","慈","嫣","茹","莎","婵","娟","姗","菲","惠","舞","茜","倩","娿","甜","穂","宛","忆","蝴",];

const BASE_NAMES_8 = ['村','镇','城','聚落','部落','乡','庄','公区','市','枢纽','口','港','营地','堡','基地',];
const BASE_NAMES_9 = ['森林','禁地','荒地','洞','禁区','山','谷','峰','废墟','野林','坡','海','窟','平原','矿洞','野原','墓地','陵','沼泽','沙漠','雪原','林','高原','冢','湖','宫','场','巢',];

const WEAPON_NAMES_1 = ['硬','软','铁','铜','银','钢','金','利','轻','重','巨','细','阔','短','长','圆','三角','老','草','竖','横','纵','残','快','慢','锋','尖','坚','固','古','刺','瓷','电','现代','厚','电子','电磁','离子','序列','索引','追踪','无影','死亡','贵族','光','飞','围','烧','多维','火焰','冰霜','多重','毒杀','护身','悲','柔软','刚烈','强','无力','普通','随意','堕落','神圣','怪','异',...BASE_NAMES_1,...BASE_NAMES_3,...BASE_NAMES_4,...BASE_NAMES_5,];
const WEAPON_NAMES_2 = ['剑','刀','锤','斧','枪','炮','弓','鞭',];
const HALMET_NAMES_2 = ['头盔','头套','头巾','帽','护额','面具','口罩','眼镜','面罩',];
const ARMOR_NAMES_2 = ['甲','板甲','大衣','风衣','铠甲','披风','上衣','衣罩','服','衣','外套','战甲','护甲','羽织','官服','制服','袍',];
const PANTS_NAMES_2 = ['裤','裙','腿布','腿甲','腿套',];
const SHOES_NAMES_2 = ['靴','鞋','履',];
const AREA_NAMES_1 = [...BASE_NAMES_2,...BASE_NAMES_3,...BASE_NAMES_4,...BASE_NAMES_5,];
const CREEP_NAMES_1 = [...WEAPON_NAMES_1,];
const CREEP_NAMES_2 = ['巨','毒','机械','食人','毛','雪','冰','性感','丑陋','丑','冷','热','燃烧','大','超级','懒惰','锋利','战争','猛','恶','炎','死','剑','刀','噩梦','湿','水','雷','风','电','火','臭','神圣','瘟疫','病毒','太阳','月亮','岚','小','光','暴虐','血','野','腐烂','智能','高级','远古','闪电','阴暗','假','奇','恐怖','圣','狂','神秘','恶臭','贵重','胆小','灵巧','无知','愤怒','怨','恨','慈悲','月','恐怖','霉菌','死亡','铁','硬','软','胖','肥重','僵硬','快乐','悲伤','愚蠢','疾病','地狱','尖刺',];
const CREEP_NAMES_3 = ['精','虫','鬼','怪','鼠','狼','熊','蜘蛛','枭','蟒','蛇','狗','蝎','雪怪','灵魂','僵尸','魔','贼','蛙','蚁','机甲','者','兵','王','之影','流氓','野人','之火','领主','骑士','恶魔','妖','骷髅','矿工','战士','猛汉','树','花','草','人','战士','教徒','邪神','邪兵','兽','爪牙','射手','雉','牙','先锋','之眼','之刃','球','头','菌体','灵','之灵','之魂','苦力','重甲','之盾','愚者','女妖','女贼','武士','忍者','女鬼','老尸','病体','喽啰','泥','种','娘','恶霸',];

const BOSS_NAMES_1 = ['污秽','黑暗','凤凰','暗影','恶毒','冤屈','复仇','纯净','圣光','机械','电元','时光','远古','恐惧','火焰','寒冰','雷鸣','风驰','大地','光明','海洋','森林','沙漠','万虫','甲狱','怨恨','正义','嗜血','愚笨','畸形','怪诞','微小','无理','克隆','光辉','鸦羽','天赐','霜冻','燃烧','地狱','天堂','炼狱','下降','螺纹','秀珍','派龙','古来','破盾','空间','谜语','锈化','量子','钢铁','蜘蛛','黑白','贪龙','疾病','仁爱','慈悲','上升','不死','智慧','重叠','无双','孤独','禁闭','死亡','古雅','欺诈','黎明','未来','废物','希望','噩梦','断臂','无头','赤血','无畏',];
const BOSS_NAMES_2 = ['之王','领主','兽','犬','魔王','将军','领袖','之主','梦魔','魅魔','神兽','圣者','主教','祭司','老者','之子','王子','女王','公主','之女','后裔','教主','酋长','船长','司令','核心','之眼','之影','巨龙','女神','之神','祖先','天皇','之形','星宿','之树','长老','之脑','天启','天灾','之源','霸王','剑圣','武圣','之魂','天神','天使','头目','先锋','幻影',];


const SKILL_NAME_1 = ['集中','希望','绝望','呼吸','黄金','分布式','多维','导体','变形','分段','整体','无序','离散','加持','中继','肉体','灵魂','加速','集合','精神','秘密','公开','固化','祖先','远古','太阳','月亮','智能','简单','复杂','阻碍','天堂','地狱','噩梦',...BASE_NAMES_1,...BASE_NAMES_4,...BASE_NAMES_5]; // 基本
const SKILL_NAME_ATK_1 = ['嗜血','残留','血染','极速','恶臭','环形','围杀','激动','破坏','流星','恐惧','云雷','制裁','花香','土豆','番茄','理想',...WEAPON_NAMES_1]; // 进攻
const SKILL_NAME_ATK_2 = ['击','斩','斩','斩','斩','斩','斩','斩','斩','斩','斩','炮','闪','线','刺','术','决','决','决','决','决','决','决','决','杀','杀','杀','杀','杀','杀','杀','爆','火','火','火','火','火','烧','残','爪','指','灼','流',]; // 进攻尾缀
const SKILL_NAME_HEA_1 = ['水','自愈','甜蜜','回魂','回神','气疗','健康','康复','医疗','恢复','急救','续命','生命','复活','正骨','活血','回血','体强','不死','续命','止血','正气','修正','液体',]; // 医疗
const SKILL_NAME_HEA_2 = ['术','决','药','光','气体','光束','缠绕','波','补丁','汤','法','式','光','功法','雾气','气','波','雾','符','泪',]; // 医疗尾缀
const SKILL_NAME_SUP_1 = ['光明','天堂','欢欣','自信','才智','怒','神圣','正义','五感','地球','宇宙','密码','天神','荣耀','霸气','强者','女神','胜利','无敌','梦境','仙人','仙女','血脉','龙','幻','心','星空','鸟','太阳','月亮','星','梦','无用','体格','鼓励','智慧','历练','月','文明','突破','南瓜',...BASE_NAMES_3,...BASE_NAMES_5]; // 辅助
const SKILL_NAME_SUP_2 = ['术','符','决','光','觉','光束','缠绕','风','波','法','式','光','油','步','附体','魂','功法','附身','焕发','身法','眼','尘','心法','醒觉','助力','力','咆哮','能量','能力','爆发','潜力','提升','展现','开源','源泉','召唤','令','遁','体','流','影','触摸','舞','雾气','痒','湖','海','云','燃烧',]; // 辅助尾缀
const SKILL_NAME_CRK_1 = ['黑暗','痛苦','疾病','噩梦','梦魇','压制','灵魂','毒','傀儡','虫','负载','压力','平庸','恐惧','火','阻碍','自负','昏迷','残','谜','疯','哭','弱者','自卑','无能','抑郁','白痴','智障','细小','诅咒','残疾','暗','孤独','潮湿','油腻','清','空','狼','鬼','破裂',...WEAPON_NAMES_1,...CREEP_NAMES_2,...BASE_NAMES_1,...BASE_NAMES_3,...BASE_NAMES_5]; // 压制
const SKILL_NAME_CRK_2 = [...SKILL_NAME_SUP_2,]; // 压制尾缀

export function genAttackName(unit){

}

export function getBuffObj(unit={},id){ // 从单位身上获取指定 ID 的 buff OBJ数据
    let buff = getMatchList(unit.buffs,[['id',id]])[0];
    if(buff){
        let { base, lvlup, level } = buff;
        let increment = (base+lvlup*(level-1))||0;
        return { buff, increment, };
    }
    return null;
}
export function getCBuff(id){ // 获取指定 ID 的配置 buff 数据
    return getMatchList(CONFIG.buffs,[['id',id]])[0];
}
export function dmgWithoutWeapon(unit){
    return [0,0,Math.ceil(unit.str/CONFIG.handsAttackDecay),0,0,0];
}
export function calcAttrOffset(unit,valueName){ // 获取用于计算伤害的属性值补正
    let fix = unit[`fix${valueName}`]||0,
        facts = unit[`${valueName}Facts`]||[0,0,0,0,],
        res = fix;
    res += facts[0];
    res += Math.round(fix*facts[1]);
    res -= facts[2];
    res -= Math.round(fix*facts[3]);
    return res;
}
export function calcAttackConsume(unit,attackType){ // 计算攻击消耗
    let weaponConsume = 0;
    if(unit.equipments&&unit.equipments.hands&&unit.equipments.hands.consume){
        weaponConsume = unit.equipments.hands.consume[attackType]||0;
    }
    return unit.consume+weaponConsume;
}
export function calcSkillConsume(unit,skill){ // 计算技能消耗
    let buffObj;
    let skillConsume = skill.consume+unit.consume;
    if(buffObj=getBuffObj(unit,3)){ // 如果有专注bufff
        let increment1 = buffObj.increment;
        skillConsume -= Math.ceil(skillConsume*increment1);
    }
    if(buffObj=getBuffObj(unit,20)){ // 如果有慧心bufff
        let increment2 = buffObj.increment;
        if(skillConsume>increment2){
            skillConsume = increment2;
        }
    }
    return skillConsume;
}
export function getAliveUnitArr(team){ // 获取阵营中存活单位数组
    let res = [];
    for(let unit of team){
        if(!unit.dead){
            res.push(unit);
        }
    }
    return res;
}
export function calcDmgRatio(unit,attackType){ // 计算伤害倍率
    if(attackType<3){ // 近战伤害
        return unit.str/CONFIG.standardStr;
    }
    else{ // 远程伤害
        return unit.acr/CONFIG.standardAcr;
    }
}
export function calcAttackDmg(unit,attackType){ // 计算攻击最终伤害
    let res = 0;
    let ratio = calcDmgRatio(unit,attackType);
    let dmg = unit.equipments.hands.dmg;
    let bodyAtk = Math.ceil(unit.str/CONFIG.handsAttackDecay)+(unit.baseAttack||0);
    if(dmg){ // 有武器
        let handsDmgAddition = dmg[attackType];
        let buffObj1 = getBuffObj(unit,11)||{}; // 点燃bufff
        let buff1 = buffObj1.buff;
        let increment1 = buffObj1.increment;
        if(buff1&&dmg[attackType]>0){
            let infact = Math.round(dmg[attackType]*increment1);
            if(infact<1){
                infact = 1;
            }
            handsDmgAddition += infact;
        }
        let buffObj2 = getBuffObj(unit,106)||{}; // 剧痛bufff
        let buff2 = buffObj2.buff;
        let increment2 = buffObj2.increment;
        if(buff2&&dmg[attackType]>0){
            let infact = Math.round(dmg[attackType]*increment2);
            if(infact<1){
                infact = 1;
            }
            handsDmgAddition -= infact;
        }
        let damageInc = handsDmgAddition+bodyAtk;
        res = Math.ceil(ratio*damageInc/25+damageInc/5);
    }
    else{ // 没有武器
        res = bodyAtk;
    }
    return res;
};
export function calcAwareness(unit){ // 计算一个单位的总固定存在感
    let res = 0;
    let equipments = unit.equipments;
    let skills = unit.skills;
    let { head, hands, body, legs, foots, } = equipments;
    res += unit.fixawareness||0;
    res += head.fixawareness||0;
    res += hands.fixawareness||0;
    res += body.fixawareness||0;
    res += legs.fixawareness||0;
    res += foots.fixawareness||0;
    // for(let skill of skills){
    //     res += skill.fixawareness||0;
    // }
    return res;
}

export function genHelmetName(){ // 生成头盔名
    return `${WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${HALMET_NAMES_2[r(0,HALMET_NAMES_2.length-1)]}`;
};
export function genWeaponName(type=0){ // 生成武器名
    return `${WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${WEAPON_NAMES_2[type]}`;
};
export function genArmorName(){ // 生成铠甲名
    return `${WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${ARMOR_NAMES_2[r(0,ARMOR_NAMES_2.length-1)]}`;
};
export function genPantsName(){ // 生成裤名
    return `${WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${PANTS_NAMES_2[r(0,PANTS_NAMES_2.length-1)]}`;
};
export function genShoesName(){ // 生成鞋名
    return `${WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]}${r(0,1)?WEAPON_NAMES_1[r(0,WEAPON_NAMES_1.length-1)]:''}${SHOES_NAMES_2[r(0,SHOES_NAMES_2.length-1)]}`;
};
export function genRoleName(gender=1){ // 生成角色名
    let givennames = [];
    if(gender==1){ // 男
        givennames = [...COMMON_NAMES,...MALE_NAMES];
    }
    else{ // 女
        givennames = [...COMMON_NAMES,...FEMALE_NAMES];
    }
    return `${BASE_NAMES_6[r(0,BASE_NAMES_6.length-1)]}${r(0,1)?givennames[r(0,givennames.length-1)]:''}${givennames[r(0,givennames.length-1)]}`;
};
export function genAreaName(type=0){ // 生成地名
    let res = `${AREA_NAMES_1[r(0,AREA_NAMES_1.length-1)]}${r(0,1)?AREA_NAMES_1[r(0,AREA_NAMES_1.length-1)]:''}${r(0,4)?'':AREA_NAMES_1[r(0,AREA_NAMES_1.length-1)]}`;

    // 缩减
    let rres = res.split(''),
        maxLen = r(2,3),
        offset = rres.length-maxLen;
    for(let i=0;i<offset;i++){ // 超出最大字数
        rres.splice(r(0,rres.length-2),1);
    }
    res = rres.join('');

    if(type){ // 城镇
        res += `${BASE_NAMES_9[r(0,BASE_NAMES_9.length-1)]}`;
    }
    else{ // 野外
        res += `${BASE_NAMES_8[r(0,BASE_NAMES_8.length-1)]}`;
    }
    return res;
};
export function genCreepName(){ // 生成野怪名
    let res = `${r(0,1)?CREEP_NAMES_2[r(0,CREEP_NAMES_2.length-1)]:''}${CREEP_NAMES_1[r(0,CREEP_NAMES_1.length-1)]}${CREEP_NAMES_3[r(0,CREEP_NAMES_3.length-1)]}`;

    // 缩减
    let rres = res.split(''),
        maxLen = r(3,5),
        offset = rres.length-maxLen;
    for(let i=0;i<offset;i++){ // 超出最大字数
        rres.splice(r(0,rres.length-2),1);
    }
    res = rres.join('');

    return res;
};
export function genSkillName(skill){ // 生成技能名
    let res = '';
    let trend = ai.getSkillTrend(skill);
    let level = skill.level;
    let maxTrend = 0;
    let targetNameArray1 = [];
    let targetNameArray2 = [];
    // [0:保护|1:强化|2:伤害|3:弱化]
    switch(trend){
        case 0:
            targetNameArray1 = SKILL_NAME_HEA_1;
            targetNameArray2 = SKILL_NAME_HEA_2;
        break;
        case 1:
            targetNameArray1 = SKILL_NAME_SUP_1;
            targetNameArray2 = SKILL_NAME_SUP_2;
        break;
        case 2:
            targetNameArray1 = SKILL_NAME_ATK_1;
            targetNameArray2 = SKILL_NAME_ATK_2;
        break;
        case 3:
            targetNameArray1 = SKILL_NAME_CRK_1;
            targetNameArray2 = SKILL_NAME_CRK_2;
        break;
    }
    let prefix1 = targetNameArray1[r(0,targetNameArray1.length-1)];
    let prefix2 = targetNameArray1[r(0,targetNameArray1.length-1)];
    let midfix = '';
    let suffix = targetNameArray2[r(0,targetNameArray2.length-1)];
    let mode = 0; // 组合模式 [0:abc|1:ab之c|2:aabbc|3:aa之c|4:aabb|5:ac|6:aac]
    let modePool = [];
    let maxLen = 0; // 最大长度
    if(level<3){
        modePool = [0,0,0,1,3,4,4,4,5,5,5,6,6,6,];
        maxLen = 3;
    }
    else if(level<5){
        modePool = [0,1,3,4,4,5,5,6,6,];
        maxLen = 4;
    }
    else if(level<7){
        modePool = [0,1,3,4,4,5,6,];
        maxLen = 4;
    }
    else{
        modePool = [0,1,2,2,2,3,4,4,4,];
        maxLen = 6;
    }
    mode = modePool[r(0,modePool.length-1)];
    switch(mode){
        case 0: // abc
            if(prefix1.length>=2){
                prefix1 = prefix1[r(0,prefix1.length-1)];
            }
            if(prefix2.length>=2){
                prefix2 = prefix2[r(0,prefix2.length-1)];
            }
            if(suffix.length>=2){
                suffix = suffix[r(0,suffix.length-1)];
            }
        break;
        case 1: // ab之c
            if(prefix1.length>=2){
                prefix1 = prefix1[r(0,prefix1.length-1)];
            }
            if(prefix2.length>=2){
                prefix2 = prefix2[r(0,prefix2.length-1)];
            }
            if(suffix.length>=2){
                suffix = suffix[r(0,suffix.length-1)];
            }
            midfix = '之';
        break;
        case 2: // aabbc
            if(prefix1.length<2){
                let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                if(newPrefix.length>=2){
                    newPrefix = newPrefix[r(0,newPrefix.length-1)];
                }
                prefix1 += newPrefix;
            }
            if(prefix2.length<2){
                let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                if(newPrefix.length>=2){
                    newPrefix = newPrefix[r(0,newPrefix.length-1)];
                }
                prefix2 += newPrefix;
            }
        break;
        case 3: // aa之c
            if(prefix1.length<2){
                let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                if(newPrefix.length>=2){
                    newPrefix = newPrefix[r(0,newPrefix.length-1)];
                }
                prefix1 += newPrefix;
            }
            if(suffix.length>=2){
                suffix = suffix[r(0,suffix.length-1)];
            }
            prefix2 = '';
            midfix = '之';
        break;
        case 4: // aabb
            if(prefix1.length<2){
                let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                if(newPrefix.length>=2){
                    newPrefix = newPrefix[r(0,newPrefix.length-1)];
                }
                prefix1 += newPrefix;
            }
            if(prefix2.length<2){
                let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                if(newPrefix.length>=2){
                    newPrefix = newPrefix[r(0,newPrefix.length-1)];
                }
                prefix2 += newPrefix;
            }
            suffix = '';
        break;
        case 5: // ac
            if(prefix1.length>=2){
                prefix1 = prefix1[r(0,prefix1.length-1)];
            }
            if(suffix.length>=2){
                suffix = suffix[r(0,suffix.length-1)];
            }
            prefix2 = '';
        break;
        case 6: // aac
            if((prefix1.length+suffix.length)<=2){
                let rk = r(0,1);
                if(rk){ // prefix补字
                    let newPrefix = targetNameArray1[r(0,targetNameArray1.length-1)];
                    if(newPrefix.length>=2){
                        newPrefix = newPrefix[r(0,newPrefix.length-1)];
                    }
                    prefix1 += newPrefix;
                }
                else{ // suffix补字
                    let newPrefix = targetNameArray2[r(0,targetNameArray2.length-1)];
                    if(newPrefix.length>=2){
                        newPrefix = newPrefix[r(0,newPrefix.length-1)];
                    }
                    suffix += newPrefix;
                }
            }
            else if((prefix1.length+suffix.length)>=3){
                if(prefix1.length>=3){
                    prefix1.shift();
                }
                if(suffix.length>=2){
                    suffix = suffix[r(0,suffix.length-1)];
                }
            }
            prefix2 = '';
        break;
    }
    res = `${prefix1}${prefix2}${midfix}${suffix}`;
    // res = `${prefix1}-${prefix2}-${midfix}-${suffix}`;

    // 缩减
    // let rres = res.split('');
    // let offset = rres.length-maxLen;
    // for(let i=0;i<offset;i++){ // 超出最大字数
    //     rres.splice(r(0,rres.length-2),1);
    // }
    // res = rres.join('');
    return res;
};
export function genBossName(title){ // 生成boss名
    return `${BOSS_NAMES_1[r(0,BOSS_NAMES_1.length-1)]}${title||(BOSS_NAMES_2[r(0,BOSS_NAMES_2.length-1)])}`;
}

export function calcRoleFinalData(unit,allEquips,allSkills,log){ // 计算角色最终数据
    let res = {
            ...unit,
        },
        increments = {
            hp: 0,
            maxhp: 0,
            pow: 0,
            maxpow: 0,
            fixstr: 0,
            fixacr: 0,
            fixdex: 0,
            price: 0,
        };
    let equipments = unit.equipments;
    let partArr = CONFIG.equipItemNameMap;
    for(let i=0;i<partArr.length;i++){
        let equipID = equipments[partArr[i]].id;
        if(equipID>0){
            let equip = getMatchList(allEquips,[['id',equipID]])[0]||{};
            if(equip){
                increments.maxhp += equip.hp||0;
                increments.maxpow += equip.pow||0;
                increments.fixstr += equip.strOffset||0;
                increments.fixacr += equip.acrOffset||0;
                increments.fixdex += equip.dexOffset||0;
                increments.price += equip.price||0;
                if(equip.viceid){
                    let viceWeapon = getMatchList(allEquips,[['id',viceid]])[0]||{};
                    if(viceWeapon){
                        increments.price += viceWeapon.price||0;
                    }
                }
            }
        }
    }
    for(let equipID of unit.bag){
        let equip = getMatchList(allEquips,[['id',equipID]])[0]||{};
        increments.price += equip.price||0;
    }
    for(let skillID of unit.skills){
        let skill = getMatchList(allSkills,[['id',skillID]])[0]||{};
        increments.price += skill.price||0;
    }

    // 记忆
    let memoryData = calcMemoryEffects(res.brain,{str:1,acr:1,dex:1});
    increments.fixstr += memoryData.str;
    increments.fixacr += memoryData.acr;
    increments.fixdex += memoryData.dex;

    res.hp = res.hp+increments.hp;
    res.maxhp = res.basehp+increments.maxhp;
    res.pow = res.pow+increments.pow;
    res.maxpow = res.basepow+increments.maxpow;
    res.fixstr = res.basestr+increments.fixstr;
    res.fixacr = res.baseacr+increments.fixacr;
    res.fixdex = res.basedex+increments.fixdex;
    res.price = res.basePrice+increments.price;
    if(res.hp>res.maxhp){
        res.hp = res.maxhp;
    }
    else if(res.hp<0){
        res.hp = 0;
    }
    if(res.pow>res.maxpow){
        res.pow = res.maxpow;
    }
    else if(res.pow<0){
        res.pow = 0;
    }
    return res;
}
export function calcRoleFinalDataPurely(unit){ // 单纯计算角色最终数据（忽略价格）
    let res = {
            ...unit,
        },
        increments = {
            hp: 0,
            maxhp: 0,
            pow: 0,
            maxpow: 0,
            fixstr: 0,
            fixacr: 0,
            fixdex: 0,
        };
    let equipments = unit.equipments;
    let partArr = CONFIG.equipItemNameMap;
    for(let i=0;i<partArr.length;i++){
        let equip = equipments[partArr[i]];
        if(equip){
            increments.maxhp += equip.hp||0;
            increments.maxpow += equip.pow||0;
            increments.fixstr += equip.strOffset||0;
            increments.fixacr += equip.acrOffset||0;
            increments.fixdex += equip.dexOffset||0;
        }
    }

    // 记忆
    let memoryData = calcMemoryEffects(res.brain,{str:1,acr:1,dex:1});
    increments.fixstr += memoryData.str;
    increments.fixacr += memoryData.acr;
    increments.fixdex += memoryData.dex;

    res.hp = res.hp+increments.hp;
    res.maxhp = res.basehp+increments.maxhp;
    res.pow = res.pow+increments.pow;
    res.maxpow = res.basepow+increments.maxpow;
    res.fixstr = res.basestr+increments.fixstr;
    res.fixacr = res.baseacr+increments.fixacr;
    res.fixdex = res.basedex+increments.fixdex;
    if(res.hp>res.maxhp){
        res.hp = res.maxhp;
    }
    else if(res.hp<0){
        res.hp = 0;
    }
    if(res.pow>res.maxpow){
        res.pow = res.maxpow;
    }
    else if(res.pow<0){
        res.pow = 0;
    }
    return res;
}
export function calcRoleAwareness(unit,allEquips){ // 计算角色战斗初始存在感
    let res = unit.fixawareness;
    let equipments = unit.equipments;
    let partArr = CONFIG.equipItemNameMap;
    for(let i=0;i<partArr.length;i++){
        let equipID = equipments[partArr[i]].id;
        if(equipID>0){
            let equip = getMatchList(allEquips,[['id',equipID]])[0]||{};
            if(equip){
                res += equip.fixawareness||0;
            }
        }
    }
    if(res>CONFIG.maxAwareness){
        res = CONFIG.maxAwareness;
    }
    else if(res<0){
        res = 0;
    }
    return res;
}
export function calcRoleAwarenessPurely(unit){ // 单纯计算角色战斗初始存在感
    let res = unit.fixawareness;
    let equipments = unit.equipments;
    let partArr = CONFIG.equipItemNameMap;
    for(let i=0;i<partArr.length;i++){
        let equip = equipments[partArr[i]];
        if(equip.fixawareness){
            res += equip.fixawareness||0;
        }
    }
    if(res>CONFIG.maxAwareness){
        res = CONFIG.maxAwareness;
    }
    else if(res<0){
        res = 0;
    }
    return res;
}
export function calcEquipPrice(equipment){ // 计算装备价格
    let res = 0;
    res += (equipment.hp||0);
    res += (equipment.pow||0)*4;
    res += (equipment.strOffset||0)*15;
    res += (equipment.acrOffset||0)*15;
    res += (equipment.dexOffset||0)*25;
    res += ((CONFIG.maxAwareness-equipment.fixawareness)/125);
    if(equipment.equipType==1){ // 如果是武器
        res *= equipment.type==2?2.5:1;
        res += Math.max(...equipment.dmg)*50;
        res += Math.max(...equipment.buffLevels)*125;
    }
    res = Math.round(res);
    return res;
}
export function calcCreepPrice(creep){ // 计算野怪的价值
    let res = 0;
    res += creep.maxhp*5;
    res += creep.maxpow*5;
    res += creep.fixstr*3;
    res += creep.fixacr*3;
    res += creep.fixdex*3;
    let dmg = creep.equipments.hands.dmg;
    if(dmg){
        for(let d of dmg){
            res += d*5;
        }
    }
    res += creep.baseAttack*5;
    for(let skill of creep.skills){
        res += 10;
    }
    return res;
}
export function calcRankScore(role,allEquips,allSkills){ // 计算战力排行分数
    role.rankScoreDetail = {
        hp: 0,
        pow: 0,
        baseAttack: 0,
        imm: 0,
        weaponDmg: 0,
        weaponBuff: 0,
        skill: 0,
        dmgSkill: 0,
        otherSkill: 0,
        dex: 0,
    };
    role.rankScoreDetail.hp = Math.round(role.maxhp*.2);
    role.rankScoreDetail.pow = Math.round(role.maxpow*.4);
    role.rankScoreDetail.baseAttack = Math.round(role.baseAttack*2.5);
    role.rankScoreDetail.imm = Math.round(role.imm*.5);
    role.rankScoreDetail.halo = 0;
    let res = role.rankScoreDetail.hp+role.rankScoreDetail.pow+role.rankScoreDetail.baseAttack+role.rankScoreDetail.imm;
    // let awareness = calcRoleAwareness(role,allEquips);
    // role.rankScoreDetail.awareness = Math.round((CONFIG.maxAwareness-awareness)/40);
    // res += role.rankScoreDetail.awareness;
    // 武器
    let weaponID = role.equipments.hands.id;
    let maxDmg = 0, maxAttackType = 2, weaponDmg = [];
    let maxAttr;
    if(weaponID>0){
        let weapon = getMatchList(allEquips,[['id',weaponID]])[0];
        if(weapon){
            let { dmg, buffLevels, consume, type, } = weapon;
            weaponDmg = dmg;
            // 求最大值和最大值索引
            for(let i=0;i<dmg.length;i++){
                let d = dmg[i];
                if(d>maxDmg){
                    maxDmg = d;
                    maxAttackType = i;
                }
            }
            let buffLevel = buffLevels[maxAttackType]; // 最高攻击类型对应的特效等级
            role.rankScoreDetail.weaponBuff += (buffLevel-1)*100;
            res += role.rankScoreDetail.weaponBuff;
        }
    }
    maxAttr = maxAttackType<3?role.fixstr:role.fixacr;
    // console.log(role.name,maxDmg);
    role.rankScoreDetail.weaponDmg = Math.round(maxDmg*maxAttr*.035);
    res += role.rankScoreDetail.weaponDmg;
    // role.maxDmg = maxDmg;
    // 技能
    let skillArr = []
    for(let skillID of role.skills){
        let skill = getMatchList(allSkills,[['id',skillID]])[0];
        if(skill){
            skillArr.push(skill);
        }
    }
    skillArr = bulbsort(skillArr,'price',2);
    // if(role.isHero){
    //     console.log(skillArr);
    // }
    for(let i=0;i<4;i++){
        let skill = skillArr[i];
        if(skill){
            let { effects, target, dmg, price, cure, buffs, buffLevels, } = skill;
            for(let eff of effects){
                if(eff==1&&(skill.trend==2||skill.trend==3)){ // 伤害效果
                    for(let i=0;i<dmg.length;i++){
                        let skillDmgVal = dmg[i];
                        let weaponDmgVal = weaponDmg[i];
                        maxAttr = i<3?role.fixstr:role.fixacr;
                        if(skillDmgVal&&weaponDmgVal){
                            let skillScore = Math.round((skillDmgVal+weaponDmgVal)*maxAttr*.0035);
                            if(skill.absolute){
                                skillScore += Math.ceil(skillScore*.7);
                            }
                            role.rankScoreDetail.dmgSkill += skillScore;
                            skillScore -= Math.floor(skill.consume*1.1);
                            res += skillScore;
                        }
                    }
                }
                else{ // 其他效果
                    let skillScore = Math.round(skill.trends[skill.trend]*.1);
                    role.rankScoreDetail.otherSkill += skillScore;
                    if(arrContains(skill.effects,11)!=-1&&(skill.trend==2||skill.trend==3)){ // 伤害和弱化
                        skillScore += skill.goodImpact*150;
                    }
                    else if(arrContains(skill.effects,10)!=-1&&(skill.trend==1||skill.trend==2)){ // 保护和强化
                        skillScore += skill.badImpact*150;
                    }
                    if(skill.absolute){
                        skillScore += Math.ceil(skillScore*.1);
                    }
                    skillScore -= Math.floor(skill.consume*.5);
                    res += skillScore;
                }
            }
        }
    }
    for(let skill of skillArr){
        role.rankScoreDetail.skill += Math.round(skill.price/500);
        res += role.rankScoreDetail.skill;
    }
    role.rankScoreDetail.dex = Math.round(res*role.fixdex/500);
    res += role.rankScoreDetail.dex;
    // 光环
    let halos = role.halos||[];
    let onHalo;
    for(let halo of halos){
        if(halo.on){
            onHalo = halo;
        }
    }
    if(onHalo){
        let haloScore = 45+onHalo.level*onHalo.level*onHalo.level*5;
        res += haloScore;
        role.rankScoreDetail.halo = haloScore;
    }
    return Math.ceil(res);
}
export function calcRankScorePurely(role){ // 单纯计算战力排行分数
    role.rankScoreDetail = {
        hp: 0,
        pow: 0,
        baseAttack: 0,
        imm: 0,
        weaponDmg: 0,
        weaponBuff: 0,
        skill: 0,
        dmgSkill: 0,
        otherSkill: 0,
        dex: 0,
    };
    role.rankScoreDetail.hp = Math.round(role.maxhp*.2);
    role.rankScoreDetail.pow = Math.round(role.maxpow*.4);
    role.rankScoreDetail.baseAttack = Math.round(role.baseAttack*2.5);
    role.rankScoreDetail.imm = Math.round(role.imm*.5);
    role.rankScoreDetail.halo = 0;
    let res = role.rankScoreDetail.hp+role.rankScoreDetail.pow+role.rankScoreDetail.baseAttack+role.rankScoreDetail.imm;
    // 武器
    let weapon = role.equipments.hands;
    let maxDmg = 0, maxAttackType = 2, weaponDmg = [];
    let maxAttr;
    if(weapon.name){
        let { dmg, buffLevels, consume, type, } = weapon;
        weaponDmg = dmg;
        // 求最大值和最大值索引
        for(let i=0;i<dmg.length;i++){
            let d = dmg[i];
            if(d>maxDmg){
                maxDmg = d;
                maxAttackType = i;
            }
        }
        let buffLevel = buffLevels[maxAttackType]; // 最高攻击类型对应的特效等级
        role.rankScoreDetail.weaponBuff += (buffLevel-1)*100;
        res += role.rankScoreDetail.weaponBuff;
    }
    maxAttr = maxAttackType<3?role.fixstr:role.fixacr;
    // console.log(role.name,maxDmg);
    role.rankScoreDetail.weaponDmg = Math.round(maxDmg*maxAttr*.035);
    res += role.rankScoreDetail.weaponDmg;
    // role.maxDmg = maxDmg;
    // 技能
    let skillArr = []
    for(let skill of role.skills){
        if(skill){
            skillArr.push(skill);
        }
    }
    skillArr = bulbsort(skillArr,'price',2);
    // if(role.isHero){
    //     console.log(skillArr);
    // }
    for(let i=0;i<4;i++){
        let skill = skillArr[i];
        if(skill){
            let { effects, target, dmg, price, cure, buffs, buffLevels, } = skill;
            for(let eff of effects){
                if(eff==1&&(skill.trend==2||skill.trend==3)){ // 伤害效果
                    for(let i=0;i<dmg.length;i++){
                        let skillDmgVal = dmg[i];
                        let weaponDmgVal = weaponDmg[i];
                        maxAttr = i<3?role.fixstr:role.fixacr;
                        if(skillDmgVal&&weaponDmgVal){
                            let skillScore = Math.round((skillDmgVal+weaponDmgVal)*maxAttr*.0035);
                            role.rankScoreDetail.dmgSkill += skillScore;
                            if(skill.absolute){
                                skillScore += Math.ceil(skillScore*.15);
                            }
                            skillScore -= Math.floor(skill.consume*.5);
                            res += skillScore;
                        }
                    }
                }
                else{ // 其他效果
                    let skillScore = Math.round(skill.trends[skill.trend]*.1);
                    role.rankScoreDetail.otherSkill += skillScore;
                    if(skill.absolute){
                        skillScore += Math.ceil(skillScore*.1);
                    }
                    skillScore -= Math.floor(skill.consume*.5);
                    res += skillScore;
                }
            }
        }
    }
    for(let skill of skillArr){
        role.rankScoreDetail.skill += Math.round(skill.price/500);
        res += role.rankScoreDetail.skill;
    }
    role.rankScoreDetail.dex = Math.round(res*role.fixdex/500);
    res += role.rankScoreDetail.dex;
    // 光环
    let halos = role.halos||[];
    let onHalo;
    for(let halo of halos){
        if(halo.on){
            onHalo = halo;
        }
    }
    if(onHalo){
        let haloScore = 45+onHalo.level*onHalo.level*onHalo.level*5;
        res += haloScore;
        role.rankScoreDetail.halo = haloScore;
    }
    return Math.ceil(res);
}
export function calcMemoryEffects(brain,{str,acr,dex}){ // 计算记忆块效果
    let res = {};
    let resstr = 0, resacr = 0, resdex = 0;
    for(let cell of brain){
        if(cell.type==1&&str){
            resstr += CONFIG.memoryStrMap[cell.level-1];
        }
        else if(cell.type==2&&acr){
            resacr += CONFIG.memoryAcrMap[cell.level-1];
        }
        else if(cell.type==3&&dex){
            resdex += CONFIG.memoryDexMap[cell.level-1];
        }
    }
    if(str){
        res.str = resstr;
    }
    if(acr){
        res.acr = resacr;
    }
    if(dex){
        res.dex = resdex;
    }
    return res;
}

export function genSkillTip(skill,showDetails){
    let res = '';
    let powSuffix = skill.powShift>=0?'提升':'降低';
    let attrSuffix = skill.attrShift>=0?'提升':'降低';
    let moveSuffix = skill.moveShift>=0?'提升':'降低';
    let awaSuffix = skill.awaShift>=0?'提升':'降低';
    let buffIds = skill.buffs;
    let buffSuffix = '';
    let dmgTypeCount = 0;
    let dmgTypeSuffix = '';
    let trendColor = '';
    for(let i=0;i<skill.dmg.length;i++){
        if(skill.dmg[i]>0){
            dmgTypeCount += 1;
        }
    }
    for(let i=0,j=0;i<skill.dmg.length;i++){
        if(skill.dmg[i]>0){
            if(showDetails){
                dmgTypeSuffix += skill.dmg[i];
            }
            dmgTypeSuffix += CONFIG.attackTypeNameMap[i];
            if(j<dmgTypeCount-1){
                dmgTypeSuffix += ' +';
                j++;
            }
        }
    }
    for(let i=0;i<buffIds.length;i++){
        let buffId = buffIds[i];
        let cbuff = getMatchList(CONFIG.buffs,[['id',buffId]])[0];
        if(cbuff){
            buffSuffix += `<span style="color:${cbuff.good?'SeaGreen':'FireBrick'}" title="${cbuff.desc}">${skill.buffLevels[i]}级`;
            buffSuffix += cbuff.name+'</span>';
            if(i<buffIds.length-1){
                buffSuffix += '+';
            }
        }
    }
    if(skill.target==1||skill.target==2||skill.target==3||skill.target==4){
        trendColor = 'SeaGreen';
    }
    else if(skill.target==5||skill.target==6||skill.target==7){
        trendColor = 'FireBrick';
    }
    res = `<span style="color:${trendColor}">${skill.absolute?'<span style="color:red" title="无视敌人存在感，必命中">[必]</span> ':''}对${(['我方单体','我方全体','我方随机单体','自己','敌方单体','敌方全体','敌方随机单体','敌我全体','任一单体'][skill.target-1])||'-'}</span>：`;
    for(let i=0;i<skill.effects.length;i++){
        let etype = skill.effects[i];
        let suffix;
        if(showDetails){
            suffix = [
                `<span style="color:FireBrick">造成 ${dmgTypeSuffix}伤害</span>`,
                `<span style="color:SeaGreen">${skill.cure}${skill.cureRate?('+'+skill.cureRate+'%'):''} 治疗</span>`,
                `<span style="color:FireBrick">${powSuffix} ${Math.abs(skill.powShift)} 意志</span>`,
                `${attrSuffix} 力量`,`${attrSuffix} 精准`,`${attrSuffix} 速度`,
                `<span style="color:${skill.moveShift<0?'FireBrick':'SeaGreen'}">${moveSuffix} ${parseFloat(Math.abs(skill.moveShift/100)).toFixed(0)}% 行动力</span>`,
                `<span style="color:${skill.awaShift>0?'FireBrick':'SeaGreen'}">${awaSuffix} ${parseFloat(Math.abs(skill.awaShift/100)).toFixed(0)}% 存在感</span>`,
                `${buffSuffix}`,
                `<span style="color:SeaGreen">解除 ${skill.badImpact}个负面状态</span>`,
                `<span style="color:FireBrick">解除 ${skill.goodImpact}个正面状态</span>`
            ][etype-1];
        }
        else{
            suffix = [
                `<span style="color:FireBrick">造成${dmgTypeSuffix}伤害</span>`,
                `<span style="color:SeaGreen">治疗</span>`,
                `<span style="color:FireBrick">${powSuffix}意志</span>`,
                `${attrSuffix}力量`,`${attrSuffix}精准`,`${attrSuffix}速度`,
                `<span style="color:${skill.moveShift<0?'FireBrick':'SeaGreen'}">${moveSuffix}行动力</span>`,
                `<span style="color:${skill.awaShift>0?'FireBrick':'SeaGreen'}">${awaSuffix}存在感</span>`,
                `${buffSuffix}`,
                `<span style="color:SeaGreen">解除 ${skill.badImpact}个负面状态</span>`,
                `<span style="color:FireBrick">解除 ${skill.goodImpact}个正面状态</span>`
            ][etype-1];
        }
        res += suffix+(i>=skill.effects.length-1?'':', ');
    }
    return res;
}
export function getImmExpRequire(imm){ // 根据当前状态抗性获得升级所需抗性经验
    return Math.round(Math.pow(imm,CONFIG.immExpLevelMap.factor)*CONFIG.immExpLevelMap.inc)+CONFIG.immExpLevelMap.base;
}

export function moneyFormat(money,dollar){ // 金币格式
    let res = '';
    let s_money = money+'';
    let arr_money = s_money.split('');
    if(money>9999){
        // let thousands = money%10000;
        // let majors = money - thousands;
        let thousandTreashold = arr_money.length-4;
        for(let i=0;i<arr_money.length;i++){
            let char = arr_money[i];
            if(i<thousandTreashold){
                res += `<b style="transform:scale(1.1) translate(-10%,-1%);display:inline-block;margin-right: 1px;text-decoration:underline;">${char}</b>`;
            }
            else{
                res += `${char}`;
            }
        }
    }
    else{
        res += s_money;
    }
    if(dollar){
        res += ` $`;
    }
    return res;
}

export function genSkill({level,dmg,bias,ownerType}){ // 生成技能
    /*
    dmg: 伤害表 [x,x,x,x,x,x,]
    bias: 属性倾向 ['str'|'acr']
    ownerType：拥有者类别 [0:非指定|1:NPC|2:野怪|3:BOSS]
    */
    let res;
    let rEffectIndex = flag =>{ // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        let res = 0;
        let r1 = r(1,100);
        if(flag&&flag==1){ // 增益可选效果 [2,7,8,9,10]
            if(r1<=17){ // 治疗
                res = 0;
            }
            else if(r1<=27){ // 影响存在感
                res = 2;
            }
            else{ // 状态
                res = 3;
            }
        }
        else if(flag&&flag==2){ // 减益可选效果 [1,3,7,8,9,11]
            if(r1<=20){ // 伤害
                res = 0;
            }
            else if(r1<=25){ // 调整意志
                res = 1;
            }
            else if(r1<=40){ // 影响存在感
                res = 3;
            }
            else{ // 状态
                res = 4;
            }
        }
        else{ // 通用可选效果 [1,2,3,7,8,9,10,11]
            if(r1<=20){ // 伤害
                res = 0;
            }
            else if(r1<=25){ // 意志
                res = 2;
            }
            else if(r1<=75){ // 状态
                res = 5;
            }
            else if(r1<=90){ // 治疗
                res = 1;
            }
            else{ // 影响存在感
                res = 4;
            }
        }
        return res;
    }
    let good = r(0,1);
    res = {
        target: r(1,9), // [1:我方单体|2:我方全体|3:我方随机单体|4:自己|5:敌方单体|6:敌方全体|7:敌方随机单体|8:敌我全体|9:任一单体]
        effects: [], // [1:伤害|2:治疗|3:调整意志|4:调整力量|5:调整精准|6:调整速度|7:调整行动力|8:调整存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
        dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
        cure: 0, // 治疗
        cureRate: 0, // 百分比治疗
        powShift: 0, // 改变意志
        attrShift: 0, // 改变基础属性
        awaShift: 0, // 改变存在感
        moveShift: 0, // 改变行动力
        buffs: [], // buff序号
        buffLevels: [], // buff等级(1-9)
        goodImpact: 1, // 解除正面状态数
        badImpact: 1, // 解除负面状态数
        fixawareness: 0, // 固有提升存在感
        absolute: 0, // 必中，无视对方存在感
        price: 0,
        level,
    }
    let effectCount = [1,1,1,1,1,1,2,2,3][r(0,8)];
    res.fixawareness = r(effectCount,effectCount*40)*100;
    let availableEffectArr = [1,2,3,7,8,9,10,11];
    let rEffectIndexFlag = 0;
    if(ownerType==3){ // boss
        if(good){ // 增益效果
            availableEffectArr = [2,7,8,9,10];
            rEffectIndexFlag = 1;
            res.badImpact = r(1,3);
        }
        else{ // 减益效果
            availableEffectArr = [1,3,7,8,9,11];
            rEffectIndexFlag = 2;
            res.goodImpact = r(2,3);
        }
        if(effectCount<2){
            effectCount = 2;
        }
    }
    for(let i=0;i<effectCount;i++){
        let effect = availableEffectArr[rEffectIndex(rEffectIndexFlag)];
        let i1 = 0;
        while(arrContains(res.effects,effect)!=-1&&i1<10000){
            effect = availableEffectArr[rEffectIndex(rEffectIndexFlag)];
            i1 += 1;
        }
        if(arrContains(res.effects,1)!=-1&&effect==2){

        }
        else if(arrContains(res.effects,2)!=-1&&effect==1){

        }
        else{
            addAnEffectOnSkill({skill:res,good,effect,level,dmg,ownerType});
        }
    }
    if(effectCount<3){ // 行动力为附加效果
        let r1 = r(0,99);
        if(r1<15){
            addAnEffectOnSkill({skill:res,good,effect:7,level,dmg,ownerType});
        }
    }
    if(res.awaShift>0){ // 提升存在感，必中
        res.absolute = 1;
    }
    if(arrContains(res.buffs,116)!=-1){ // 有锁定效果，必中
        res.absolute = 1;
    }
    if(res.dmg[3]>0){ // 有炮击伤害，必中
        res.absolute = 1;
    }
    if(res.fixawareness>CONFIG.maxAwareness){
        res.fixawareness = CONFIG.maxAwareness;
    }

    // 效果调整
    let strikingLevel = arrContains(res.buffs,116);
    if(strikingLevel!=-1&&res.awaShift<=0){ // 有‘锁定’效果，再添加‘提高存在感’效果
        res.awaShift = r(1000,10000);
        if(arrContains(res.effects,8)==-1){
            res.effects.push(8);
        }
    }
    let sneakLevel = arrContains(res.buffs,12);
    if(sneakLevel!=-1&&res.awaShift>=0){ // 有‘潜行’效果，再添加‘降低存在感’效果
        res.awaShift = -r(1000,10000);
        if(arrContains(res.effects,8)==-1){
            res.effects.push(8);
        }
    }

    // 计算价格，消耗，名字
    let trends = ai.getSkillTrends(res);
    let valueFact = Math.max(...trends);
    let goodTrend = 0, badTrend = 0;
    for(let i=0;i<trends.length;i++){
        let trend = trends[i];
        if(i<2){
            goodTrend += trend;
        }
        else{
            badTrend += trend;
        }
    }
    if(goodTrend>badTrend){ // 偏向于保护技能
        res.target = [1,2,3,4][r(0,3)];
        if(ownerType==3&&level>4&&arrContains(res.effects,10)==-1){ // boss技能解除负面状态
            res.effects.push(10);
        }
        if(ownerType==1&&r(1,100)<=level*4){ // NPC添加随机消除buff效果
            res.effects.push(10);
        }
    }
    else{ // 偏向于伤害技能
        res.target = [5,6,7][r(0,2)];
        if(ownerType==3&&level>4&&arrContains(res.effects,11)==-1){ // boss技能解除正面状态
            res.effects.push(11);
        }
        if(ownerType==3&&level>9&&arrContains(res.effects,1)==-1){ // 如果此boss技能没有对敌伤害，则添加伤害效果
            res.absolute = 0;
            addAnEffectOnSkill({skill:res,good,effect:1,level,dmg,ownerType});
        }
        if(ownerType==1&&r(1,100)<=level*4){ // NPC添加随机消除buff效果
            res.effects.push(11);
        }
    }

     // boss 技能调整
    if(ownerType==3){
        // 技能包含伤害
        if(arrContains(res.effects,1)!=-1){
            if(res.target==6){ // 全体伤害向下调整
                for(let i=0;i<res.dmg.length;i++){
                    res.dmg[i] -= Math.floor(res.dmg[i]*.4);
                }
            }
        }
    }

    // 如果技能包含buff，并且有倾向
    if((arrContains(res.effects,9)!=-1)&&bias){
        if((goodTrend>badTrend)){ // 技能倾向为保护或强化
            if(bias=='str'){ // 如果是力量型选手，调整保护状态为力量增强
                for(let bx=0;bx<res.buffs.length;bx++){
                    if(res.buffs[bx]==6){
                        res.buffs[bx] = 5;
                    }
                    else if(res.buffs[bx]==9){
                        res.buffs[bx] = 8;
                    }
                }
            }
            else if(bias=='acr'){ // 如果是精准型选手，调整保护状态为精准增强
                for(let bx=0;bx<res.buffs.length;bx++){
                    if(res.buffs[bx]==5){
                        res.buffs[bx] = 6;
                    }
                    else if(res.buffs[bx]==8){
                        res.buffs[bx] = 9;
                    }
                }
            }
        }
    }

    trends = ai.getSkillTrends(res); // 再进行一次倾向计算
    res.trends = trends;
    res.trend = ai.getSkillTrend(res,trends);
    let rt = r(1,100);
    if(rt<=10){
        if(rt<=2){
            res.target = 8;
        }
        else{
            res.target = 9;
        }
    }
    res.price = Math.ceil(ai.getSkillValue(res)*30);
    res.consume = (Math.floor(level/3))+r(1,Math.ceil(level/2))+Math.ceil(Math.sqrt(valueFact)*2);
    res.name = genSkillName(res);

    // 消耗调整
    if(res.target==2||res.target==6){ // 目标为阵营全体
        res.consume = Math.round(res.consume*2.4);
    }
    else if(res.target==1||res.target==5||res.target==9){ // 目标为指定单位
        res.consume = Math.round(res.consume*1.4);
    }

    return res;
}
export function genHideSkill(){ // 生产隐藏类型技能
    let level = r(20,200);
    let res = {
        target: 4,
        effects: [8],
        dmg: [0,0,0,0,0,0,],
        cure: 0,
        powShift: 0,
        attrShift: 0,
        awaShift: -level*50,
        moveShift: 0,
        buffs: [],
        buffLevels: [],
        fixawareness: 0,
        absolute: 0,
        price: 0,
        level: 1,
        trend: 0,
        consume: 5+Math.ceil(level/40),
        name: '隐藏',
    };
    res.trends = ai.getSkillTrends(res);
    res.trend = ai.getSkillTrend(res,res.trends);
    return res;
}
function addAnEffectOnSkill({skill,good,effect,level,dmg,ownerType}){ // 给技能添加一个效果种类
    skill.effects.push(effect);
    if(effect==1){ // 伤害
        let dmgLevel = level;
        skill.dmg = [rr(6,dmgLevel*18,dmgLevel*25),rr(6,dmgLevel*18,dmgLevel*25),rr(6,dmgLevel*18,dmgLevel*25),rr(6,dmgLevel*18,dmgLevel*25),rr(6,dmgLevel*18,dmgLevel*25),rr(6,dmgLevel*18,dmgLevel*25),];
        if(dmg){ // 适应武器的伤害类型
            for(let i=0;i<dmg.length;i++){ // 遍历武器类型
                let d = dmg[i];
                if(d>0&&skill.dmg[i]<=0){
                    if(ownerType==3){
                        skill.dmg[i] = r(dmgLevel*18,dmgLevel*25);
                    }
                    else{
                        skill.dmg[i] = rr(2,dmgLevel*18,dmgLevel*25);
                    }
                }
            }
        }
        let maxDmg = Math.max(...skill.dmg);
        if(maxDmg==0){
            skill.dmg[r(0,5)] = r(dmgLevel*20,dmgLevel*30);
        }
    }
    else if(effect==2){ // 治疗
        let levelOffset;
        if(ownerType==3){ // 如果技能拥有者是BOSS
            levelOffset = CONFIG.creepPowerMap[level-1];
            skill.cure = r(levelOffset*125,levelOffset*185);
        }
        else{
            levelOffset = level*level*2;
            skill.cure = r(levelOffset*13,levelOffset*18);
            if(r(0,100)<levelOffset){
                skill.cureRate = r(level*2,levelOffset+10)-1;
                if(skill.cureRate>99){
                    skill.cureRate = r(70,99);
                }
            }
        }
    }
    else if(effect==3){ // 意志
        if(ownerType!=2){ // 如果技能拥有者不是野怪，则强化意志影响的威力
            skill.powShift = -r(level*15,level*30);
        }
        else{
            skill.powShift = -r(level*5,level*10);
        }
    }
    else if(effect==7){ // 行动力调整
        if(ownerType==3){
            if(good){
                skill.moveShift = r(level*300,level*500);
            }
            else{
                skill.moveShift = -r(level*300,level*500);
            }
        }
        else{
            if(r(0,1)){
                skill.moveShift = r(-level*500,-200);
            }
            else{
                skill.moveShift = r(200,level*500);
            }
        }
        if(skill.moveShift>4000){
            skill.moveShift = 4000;
        }
        else if(skill.moveShift<-4000){
            skill.moveShift = -4000;
        }
    }
    else if(effect==8){ // 存在感调整
        if(ownerType==3){
            if(good){
                skill.awaShift = -r(level*2000,level*3000);
            }
            else{
                skill.awaShift = r(level*2000,level*3000);
            }
        }
        else{
            skill.awaShift = (r(0,1)?1:-1)*r(2000,level*3000);
        }
        if(skill.awaShift>10000){
            skill.awaShift = 10000;
        }
        else if(skill.awaShift<-10000){
            skill.awaShift = -10000;
        }
    }
    else if(effect==9){ // 添加状态
        let buffCount = [1,1,1,1,1,1,2,2,3][r(0,8)];
        let shuffleBuffs;
        if(ownerType==3){ // boss
            let goodBuffs = getMatchList(CONFIG.buffs,[['good',1]]);
            let badBuffs = getMatchList(CONFIG.buffs,[['good',0]]);
            if(level<=6){
                buffCount = [2,3,][r(0,1)];
            }
            else{
                buffCount = 3;
            }
            shuffleBuffs = shuffle(good?goodBuffs:badBuffs);
        }
        else{
            shuffleBuffs = shuffle(CONFIG.buffs);
        }
        for(let i=0;i<buffCount;i++){
            let buff = shuffleBuffs[i];
            let buffLevel = r(Math.ceil(level/2),level);
            if(buffLevel>9){
                buffLevel = 9;
            }
            skill.buffs.push(buff.id);
            skill.buffLevels.push(buffLevel);
        }
    }
    return skill;
}
export function genEquipment({level,equipType,bias,alite}){ // 生成装备
    let res;
    let levelOffset = level;
    let mix = {
        strOffset: 0,
        acrOffset: 0,
        dexOffset: 0,
        fixawareness: 0,
        hp: 0,
        pow: 0,
        name: '',
        type: 0, // 攻击类型[0:非武器|1:单体攻击|2:全体攻击]
        equipType, // 装备位置类型[1:头部|2:手持|3:副手持|4:上身|5:下身|6:脚部]
        level: levelOffset,
    };
    let weaponType;
    let attrFact1 = 0, attrFact2 = 0, attrFact3 = 0;
    let hpFact1 = 0, hpFact2 = 0, hpFact3 = 0;
    let powFact1 = 0, powFact2 = 0, powFact3 = 0;
    switch(equipType){
        case 0: // 头部
            attrFact1 = 3;
            attrFact2 = 3;
            attrFact3 = 5;
            hpFact1 = 5;
            hpFact2 = 4;
            hpFact3 = 5;
            powFact1 = 5;
            powFact2 = 6;
            powFact3 = 5;
            mix.fixawareness = r(-10,50)*50;
            mix.name = genHelmetName();
        break;
        case 1: // 手持
            attrFact1 = 1;
            attrFact2 = 25;
            attrFact3 = 1;
            mix.fixawareness = r(1,20)*250;
            mix.type = r(1,2);
            // 参考属性偏向，随机决定武器类型
            if(bias=='str'){
                weaponType = r(0,3);
            }
            else if(bias=='acr'){
                weaponType = r(4,7);
            }
            else{
                weaponType = r(0,7);
            }
            let { dmg, buffLevels, consume, } = this.genDmgsOfWeapon(levelOffset,weaponType,mix.type,1,0);
            mix.dmg = dmg;
            mix.buffLevels = buffLevels;
            mix.consume = consume;
            mix.name = genWeaponName(weaponType);
        break;
        case 2: // 身体
            attrFact1 = 3;
            attrFact2 = 5;
            attrFact3 = 5;
            hpFact1 = 1;
            hpFact2 = 5;
            hpFact3 = 10;
            powFact1 = 1;
            powFact2 = 8;
            powFact3 = 10;
            mix.fixawareness = r(-8,30)*250;
            mix.name = genArmorName();
        break;
        case 3: // 腿部
            attrFact1 = 3;
            attrFact2 = 3;
            attrFact3 = 5;
            hpFact1 = 2;
            hpFact2 = 8;
            hpFact3 = 5;
            powFact1 = 2;
            powFact2 = 10;
            powFact3 = 5;
            mix.fixawareness = r(-20,100)*50;
            mix.name = genPantsName();
        break;
        case 4: // 脚
            attrFact1 = 5;
            attrFact2 = 3;
            attrFact3 = 5;
            hpFact1 = 2;
            hpFact2 = 5;
            hpFact3 = 5;
            powFact1 = 2;
            powFact2 = 8;
            powFact3 = 5;
            mix.fixawareness = r(-10,30)*50;
            mix.name = genShoesName();
        break;
    }
    let lowpoint = levelOffset*(attrFact2-10); // 随机属性最小值
    if(lowpoint<1){
        lowpoint = 1;
    }
    if(mix.type!=2){ // 非全体攻击装备，则添加速度属性
        if(bias){
            let offsetRate = offsetRate/2;
            if(level>4){
                offsetRate = 1;
            }
            mix.dexOffset = Math.ceil(rr(offsetRate,lowpoint,levelOffset*attrFact2)*attrFact3*2/3)+r(1,8);
        }
        else{
            mix.dexOffset = Math.ceil(rr(attrFact1,lowpoint,levelOffset*attrFact2)*attrFact3/2)+r(1,4);
        }
    }
    if((mix.type==2&&level>=5)||mix.type!=2){ // 大于5级的全体攻击武器，或非全体攻击武器，则添加力量\精准属性
        if(bias){
            let offsetRate = 2;
            if(level>4){
                offsetRate = 1;
            }
            mix[`${bias}Offset`] = rr(offsetRate,lowpoint,levelOffset*attrFact2)*attrFact3;
        }
        else{
            mix.strOffset = rr(attrFact1,lowpoint,levelOffset*attrFact2)*attrFact3;
            mix.acrOffset = rr(attrFact1,lowpoint,levelOffset*attrFact2)*attrFact3;
        }
    }
    if(equipType!=1){ // 如果非武器
        // 生命值
        if(bias){
            let hpLevelOffset = levelOffset;
            if(level>5){
                hpLevelOffset = Math.round(hpLevelOffset*(1+(level-4)/5));
            }
            mix.hp = rr(hpFact1,levelOffset,hpLevelOffset*hpLevelOffset*hpFact2)*hpFact3;
        }
        else{
            mix.hp = rr(hpFact1,levelOffset,levelOffset*levelOffset*hpFact2)*hpFact3;
        }
        // 意志
        if(bias){
            let powLevelOffset = levelOffset;
            if(level>5){
                powLevelOffset = Math.round(powLevelOffset*(1+(level-4)/5));
            }
            mix.pow = rr(powFact1,powLevelOffset,powLevelOffset*powFact2)*powFact3;
        }
        else{
            mix.pow = rr(powFact1,levelOffset,levelOffset*powFact2)*powFact3;
        }
    }
    else{ // 如果是武器，则纠正与武器类型不匹配的属性
        if(weaponType<4){
            if(mix.acrOffset>0){
                mix.strOffset += mix.acrOffset;
                mix.acrOffset = 0;
            }
        }
        else{
            if(mix.strOffset>0){
                mix.acrOffset += mix.strOffset;
                mix.strOffset = 0;
            }
        }
    }
    res = {
        ...mix,
    }
    res.price = calcEquipPrice(res);
    return res;
}
export function genDmgsOfWeapon(level,weaponType,type,ownerType,stable){ // 根据武器类型和等级，生成武器对应的伤害、buff和消耗数组
    let mix = {
        dmg: [0,0,0,0,0,0,],
        buffLevels: [0,0,0,0,0,0,],
        consume: [0,0,0,0,0,0,],
    }
    let buffLevel = level;
    if(buffLevel>9){
        buffLevel = 9;
    }
    switch(weaponType){
        case 0: // 剑
            if(stable){
                mix.dmg = [r(9*level,10*level),r(9*level,10*level),0,0,0,0];
            }
            else{
                mix.dmg = [r(0,5*level),r(5*level,10*level),0,0,0,0];
            }
            mix.buffLevels = [r(1,buffLevel),r(1,buffLevel),0,0,0,0];
            // mix.consume = (type==2?[4,4,0,0,0,0]:[r(0,2),r(0,2),0,0,0,0,]);
        break;
        case 1: // 刀
            if(stable){
                mix.dmg = [r(8*level,9*level),r(8*level,9*level),r(8*level,9*level),0,0,0];
            }
            else{
                mix.dmg = [r(5*level,10*level),r(0,10*level),r(0,10*level),0,0,0];
            }
            mix.buffLevels = [r(1,buffLevel),r(1,buffLevel),r(1,buffLevel),0,0,0];
            // mix.consume = (type==2?[4,3,2,0,0,0]:[r(0,3),r(0,2),r(0,1),0,0,0,]);
        break;
        case 2: // 锤
            if(stable){
                mix.dmg = [0,0,r(12*level,14*level),0,0,0];
            }
            else{
                mix.dmg = [0,0,r(7*level,14*level),0,0,0];
            }
            mix.buffLevels = [0,0,r(1,buffLevel),0,0,0];
            // mix.consume = (type==2?[0,0,4,0,0,0]:[0,0,r(0,2),0,0,0,]);
        break;
        case 3: // 斧
            if(stable){
                mix.dmg = [r(9*level,10*level),0,r(9*level,10*level),0,0,0];
            }
            else{
                mix.dmg = [r(5*level,10*level),0,r(5*level,10*level),0,0,0];
            }
            mix.buffLevels = [r(1,buffLevel),0,r(1,buffLevel),0,0,0];
            // mix.consume = (type==2?[4,0,4,0,0,0]:[r(0,2),0,r(0,2),0,0,0,]);
        break;
        case 4: // 枪
            if(stable){
                mix.dmg = [0,0,0,r(9*level,10*level),r(9*level,11*level),0];
            }
            else{
                mix.dmg = [0,0,0,r(0,2*level),r(5*level,11*level),0];
            }
            mix.buffLevels = [0,0,0,r(1,buffLevel),r(1,buffLevel),0];
            // mix.consume = (type==2?[0,0,0,2,4,0]:[0,0,0,r(0,1),r(0,2),0]);
        break;
        case 5: // 炮
            if(stable){
                mix.dmg = [0,0,0,r(12*level,14*level),0,0];
            }
            else{
                mix.dmg = [0,0,0,r(7*level,14*level),0,0];
            }
            mix.buffLevels = [0,0,0,r(1,buffLevel),0,0];
            // mix.consume = (type==2?[0,0,0,4,0,0]:[0,0,0,r(0,2),0,0,]);
        break;
        case 6: // 弓
            if(stable){
                mix.dmg = [0,0,0,r(8*level,9*level),r(8*level,9*level),r(8*level,9*level)];
            }
            else{
                mix.dmg = [0,0,0,r(5*level,10*level),r(0*level,10*level),r(0,10*level)];
            }
            mix.buffLevels = [0,0,0,r(1,buffLevel),r(1,buffLevel),r(1,buffLevel)];
            // mix.consume = (type==2?[0,0,0,0,4,2]:[0,0,0,0,r(0,2),r(0,1),]);
        break;
        case 7: // 鞭
            if(stable){
                mix.dmg = [0,0,0,0,r(9*level,10*level),r(9*level,10*level)];
            }
            else{
                mix.dmg = [0,0,0,0,r(0,2*level),r(5*level,10*level)];
            }
            mix.buffLevels = [0,0,0,0,r(1,buffLevel),r(1,buffLevel)];
            // mix.consume = (type==2?[0,0,0,0,2,4]:[0,0,0,0,r(0,1),r(0,2),]);
        break;
    }

     // BOSS
    if(ownerType==3){
        if(type==2){
            for(let i=0;i<mix.dmg.length;i++){
                if(mix.dmg[i]>0){
                    mix.dmg[i] = Math.ceil(mix.dmg[i]*.5);
                }
            }
        }
    }
    else if(!stable){
        for(let i=0;i<mix.dmg.length;i++){
            if(mix.dmg[i]>0){
                mix.dmg[i] += r(level*2,level*4);
            }
        }
    }

    // 设置消耗
    let dmgIndexArr = [];
    for(let i=0;i<mix.dmg.length;i++){
        if(mix.dmg[i]>0){
            dmgIndexArr.push({
                type: i,
                value: mix.dmg[i],
            });
        }
    }
    if(type==2){ // 全攻击武器
        let startConsume = 4;
        dmgIndexArr = bulbsort(dmgIndexArr,'value');
        for(let i=0;i<dmgIndexArr.length;i++){
            let dmgObj = dmgIndexArr[i];
            mix.consume[dmgObj.type] = startConsume--;
        }
    }
    else{ // 单攻击武器
        let startConsume = r(0,1);
        dmgIndexArr = bulbsort(dmgIndexArr,'value',0);
        for(let i=0;i<dmgIndexArr.length;i++){
            let dmgObj = dmgIndexArr[i];
            mix.consume[dmgObj.type] = startConsume++;
        }
    }

    // if(level==1){
    //     console.log(type==2?'全':'单');
    //     console.log('武器伤害：',mix.dmg);
    //     console.log('武器伤害排序',dmgIndexArr);
    //     console.log('武器消耗',mix.consume);
    //     console.log(`========================`);
    // }
    return mix;
}
export function genRandomGrids(length){ // 生成随机连续格子
    let map = [{x:0,y:0}];
    for(let i=0;i<length-1;i++){
        let rGrid = map[r(0,map.length-1)];
        map.push(getRandomRoundGrid({map,x:rGrid.x,y:rGrid.y}));
    }
    return map;
}
export function getRandomRoundGrid({map,x,y,boundary,mainDir}){ // 在地图 map 中获取坐标（x,y）四周可用坐标中的随机一个
    let res;
    let roundPosArr = []; // 四周的坐标数组
    let availablePosArr = []; // 四周的空坐标数组
    let potentPos = [[0,-1],[-1,0],[1,0],[0,1],];
    for(let i=0;i<potentPos.length;i++){
        let pc = potentPos[i];
        let tx = x+pc[0], ty = y+pc[1];
        if(boundary){ // 如果有边界
            if(tx>=0&&tx<boundary&&ty>=0&&ty<boundary){
                roundPosArr.push({x:tx,y:ty});
            }
        }
        else{
            roundPosArr.push({x:tx,y:ty});
        }
    }
    // console.log(`四周的空坐标数组`,roundPosArr);
    let occupiedPosArr = []; // 已经被占据的坐标数组
    for(let pos of roundPosArr){ // 筛选已经被占据的坐标
        let grid = getMatchList(map,[['x',pos.x],['y',pos.y]])[0];
        if(grid){
            occupiedPosArr.push({x:pos.x,y:pos.y});
        }
    }
    // console.log(`筛选已经被占据的坐标`,occupiedPosArr);
    for(let pos of roundPosArr){ // 从四周坐标数组中过滤掉已经被占据的坐标
        let grid = getMatchList(occupiedPosArr,[['x',pos.x],['y',pos.y]])[0];
        if(!grid){
            availablePosArr.push({x:pos.x,y:pos.y});
        }
    }
    // console.log(`从四周坐标数组中过滤掉已经被占据的坐标`,availablePosArr);
    if(availablePosArr.length==0){ // 如果四周都没有空坐标，则选择一个已经被占据的坐标，并递归获取其四周随机一个可用坐标
        let randomOccupiedPos = occupiedPosArr[r(0,occupiedPosArr.length-1)];
        let newPos = getRandomRoundGrid({map,x:randomOccupiedPos.x,y:randomOccupiedPos.y,boundary});
        availablePosArr.push(newPos);
    }
    // console.log(`可用坐标数组`,availablePosArr);
    if(mainDir){ // 如果有优先方向倾向
        let trendX = x, trendY = y;
        switch(mainDir){
            case 1: trendX = x-1;break; // 左
            case 2: trendY = y-1;break; // 上
            case 3: trendX = x+1;break; // 右
            case 4: trendY = y+1;break; // 下
        }
        for(let pos of availablePosArr){
            if(pos.x==trendX&&pos.y==trendY){
                res = pos;
            }
        }
    }
    if(!res){
        res = availablePosArr[r(0,availablePosArr.length-1)];
    }
    return res;
};
