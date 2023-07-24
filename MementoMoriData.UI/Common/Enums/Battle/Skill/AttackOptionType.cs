﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("攻撃オプション種別")]
	public enum AttackOptionType
	{
		[Description("シールド類無視")]
		IgnoreShieldType = 1,
		[Description("必中")]
		PerfectHit,
		[Description("必ずクリティカル")]
		PerfectCritical,
		[Description("クリティカル不可")]
		NoneCritical
	}
}
