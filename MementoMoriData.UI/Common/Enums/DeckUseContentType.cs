﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("デッキを使用したコンテンツ")]
	public enum DeckUseContentType
	{
		None,
		[Description("放置")]
		Auto,
		[Description("ボスバトル")]
		Boss,
		[Description("無窮の塔")]
		Infinite,
		[Description("時空の洞窟")]
		DungeonBattle,
		[Description("幻影の神殿")]
		LocalRaid,
		[Description("バトルリーグ（攻撃）")]
		BattleLeagueOffense,
		[Description("バトルリーグ（防御）")]
		BattleLeagueDefense,
		[Description("レジェンドリーグ（攻撃）")]
		LegendLeagueOffense,
		[Description("レジェンドリーグ（防御）")]
		LegendLeagueDefense,
		[Description("ギルドハント")]
		GuildHunt,
		[Description("愁（しゅう）の塔")]
		BlueTower,
		[Description("業（ごう）の塔")]
		RedTower,
		[Description("心（しん）の塔")]
		GreenTower,
		[Description("渇（かつ）の塔")]
		YellowTower,
		[Description("ギルドバトル")]
		GuildBattle = 1000,
		[Description("グランドバトル")]
		GrandBattle = 2000
	}
}
