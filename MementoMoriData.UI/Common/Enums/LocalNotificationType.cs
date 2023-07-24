﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("ローカル通知種別")]
	public enum LocalNotificationType
	{
		None,
		[Description("オートバトル報酬上限到達")]
		AutoBattle,
		[Description("幻影の神殿開始")]
		LocalRaid,
		[Description("バトルリーグ報酬受け取り")]
		BattleLeagueReward,
		[Description("幻影の神殿イベント報酬増加")]
		LocalRaidRewardIncrease
	}
}
