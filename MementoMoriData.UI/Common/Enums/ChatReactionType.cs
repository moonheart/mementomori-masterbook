using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	public enum ChatReactionType
	{
		[Description("リアクションなし")]
		None,
		[Description("ウインク")]
		Wink,
		[Description("乾杯")]
		Cheers,
		[Description("ハート")]
		Heart,
		[Description("悲しい")]
		Sad
	}
}
