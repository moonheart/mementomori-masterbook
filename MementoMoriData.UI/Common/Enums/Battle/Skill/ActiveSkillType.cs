using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("アクティブスキル種別")]
	public enum ActiveSkillType
	{
		[Description("通常攻撃")]
		NormalSkill,
		[Description("スキル1")]
		ActiveSkill1,
		[Description("スキル2")]
		ActiveSkill2
	}
}
