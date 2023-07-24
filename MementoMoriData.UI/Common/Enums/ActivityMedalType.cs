using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("貢献メダルタイプ")]
	public enum ActivityMedalType
	{
		[Description("デイリー")]
		Daily = 1,
		[Description("ウィークリー")]
		Weekly,
		[Description("初心者ミッション")]
		Beginner,
		[Description("課金ミッション")]
		Currency,
		[Description("期間限定")]
		Limited
	}
}
