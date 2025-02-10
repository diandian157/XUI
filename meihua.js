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

	// 给十周年UI观星增加可隐藏窗口按钮  by武将美化
	decadeUI.content.chooseGuanXing = function(player, cards1, movable1, cards2, movable2, infohide) {
		// 修改参数检查逻辑
		if (!player || get.itemtype(player) != 'player') {
			console.error('Invalid player parameter');
			return;
		}

		// 修改卡牌检查逻辑
		if (!cards1 && !cards2) {
			console.error('No cards provided');
			return;
		}

		var guanXing = decadeUI.dialog.create('confirm-box guan-xing');

		// 添加点击音效函数
		var playButtonAudio = function() {
			game.playAudio('../extension/十周年UI/audio/gxbtn');
		};

		// 修改hideBtn的点击事件
		var hideBtn = ui.create.div('.closeDialog', document.body, function() {
			playButtonAudio(); // 添加音效
			if (game.me == player) {
				if (guanXing.classList.contains("active")) {
					guanXing.classList.remove("active");
					guanXing.style.transform = 'scale(1)';
					hideBtn.style.backgroundImage = 'url("' + lib.assetURL +
						'extension/十周年UI/assets/image/yincangck.png")';
				} else {
					guanXing.classList.add("active");
					guanXing.style.transform = 'scale(0)';
					hideBtn.style.backgroundImage = 'url("' + lib.assetURL +
						'extension/十周年UI/assets/image/xianshick.png")';
				};
			};
		});

		hideBtn.style.cssText = `
		        background-image: url("${lib.assetURL}extension/十周年UI/assets/image/yincangck.png");
		        background-size: 100% 100%;
		        height: 4%;
		        width: 7%;
		        z-index: 114514;
		        left: 10%;
				right: auto;
				top: 75%;
		    `;
		// ----修改结束1----

		var properties = {
			caption: undefined,
			tip: undefined,
			header1: undefined,
			header2: undefined,
			cards: [
				[],
				[]
			],
			movables: [movable1 ? movable1 : 0, movable2 ? movable2 : 0],
			selected: undefined,
			callback: undefined,
			infohide: undefined,
			confirmed: undefined,
			doubleSwitch: undefined,
			orderCardsList: [
				[],
				[]
			],
			finishing: undefined,
			finished: undefined,
			finishTime: function(time) {
				if (this.finishing || this.finished) return;
				if (typeof time != 'number') throw time;
				this.finishing = true;
				setTimeout(function(dialog) {
					dialog.finishing = false;
					dialog.finish();
				}, time, this)
			},
			finish: function() {
				if (this.finishing || this.finished) return;
				this.finishing = true;
				if (this.callback) this.confirmed = this.callback.call(this);

				cards = guanXing.cards[0];
				if (cards.length) {
					for (var i = cards.length - 1; i >= 0; i--) {
						cards[i].removeEventListener('click', guanXing._click);
						cards[i].classList.remove('infohidden');
						cards[i].classList.remove('infoflip');
						cards[i].style.cssText = cards[i].rawCssText;
						delete cards[i].rawCssText;

						if (!this.callback) ui.cardPile.insertBefore(cards[i], ui.cardPile
							.firstChild);
					}
				}

				cards = guanXing.cards[1];
				for (var i = 0; i < cards.length; i++) {
					cards[i].removeEventListener('click', guanXing._click);
					cards[i].classList.remove('infohidden');
					cards[i].classList.remove('infoflip');
					cards[i].style.cssText = cards[i].rawCssText;
					delete cards[i].rawCssText;

					if (!this.callback) ui.cardPile.appendChild(cards[i]);
				}

				_status.event.cards1 = this.cards[0];
				_status.event.cards2 = this.cards[1];
				_status.event.num1 = this.cards[0].length;
				_status.event.num2 = this.cards[1].length;
				if (_status.event.result) _status.event.result.bool = this.confirmed === true;
				else _status.event.result = {
					bool: this.confirmed === true
				}

				game.broadcastAll(function() {
					if (!window.decadeUI && decadeUI.eventDialog) return;
					decadeUI.eventDialog.close();
					decadeUI.eventDialog.finished = true;
					decadeUI.eventDialog.finishing = false;
					decadeUI.eventDialog = undefined;
				});
				decadeUI.game.resume();
			},
			update: function() {
				var x, y;
				for (var i = 0; i < this.cards.length; i++) {
					cards = this.cards[i];
					if (this.orderCardsList[i].length) {
						cards.sort(function(a, b) {
							var aIndex = guanXing.orderCardsList[i].indexOf(a);
							var bIndex = guanXing.orderCardsList[i].indexOf(b);

							aIndex = aIndex >= 0 ? aIndex : guanXing.orderCardsList[i]
								.length;
							bIndex = bIndex >= 0 ? bIndex : guanXing.orderCardsList[i]
								.length;
							return aIndex - bIndex;
						});
					}

					y = 'calc(' + (i * 100) + '% + ' + (i * 10) + 'px)';
					for (var j = 0; j < cards.length; j++) {
						x = 'calc(' + (j * 100) + '% + ' + (j * 10) + 'px)';
						// cards[j].style.transform = 'translate(' + x + ', ' + y + ')';
						// cards[j].style.zIndex = (i * 10 + j + 1);
						cards[j].style.cssText += ';transform:translate(' + x + ', ' + y +
							'); z-index:' + (i * 10 + j + 1) + ';';
					}
				}
			},
			swap: function(source, target) {
				game.broadcast(function(source, target) {
					if (!window.decadeUI && decadeUI.eventDialog) return;

					decadeUI.eventDialog.swap(source, target);
				}, source, target);

				var sourceIndex = this.cardToIndex(source, 0);
				var targetIndex = this.cardToIndex(target, 1)

				if (sourceIndex >= 0 && targetIndex >= 0) {
					this.cards[0][sourceIndex] = target;
					this.cards[1][targetIndex] = source;
					this.update();
					this.onMoved();
					return;
				}

				sourceIndex = this.cardToIndex(source, 1);
				targetIndex = this.cardToIndex(target, 0);

				if (sourceIndex >= 0 && targetIndex >= 0) {
					this.cards[1][sourceIndex] = target;
					this.cards[0][targetIndex] = source;
					this.update();
					this.onMoved();
					return;
				}

				if (sourceIndex >= 0) {
					targetIndex = this.cardToIndex(target, 1);
					if (targetIndex < 0) console.error('card not found');

					this.cards[1][sourceIndex] = target;
					this.cards[1][targetIndex] = source;
				} else {
					sourceIndex = this.cardToIndex(source, 0);

					if (targetIndex < 0 || sourceIndex < 0) return console.error('card not found');
					this.cards[0][sourceIndex] = target;
					this.cards[0][targetIndex] = source;
				}

				this.update();
				this.onMoved();
			},
			switch: function(card) {
				game.broadcast(function(card) {
					if (!window.decadeUI && decadeUI.eventDialog) return;

					decadeUI.eventDialog.switch(card);
				}, card);

				var index = this.cardToIndex(card, 0);
				if (index >= 0) {
					if (this.cards[1].length >= this.movables[1]) return;

					card = this.cards[0][index];
					this.cards[0].remove(card);
					this.cards[1].push(card);
				} else {
					if (this.cards[0].length >= this.movables[0]) return;

					index = this.cardToIndex(card, 1);
					if (index < 0) return console.error('card not found');
					card = this.cards[1][index];
					this.cards[1].remove(card);
					this.cards[0].push(card);
				}

				this.update();
				this.onMoved();
			},
			move: function(card, indexTo, moveDown) {
				var dim = moveDown ? 1 : 0;
				var dim2 = dim;
				var index = this.cardToIndex(card, dim);

				indexTo = Math.max(indexTo, 0);
				if (index < 0) {
					var dim2 = dim == 1 ? 0 : 1;
					index = this.cardToIndex(card, dim2);
					if (index < 0) return console.error('card not found');

					if (this.cards[dim].length >= this.movables[dim]) return;
				}

				this.cards[dim2].splice(index, 1);
				this.cards[dim].splice(indexTo, 0, card);
				this.onMoved();
				this.update();
			},
			cardToIndex: function(card, cardArrayIndex) {
				if (!(card && card.cardid)) return -1;
				var id = card.cardid;
				var cards = this.cards[cardArrayIndex == null ? 0 : cardArrayIndex];
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].cardid == id) return i;
				}

				return -1;
			},
			lockCardsOrder: function(isBottom) {
				var orders;
				var cards;

				if (isBottom) {
					cards = this.cards[1];
					this.orderCardsList[1] = [];
					orders = this.orderCardsList[1];
				} else {
					cards = this.cards[0];
					this.orderCardsList[0] = [];
					orders = this.orderCardsList[0];
				}

				if (cards.length) {
					for (var i = 0; i < cards.length; i++) {
						orders.push(cards[i]);
					}
				}
			},
			unlockCardsOrder: function(isBottom) {
				if (isBottom) {
					this.orderCardsList[1] = [];
				} else {
					this.orderCardsList[0] = [];
				}
			},
			getCardArrayIndex: function(card) {
				var cards = this.cards;

				if (cards[0].indexOf(card) >= 0) {
					return 0;
				} else if (cards[1].indexOf(card) >= 0) {
					return 1;
				} else {
					return -1;
				}

			},
			onMoved: function() {
				if (typeof this.callback == 'function') {
					var ok = this.callback.call(this);
					if (!ok) {
						this.classList.add('ok-disable');
						return;
					}
				}

				this.classList.remove('ok-disable');
			},
			_click: function(e) {
				if (this.finishing || this.finished) return;
				switch (this.objectType) {
					case 'content':
						guanXing.selected = null;
						break;

					case 'card':
						// 直接切换卡牌位置，无需选中
						guanXing.switch(this);
						guanXing.selected = null;
						break;

					case 'button ok':
						if (guanXing.classList.contains('ok-disable')) return;
						guanXing.confirmed = true;
						guanXing.finish();
						break;

					default:
						guanXing.classList.remove('selecting');
						guanXing.selected = null;
						break;
				}

				e.stopPropagation();
			},
			_selected: undefined,
			_caption: decadeUI.dialog.create('caption', guanXing),
			_content: decadeUI.dialog.create('content buttons', guanXing),
			_tip: decadeUI.dialog.create('tip', guanXing),
			_header1: undefined,
			_header2: undefined,
			_infohide: undefined,
			_callback: undefined,

		}

		for (var key in properties) {
			guanXing[key] = properties[key];
		}

		Object.defineProperties(guanXing, {
			selected: {
				configurable: true,
				get: function() {
					return this._selected;
				},
				set: function(value) {
					var current = this._selected;
					if (current == value) return;
					if (current != undefined) current.classList.remove('selected');

					this._selected = current = value;
					if (current != undefined) {
						current.classList.add('selected');
						this.classList.add('selecting');
					} else {
						this.classList.remove('selecting');
					}
				},
			},
			caption: {
				configurable: true,
				get: function() {
					return this._caption.innerHTML;
				},
				set: function(value) {
					if (this._caption.innerHTML == value) return;
					this._caption.innerHTML = value;
				},
			},
			tip: {
				configurable: true,
				get: function() {
					return this._tip.innerHTML;
				},
				set: function(value) {
					if (this._tip.innerHTML == value) return;
					this._tip.innerHTML = value;
				},
			},
			header1: {
				configurable: true,
				get: function() {
					if (this._header1) return this._header1.innerHTML;
					return '';
				},
				set: function(value) {
					if (!this._header1 || this._header1.innerHTML == value) return;
					this._header1.innerHTML = value;
				},
			},
			header2: {
				configurable: true,
				get: function() {
					if (this._header2) return this._header2.innerHTML;
					return '';
				},
				set: function(value) {
					if (!this._header2 || this._header2.innerHTML == value) return;
					this._header2.innerHTML = value;
				},
			},
			infohide: {
				configurable: true,
				get: function() {
					return this._infohide;
				},
				set: function(value) {
					if (this._infohide == value) return;
					this._infohide = value;

					for (var i = 0; i < this.cards.length; i++) {
						var cards = this.cards[i];
						for (var j = 0; j < cards.length; j++) {
							if (value) {
								cards[j].classList.add('infohidden');
								cards[j].classList.add('infoflip');
								cards[j].style.backgroundImage = '';
							} else {
								cards[j].classList.remove('infohidden');
								cards[j].classList.remove('infoflip');
								cards[j].style.cssText = cards[j].rawCssText;
							}
						}
					}
				},
			},
			callback: {
				configurable: true,
				get: function() {
					return this._callback;
				},
				set: function(value) {
					if (this._callback == value) return;
					this._callback = value;
					this.onMoved();
				},
			}
		});

		var content = guanXing._content;
		guanXing.addEventListener('click', guanXing._click, false);


		if (game.me == player) {
			content.objectType = 'content';
			content.addEventListener('click', guanXing._click, false);
			var button = decadeUI.dialog.create('button ok', guanXing);
			button.innerHTML = '确认';
			button.objectType = 'button ok';
			button.addEventListener('click', guanXing._click, false);
			// ----修改开始2----
			button.addEventListener('click', function() {
				document.body.removeChild(hideBtn);
			});
		} else {
			document.body.removeChild(hideBtn);
		}
		// ----修改结束2----

		var size = decadeUI.getHandCardSize();
		var height = 0;

		if (cards1) {
			guanXing.cards[0] = cards1;
			guanXing.movables[0] = Math.max(cards1.length, guanXing.movables[0]);
		}

		if (cards2) {
			guanXing.cards[1] = cards2;
			guanXing.movables[1] = Math.max(cards2.length, guanXing.movables[1]);
		}

		if (guanXing.movables[0] > 0) {
			height = size.height;
			guanXing._header1 = decadeUI.dialog.create('header', guanXing._content);
			guanXing._header1.style.top = '0';
			guanXing._header1.innerHTML = '牌堆顶'
		}

		if (guanXing.movables[1] > 0) {
			height += height + (height > 0 ? 10 : 0);
			guanXing._header2 = decadeUI.dialog.create('header', guanXing._content);
			guanXing._header2.style.bottom = '0';
			guanXing._header2.innerHTML = '牌堆底'
		}

		content.style.height = height + 'px';

		var cards;
		for (var i = 0; i < guanXing.cards.length; i++) {
			cards = guanXing.cards[i];
			for (var j = 0; j < cards.length; j++) {
				if (game.me == player) {
					cards[j].objectType = 'card';
					cards[j].removeEventListener('click', ui.click.intro);
					cards[j].addEventListener('click', guanXing._click, false);
				}

				cards[j].rawCssText = cards[j].style.cssText;
				cards[j].fix();
				content.appendChild(cards[j]);
			}
		}

		decadeUI.game.wait();
		guanXing.infohide = infohide == null ? (game.me == player ? false : true) : infohide;
		guanXing.caption = get.translation(player) + '正在发动【观星】';
		guanXing.tip = '单击卡牌可直接在牌堆顶和牌堆底之间切换位置';
		guanXing.update();
		ui.arena.appendChild(guanXing);

		decadeUI.eventDialog = guanXing;
		return guanXing;
	};

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
