import {
	lib,
	game,
	ui,
	get,
	ai,
	_status
} from "../../../noname.js";

//来源/参考自 2v2美化(作者@西瓜)
export function versus() {
	if (lib.config.mode == 'versus' && get.config('versus_mode') == 'two') {
		lib.game.chooseCharacterTwo = function() {
			var next = game.createEvent("chooseCharacter");
			next.showConfig = true;
			next.setContent(function() {
				"step 0";
				ui.arena.classList.add("choose-character");
				if (true) {
					for (var i in lib.skill) {
						if (lib.skill[i].changeSeat) {
							lib.skill[i] = {};
							if (lib.translate[i + '_info']) {
								lib.translate[i + '_info'] = '此模式下不可用';
							}
						}
					}
				}
				var bool = Math.random() < 0.5;
				var bool2 = Math.random() < 0.5;
				var ref = game.players[0];

				ref.side = bool;
				ref.next.side = bool2;
				ref.next.next.side = !bool;
				ref.previous.side = !bool2;

				var firstChoose = game.players.randomGet();
				if (firstChoose.next.side == firstChoose.side) {
					firstChoose = firstChoose.next;
				}
				_status.firstAct = firstChoose;
				for (var i = 0; i < 4; i++) {
					firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
					firstChoose = firstChoose.next;
				}

				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].side == game.me.side) {
						game.players[i].node.identity.firstChild.innerHTML = "友";
					} else {
						game.players[i].node.identity.firstChild.innerHTML = "敌";
					}
					game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
				}
				//22选将框分配
				var list = [];
				var list4 = [];
				for (i in lib.characterReplace) {
					var ix = lib.characterReplace[i];
					for (var j = 0; j < ix.length; j++) {
						if (lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
					}
					if (ix.length) {
						list.push(i);
						list4.addArray(ix);
					}
				}
				for (i in lib.character) {
					if (!list4.includes(i) && !lib.filter.characterDisabled(i)) {
						list.push(i);
						list4.push(i);
					}
				}
				var choose = [];
				event.list = list;
				_status.characterlist = list4;

				if (true) {
					var one = _status.firstAct;
					var xia = game.me.next;
					var xxia = game.me.next.next;
					var shang = game.me.previous;
					if (game.me == _status.firstAct) { //主一号位
						xia.style.right = '350px';
						xia.style.top = '40px';
						xia.style.left = 'auto';
						xxia.style.right = '650px';
						xxia.style.top = '40px';
						xxia.style.left = 'auto';
					} else if (game.me.previous == _status.firstAct) { //主二号位
						xia.style.right = '0px';
						xia.style.top = '220px';
						xia.style.left = 'auto';
						xxia.style.left = '380px';
						xxia.style.top = '50px';
						xxia.style.right = 'auto';
					} else if (game.me.next == _status.firstAct) { //主视角四号位
						xia.style.right = '0px';
						xia.style.top = '220px';
						xia.style.left = 'auto';
						xxia.style.left = '380px';
						xxia.style.top = '50px';
						xxia.style.right = 'auto';
					} else if (game.me.next.next == _status.firstAct) { //主视角三号位
						xia.style.right = '350px';
						xia.style.top = '40px';
						xia.style.left = 'auto';
						xxia.style.right = '650px';
						xxia.style.top = '40px';
						xxia.style.left = 'auto';
					}
				}

				var addSetting = function(dialog) {
					dialog.add("选择座位").classList.add("add-setting");
					var seats = document.createElement("table");
					seats.classList.add("add-setting");
					seats.style.margin = "0";
					seats.style.width = "100%";
					seats.style.position = "relative";
					for (var i = 1; i <= game.players.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.innerHTML = get.cnNumber(i, true);
						td.link = i - 1;
						seats.appendChild(td);
						if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
							td.classList.add("bluebg");
						}
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
							if (_status.dragged) return;
							if (_status.justdragged) return;
							if (get.distance(_status.firstAct, game.me, "absolute") == this
								.link) return;
							var current = this.parentNode.querySelector(".bluebg");
							if (current) {
								current.classList.remove("bluebg");
							}
							this.classList.add("bluebg");
							_status.firstAct = game.me;
							for (var i = 0; i < this.link; i++) {
								_status.firstAct = _status.firstAct.previous;
							}
							var firstChoose = _status.firstAct;
							firstChoose.next.side = !firstChoose.side;
							firstChoose.next.next.side = !firstChoose.side;
							firstChoose.previous.side = firstChoose.side;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].side == game.me.side) {
									game.players[i].node.identity.firstChild.innerHTML = "友";
								} else {
									game.players[i].node.identity.firstChild.innerHTML = "敌";
								}
								game.players[i].node.identity.dataset.color = game.players[i]
									.side + "zhu";
							}
							for (var i = 0; i < 4; i++) {
								firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(
									i + 1, true) + "号位");
								firstChoose = firstChoose.next;
							}

							if (true) {
								var one = _status.firstAct;
								var xia = game.me.next;
								var xxia = game.me.next.next;
								var shang = game.me.previous;
								if (game.me == _status.firstAct) { //主一号位
									xia.style.right = '350px';
									xia.style.top = '40px';
									xia.style.left = 'auto';
									xxia.style.right = '650px';
									xxia.style.top = '40px';
									xxia.style.left = 'auto';
								} else if (game.me.previous == _status.firstAct) { //主二号位
									xia.style.right = '0px';
									xia.style.top = '220px';
									xia.style.left = 'auto';
									xxia.style.left = '380px';
									xxia.style.top = '50px';
									xxia.style.right = 'auto';
								} else if (game.me.next == _status.firstAct) { //主视角四号位
									xia.style.right = '0px';
									xia.style.top = '220px';
									xia.style.left = 'auto';
									xxia.style.left = '380px';
									xxia.style.top = '50px';
									xxia.style.right = 'auto';
								} else if (game.me.next.next == _status.firstAct) { //主视角三号位
									xia.style.right = '350px';
									xia.style.top = '40px';
									xia.style.left = 'auto';
									xxia.style.right = '650px';
									xxia.style.top = '40px';
									xxia.style.left = 'auto';
								}
							}
						});
					}
					dialog.content.appendChild(seats);
					if (game.me == game.zhu) {
						seats.previousSibling.style.display = "none";
						seats.style.display = "none";
					}

					dialog.add(ui.create.div(".placeholder.add-setting"));
					dialog.add(ui.create.div(".placeholder.add-setting"));
					if (get.is.phoneLayout()) dialog.add(ui.create.div(".placeholder.add-setting"));
				};
				var removeSetting = function() {
					var dialog = _status.event.dialog;
					if (dialog) {
						dialog.style.height = "";
						delete dialog._scrollset;
						var list = Array.from(dialog.querySelectorAll(".add-setting"));
						while (list.length) {
							list.shift().remove();
						}
						ui.update();
					}
				};
				event.addSetting = addSetting;
				event.removeSetting = removeSetting;

				var characterChoice;
				if (_status.brawl && _status.brawl.chooseCharacter) {
					characterChoice = _status.brawl.chooseCharacter(list, game.me);
				} else {
					characterChoice = list.randomGets(7);
				}
				var basenum = 1;
				var basestr = "选择角色";
				if (get.config("two_assign")) {
					basenum = 2;
					basestr = "选择你和队友的角色";
					event.two_assign = true;
				}
				if (get.config("replace_character_two")) {
					basestr += "（含一名替补角色）";
					_status.replacetwo = true;
					game.additionaldead = [];
					basenum *= 2;
				}
				var dialog = ui.create.dialog(basestr, [characterChoice, "characterx"]);
				game.me.chooseButton(true, dialog, basenum).set("onfree", true);
				if (!_status.brawl || !_status.brawl.noAddSetting) {
					if (get.config("change_identity")) {
						addSetting(dialog);
					}
				}

				ui.create.cheat = function() {
					_status.createControl = ui.cheat2;
					ui.cheat = ui.create.control("更换", function() {
						if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
							return;
						}
						if (game.changeCoin) {
							game.changeCoin(-3);
						}
						var buttons = ui.create.div(".buttons");
						var node = _status.event.dialog.buttons[0].parentNode;
						_status.event.dialog.buttons = ui.create.buttons(list.randomGets(7),
							"characterx", buttons);
						_status.event.dialog.content.insertBefore(buttons, node);
						buttons.addTempClass("start");
						node.remove();
						game.uncheck();
						game.check();
					});
					delete _status.createControl;
				};
				if (lib.onfree) {
					lib.onfree.push(function() {
						event.dialogxx = ui.create.characterDialog("heightset");
						if (ui.cheat2) {
							ui.cheat2.addTempClass("controlpressdownx", 500);
							ui.cheat2.classList.remove("disabled");
						}
					});
				} else {
					event.dialogxx = ui.create.characterDialog("heightset");
				}
				ui.create.cheat2 = function() {
					ui.cheat2 = ui.create.control("自由选将", function() {
						if (this.dialog == _status.event.dialog) {
							if (game.changeCoin) {
								game.changeCoin(10);
							}
							this.dialog.close();
							_status.event.dialog = this.backup;
							this.backup.open();
							delete this.backup;
							game.uncheck();
							game.check();
							if (ui.cheat) {
								ui.cheat.addTempClass("controlpressdownx", 500);
								ui.cheat.classList.remove("disabled");
							}
						} else {
							if (game.changeCoin) {
								game.changeCoin(-10);
							}
							this.backup = _status.event.dialog;
							_status.event.dialog.close();
							_status.event.dialog = _status.event.parent.dialogxx;
							this.dialog = _status.event.dialog;
							this.dialog.open();
							game.uncheck();
							game.check();
							if (ui.cheat) {
								ui.cheat.classList.add("disabled");
							}
						}
					});
					ui.cheat2.classList.add("disabled");
				};
				if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
					if (!ui.cheat && get.config("change_choice")) {
						ui.create.cheat();
					}
					if (!ui.cheat2 && get.config("free_choose")) {
						ui.create.cheat2();
					}
				}
				"step 1";
				if (ui.cheat) {
					ui.cheat.close();
					delete ui.cheat;
				}
				if (ui.cheat2) {
					ui.cheat2.close();
					delete ui.cheat2;
				}
				for (var i = 0; i < result.links.length; i++) {
					game.addRecentCharacter(result.links[i]);
				}
				game.me.init(result.links[0]);
				if (_status.replacetwo) {
					game.me.replacetwo = result.links[1];
				}
				event.list.remove(game.me.name1);
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i] != game.me) {
						if (_status.brawl && _status.brawl.chooseCharacter) {
							var list = _status.brawl.chooseCharacter(event.list, game.players[i]);
							game.players[i].init(list.randomGet());
							event.list.remove(game.players[i].name1);
							if (_status.replacetwo) {
								game.players[i].replacetwo = list.randomGet(game.players[i].name1);
								event.list.remove(game.players[i].replacetwo);
							}
						} else {
							if (event.two_assign && game.players[i].side == game.me.side) {
								if (_status.replacetwo) {
									game.players[i].init(result.links[2]);
									game.players[i].replacetwo = result.links[3];
								} else {
									game.players[i].init(result.links[1]);
								}
							} else {
								var name = event.list.randomRemove();
								if (lib.characterReplace[name] && lib.characterReplace[name].length) name =
									lib.characterReplace[name].randomGet();
								game.players[i].init(name);
								if (_status.replacetwo) {
									var name2 = event.list.randomRemove();
									if (lib.characterReplace[name2] && lib.characterReplace[name2].length)
										name2 = lib.characterReplace[name2].randomGet();
									game.players[i].replacetwo = name2;
								}
							}
						}
					}
				}
				for (var i = 0; i < game.players.length; i++) {
					_status.characterlist.remove(game.players[i].name1);
					_status.characterlist.remove(game.players[i].replacetwo);
				}
				setTimeout(function() {
					ui.arena.classList.remove("choose-character");
				}, 500);
				if (get.config("olfeiyang_four")) {
					var target = _status.firstAct.previous;
					if (target.isIn()) target.addSkill("olfeiyang");
				}
				game.addGlobalSkill("versus_viewHandcard");
				if (get.config("two_phaseswap")) {
					game.addGlobalSkill("autoswap");
					if (lib.config.show_handcardbutton) {
						ui.versushs = ui.create.system("手牌", null, true);
						lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
					}
				}
			});
		};
	};
}
