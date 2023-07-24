using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("抽選タイプ")]
	public enum LotteryType
	{
		[Description("確率")]
		Percent,
		[Description("比率")]
		Weight
	}
}
