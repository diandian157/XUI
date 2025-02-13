'use strict';
decadeModule.import(function(lib, game, ui, get, ai, _status) {
	lib.translate.zhangba_skill = '丈八';

	//武将背景
	lib.skill._characterBackground = {
		charlotte: true,
		forced: true,
		popup: false,
		trigger: {
			global: ['gameStart', 'modeSwitch'],
			player: ['enterGame', 'showCharacterEnd'],
		},
		priority: 100,
		content: function() {
			const setBackground = (player) => {
				if (!player) return;
				// 检查游戏模式和双将设置
				const mode = get.mode();
				const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[
					mode].double_character;
				if (mode === 'guozhan' || isDoubleCharacter) {
					// 国战模式或开启双将时使用bj2
					player.style.background =
						'url("extension/十周年UI/assets/image/bj2.png") no-repeat center center';
					player.style.backgroundSize = '100% 100%';
					player.setAttribute('data-mode', 'guozhan');
				} else {
					// 其他情况使用bj1
					player.style.background =
						'url("extension/十周年UI/assets/image/bj1.png") no-repeat center center';
					player.style.backgroundSize = '100% 100%';
					player.setAttribute('data-mode', 'normal');
				}
			};
			// 为所有玩家设置背景
			game.players.forEach(setBackground);
			game.dead.forEach(setBackground);
		},
	};
	// 添加全局技能
	if (!_status.connectMode) {
		game.addGlobalSkill('_characterBackground');
	}

	// 在游戏开始时检查并设置背景
	lib.arenaReady.push(function() {
		const mode = get.mode();
		const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[mode]
			.double_character;

		if (mode === 'guozhan' || isDoubleCharacter) {
			document.body.setAttribute('data-mode', 'guozhan');
		} else {
			document.body.setAttribute('data-mode', 'normal');
		}
	});

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
						'<span style="color:#00ffff;font-family:kaiti;font-size:15px;padding:2px 12px;backdrop-filter:blur(53px);text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;">' +
						nickname + '</span>';
				} else {
					const randomNum = get.rand(1000000, 9999999);
					player.node.nameol.innerHTML =
						'<span style="color:#ba30cc;font-family:kaiti;font-size:15px;padding:2px 12px;backdrop-filter:blur(53px);text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;">小杀-' +
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

	// 全选按钮
	lib.hooks.checkBegin.add("cardqx", () => {
		const event = get.event();
		// 只在需要选择多张牌且没有全选按钮时创建
		if (event.selectCard?.[1] > 1 && !ui.cardqx) {
			ui.cardqx = ui.create.control("全选", () => {
				// 选择所有手牌
				ai.basic.chooseCard(card => get.position(card) == "h" ? 114514 : 0);
				// 执行自定义添加卡牌函数
				_status.event.custom?.add.card?.();
				// 更新选中卡牌的显示
				ui.selected.cards.forEach(card => card.updateTransform(true));
			});
		}
		// 当不需要选择多张牌时移除按钮
		else if (!event.selectCard?.[1] || event.selectCard[1] <= 1) {
			ui.cardqx?.remove();
			delete ui.cardqx;
		}
	});
	// 选择结束时移除按钮
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
		filter: function(event, player) {
			return event.num && event.num > 0 && event.num <= 9;
		},
		content: function() {
			var action;
			if (trigger.num > 0 && trigger.num <= 1) action = '1';
			else if (trigger.num > 1 && trigger.num <= 2) action = '2';
			else if (trigger.num > 2 && trigger.num <= 3) action = '3';
			else if (trigger.num > 3 && trigger.num <= 4) action = '4';
			else if (trigger.num > 4 && trigger.num <= 5) action = '5';
			else if (trigger.num > 5 && trigger.num <= 6) action = '6';
			else if (trigger.num > 6 && trigger.num <= 7) action = '7';
			else if (trigger.num > 7 && trigger.num <= 8) action = '8';
			else if (trigger.num > 8 && trigger.num <= 9) action = '9';
			if (action) {
				dcdAnim.loadSpine(window._WJMHHUIFUSHUZITEXIAO.shuzi2.name, "skel", function() {
					window._WJMHHUIFUSHUZITEXIAO.shuzi2.action = action;
					dcdAnim.playSpine(window._WJMHHUIFUSHUZITEXIAO.shuzi2, {
						speed: 0.6,
						scale: 0.5,
						parent: player,
					});
				});
			};
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
		filter: function(event, player) {
			if ((event.num != 0 && !event.num) || (event.num < 0 && event.num > 9)) return false;
			return event.unreal; // 判断是否是虚拟伤害
		},
		content: function() {
			var action;
			if (trigger.num <= 0) action = "play0";
			else if (trigger.num > 0 && trigger.num <= 1) action = 'play1';
			else if (trigger.num > 1 && trigger.num <= 2) action = 'play2';
			else if (trigger.num > 2 && trigger.num <= 3) action = 'play3';
			else if (trigger.num > 3 && trigger.num <= 4) action = 'play4';
			else if (trigger.num > 4 && trigger.num <= 5) action = 'play5';
			else if (trigger.num > 5 && trigger.num <= 6) action = 'play6';
			else if (trigger.num > 6 && trigger.num <= 7) action = 'play7';
			else if (trigger.num > 7 && trigger.num <= 8) action = 'play8';
			else if (trigger.num > 8 && trigger.num <= 9) action = 'play9';
			if (action) {
				dcdAnim.loadSpine(window._WJMHXUNISHUZITEXIAO.SS_PaiJu_xunishanghai.name, "skel",
					function() {
						window._WJMHXUNISHUZITEXIAO.SS_PaiJu_xunishanghai.action = action;
						dcdAnim.playSpine(window._WJMHXUNISHUZITEXIAO.SS_PaiJu_xunishanghai, {
							speed: 0.6,
							scale: 0.5,
							parent: player,
						});
					});
			};
		},
	};
	window._WJMHSHANGHAISHUZITEXIAO = {
		shuzi: {
			name: "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi",
		}, // OL
		SZN_shuzi: {
			name: "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi",
		}, // 十周年
	};
	lib.skill._wjmh_shanghaishuzi_ = {
		priority: 210,
		forced: true,
		trigger: {
			player: 'damageBegin4',
		},
		filter: function(event, player) {
			return event.num && event.num > 1 && event.num <= 9;
		},
		content: function() {
			var action;
			if (trigger.num > 1 && trigger.num <= 2) action = '2';
			else if (trigger.num > 2 && trigger.num <= 3) action = '3';
			else if (trigger.num > 3 && trigger.num <= 4) action = '4';
			else if (trigger.num > 4 && trigger.num <= 5) action = '5';
			else if (trigger.num > 5 && trigger.num <= 6) action = '6';
			else if (trigger.num > 6 && trigger.num <= 7) action = '7';
			else if (trigger.num > 7 && trigger.num <= 8) action = '8';
			else if (trigger.num > 8 && trigger.num <= 9) action = '9';
			if (action) {
				var anim = "shuzi";
				if (lib.config.extension_十周年UI_shanghaishuzi == "shizhounian") anim = "SZN_shuzi";
				dcdAnim.loadSpine(window._WJMHSHANGHAISHUZITEXIAO[anim].name, "skel", function() {
					window._WJMHSHANGHAISHUZITEXIAO[anim].action = action;
					dcdAnim.playSpine(window._WJMHSHANGHAISHUZITEXIAO[anim], {
						speed: 0.6,
						scale: 0.5,
						parent: player,
					});
				});
			};
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
			let card = trigger.card;
			let cardType = get.type(card);
			let cardName = get.name(card);
			let cardNature = get.nature(card);
			if (cardType == 'basic') {
				switch (cardName) {
					case 'sha':
						if (cardNature == 'fire') {
							game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						} else if (cardNature == 'thunder') {
							game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						} else {
							game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						}
						break;
					case 'shan':
						game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						break;
					case 'tao':
						game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						break;
					case 'jiu':
						game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
						break;
					default:
						game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
				}
			} else if (cardType == 'trick') {
				if (get.tag(card, 'damage')) {
					game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
				} else if (get.tag(card, 'recover')) {
					game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
				} else {
					game.playAudio('..', 'extension', '十周年UI', 'audio/GameShowCard');
				}
			} else if (cardType == 'equip') {
				let equipType = get.subtype(card);
				switch (equipType) {
					case 'equip1': // 武器
						game.playAudio('..', 'extension', '十周年UI', 'audio/weapon_equip');
						break;
					case 'equip2': // 防具
						game.playAudio('..', 'extension', '十周年UI', 'audio/horse_equip');
						break;
					case 'equip3': // -1马
						game.playAudio('..', 'extension', '十周年UI', 'audio/armor_equip');
						break;
					case 'equip4': // +1马
						game.playAudio('..', 'extension', '十周年UI', 'audio/armor_equip');
						break;
					case 'equip5': // 宝物
						game.playAudio('..', 'extension', '十周年UI', 'audio/horse_equip');
						break;
				}
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
