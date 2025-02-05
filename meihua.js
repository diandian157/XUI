'use strict';
decadeModule.import(function(lib, game, ui, get, ai, _status) {
	lib.translate.zhangba_skill = '丈八';

	// AI随机名称
	lib.skill._AIname = {
		charlotte: true,
		ruleSkill: true,
		trigger: {
			global: 'gameStart'
		},
		forced: true,
		priority: 1145141919810,
		content() {
			// 初始化时设置名称
			const setPlayerName = (player) => {
				if (!player || !player.node || !player.node.nameol) return;

				player.node.nameol.style.display = 'none';

				if (player == game.me) {
					const nickname = get.connectNickname() || '无名玩家';
					player.node.nameol.innerHTML =
						'<span style="color:#9932CC;font-family:kaiti;font-size:15px;padding:2px 12px;backdrop-filter:blur(53px);text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;">' +
						nickname + '</span>';
				} else {
					const randomNum = get.rand(1000000, 9999999);
					player.node.nameol.innerHTML =
						'<span style="color:#9932CC;font-family:kaiti;font-size:15px;padding:2px 12px;backdrop-filter:blur(53px);text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;">小杀-' +
						randomNum + '</span>';
				}

				player.addEventListener('mouseenter', function() {
					this.node.nameol.style.display = '';
				});
				player.addEventListener('mouseleave', function() {
					this.node.nameol.style.display = 'none';
				});
			};

			// 为所有现有玩家设置名称
			game.players.forEach(player => setPlayerName(player));

			// 监听新玩家加入
			lib.element.player.$init = (function(origin) {
				return function() {
					origin.apply(this, arguments);
					setPlayerName(this);
				}
			})(lib.element.player.$init);

			// 处理换座位
			var originSwapSeat = game.swapSeat;
			game.swapSeat = function(player1, player2, prompt, behind, noanimate) {
				originSwapSeat.apply(this, arguments);
				setPlayerName(player1);
				setPlayerName(player2);
			};
		},
	};

	//神势力选择
	lib.skill._group = {
		charlotte: true,
		ruleSkill: true,
		trigger: {
			global: 'gameStart',
			player: 'enterGame',
		},
		forced: true,
		popup: false,
		silent: true,
		priority: 520,
		firstDo: true,
		direct: true,
		filter: function(event, player) {
			// 检查是否有特定技能和状态
			if (player.hasSkill('mbjsrgxiezheng') && !player.storage.mbjsrgxiezheng_level2)
				return false;
			// 检查游戏模式
			if (!['doudizhu', 'versus'].includes(get.mode())) return false;
			// 检查角色类型
			if (lib.character[player.name1][1] === 'shen') return true;
			// 检查是否为双势力角色
			return lib.character[player.name1][4].some(group => group.includes('doublegroup'));
		},
		content: function() {
			'step 0'
			const name = player.name1;
			let options;

			// 根据角色类型选择势力
			if (get.is.double(name)) {
				options = get.is.double(name, true);
				player.chooseControl(options).set('prompt', '请选择你的势力');
			} else if (lib.character[name][1] === 'shen') {
				options = lib.group.filter(group => group !== 'shen');
				player.chooseControl(options).set('prompt', '请选择神武将的势力');
			}

			'step 1'
			if (result.control) {
				player.changeGroup(result.control);
			}
		}
	};
	
	//全选按钮
	lib.hooks.checkBegin.add("cardqx", () => {
		const event = get.event();
		if (event.selectCard && event.selectCard[1] > 1 && !ui.cardqx) {
			ui.cardqx = ui.create.control("全选", function() {
				ai.basic.chooseCard((card) => get.position(card) == "h" ? 114514 : 0);
				if (_status.event.custom?.add.card) _status.event.custom.add.card();
				ui.selected.cards.forEach(card => card.updateTransform(true));
			});
		} else if (!event.selectCard || event.selectCard[1] <= 1) {
			ui.cardqx?.remove();
			delete ui.cardqx;
		}
	});
	lib.hooks.uncheckBegin.add("cardqx", () => {
		if (get.event().result?.bool) {
			ui.cardqx?.remove();
			delete ui.cardqx;
		}
	});

	// 伤害恢复优化
	window._WJMHHUIFUSHUZITEXIAO = {
		shuzi2: {
			name: "../../../十周年UI/assets/animation/globaltexiao/huifushuzi/shuzi2",
		},
	};
	lib.skill._wjmh_huifushuzi_ = {
		priority: 10,
		forced: true,
		trigger: {
			player: 'recoverBegin',
		},
		filter: function(event) {
			return event.num > 0 && event.num <= 9;
		},
		content: function() {
			const action = trigger.num.toString(); // 直接使用数字作为动作
			if (action) {
				dcdAnim.loadSpine(window._WJMHHUIFUSHUZITEXIAO.shuzi2.name, "skel", function() {
					dcdAnim.playSpine(window._WJMHHUIFUSHUZITEXIAO.shuzi2, {
						speed: 0.6,
						scale: 0.5,
						parent: player,
					});
				});
			}
		},
	};
	window._WJMHXUNISHUZITEXIAO = {
		SS_PaiJu_xunishanghai: {
			name: "../../../十周年UI/assets/animation/globaltexiao/xunishuzi/SS_PaiJu_xunishanghai",
		},
	};
	lib.skill._wjmh_xunishuzi_ = {
		priority: 10,
		forced: true,
		trigger: {
			player: 'damage',
		},
		filter: function(event) {
			return event.unreal && event.num > 0 && event.num <= 9;
		},
		content: function() {
			const action = trigger.num <= 9 ? `play${trigger.num}` : null; // 动作名称
			if (action) {
				dcdAnim.loadSpine(window._WJMHXUNISHUZITEXIAO.SS_PaiJu_xunishanghai.name, "skel",
					function() {
						dcdAnim.playSpine(window._WJMHXUNISHUZITEXIAO.SS_PaiJu_xunishanghai, {
							speed: 0.6,
							scale: 0.5,
							parent: player,
						});
					});
			}
		},
	};
	window._WJMHSHANGHAISHUZITEXIAO = {
		shuzi: {
			name: "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi",
		},
	};
	lib.skill._wjmh_shanghaishuzi_ = {
		priority: 210,
		forced: true,
		trigger: {
			player: 'damageBegin4',
		},
		filter: function(event) {
			return event.num > 1 && event.num <= 9;
		},
		content: function() {
			const action = trigger.num.toString(); // 直接使用数字作为动作
			const anim = lib.config.extension_十周年UI_shanghaishuzitexiao === "shizhounian" ?
				"SZN_shuzi" : "shuzi";
			if (action) {
				dcdAnim.loadSpine(window._WJMHSHANGHAISHUZITEXIAO[anim].name, "skel", function() {
					dcdAnim.playSpine(window._WJMHSHANGHAISHUZITEXIAO[anim], {
						speed: 0.6,
						scale: 0.5,
						parent: player,
					});
				});
			}
		},
	};

	// 局内交互优化
	lib.skill._useCardAudio = {
		trigger: {
			player: 'useCard'
		},
		forced: true,
		popup: false,
		priority: -10,
		content: function() {
			const card = trigger.card;
			const cardType = get.type(card);
			const cardName = get.name(card);
			const cardNature = get.nature(card);

			const playAudio = (audio) => game.playAudio('..', 'extension', '十周年UI', audio);

			if (cardType === 'basic') {
				if (cardName === 'sha' && (cardNature === 'fire' || cardNature === 'thunder')) {
					playAudio('GameShowCard');
				} else {
					playAudio('GameShowCard');
				}
			} else if (cardType === 'trick') {
				if (get.tag(card, 'damage') || get.tag(card, 'recover')) {
					playAudio('GameShowCard');
				}
			} else if (cardType === 'equip') {
				const equipType = get.subtype(card);
				const audioMap = {
					'equip1': 'weapon_equip',
					'equip2': 'horse_equip',
					'equip3': 'armor_equip',
					'equip4': 'armor_equip',
					'equip5': 'horse_equip'
				};
				playAudio(audioMap[equipType] || 'GameShowCard');
			}
		}
	};
	if (!_status.connectMode) {
		game.addGlobalSkill('_useCardAudio');
	}
	lib.skill._phaseStartAudio = {
		trigger: {
			player: 'phaseBegin'
		},
		forced: true,
		popup: false,
		priority: -10,
		content: function() {
			if (player === game.me) {
				game.playAudio('..', 'extension', '十周年UI', 'audio/seatRoundState_start');
			}
		}
	};
	if (!_status.connectMode) {
		game.addGlobalSkill('_phaseStartAudio');
	}
	// 处理按钮点击音效
	document.body.addEventListener('mousedown', function(e) {
		const target = e.target;
		if (target.closest('#dui-controls')) {
			if (target.classList.contains('control') || target.parentElement.classList.contains(
					'control')) {
				game.playAudio('..', 'extension', '十周年UI', 'audio/BtnSure');
			}
		}
		if (target.classList.contains('menubutton') || target.classList.contains('button')) {
			game.playAudio('..', 'extension', '十周年UI', 'audio/card_click');
		}
		if (target.classList.contains('card')) {
			game.playAudio('..', 'extension', '十周年UI', 'audio/card_click');
		}
	});
	// 处理按钮缩放效果
	document.body.addEventListener('mousedown', function(e) {
		const control = e.target.closest('.control');
		if (control && !control.classList.contains('disabled')) {
			control.style.transform = 'scale(0.95)';
			control.style.filter = 'brightness(0.9)';
			setTimeout(() => {
				control.style.transform = '';
				control.style.filter = '';
			}, 100);
		}
	});

	//目标指示特效
	lib.element.player.inits = [].concat(lib.element.player.inits || [])
		.concat(player => {
			if (player.ChupaizhishiXObserver) return;

			const ChupaizhishiX = {
				attributes: true,
				attributeFilter: ['class']
			};

			let timer = null;
			const animations = {
				'jiangjun': 'SF_xuanzhong_eff_jiangjun',
				'weijiangjun': 'SF_xuanzhong_eff_weijiangjun',
				'cheqijiangjun': 'SF_xuanzhong_eff_cheqijiangjun',
				'biaoqijiangjun': 'SF_xuanzhong_eff_biaoqijiangjun',
				'dajiangjun': 'SF_xuanzhong_eff_dajiangjun',
				'dasima': 'SF_xuanzhong_eff_dasima'
			};

			const ChupaizhishiXObserver = new globalThis.MutationObserver(mutationRecords => {
				for (let mutationRecord of mutationRecords) {
					if (mutationRecord.attributeName !== 'class') continue;
					const targetElement = mutationRecord.target;

					if (targetElement.classList.contains('selectable')) {
						if (!targetElement.ChupaizhishiXid) {
							if (!window.chupaiload) {
								window.chupaiload = true;
							}
							if (timer) return;

							timer = setTimeout(() => {
								const config = decadeUI.config.chupaizhishi;
								if (config !== 'off' && animations[config]) {
									targetElement.ChupaizhishiXid = dcdAnim.playSpine({
										name: animations[config],
										loop: true
									}, {
										parent: targetElement,
										scale: config === 'biaoqijiangjun' ? 0.65 :
											0.8
									});
								}
								timer = null;
							}, 300);
						}
					} else {
						if (targetElement.ChupaizhishiXid) {
							dcdAnim.stopSpine(targetElement.ChupaizhishiXid);
							delete targetElement.ChupaizhishiXid;
							if (timer) {
								clearTimeout(timer);
								timer = null;
							}
						}
					}
				}
			});
			ChupaizhishiXObserver.observe(player, ChupaizhishiX);
			player.ChupaizhishiXObserver = ChupaizhishiXObserver;
		});
})
