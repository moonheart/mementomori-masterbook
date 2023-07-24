﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("画像位置フォーマット")]
	public enum ImagePositionFormatType
	{
		[Description("不明")]
		None,
		[Description("時空の洞窟イベント")]
		DungeonBattleEvent,
		[Description("神殿イベント")]
		LocalRaidEvent
	}
}
