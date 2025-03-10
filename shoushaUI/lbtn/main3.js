app.import(function(lib, game, ui, get, ai, _status, app) {

	lib.arenaReady.push(function() {
		//更新轮次
		var originUpdateRoundNumber = game.updateRoundNumber;
		game.updateRoundNumber = function() {
			originUpdateRoundNumber.apply(this, arguments);
			if (ui.cardRoundTime) ui.cardRoundTime.updateRoundCard();
		};
		if (lib.config.mode == "identity" || lib.config.mode == "doudizhu" || lib.config.mode ==
			"guozhan" || lib.config.mode == "versus" || lib.config.mode == "single" || lib.config
			.mode == "martial") {
			var wenhao = ui.create.node("ismg");
			wenhao.src = lib.assetURL + "extension/十周年UI/shoushaUI/lbtn/images/CD/wenhao.png";
			wenhao.style.cssText =
				"cursor: pointer;display: block;width: 40px;height: 29px;position: absolute;bottom: calc(100% - 30px);left:61.5%;background-color: transparent;z-index:5";

			//--------------//
			if (lib.config.mode == "identity" || lib.config.mode == "doudizhu" || lib.config.mode ==
				"versus" || lib.config.mode == "guozhan") {
				wenhao.onclick = function() {
					var popuperContainer = ui.create.div(".popup-container", ui.window);
					game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

					if (lib.config.mode == "identity") {
						if (game.me.identity == "zhu") {
							ui.create.div(".Tipzhugong", popuperContainer);
						} else if (game.me.identity == "zhong") {
							ui.create.div(".Tipzhongchen", popuperContainer);
						} else if (game.me.identity == "fan") {
							ui.create.div(".Tipfanzei", popuperContainer);
						} else if (game.me.identity == "nei") {
							ui.create.div(".Tipneijian", popuperContainer);
						}
					}
					if (lib.config.mode == "doudizhu") {
						if (game.me.identity == "zhu") {
							ui.create.div(".Tipdizhu", popuperContainer);
						} else if (game.me.identity == "fan") {
							ui.create.div(".Tipnongmin", popuperContainer);
						}
					}

					if (lib.config.mode == "versus") {
						ui.create.div(".Tiphu", popuperContainer);
					}

					if (lib.config.mode == "guozhan") {
						if (game.me.group == "unknown" || game.me.group == "undefined") {
							//未选择身份势力
							ui.create.div(".Tipundefined", popuperContainer);
						} else if (game.me.group == "wei") {
							ui.create.div(".Tipweiguo", popuperContainer);
						} else if (game.me.group == "shu") {
							ui.create.div(".Tipshuguo", popuperContainer);
						} else if (game.me.group == "wu") {
							ui.create.div(".Tipwuguo", popuperContainer);
						} else if (game.me.group == "qun") {
							ui.create.div(".Tipqunxiong", popuperContainer);
						} else if (game.me.group == "jin") {
							ui.create.div(".Tipjinguo", popuperContainer);
						} else if (game.me.group == "ye") {
							ui.create.div(".Tipyexinjia", popuperContainer);
						}
						//容错选项
						else {
							ui.create.div(".Tipweizhi", popuperContainer);
						}
					}
					popuperContainer.addEventListener("click", event => {
						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");
						popuperContainer.delete(200);
					});
				};
			}
			document.body.appendChild(wenhao);
		}
		//手牌排序
		var head = ui.create.node('img');
		head.src = lib.assetURL + "extension/十周年UI/shoushaUI/lbtn/images/uibutton/new_zhengli.png"
		head.style.cssText =
			"cursor: pointer;display: block;--w: 80px;--h: calc(var(--w) * 81/247);width: var(--w);height: var(--h)+4px;position: absolute;top: calc(100% - 50px);left: calc(100% - 360px);background-color: transparent;z-index:4"
		head.onclick = function() {
			//head.onclick=ui.click.sortCard;
			if (!game.me || game.me.hasSkillTag('noSortCard')) return;
			var cards = game.me.getCards("hs");
			var sort2 = function(b, a) {
				if (a.name != b.name) return lib.sort.card(a.name, b.name);
				else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
				else return a.number - b.number;
			};
			if (cards.length > 1) {
				cards.sort(sort2);
				cards.forEach(function(i, j) {
					game.me.node.handcards1.insertBefore(cards[j], game.me.node.handcards1
						.firstChild);
				});
				dui.queueNextFrameTick(dui.layoutHand, dui);
			}
		}
		document.body.appendChild(head);
		//右上角菜单
		var head = ui.create.node("img");
		head.src =
			lib.assetURL +
			"extension/十周年UI/shoushaUI/lbtn/images/uibutton/yinying.png";
		head.style.cssText =
			"display: block;width: 100%;height:15%;position: absolute;bottom: 0px;background-color: transparent;z-index:-4";
		document.body.appendChild(head);

		document.body.appendChild(head);
		var head = ui.create.node("img");
		head.src =
			lib.assetURL +
			"extension/十周年UI/shoushaUI/lbtn/images/uibutton/yinying.png";
		head.style.cssText =
			"display: block;width: 100%;height:15%;position: absolute;bottom: 0px;background-color: transparent;z-index:-4";
		document.body.appendChild(head);
	});

	var plugin = {
		name: 'lbtn',
		filter() {
			return !['chess', 'tafang'].includes(get.mode());
		},
		content(next) {
			lib.skill._uicardupdate = {
				trigger: {
					player: 'phaseJieshuBegin'
				},
				forced: true,
				unique: true,
				popup: false,
				silent: true,
				noLose: true,
				noGain: true,
				noDeprive: true,
				priority: -Infinity,
				filter(event, player) {
					return player == game.me
				},
				content() {
					if (ui.updateSkillControl) ui.updateSkillControl(game.me, true);
				}
			}
		},
		precontent() {
			Object.assign(game.videoContent, {
				createCardRoundTime() {
					ui.cardRoundTime = plugin.create.cardRoundTime();
				},
				createhandcardNumber() {
					ui.handcardNumber = plugin.create.handcardNumber();
				},
				updateCardRoundTime(opts) {
					if (!ui.cardRoundTime) return;
					ui.cardRoundTime.node.roundNumber.innerHTML = '<span>第' + game
						.roundNumber + '轮</span>';
					ui.cardRoundTime.setNumberAnimation(opts.cardNumber);
				},
				updateCardnumber(opts) {
					if (!ui.handcardNumber) return;
					// ui.handcardNumber.setNumberAnimation(opts.cardNumber);
				},
			});
			app.reWriteFunction(ui.create, {
				me: [function() {
					plugin.create.control();
				}, null],
				arena: [null, function() {
					if (ui.time3) {
						clearInterval(ui.time3.interval);
						ui.time3.delete();
					}
					if (ui.cardPileNumber) ui.cardPileNumber.delete();
					ui.cardRoundTime = plugin.create.cardRoundTime();
					ui.handcardNumber = plugin.create.handcardNumber();
				}],
				cards: [null, function() {
					if (ui.cardRoundTime) {
						ui.cardRoundTime.updateRoundCard();
					}
				}],
			});
			app.reWriteFunction(lib.configMenu.appearence.config, {
				update: [null, function(res, config, map) {
					map.control_style.hide();
					map.custom_button.hide();
					map.custom_button_system_top.hide();
					map.custom_button_system_bottom.hide();
					map.custom_button_control_top.hide();
					map.custom_button_control_bottom.hide();
					map.radius_size.hide();
				}],
			});


			ui.create.confirm = function(str, func) {
				var confirm = ui.confirm;
				if (!confirm) {
					confirm = ui.confirm = plugin.create.confirm();
				}
				confirm.node.ok.classList.add('disabled');
				confirm.node.cancel.classList.add('disabled');
				if (_status.event.endButton) {
					ui.confirm.node.cancel.classList.remove('disabled');
				}
				if (str) {
					if (str.indexOf('o') !== -1) {
						confirm.node.ok.classList.remove('disabled');
					}
					if (str.indexOf('c') !== -1) {
						confirm.node.cancel.classList.remove('disabled');
					}
					confirm.str = str;
				}

				if (func) {
					confirm.custom = func;
				}
				ui.updatec();
				confirm.update();
			};
		},
		create: {
			control() {

			},
			confirm() {

				var confirm = ui.create.control('<span>确定</span>', 'cancel');
				confirm.classList.add('lbtn-confirm');
				confirm.node = {
					ok: confirm.firstChild,
					cancel: confirm.lastChild,
				};
				if (_status.event.endButton) {
					_status.event.endButton.close();
					//	delete event.endButton;		
				}
				confirm.node.ok.link = 'ok';
				confirm.node.ok.classList.add('primary');
				confirm.node.cancel.classList.add('primary2');
				confirm.custom = plugin.click.confirm;
				app.reWriteFunction(confirm, {
					close: [function() {
						this.classList.add('closing');
					}],
				});
				for (var k in confirm.node) {
					confirm.node[k].classList.add('disabled');
					confirm.node[k].removeEventListener(lib.config.touchscreen ? 'touchend' : 'click',
						ui.click.control);
					confirm.node[k].addEventListener(lib.config.touchscreen ? 'touchend' : 'click',
						function(e) {
							e.stopPropagation();
							if (this.classList.contains('disabled')) {
								if (this.link === 'cancel' && this.dataset.type === 'endButton' &&
									_status.event.endButton) {

									_status.event.endButton.custom();
									ui.confirm.close();
									//  ui.updatec();
								}
								return;
							}

							if (this.parentNode.custom) {
								this.parentNode.custom(this.link, this);
							}
						});
				}

				if (ui.skills2 && ui.skills2.skills.length) {
					var skills = ui.skills2.skills;
					confirm.skills2 = [];
					for (var i = 0; i < skills.length; i++) {
						var item = document.createElement('div');
						item.link = skills[i];
						item.innerHTML = get.translation(skills[i]);
						item.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function(
							e) {
							e.stopPropagation();
							ui.click.skill(this.link);
						});

						item.dataset.type = 'skill2';
						if (ui.updateSkillControl) ui.updateSkillControl(game.me, true);
						/*
						            confirm.insertBefore(item, confirm.firstChild);*/
					}
				}

				confirm.update = function() {
					if (confirm.skills2) {
						if (_status.event.skill && _status.event.skill !== confirm.dataset.skill) {
							confirm.dataset.skill = _status.event.skill;
							confirm.skills2.forEach(function(item) {
								item.remove();
							});
							ui.updatec();
						} else if (!_status.event.skill && confirm.dataset.skill) {
							delete confirm.dataset.skill;
							confirm.skills2.forEach(function(item) {
								confirm.insertBefore(item, confirm.firstChild);
							});
							ui.updatec();
						}
					}
					if (ui.updateSkillControl) ui.updateSkillControl(game.me, true);
				};
				return confirm;
			},


			handcardNumber() {
				var node3 = ui.create.div('.settingButton', ui.arena, plugin.click.setting);

				/*ui.create.div('.lbtn-controls', ui.arena);*/
				//-------原版---------//
				if (lib.config.extension_十周年UI_XPJ == "on") {
					var node5 = ui.create.div('.xiaolianButton_new1', ui.arena, plugin.click.huanfu);
					var node2 = ui.create.div('.juliButton_new1', ui.arena, ui.click.pause);
					var node22 = ui.create.div('.meiguiButton_new1', ui.arena);
					var node212 = ui.create.div('.meiguiButton_new11', ui.arena);
					var node212 = ui.create.div('.huanfuButton_new1', ui.arena);
					var node2122 = ui.create.div('.jiluButton_new1', ui.arena);
					var node21222 = ui.create.div('fanhuibjButton_new1', ui.arena);
					var node6123 = ui.create.div('.bujianSbj1Button_new', ui.arena);
					//-------------------//
				} else {
					//-------新版----------//
					var node63 = ui.create.div('.bujianbjButton_new', ui.arena);
					var node623 = ui.create.div('.bujianSbjButton_new', ui.arena);
					var node633 = ui.create.div('.fanhuibjButton_new', ui.arena);
					var node6 = ui.create.div('.huanfuButton_new', ui.arena, function() {
						game.playAudio('..', 'extension', '十周年UI', 'audio/XianxianEnter');
						ui.click.auto();
					});
					// 设置提示
					node6.title = '托管';
					var node61 = ui.create.div('.huanfuButton1_new', ui.arena, function() {
						game.playAudio('..', 'extension', '十周年UI', 'audio/XianxianEnter');
						ui.click.auto();
					});
					// 设置提示
					node61.title = '托管';
					var node641 = ui.create.div('.huanfuButton12_new', ui.arena, function() {
						game.playAudio('..', 'extension', '十周年UI', 'audio/XianxianEnter');
						// 切换全屏状态
						if (window.node && window.node.gui) {
							// NW.js环境
							try {
								let win = window.node.gui.Window.get();
								if (win.isFullscreen) {
									win.leaveFullscreen();
								} else {
									win.enterFullscreen();
								}
							} catch (e) {
								console.log('全屏切换失败');
							}
						} else if (window.require) {
							// Electron环境
							try {
								let remote = require('@electron/remote');
								if (remote) {
									let win = remote.getCurrentWindow();
									if (win.isFullScreen()) {
										win.setFullScreen(false);
									} else {
										win.setFullScreen(true);
									}
								}
							} catch (e) {
								// 如果不是客户端环境，尝试使用浏览器的全屏API
								if (document.fullscreenElement) {
									document.exitFullscreen();
								} else {
									document.documentElement.requestFullscreen();
								}
							}
						} else {
							// 浏览器环境
							if (document.fullscreenElement) {
								document.exitFullscreen();
							} else {
								document.documentElement.requestFullscreen();
							}
						}
					});
					// 设置提示
					node641.title = '全屏';
					var node7 = ui.create.div('.jiluButton_new', ui.arena, function() {
						game.playAudio('..', 'extension', '十周年UI', 'audio/XianxianEnter');
						ui.click.pause();
					});
					// 设置提示
					node7.title = '记录';
					var node8 = ui.create.div('.meiguiButton_new', ui.arena);
					// 背景图片列表
					var backgroundList = [
						'extension/十周年UI/shoushaUI/lbtn/images/background/十周年UI.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/上兵伐谋.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/一将成名.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/旧十周年.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/周年华灯.jpg',
						// 可以继续添加更多背景
					];

					// 当前背景索引
					var currentBgIndex = 0;

					// 添加更换背景功能
					node8.listen(function(e) {
						e.stopPropagation();

						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 切换到下一个背景
						currentBgIndex = (currentBgIndex + 1) % backgroundList.length;

						// 更新背景
						ui.background.style.backgroundImage =
							`url('${backgroundList[currentBgIndex]}')`;

						// 保存当前背景设置
						game.saveConfig('background', currentBgIndex);
					});
					// 设置提示
					node8.title = '背景';
					var node81 = ui.create.div('.meiguiButton1_new', ui.arena);
					// 背景图片列表
					var backgroundList = [
						'extension/十周年UI/shoushaUI/lbtn/images/background/十周年UI.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/上兵伐谋.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/一将成名.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/旧十周年.jpg',
						'extension/十周年UI/shoushaUI/lbtn/images/background/周年华灯.jpg',
						// 可以继续添加更多背景
					];

					// 当前背景索引
					var currentBgIndex = 0;

					// 添加更换背景功能
					node81.listen(function(e) {
						e.stopPropagation();

						// 播放音效
						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 切换到下一个背景
						currentBgIndex = (currentBgIndex + 1) % backgroundList.length;

						// 更新背景
						ui.background.style.backgroundImage =
							`url('${backgroundList[currentBgIndex]}')`;

						// 保存当前背景设置
						game.saveConfig('background', currentBgIndex);
					});
					// 设置提示
					node81.title = '背景';
					var node9 = ui.create.div('.xiaolianButton_new', ui.arena);
					// 添加打开武将资料卡功能
					node9.listen(function(e) {
						e.stopPropagation();

						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 打开武将资料卡
						if (game.me && game.me.name && game.me.name2) {
							// 双将模式
							var name1 = game.me.name;
							var name2 = game.me.name2;
							ui.click.charactercard(name1, null, null, true);
							setTimeout(() => {
								ui.click.charactercard(name2, null, null, true);
							}, 100);
						} else if (game.me && game.me.name) {
							// 单将模式
							var name = game.me.name;
							ui.click.charactercard(name, null, null, true);
						}
					});
					// 设置提示
					node9.title = '武将信息';
					var node91 = ui.create.div('.xiaolianButton1_new', ui.arena);
					// 添加打开武将资料卡功能
					node91.listen(function(e) {
						e.stopPropagation();

						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 打开武将资料卡
						if (game.me && game.me.name && game.me.name2) {
							// 双将模式
							var name1 = game.me.name;
							var name2 = game.me.name2;
							ui.click.charactercard(name1, null, null, true);
							setTimeout(() => {
								ui.click.charactercard(name2, null, null, true);
							}, 100);
						} else if (game.me && game.me.name) {
							// 单将模式
							var name = game.me.name;
							ui.click.charactercard(name, null, null, true);
						}
					});
					// 设置提示
					node91.title = '武将信息';
					var node61 = ui.create.div('.juliButton_new', ui.arena);
					var node72 = ui.create.div('.luxiangButton_new', ui.arena);
					// 添加打开选项功能
					node72.listen(function(e) {
						e.stopPropagation();

						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 直接打开游戏选项
						ui.click.configMenu();
						// 或者使用
						// game.pause2();
					});
					// 设置提示
					node72.title = '菜单';
					var node712 = ui.create.div('.luxiangButton1_new', ui.arena);
					// 添加打开选项功能
					node712.listen(function(e) {
						e.stopPropagation();

						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 直接打开游戏选项
						ui.click.configMenu();
						// 或者使用
						// game.pause2();
					});
					// 设置提示
					node712.title = '菜单';
					var node83 = ui.create.div('.touxiangButton_new', ui.arena);
					// 添加投降功能
					node83.listen(function(e) {
						e.stopPropagation();

						// 播放音效
						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 直接投降
						game.over(false);
					});
					// 添加按钮状态检查
					game.checkSurrenderButton = function() {
						// 只在游戏进行中且为自己回合时可用
						if (game.me && game.me.isAlive() && !game.over) {
							node83.classList.remove('disabled');
							node83.style.opacity = '1';
						} else {
							node83.classList.add('disabled');
							node83.style.opacity = '0.5';
						}
					};
					// 设置提示
					node83.title = '投降';
					var node813 = ui.create.div('.touxiang1Button_new', ui.arena);
					// 添加重开功能
					node813.listen(function(e) {
						e.stopPropagation();

						// 播放音效
						game.playAudio("../extension/十周年UI/audio/XianxianEnter.mp3");

						// 直接重新开始游戏
						game.reload();
					});
					// 添加按钮状态检查
					game.checkRestartButton = function() {
						if (game.me && !game.over) {
							node813.classList.remove('disabled');
							node813.style.opacity = '1';
						} else {
							node813.classList.add('disabled');
							node813.style.opacity = '0.5';
						}
					};
					node813.title = '重开';
					var node94 = ui.create.div('.huatongButton_new', ui.arena);
					//---------------------//
				}
				var node4 = ui.create.div('.tuoguanButton', ui.arena, ui.click.auto);
				var node = ui.create.div('.handcardNumber', ui.arena).hide();

				node.node = {
					cardPicture: ui.create.div('.cardPicture', node),
					cardNumber: ui.create.div('.cardNumber', node),

				};
				node.updateCardnumber = function() {
					if (!game.me) return;

					var cardNumber2 = game.me.countCards('h') || 0;
					var cardNumber = game.me.getHandcardLimit() || 0;
					var numbercolor = 'white';
					if (cardNumber2 > cardNumber) numbercolor = 'red';
					if (cardNumber == Infinity) cardNumber = '∞'
					this.node.cardNumber.innerHTML = '<span>' + '<font color=' + numbercolor +
						' > ' + cardNumber2 + '</font>' +
						'<sp style="font-size:20px; font-family:yuanli; color:#FFFCF5;">' + ' / ' +
						'</sp>' + cardNumber + '</span>'; /*手牌数参数*/
					//      this.setNumberAnimation(cardNumber);
					this.show();

					game.addVideo('updateCardnumber', null, {
						cardNumber: cardNumber,
					});
				};
				node.node.cardNumber.interval = setInterval(function() {
					ui.handcardNumber.updateCardnumber()
				}, 1000);
				//    game.addVideo('createCardRoundTime');
				game.addVideo('createhandcardNumber');
				return node;
			},
			cardRoundTime() {
				var node = ui.create.div('.cardRoundNumber', ui.arena);
				node.listen(function(e) {
					e.stopPropagation();
					game.playAudio('..', 'extension', '十周年UI', 'audio/XianxianEnter');
					ui.click.pause();
				});
				// 设置提示
				node.title = '记录';
				node.hide();
				node.node = {
					cardPileNumber: ui.create.div('.cardPileNumber', node),
					roundNumber: ui.create.div('.roundNumber', node),
					time: ui.create.div('.time', node),
				};

				node.updateRoundCard = function() {
					var cardNumber = ui.cardPile.childNodes.length || 0;
					var roundNumber = game.roundNumber || 0;
					this.node.roundNumber.innerHTML = '<span>第' + game.roundNumber + '轮</span>';
					this.setNumberAnimation(cardNumber);
					this.show();
					game.addVideo('updateCardRoundTime', null, {
						cardNumber: cardNumber,
						roundNumber: roundNumber,
					});
				};

				node.setNumberAnimation = function(num, step) {
					var item = this.node.cardPileNumber;
					clearTimeout(item.interval);
					if (!item._num) {
						item.innerHTML = '<span>' + num + '</span>';
						item._num = num;
					} else {
						if (item._num !== num) {
							if (!step) step = 500 / Math.abs(item._num - num);
							if (item._num > num) item._num--;
							else item._num++;
							item.innerHTML = '<span>' + item._num + '</span>';
							if (item._num !== num) {
								item.interval = setTimeout(function() {
									node.setNumberAnimation(num, step);
								}, step);
							}
						}
					}
				};

				ui.time4 = node.node.time;
				ui.time4.starttime = get.utc();
				ui.time4.interval = setInterval(function() {
					var num = Math.round((get.utc() - ui.time4.starttime) / 1000);
					if (num >= 3600) {
						var num1 = Math.floor(num / 3600);
						var num2 = Math.floor((num - num1 * 3600) / 60);
						var num3 = num - num1 * 3600 - parseInt(num2) * 60;
						if (num1 < 10) {
							num1 = '0' + num1.toString();
						}
						if (num2 < 10) {
							num2 = '0' + num2.toString();
						}
						if (num3 < 10) {
							num3 = '0' + num3.toString();
						}
						ui.time4.innerHTML = '<span>' + num1 + ':' + num2 + ':' + num3 +
							'</span>';
					} else {
						var num1 = Math.floor(num / 60);
						var num2 = num - num1 * 60;
						if (num1 < 10) {
							num1 = '0' + num1.toString();
						}
						if (num2 < 10) {
							num2 = '0' + num2.toString();
						}
						ui.time4.innerHTML = '<span>' + num1 + ':' + num2 + '</span>';
					}
				}, 1000);
				game.addVideo('createCardRoundTime');
				return node;
			},
		},
		click: {
			huanfu() {
				game.playAudio('../extension/十周年UI/shoushaUI/lbtn/images/CD/huanfu.mp3');
				window.zyile_charactercard ? window.zyile_charactercard(player, false) : ui.click
					.charactercard(game.me.name, game.zhu, lib.config.mode == 'mode_guozhan' ?
						'guozhan' : true);
			},
			confirm(link, target) {
				if (link === 'ok') {
					ui.click.ok(target);
				} else if (link === 'cancel') {
					ui.click.cancel(target);
				} else if (target.custom) {
					target.custom(link);
				}
			},
		},
		compare: {
			type(a, b) {
				if (a === b) return 0;
				var types = ['basic', 'trick', 'delay', 'equip'].addArray([a, b]);
				return types.indexOf(a) - types.indexOf(b);
			},
			name(a, b) {
				if (a === b) return 0;
				return a > b ? 1 : -1;
			},
			nature(a, b) {
				if (a === b) return 0;
				var nature = [undefined, 'fire', 'thunder'].addArray([a, b]);
				return nature.indexOf(a) - nature.indexOf(b);
			},
			suit(a, b) {
				if (a === b) return 0;
				var suit = ['diamond', 'heart', 'club', 'spade'].addArray([a, b]);
				return suit.indexOf(a) - suit.indexOf(b);
			},
			number(a, b) {
				return a - b;
			},
		},
	};
	return plugin;
});
