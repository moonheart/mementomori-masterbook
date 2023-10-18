using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("対象キャラクター")]
	[Obsolete("α2でスキルの構造が変わったため、削除予定です！")]
	public enum TargetType
	{
		[Description("単体")]
		OnlyOne,
		[Description("全体")]
		All
	}
}
