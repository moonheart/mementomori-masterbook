﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("ミッション遷移先タイプ")]
	public enum MissionTransitionDestinationType
	{
		[Description("遷移先無し")]
		None,
		[Description("デイリーミッション")]
		MissionDaily = 101,
		[Description("プレイヤー情報")]
		PlayerInfo = 201,
		[Description("フレンド一覧")]
		Friend = 301,
		[Description("アカウント連携")]
		LinkAccount = 401,
		[Description("Twitter ")]
		Twitter,
		[Description("YouTube")]
		YouTube,
		[Description("ショップ（武具合成\uff3f聖装タブ）")]
		ExchangeLegendForge = 501,
		[Description("ショップ（武具合成\uff3f通常タブ）")]
		ExchangeEquipmentForge,
		[Description("ショップ（店舗タブ）")]
		Exchange,
		[Description("GvGショップ")]
		ExchangeGvG,
		[Description("時空の洞窟ショップ")]
		ExchangeDungeonBattle,
		[Description("ロイヤルショップ\uff3fダイヤ購入タブ")]
		Shop = 601,
		[Description("キャラ画面（所持キャラタブ）")]
		CharacterList = 701,
		[Description("キャラ画面（進化タブ）")]
		CharacterRankUp,
		[Description("レベルリンク（共鳴クリスタル）")]
		LevelLink,
		[Description("アイテムボックス_スフィア")]
		ItemBoxSphere = 801,
		[Description("アイテムボックス_武具")]
		ItemBoxEquipment,
		[Description("アイテムボックス画面（パーツタブ）")]
		ItemBoxParts,
		[Description("オートバトル")]
		AutoBattle = 901,
		[Description("高速バトルダイアログ")]
		AutoBattleQuick,
		[Description("時空の洞窟")]
		DungeonBattle = 1001,
		[Description("無窮の塔")]
		TowerBattle = 1101,
		[Description("バトルリーグ")]
		BattleLeague = 1201,
		[Description("幻影の神殿")]
		LocalRaid = 1301,
		[Description("祈りの泉（ノーマルタブ）")]
		BountyQuestSolo = 1401,
		[Description("祈りの泉（チームタブ）")]
		BountyQuestTeam,
		[Description("ガチャ（キャラタブ）")]
		Gacha = 1501,
		[Description("ギルド")]
		Guild = 1601,
		[Description("ギルドレイド画面（ソーニャ）")]
		GuildRaid,
		[Description("チャット")]
		Chat = 1701,
		[Description("各OSのストア")]
		OsStore = 1801,
		[Description("キャラ詳細")]
		CharacterDetail = 1901,
		[Description("マイページお気に入り設定ダイアログ")]
		FavoriteCharacter = 2001,
		[Description("パネル図鑑")]
		PanelPictureBook = 2101,
		[Description("楽曲再生")]
		MusicPlayer = 2201,
		[Description("ギルドツリーメイン画面")]
		GuildTower = 2301,
		[Description("ギルドツリーLV強化ダイアログ")]
		GuildTowerReinforceJob
	}
}
