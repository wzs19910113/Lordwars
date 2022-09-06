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
		/* 战斗 */
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
		observeValue: 1000, // 追踪提供存在感增加值
		observeConsume: 1, // 追踪消耗意志值
		escapeConsume: 1, // 逃跑消耗意志值
		switchConsume: 1, // 切换武器消耗意志值
		observeAwarenessIncrement: 1000, // 追踪提升的存在感增量
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

		/* 职位 */
		jobs: [
			{
				id: 1, name: '会长', //【智力】提高所有策略师策划方案的强度，【经验】提高所有管辖区域的收入，【综合战力】提高所有管辖区域的武力加成（1个）
				press: 100, // 担任此职位获得的压力
				authRange: [9,9], // 权利级别范围
			},
			{
				id: 2, name: '副会长', //【智力】提高所有策略师策划方案的强度，【经验】提高所有管辖区域的收入，【综合战力】提高所有管辖区域的武力加成（0-1个）
				press: 80,
				authRange: [8,8],
			},
			{
				id: 3, name: '秘书', //【经验】提高会长和副会长的工作效率（0-2个）
				press: 80,
				authRange: [3,7],
			},
			{
				id: 4, name: '护卫长官', //【综合战力】提高会长和副会长的武力加成（0-2个）
				press: 80,
				authRange: [3,7],
			},
			// 文员
			{
				id: 11, name: '执行官', //【智力】提高所有策略师策划方案的强度，【经验】提高所有管辖区域的收入（0-1个）
				press: 90,
				authRange: [7,7],
			},
			{
				id: 12, name: '总策略师', //【智力】策划方案，【智力】提高所有策略师策划方案的强度（0-1个）
				press: 80,
				authRange: [6,6],
			},
			{
				id: 13, name: '策略师', //【智力】策划方案（0-5个）
				press: 70,
				authRange: [3,5],
			},
			{
				id: 14, name: '区域总管', //【经验】文职工作，【经验】提高管辖区域的收入（每个区域 0-1 个）
				press: 70,
				authRange: [3,5],
			},
			{
				id: 15, name: '文员', //【经验】文职工作（无数个）
				press: 50,
				authRange: [1,1],
			},
			// 武装
			{
				id: 31, name: '总武领', //【综合战力】提高所有管辖区域的武力加成（1个）
				press: 90,
				authRange: [6,7],
			},
			{
				id: 32, name: '武领', //【综合战力】提高所在管辖区域的武力加成（无数个）
				press: 70,
				authRange: [2,2],
			},
			{
				id: 33, name: '打手', //（无数个）
				press: 50,
				authRange: [1,1],
			},
		],

		/* 指令 */
		order: [
			{
				id: 1, name: '无所事事',
				strikingRange: [0,0], // 执行此任务会影响的地图存在感范围
			},

			// 文职
			{
				id: 11, name: '文职工作',
				strikingRange: [0,10,],
			},
			{
				id: 12, name: '贸易工作',
				strikingRange: [0,50,],
			},
			{
				id: 13, name: '制定方案',
				strikingRange: [0,10,],
			},
			{
				id: 14, name: '辅佐某人',
				strikingRange: [0,0,],
			},
			{
				id: 15, name: '招募某人',
				strikingRange: [0,10,],
			},
			{
				id: 16, name: '离间某两人',
				strikingRange: [0,50,],
			},
			{
				id: 17, name: '诋毁某人',
				strikingRange: [50,100,],
			},
			{
				id: 18, name: '赞美某人',
				strikingRange: [0,100,],
			},

			// 战斗
			{
				id: 31, name: '守卫区域',
				strikingRange: [0,100,],
			},
			{
				id: 32, name: '保护某人',
				strikingRange: [0,100,],
			},
			{
				id: 33, name: '进攻区域',
				strikingRange: [0,100,],
			},
			{
				id: 34, name: '攻击某人',
				strikingRange: [0,100,],
			},
			{
				id: 35, name: '追杀某人',
				strikingRange: [0,100,],
			},
			{
				id: 36, name: '避险',
				strikingRange: [0,0,],
			},

			// 其他
			{
				id: 51, name: '搜寻某人',
				strikingRange: [0,10,],
			},
			{
				id: 52, name: '亲近某人',
				strikingRange: [0,10,],
			},
			{
				id: 53, name: '掠夺某人',
				strikingRange: [0,100,],
			},
			{
				id: 54, name: '强暴某人',
				strikingRange: [0,100,],
			},
			{
				id: 55, name: '教授某人',
				strikingRange: [0,100,],
			},
			{
				id: 56, name: '学习某人',
				strikingRange: [0,100,],
			},
		],

    }
}

















/*
person:{
	id: 1,
	name: '阿奇',
	age: 20,
	gender: 1, // [1:男|2:女]

	avatarData, // 头像数据

	personalities: [10,20,30,40,50,], // 性格五维（0-100）
	// ['野心','无欲'],
	// ['邪恶','善良'],
	// ['自卑','自信'],
	// ['鲁莽','冷静'],
	// ['沉闷','开朗'],

	abilities: [222,444,222,180,30], // 能力五维（>0） [力量，精准，速度，智力，经验]
	hp: 200,
	pow: 100,
	imm: 22, // 状态抗性
	baseAttack: 8, // 基础攻击力
	fixawareness: 1300, // 固有存在感（0-10000）
	weaponID: 1, // 武器 ID
	viceWeaponID: 0, // 副手武器 ID
	skillIDs: [1,], // 技能 ID 数组

	passed: false, // 已辞世
	clubID: 4, // 所属公会 ID（0：无公会）
	impaction: [0,0], // 社会影响力 [正面影响，负面影响]
	press: 0, // 压力百分比（0-无限）
	strikingLevel: 50, // 地图存在感百分比（0-100）

	mapID: 12, // 当前所在地图 ID
	cellID: 33, // 当前所在格子 ID

	job: {
		cover: [1,4,10,], // 担任职位 ID 数组
		authLevel: 0, // 权利级别（0-9,0:无权利）
		mapID: 12, // 工作所属地图
	},

	relations: [ // 与其他角色的关系
		{
			id: 144, // 对应人物 ID
			values: [220,150,481,-338], // [亲密度(0,无限),喜爱度(0,无限),怨恨度(0,无限) ,信任度(-无限,无限)]
			type: [1,7,], // 关系类型 [0:朋友|1:情侣|2:夫妻|3:我是父母|4:我是子女|5:同胞|6:其他家人|7:死敌]
			memories: ['于2500年7月结仇','于2500年9月战斗，失败',], // 对此人的记忆
		},
	],

	privateOrders: [ // 个人行动指令数组
		{
			id: 0,
		},
	],

	publicOrders: [ // 公开行动指令数组
		{

		},
	],
}

weapon: {
 	id: 1,
	name: '铁剑',
	dmg: [12,11,3,0,0,0,], // [0:割据|1:突刺|2:钝击|3:炮火|4:射击|5:抽击]
	buffLevels: [1,2,1,0,0,0] // 攻击对应buff等级
	consume: [4,3,2,0,0,0],
	type: 2, // [1:攻击单人|2:攻击全体]
	fixawareness: 4000,
}

skill:{
	id: 1,
	name: '躲避',
	target: 4, // [1:我方单体|2:我方全体|4:自己|5:敌方单体|6:敌方全体]
	effects: [8], // [1:伤害|2:治疗|3:改变意志|7:改变行动力|8:改变存在感|9:添加状态|10:解除负面状态|11:解除正面状态]
	dmg: [0,0,0,0,0,0,], // [0:割锯|1:突刺|2:钝击|3:火炮|4:射击|5:抽击]
	cure: 0, // 固定治疗
	cureRate: 0, // 比率治疗
	powShift: 0, // 改变意志
	attrShift: 0, // 改变基础属性
	awaShift: -4000, // 改变存在感
	moveShift: 0, // 改变行动力
	buffs: [], // buff序号
	buffLevels: [], // buff等级(1-9)
	consume: 7, // 意志消耗
	fixawareness: 0,
	absolute: 0, // 必中，无视对方存在感
}

*/






























//
