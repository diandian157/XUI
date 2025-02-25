'use strict';
decadeModule.import(function(lib, game, ui, get, ai, _status) {
	//装备名字简化
	lib.translate.zhangba_skill = '丈八';

	//强制触屏布局开启
	if (lib.config.phonelayout != 'on') game.saveConfig('phonelayout', 'on');
	//强制布局为新版
	if (lib.config.layout != 'nova') game.saveConfig('layout', 'nova');
	//强制主题为音乐
	if (lib.config.theme != 'music') game.saveConfig('theme', 'music');

	//手气卡美化
	if (lib.config['extension_十周年UI_shouqikamh']) {
		lib.element.content.gameDraw = function() {
			"step 0";
			if (_status.brawl && _status.brawl.noGameDraw) {
				event.finish();
				return;
			}
			var end = player;
			var numx = num;
			do {
				if (typeof num == "function") {
					numx = num(player);
				}
				if (player.getTopCards) player.directgain(player.getTopCards(numx));
				else player.directgain(get.cards(numx));
				if (player.singleHp === true && get.mode() != "guozhan" && (lib.config.mode != "doudizhu" ||
						_status
						.mode != "online")) {
					player.doubleDraw();
				}
				player._start_cards = player.getCards("h");
				player = player.next;
			} while (player != end);
			event.changeCard = get.config("change_card");
			if (_status.connectMode || (lib.config.mode == "single" && _status.mode != "wuxianhuoli") || (
					lib
					.config
					.mode == "doudizhu" && _status.mode == "online") || (lib.config.mode != "identity" &&
					lib
					.config
					.mode != "guozhan" && lib.config.mode != "doudizhu" && lib.config.mode != "single")) {
				event.changeCard = "disabled";
			}
			"step 1";
			if (event.changeCard != "disabled" && !_status.auto) {
				function getRandomInt(min, max) {
					min = Math.ceil(min);
					max = Math.floor(max);
					return Math.floor(Math.random() * (max - min + 1)) + min;
				};
				event.numsl = getRandomInt(10000, 99999);
				event.numsy = 5; //手气卡次数改这里
				var str = "本场还可更换" + event.numsy + "次手牌(剩余" + event.numsl + "张手气卡)";
				event.dialog = dui.showHandTip(str);
				event.dialog.strokeText();
				ui.create.confirm("oc");
				event.custom.replace.confirm = function(bool) {
					_status.event.bool = bool;
					game.resume();
				};
			} else {
				event.goto(4);
			}
			"step 2";
			function getConfig(ext, id, def) {
				var str = ["extension", ext, id].join("_");
				var val = lib.config[str];
				return typeof val !== "undefined" || val ? val : def;
			};
			let val = getConfig("武将美化", "shouqikasize", 28.5);
			let elements = document.querySelectorAll('#arena>.hand-tip');
			if (elements.length) {
				elements[0].style.bottom = val.toFixed(1) + "%";
				// 添加左侧位置调整
				elements[0].style.left = '120px'; // 减小这个值会向左移动
				elements[0].style.right = '220px'; // 保持对称，也要调整right值
			}
			if (event.changeCard == "once") {
				event.changeCard = "disabled";
			} else if (event.changeCard == "twice") {
				event.changeCard = "once";
			} else if (event.changeCard == "disabled") {
				event.bool = false;
				return;
			}
			_status.imchoosing = true;
			event.switchToAuto = function() {
				_status.event.bool = false;
				game.resume();
			};
			game.pause();
			"step 3";
			_status.imchoosing = false;
			if (event.bool) {
				var hs = game.me.getCards("h");
				game.addVideo("lose", game.me, [get.cardsInfo(hs), [],
					[],
					[]
				]);
				for (var i = 0; i < hs.length; i++) {
					hs[i].discard(false);
				}
				if (true) {
					var sound = document.createElement("audio");
					sound.id = "shouqikaAudio";
					sound.preload = "auto";
					sound.style.display = "none";
					sound.play();
				}
				game.me.directgain(get.cards(hs.length));
				event.numsl--;
				event.numsy--;
				if (event.numsy <= 0) {
					if (event.dialog) event.dialog.close();
					if (event.score) event.score.remove();
					if (ui.confirm) ui.confirm.close();
					game.me._start_cards = game.me.getCards("h");
					event.goto(4);
				} else {
					var str = "本场还可更换" + event.numsy + "次手牌(剩余" + event.numsl + "张手气卡)";
					event.dialog.remove();
					event.dialog = dui.showHandTip(str);
					event.dialog.strokeText();
					event.goto(2);
				}
			} else {
				if (event.dialog) event.dialog.close();
				if (event.score) event.score.remove();
				if (ui.confirm) ui.confirm.close();
				game.me._start_cards = game.me.getCards("h");
				event.goto(4);
			}
			"step 4";
			setTimeout(decadeUI.effect.gameStart, 51);
		};
	};

	//武将背景
	if (lib.config['extension_十周年UI_wujiangbeijing']) {
		lib.skill._wjBackground = {
			charlotte: true,
			forced: true,
			popup: false,
			trigger: {
				global: ['gameStart', 'modeSwitch'],
				player: ['enterGame', 'showCharacterEnd'],
			},
			priority: 100,
			content() {
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
			game.addGlobalSkill('_wjBackground');
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
	};

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
					const randomNum = get.rand(10000, 99999);
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
		filter(event, player) {
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
		content() {
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

	// 全选按钮功能 by奇妙工具做修改
	lib.hooks.checkBegin.add("Selectall", () => {
	    const event = get.event();
	    const needMultiSelect = event.selectCard?.[1] > 1;
	    // 创建或移除全选按钮
	    if (needMultiSelect && !ui.Selectall) {
	        ui.Selectall = ui.create.control("全选", () => {
	            // 选择所有手牌
	            ai.basic.chooseCard(card => get.position(card) === "h" ? 114514 : 0);
	            // 执行自定义添加卡牌函数
	            event.custom?.add?.card?.();
	            // 更新选中卡牌显示
	            ui.selected.cards?.forEach(card => card.updateTransform(true));
	        });
	    } else if (!needMultiSelect) {
	        removeCardQX();
	    }
	});
	lib.hooks.uncheckBegin.add("Selectall", () => {
	    if (get.event().result?.bool) {
	        removeCardQX();
	    }
	});
	// 抽取移除按钮的公共函数
	const removeCardQX = () => {
	    if (ui.Selectall) {
	        ui.Selectall.remove();
	        delete ui.Selectall;
	    }
	};

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
		filter(event, player) {
			return event.num && event.num > 0 && event.num <= 9;
		},
		content() {
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
		filter(event, player) {
			if ((event.num != 0 && !event.num) || (event.num < 0 && event.num > 9)) return false;
			return event.unreal; // 判断是否是虚拟伤害
		},
		content() {
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
		filter(event, player) {
			return event.num && event.num > 1 && event.num <= 9;
		},
		content() {
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
		content() {
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
		content() {
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

	//阶段提示
	if (lib.config.extension_十周年UI_JDTS) {
		//游戏结束消失
		lib.onover.push(function(bool) {
			game.as_removeImage();
		});
		//等待响应
		lib.skill._jd_ddxyA = {
			trigger: {
				player: ["chooseToRespondBegin"],
			},
			silent: true,
			direct: true,
			filter: function(event, player) {
				return player == game.me && _status.auto == false;
			},
			content: function() {
				trigger._jd_ddxy = true;
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/ddxy.png", [22.5, 71.5,
					0, 3
				], 10);
			},
		};
		//成为杀的目标开始
		lib.skill._jd_ddxyB = {
			trigger: {
				target: "shaBegin",
			},
			silent: true,
			filter: function(event, player) {
				return game.me == event.target;
			},
			charlotte: true,
			forced: true,
			content: function() {
				trigger._jd_ddxy = true;
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/ddxy.png", [22.5, 71.5,
					0, 3
				], true);
			},
		};
		lib.skill._jd_ddxyC = {
			trigger: {
				player: ["useCardToBegin", "phaseJudge"],
			},
			silent: true,
			filter: function(event, player) {
				if (event.card.storage && event.card.storage.nowuxie) return false;
				var card = event.card;
				var info = get.info(card);
				if (info.wuxieable === false) return false;
				if (event.name != "phaseJudge") {
					if (event.getParent().nowuxie) return false;
					if (!event.target) {
						if (info.wuxieable) return true;
						return false;
					}
					if (event.player.hasSkillTag("playernowuxie", false, event.card)) return false;
					if (get.type(event.card) != "trick" && !info.wuxieable) return false;
				}
				return player == game.me && _status.auto == false;
			},
			charlotte: true,
			forced: true,
			content: function() {
				trigger._jd_ddxy = true;
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/ddxy.png", [22.5, 71.5,
					0, 3
				], true);
			},
		};
		//使用或打出闪后
		lib.skill._jd_shiyongshanD = {
			forced: true,
			charlotte: true,
			trigger: {
				player: ["useCard", "respondAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && event.card.name == "shan";
			},
			content: function() {
				trigger._jd_ddxy = true;
				game.as_removeImage();
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/" + _status
					.as_showImage_phase + ".png", [19, 71.5, 0, 3], true);
			},
		};
		//等待响应及游戏结束
		lib.skill._jd_ddxyE = {
			trigger: {
				player: ["chooseToRespondEnd", "useCardToEnd", "phaseJudgeEnd", "respondSha", "shanBegin"],
			},
			silent: true,
			filter: function(event, player) {
				if (!event._jd_ddxy) return false;
				return player == game.me && _status.auto == false;
			},
			direct: true,
			content: function() {
				game.as_removeImage();
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/" + _status
					.as_showImage_phase + ".png", [19, 71.5, 0, 3], true);
			},
		};
		//对方正在思考
		lib.skill._jd_dfsk = {
			trigger: {
				global: ["phaseBegin", "phaseEnd", "phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin",
					"phaseDiscardBegin"
				],
			},
			silent: true,
			charlotte: true,
			forced: true,
			filter: function(event, player) {
				//剩余人数两人时
				if (game.players.length == 2 && _status.currentPhase != game.me) return true;
			},
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/dfsk.png", [22.5, 71.5,
					0, 3
				], true);
			},
		};
		//死亡或回合结束消失
		lib.skill._jd_wjsw = {
			trigger: {
				global: ["phaseEnd", "useCardAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return _status.currentPhase != game.me && player != game.me;
			},
			forced: true,
			charlotte: true,
			content: function() {
				game.as_removeImage();
			},
		};
		lib.skill._jd_swxs = {
			trigger: {
				global: ["dieAfter"],
			},
			silent: true,
			forced: true,
			charlotte: true,
			filter: function(event, player) {
				return player == game.me && _status.auto == false;
			},
			content: function() {
				game.as_removeImage();
			},
		};
		//回合开始
		lib.skill._jd_hhks = {
			trigger: {
				player: ["phaseBegin"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/hhks.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "hhks";
			},
		};
		//准备阶段
		lib.skill._jd_zbjdb = {
			trigger: {
				player: ["phaseZhunbeiBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/zbjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "zbjd";
			},
		};
		lib.skill._jd_zbjde = {
			trigger: {
				player: ["phaseZhunbeiAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "zbjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//判定阶段
		lib.skill._jd_pdjdb = {
			trigger: {
				player: ["phaseJudgeBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/pdjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "pdjd";
			},
		};
		lib.skill._jd_pdjde = {
			trigger: {
				player: ["phaseJudgeAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "pdjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//摸牌阶段
		lib.skill._jd_mpjdb = {
			trigger: {
				player: ["phaseDrawBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/mpjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "mpjd";
			},
		};
		lib.skill._jd_mpjde = {
			trigger: {
				player: ["phaseDrawAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "mpjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//出牌阶段
		lib.skill._jd_cpjdb = {
			trigger: {
				player: ["phaseUseBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/cpjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "cpjd";
			},
		};
		lib.skill._jd_cpjde = {
			trigger: {
				player: ["phaseUseAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "cpjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//弃牌阶段
		lib.skill._jd_qpjdb = {
			trigger: {
				player: ["phaseDiscardBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/qpjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "qpjd";
			},
		};
		lib.skill._jd_qpjde = {
			trigger: {
				player: ["phaseDiscardAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "qpjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//结束阶段
		lib.skill._jd_jsjdb = {
			trigger: {
				player: ["phaseJieshuBefore"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/jsjd.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "jsjd";
			},
		};
		lib.skill._jd_jsjde = {
			trigger: {
				player: ["phaseJieshuAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "jsjd") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
		//回合结束
		lib.skill._jd_hhjsb = {
			trigger: {
				player: ["phaseEnd"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: Infinity,
			firstDo: true,
			content: function() {
				game.as_showImage("extension/十周年UI/shoushaUI/lbtn/images/JDTS/hhjs.png", [22.5, 71.5,
					0, 3
				], true);
				_status.as_showImage_phase = "hhjs";
			},
		};
		lib.skill._jd_hhjse = {
			trigger: {
				player: ["phaseAfter"],
			},
			silent: true,
			filter: function(event, player) {
				return player == game.me && _status.currentPhase == player;
			},
			charlotte: true,
			ruleSkill: true,
			direct: true,
			priority: -Infinity,
			lastDo: true,
			content: function() {
				if (_status.as_showImage_phase && _status.as_showImage_phase == "hhjs") {
					game.as_removeImage();
					delete _status.as_showImage_phase;
				}
			},
		};
	};
})
