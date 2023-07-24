using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("スキルタイプ")]
	[Obsolete("α2でスキルの構造が変わったため、削除予定です！")]
	public enum SkillType
	{
		[Description("攻撃")]
		Attack,
		[Description("回復")]
		Recovery
	}
}
