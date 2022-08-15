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

		generalForeHairTemplates: [{
			name: 'gugu',
			center: [500,197],
			outline: [[0,500,188],[2,440,176,376,200],[2,328,220,332,248],[2,268,304,296,352],[2,244,420,284,432],[2,236,504,292,516],[2,256,608,300,628],[2,316,640,332,676],[2,360,624,352,608],[2,396,604,360,512],[2,384,472,388,384],[2,408,408,408,340],[2,432,360,432,328],[2,484,352,500,316],[0,500,188],[2,560,176,624,200],[2,676,220,668,272],[2,732,304,708,372],[2,760,420,716,460],[2,764,504,704,536],[2,744,608,680,672],[2,684,640,676,636],[2,644,624,660,588],[2,604,604,624,544],[2,616,472,620,380],[2,592,408,592,340],[2,568,360,564,328],[2,520,352,500,316]]
		}],
		maleForeHairTemplates: [],
		femaleForeHairTemplates: [],

		generalBangsTemplates: [
			{
				name: '齐刘海',
				center: [502,250],
				outline: [[0,500,240],[2,442,250,396,292],[2,380,328,376,388],[1,414,382],[1,426,332],[1,418,382],[1,444,378],[1,454,318],[1,448,378],[1,472,372],[1,476,318],[1,474,374],[1,498,374],[1,502,316],[0,500,240],[2,558,250,604,292],[2,620,328,624,388],[1,586,382],[1,574,332],[1,582,382],[1,556,378],[1,544,318],[1,548,378],[1,528,372],[1,520,318],[1,524,374],[1,502,374],[1,502,322]]
			},
			{
				name: '空气刘海',
				center: [500,185],
				outline:[[0,374,264],[2,364,328,378,384],[0,386,260],[2,378,300,390,376],[0,400,264],[2,394,304,402,370],[0,408,260],[2,402,300,408,368],[0,424,260],[2,418,298,424,352],[0,414,260],[2,412,298,414,358],[0,430,260],[2,426,300,428,332],[0,434,264],[2,428,286,434,332],[0,440,260],[2,436,284,440,328],[0,448,258],[2,440,286,444,332],[0,454,256],[2,444,286,450,322],[0,454,256],[2,454,282,454,322],[0,462,256],[2,454,280,460,318],[0,468,256],[2,462,272,468,324],[0,476,250],[2,468,274,472,324],[0,480,250],[2,474,282,478,324],[0,486,244],[2,480,274,484,318],[0,492,252],[2,486,274,488,308],[0,494,244],[2,490,274,494,310],[0,496,244],[2,494,270,496,296],[0,500,216],[0,624,264],[2,634,328,620,384],[0,612,260],[2,620,300,610,376],[0,600,264],[2,606,304,598,370],[0,592,260],[2,598,300,592,368],[0,576,260],[2,582,298,576,352],[0,584,260],[2,588,298,584,358],[0,570,260],[2,574,300,570,332],[0,564,264],[2,570,286,564,332],[0,560,260],[2,564,284,560,328],[0,552,258],[2,560,286,554,332],[0,546,256],[2,554,286,550,322],[0,544,256],[2,546,282,544,322],[0,536,256],[2,544,280,540,318],[0,532,256],[2,538,272,532,324],[0,524,250],[2,532,274,528,324],[0,520,250],[2,524,282,522,324],[0,512,244],[2,520,274,514,318],[0,508,252],[2,512,274,512,308],[0,504,244],[2,510,274,506,310],[0,504,244],[2,506,270,504,296],[0,500,216]]
			},
			{
				name: '三七',
				center: [500,330],
				outline:[[0,406,394],[2,348,426,358,462],[2,370,482,346,504],[2,448,494,528,416],[2,514,444,470,478],[2,524,458,554,418],[2,550,454,648,494],[2,670,440,618,394]]
			},
		],
		maleBangsTemplates: [],
		femaleBangsTemplates: [],

		generalBackHairTemplates: [{
			name: '泥石流',
			center: [500,308],
			outline: [[0,502,368],[2,446,386,414,440],[2,394,514,388,576],[2,388,622,386,690],[2,380,728,364,758],[2,320,816,282,852],[2,258,890,264,922],[2,290,934,372,936],[2,432,938,478,938],[2,502,938,498,932],[0,498,366],[2,554,386,586,440],[2,606,514,612,576],[2,612,622,614,690],[2,620,728,636,758],[2,680,816,718,852],[2,742,890,736,922],[2,710,934,628,936],[2,568,938,522,938],[2,498,938,498,932],[0,502,368]]
		},{
			name: '瀑布',
			center: [500,308],
			outline: [[0,500,340],[2,422,350,408,368],[2,358,552,342,914],[2,456,922,500,914],[0,500,340],[2,578,350,592,368],[2,642,552,658,914],[2,544,922,500,914]]
		},{
			name: '高弯双马尾',
			center: [500,288],
			outline:[[0,404,286],[2,380,266,352,276],[2,330,312,340,346],[2,358,360,384,356],[2,414,322,402,284],[0,340,346],[2,268,408,228,518],[2,196,624,236,756],[2,260,828,258,894],[2,312,790,292,714],[2,304,812,292,866],[2,348,774,346,708],[2,338,786,328,820],[2,378,772,384,690],[2,378,638,336,590],[2,298,526,310,478],[2,334,392,364,356],[0,500,348],[0,594,286],[2,620,266,648,276],[2,670,312,660,346],[2,642,360,614,356],[2,586,322,598,284],[0,660,346],[2,732,408,772,518],[2,804,624,764,756],[2,740,828,742,894],[2,688,790,708,714],[2,694,812,708,866],[2,652,774,654,708],[2,662,786,672,820],[2,622,772,616,690],[2,622,638,664,590],[2,702,526,690,478],[2,666,392,636,356],[0,500,348]]
		},{
			name: '低弯双马尾',
			center: [500,142],
			outline:[[0,384,132],[2,356,96,324,116],[2,296,176,308,236],[2,332,260,360,252],[2,396,192,384,128],[0,308,236],[2,224,344,176,532],[2,136,716,184,944],[2,212,1068,212,1180],[2,276,1004,252,872],[2,264,1040,252,1136],[2,320,972,316,860],[2,308,996,296,1052],[2,356,972,360,828],[2,356,740,304,656],[2,260,548,272,464],[2,300,312,336,252],[0,500,240],[0,612,132],[2,644,96,680,116],[2,704,176,692,236],[2,672,260,636,252],[2,604,192,620,128],[0,692,236],[2,780,344,828,532],[2,864,716,816,944],[2,788,1068,792,1180],[2,728,1004,752,872],[2,732,1040,752,1136],[2,684,972,684,860],[2,696,996,708,1052],[2,648,972,640,828],[2,648,740,696,656],[2,744,548,728,464],[2,700,312,664,252],[0,500,240]]
		},],
		maleBackHairTemplates: [],
		femaleBackHairTemplates: [],
		/*hairTemplates: [{
			center: [502,254],
			outline:[[0,500,240],[2,430,250,376,292],[2,356,328,352,388],[1,396,382],[1,412,332],[1,402,382],[1,432,378],[1,446,318],[1,440,378],[1,466,372],[1,474,318],[1,470,374],[1,498,374],[1,502,316],[0,500,240],[2,570,250,624,292],[2,644,328,648,388],[1,604,382],[1,588,332],[1,598,382],[1,568,378],[1,554,318],[1,560,378],[1,534,372],[1,526,318],[1,530,374],[1,502,374],[1,498,316]]
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
