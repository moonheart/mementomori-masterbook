using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("懸賞カウンター条件タイプ")]
	public enum BountyQuestConditionType
	{
		[Description("属性")]
		Element,
		[Description("レアリティ")]
		Rarity
	}
}
