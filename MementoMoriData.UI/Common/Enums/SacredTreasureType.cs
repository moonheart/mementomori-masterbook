using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("神器タイプ")]
	public enum SacredTreasureType
	{
		[Description("神器ではない")]
		None,
		[Description("魔装")]
		Matchless,
		[Description("聖装")]
		Legend,
		[Description("双ステータス神器")]
		DualStatus
	}
}
