using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	public enum LocalRaidEventType
	{
		[Description("なし")]
		None,
		[Description("クエスト追加イベント")]
		PlusQuest,
		[Description("全日開催イベント")]
		FullOpen
	}
}
