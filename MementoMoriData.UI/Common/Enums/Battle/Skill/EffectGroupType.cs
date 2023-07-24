using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("バフ・デバフ効果グループ種別")]
	public enum EffectGroupType
	{
		[Description("なし")]
		None,
		[Description("スタン")]
		Stun
	}
}
