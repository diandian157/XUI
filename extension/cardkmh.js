import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function cardkmh() {
	var name = lib.config.extension_十周年UI_cardkmh;
	var style = document.createElement('style');
	var css = `
		.hand-cards>.handcards>.card {/*手牌边框美化*/
			margin: 0px;
			width: 108px;
			height: 150px;
			position: absolute;
			transition-property: transform, opacity, left, top;
			border:1px solid;
			border-radius: 6px;
			border-image-source: url('${lib.assetURL}extension/十周年UI/assets/image/${name}.png');
			border-image-slice: 20 20 20 20;
			border-image-width: 20px 20px 20px 20px;/*此处调节边框大小*/
			z-index: 1;
		}

		#arena>.card, 
		#arena.oblongcard:not(.chess)>.card,
		#arena.oblongcard:not(.chess) .handcards>.card {/*打出牌边框美化*/
			width: 108px;
			height: 150px;
			border:1px solid;
			border-radius: 6px;
			border-image-source: url('${lib.assetURL}extension/十周年UI/assets/image/${name}.png');
			border-image-slice: 20 20 20 20;
			border-image-width: 16px 16px 16px 16px;/*此处调节边框大小*/
		}
	`;
	style.innerHTML = css;
	document.head.appendChild(style);
}
