module.exports = {
	DEBUG: 0,
	CACHE: {
		save1: 'D1',
		save2: 'D2',
		save3: 'D3',
		preset: 'P',
	},
	CONFIG:{
        init:{
        },
		buffs: [
			{
				id: 1,
				name: '急救',
				desc: '根据生命损耗程度持续恢复生命',
				detail: '根据当前生命损耗程度持续恢复生命；当前生命越低，恢复速度越快。',
				style: 'LightPink',
				base: .18,
				lvlup: .09,
				good: 1,
				trend: 0, // [0:保护|1:强化|2:伤害|3:弱化]
				fixTime: 30000,
			},{
				id: 2,
				name: '自愈',
				desc: '持续恢复生命',
				detail: '根据生命上限的百分比持续恢复生命。',
				style: 'LightPink',
				base: .05,
				lvlup: .025,
				good: 1,
				trend: 0,
				fixTime: 30000,
			},{
				id: 3,
				name: '专注',
				desc: '减少使用技能消耗的意志',
				detail: '根据百分比减少使用技能消耗的意志。',
				style: 'RoyalBlue',
				base: .25,
				lvlup: .05,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 4,
				name: '护盾',
				desc: '减少受到的伤害',
				detail: '根据百分比减少受到的伤害；无法减少来自状态的伤害。',
				style: 'Yellow',
				base: .2,
				lvlup: .06,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 5,
				name: '强力',
				desc: '提升力量',
				detail: '根据固定数值提升力量。',
				style: 'FireBrick',
				base: 80,
				lvlup: 30,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 6,
				name: '高精',
				desc: '提升精准',
				detail: '根据固定数值提升精准。',
				style: 'MediumTurquoise',
				base: 80,
				lvlup: 30,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 7,
				name: '加速',
				desc: '提升速度',
				detail: '根据固定数值提升速度。',
				style: 'PaleGreen',
				base: 30,
				lvlup: 15,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 8,
				name: '爆筋',
				desc: '百分比提升力量',
				detail: '根据百分比提升力量。',
				style: 'FireBrick',
				base: .2,
				lvlup: .1,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 9,
				name: '清晰',
				desc: '百分比提升精准',
				detail: '根据百分比提升精准。',
				style: 'MediumTurquoise',
				base: .2,
				lvlup: .1,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 10,
				name: '迅捷',
				desc: '百分比提升速度',
				detail: '根据百分比提升速度。',
				style: 'PaleGreen',
				base: .15,
				lvlup: .04,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 11,
				name: '点燃',
				desc: '武器伤害提升',
				detail: '根据百分比提升武器伤害。',
				style: 'BlueViolet',
				base: .3,
				lvlup: .1,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 12,
				name: '潜行',
				desc: '行动后不提升存在感',
				detail: '【时效类】自身进行攻击、使用技能和切换武器不提升存在感；但每当受到伤害时，时效都会减少，伤害值越高减少的时效越多。',
				style: 'Orange',
				lvlup: 3000,
				good: 1,
				trend: 1,
				fixTime: 6000,
			},{
				id: 13,
				name: '反伤',
				desc: '对伤害来源造成反馈伤害',
				detail: '对攻击自己的敌人造成反馈伤害；对友方无效；对来自状态的伤害无效。',
				style: 'Yellow',
				base: .15,
				lvlup: .08,
				good: 1,
				trend: 0,
				fixTime: 30000,
			},{
				id: 14,
				name: '灵巧',
				desc: '以更高的起点增长行动力',
				detail: '每次行动结束后，行动力自动补充到固定数值X，并以此值为起点进行增长。1级时X为10%，每级提升5%。',
				style: 'PaleGreen',
				base: 1000,
				lvlup: 500,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 15,
				name: '嗜血',
				desc: '对敌人造成伤害后恢复自身生命',
				detail: '对敌人造成伤害后根据伤害的平方根倍率恢复自身生命；施与状态的伤害无法恢复；恢复的生命不会大于造成的伤害。',
				style: 'MediumVioletRed',
				base: 3,
				lvlup: 1.5,
				good: 1,
				trend: 0,
				fixTime: 30000,
			},{
				id: 16,
				name: '祝福',
				desc: '屏蔽低于或等于祝福等级的负面状态',
				detail: '不会获得新的高于祝福等级的负面状态。对已存在的负面状态无效。',
				style: 'Gold',
				base: 1,
				lvlup: 1,
				good: 1,
				trend: 0,
				fixTime: 30000,
			},{
				id: 17,
				name: '狂暴',
				desc: '行动力不会被控制，且受到攻击后会增长',
				detail: '行动力不会因攻击（钝击）效果和技能效果而下降，且受到攻击后会立即增长',
				style: 'PaleGreen',
				base: 1500,
				lvlup: 750,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 18,
				name: '不死',
				desc: '不会死亡',
				detail: '【时效类】生命不会低于 1；但每当受到伤害时，时效都会减少，伤害值越高减少的时效越多。',
				style: 'Yellow',
				lvlup: 3000,
				good: 1,
				trend: 0,
				fixTime: 6000,
			},{
				id: 19,
				name: '战气',
				desc: '对敌方造成伤害时能损耗其意志',
				detail: '对敌方造成伤害时能损耗其意志，损失的意志包括固定数值和意志上限的百分比。',
				style: 'MidnightBlue',
				base: 10,
				lvlup: 5,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 20,
				name: '慧心',
				desc: '为单次的意志损耗设置上限',
				detail: '无论用任何方式，单次意志的损耗值都不会超过上限X。1级时X为80，每级减少5。',
				style: 'RoyalBlue',
				base: 80,
				lvlup: -5,
				good: 1,
				trend: 1,
				fixTime: 30000,
			},{
				id: 101,
				name: '消极',
				desc: '持续损失意志',
				detail: '持续损失意志；损失的意志包括固定数值和意志上限的百分比',
				style: 'RoyalBlue',
				base: 25,
				lvlup: 20,
				good: 0,
				trend: 3,
				fixTime: 75000,
			},{
				id: 102,
				name: '出血',
				desc: '进行攻击会损失生命',
				detail: '进行攻击会损失生命；损失的生命包括固定数值和百分比数值。',
				style: 'Crimson',
				base: 100,
				lvlup: 50,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 103,
				name: '内伤',
				desc: '每次开始行动时都会损失生命',
				detail: '每次开始行动时都会按百分比和固定数值损失一次生命。',
				style: 'Crimson',
				base: 10,
				lvlup: 5,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 104,
				name: '破绽',
				desc: '受到的伤害提升',
				detail: '根据百分比提升受到的伤害。',
				style: 'SaddleBrown', // RoyalBlue
				base: .25,
				lvlup: .08,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 105,
				name: '晕眩',
				desc: '行动力停止增长',
				detail: '【时效类】行动力停止增长。',
				style: 'DarkKhaki',
				lvlup: 750,
				good: 0,
				trend: 3,
				fixTime: 2000,
			},{
				id: 106,
				name: '剧痛',
				desc: '武器伤害降低',
				detail: '根据百分比降低武器伤害。',
				style: 'OrangeRed',
				base: .3,
				lvlup: .08,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 107,
				name: '沉默',
				desc: '无法使用技能',
				detail: '【时效类】无法使用技能。',
				style: '#222',
				lvlup: 1500,
				good: 0,
				trend: 3,
				fixTime: 3000,
			},{
				id: 108,
				name: '弱力',
				desc: '降低力量',
				detail: '根据固定数值降低力量。',
				style: 'FireBrick',
				base: 80,
				lvlup: 30,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 109,
				name: '低精',
				desc: '降低精准',
				detail: '根据固定数值降低精准。',
				style: 'MediumTurquoise',
				base: 80,
				lvlup: 30,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 110,
				name: '减速',
				desc: '降低速度',
				detail: '根据固定数值降低速度。',
				style: 'PaleGreen',
				base: 30,
				lvlup: 15,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 111,
				name: '虚弱',
				desc: '百分比降低力量',
				detail: '根据百分比降低力量。',
				style: 'FireBrick',
				base: .2,
				lvlup: .1,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 112,
				name: '模糊',
				desc: '百分比降低精准',
				detail: '根据百分比降低精准。',
				style: 'MediumTurquoise',
				base: .2,
				lvlup: .1,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 113,
				name: '迟钝',
				desc: '百分比降低速度',
				detail: '根据百分比降低速度。',
				style: 'PaleGreen',
				base: .15,
				lvlup: .04,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 114,
				name: '干毒',
				desc: '持续损失生命',
				detail: '根据生命上限百分比和固定数值持续损失生命。',
				style: 'DarkOrchid',
				base: 10,
				lvlup: 5,
				good: 0,
				trend: 3,
				fixTime: 75000,
			},{
				id: 115,
				name: '湿毒',
				desc: '根据意志损耗程度持续损失生命',
				detail: '根据当前意志损耗程度百分比和固定数值持续损失生命。',
				style: 'DarkOrchid',
				base: 10,
				lvlup: 5,
				good: 0,
				trend: 3,
				fixTime: 75000,
			},{
				id: 116,
				name: '锁定',
				desc: '存在感不会降低',
				detail: '【时效类】无法通过使用技能和切换武器来降低存在感。',
				style: 'Yellow',
				lvlup: 5000,
				good: 0,
				trend: 3,
				fixTime: 10000,
			},{
				id: 117,
				name: '破财',
				desc: '受到伤害会损失金币',
				detail: '受到伤害会损失金币；如果作用在敌方，则当敌方受到伤害时我方能获得额外的金币；与 NPC 对战时无效。',
				style: 'Orange',
				base: .1,
				lvlup: .05,
				good: 0,
				trend: 3,
				fixTime: 30000,
			},{
				id: 118,
				name: '昏睡',
				desc: '行动力停止增长，但受到外界影响会解除',
				detail: '【时效类】行动力停止增长，一旦受到任何外力影响，或成为攻击和技能目标（即使未命中）会立刻解除。存在感影响和生命恢复效果除外。',
				style: 'DarkKhaki',
				lvlup: 5000,
				good: 0,
				trend: 3,
				fixTime: 10000,
			},{
				id: 119,
				name: '禁疗',
				desc: '无法恢复生命',
				detail: '【时效类】无法通过任何手段恢复生命。',
				style: 'LightPink',
				lvlup: 3000,
				good: 0,
				trend: 3,
				fixTime: 6000,
			},{
				id: 120,
				name: '灾厄',
				desc: '除灾厄以外的负面状态不会自然消退',
				detail: '【时效类】停止除灾厄以外的所有负面状态的自然消退。',
				style: '#222',
				lvlup: 750,
				good: 0,
				trend: 3,
				fixTime: 2000,
			},
		],
		battleSpeed: 25,
		enviorTimeIncrement: 50,
		standardStr: 5, // 力量校对值
		standardAcr: 5, // 精准校对值
		maxEnviorTime: 5000, // 环境时间最大值
		maxAwareness: 10000, // 存在感最大值
		maxMove: 10000, // 行动力最大值
		handsAttackDecay: 20, // 空手攻击伤害计算因素
		escapeTime: 15000, // 单个单位逃跑需要的时间
		laterMove: 7500, // 置后得到的行动力
		switchWeaponMove: 7500, // 切换武器后得到的行动力
		attackTypeNameMap: ['割锯','突刺','钝击','火炮','射击','抽击'],
		equipItemNameMap: ['head','hands','body','legs','foots',],
		observeValue: 1000, // 探查提供存在感增加值
		observeConsume: 1, // 探查消耗意志值
		escapeConsume: 1, // 逃跑消耗意志值
		switchConsume: 1, // 切换武器消耗意志值
		observeAwarenessIncrement: 1000, // 探查提升的存在感增量
		powRechargeTreshold: 5, // 集中的意志触发条件阈值
		powRechargeValue: 1, // 集中的意志补充值
		powDamageFromStab: [20,30,40,50,60,70,80,90,100,], // 抽击减少行意志值
		moveDamageFromPunch: [2000,3000,4000,5000,6000,7000,8000,9000,10000,], // 钝击攻击减少行动力值
		awarenessDamageFromFire: [1000,2000,3000,4000,5000,6000,7000,8000,9000,], // 炮击攻击增加存在感
		hpDamageFromShot: [1000,1300,1600,1900,2200,2500,2800,3100,3400],  // 射击攻击增加伤害（百分比）

		bonus: { // 额外奖励机制
			// move: 9000, // 死亡敌人行动力高于或等于此值时触发“破绽击杀奖励”
			// moveReward: 25, // 破绽击杀奖励提升额外奖励百分比
			// pow: 50, // 死亡敌人意志百分比低于或等于此值时触发“疲惫击杀奖励”
			// powReward: 50, // 疲惫击杀奖励提升额外奖励百分比
			move: 8950, // 死亡敌人行动力高于或等于此值时触发“破绽击杀奖励”
			moveReward: 20, // 破绽击杀奖励提升额外奖励百分比
			pow: 50, // 死亡敌人意志百分比低于或等于此值时触发“疲惫击杀奖励”
			powReward: 50, // 疲惫击杀奖励提升额外奖励百分比
			rampageReward: [10,20,30,40], // 全体击杀额外奖励百分比
		},
		immExpLevelMap:{ // 状态抗性经验等级分布
			base: 200,
			inc: 15,
			factor: 1.3,
		},
		humanMaxImm: 90, // 人类最大状态抗性
		maxSkillCountOnBattle: 6, // 战斗时可用的技能最大数

		maleHairTemplates: [{
			center: [504,302] ,
			outline:[[2,468,216,440,216],[2,426,220,404,222],[2,386,228,366,236],[2,334,260,322,274],[2,296,312,286,330],[2,278,366,274,382],[2,264,426,264,446],[2,258,486,260,516],[2,276,542,290,554],[2,322,576,336,590],[2,342,554,352,528],[2,358,494,380,460],[2,392,424,400,412],[2,426,388,444,394],[2,474,392,488,376],[2,530,374,550,380],[2,576,380,594,382],[2,628,392,642,410],[2,664,444,676,472],[2,682,498,686,530],[2,694,544,714,484],[2,720,462,722,426],[2,710,368,708,350],[2,678,296,672,278],[2,664,244,652,224],[2,634,214,610,206],[2,568,200,544,198],[2,504,200,484,202],[2,470,204,440,216]],
		}],
		/*maleHairTemplates: [{
			center: [526,260],
			outline: [[1,488,210],[1,380,130],[1,410,210],[1,328,192],[1,370,238],[1,270,246],[1,368,266],[1,244,330],[1,348,310],[1,324,370],[1,392,344],[1,396,394],[1,446,356],[1,456,368],[1,478,344],[1,482,370],[1,506,338],[1,524,370],[1,530,336],[1,550,342],[1,554,318],[1,574,350],[1,580,320],[1,606,336],[1,616,322],[1,632,354],[1,640,318],[1,676,364],[1,666,304],[1,712,320],[1,686,266],[1,754,270],[1,680,220],[1,734,182],[1,672,182],[1,668,128],[1,620,180],[1,650,98],[1,572,162],[1,542,94],[1,516,172],[1,478,114],[1,488,210]],
		},{
			center: [536,304],
			outline:[[1,510,216],[1,410,122],[1,302,128],[1,378,162],[1,408,222],[1,290,218],[1,180,244],[1,132,294],[1,216,292],[1,148,336],[1,86,406],[1,136,400],[1,246,344],[1,86,468],[1,78,530],[1,122,466],[1,190,442],[1,276,434],[1,212,502],[1,212,552],[1,238,588],[1,254,540],[1,292,494],[1,304,534],[1,312,576],[1,338,504],[1,354,440],[1,374,450],[1,390,404],[1,434,390],[1,412,448],[1,478,402],[1,528,394],[1,576,410],[1,586,452],[1,614,428],[1,628,476],[1,642,412],[1,670,482],[1,674,390],[1,730,522],[1,724,556],[1,710,592],[1,684,622],[1,738,594],[1,766,534],[1,760,440],[1,788,474],[1,786,504],[1,812,466],[1,792,412],[1,818,412],[1,802,364],[1,772,336],[1,790,334],[1,760,294],[1,824,304],[1,754,268],[1,774,234],[1,718,232],[1,712,184],[1,648,224],[1,648,140],[1,602,214],[1,580,126],[1,560,208],[1,520,114],[1,488,102],[1,442,86],[1,364,84],[1,428,104],[1,472,120],[1,480,152],[1,510,216]],
		},{
			center: [612,274],
			outline: [[0,492,248],[2,356,206,194,282],[2,322,264,424,290],[2,292,310,134,414],[2,312,352,438,354],[2,258,450,218,544],[2,358,468,444,426],[2,450,428,442,476],[2,460,454,474,420],[2,490,406,504,442],[2,514,430,522,386],[2,526,414,508,466],[2,534,426,536,394],[2,554,394,560,436],[2,574,418,570,380],[2,590,370,612,422],[2,628,378,630,358],[2,662,372,682,424],[2,680,374,686,360],[2,714,420,718,460],[2,726,386,726,384],[2,740,458,728,502],[2,780,434,782,382],[2,810,412,812,440],[2,784,370,792,352],[2,822,378,822,386],[2,826,358,826,334],[2,842,324,894,372],[2,866,282,806,250],[2,796,228,830,188],[2,772,208,754,228],[2,716,210,682,160],[2,678,204,662,220],[2,636,192,608,130],[2,594,166,580,208],[2,562,152,542,122],[2,538,200,518,222],[2,486,186,428,168],[2,444,200,488,244],],
		},{
			center: [586,308],
			outline:[[0,488,220],[2,424,132,304,120],[2,396,174,412,232],[2,332,208,204,200],[2,250,226,324,296],[2,226,298,116,354],[2,248,368,380,338],[2,284,390,146,450],[2,272,438,394,390],[2,352,420,254,506],[2,286,496,352,462],[2,356,492,350,556],[2,382,502,412,474],[2,416,520,410,580],[2,464,480,484,400],[2,486,412,488,470],[2,514,438,556,378],[2,554,404,552,442],[2,582,414,596,378],[2,610,396,610,458],[2,628,422,632,370],[2,650,392,656,438],[2,668,400,672,364],[2,696,406,690,454],[2,712,424,716,356],[2,732,408,724,476],[2,750,434,748,390],[2,774,480,788,550],[2,800,516,802,470],[2,806,544,804,592],[2,842,506,836,408],[2,836,382,850,418],[2,844,350,808,322],[2,812,278,862,308],[2,808,248,740,232],[2,718,220,766,190],[2,708,162,604,218],[2,596,174,620,106],[2,564,150,518,212],[2,504,160,466,114],[2,474,186,488,220]],
		},{
			center: [504,302] ,
			outline:[[2,468,216,440,216],[2,426,220,404,222],[2,386,228,366,236],[2,334,260,322,274],[2,296,312,286,330],[2,278,366,274,382],[2,264,426,264,446],[2,258,486,260,516],[2,276,542,290,554],[2,322,576,336,590],[2,342,554,352,528],[2,358,494,380,460],[2,392,424,400,412],[2,426,388,444,394],[2,474,392,488,376],[2,530,374,550,380],[2,576,380,594,382],[2,628,392,642,410],[2,664,444,676,472],[2,682,498,686,530],[2,694,544,714,484],[2,720,462,722,426],[2,710,368,708,350],[2,678,296,672,278],[2,664,244,652,224],[2,634,214,610,206],[2,568,200,544,198],[2,504,200,484,202],[2,470,204,440,216]],
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},{
			center: ,
			outline:,
		},],*/
    }
}

















//
