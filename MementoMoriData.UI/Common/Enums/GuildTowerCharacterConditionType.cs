using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	public enum GuildTowerCharacterConditionType
	{
		[Description("健康")]
		None,
		[Description("疲労(小)")]
		FatigueSmall,
		[Description("疲労(大)")]
		FatigueLarge
	}
}
