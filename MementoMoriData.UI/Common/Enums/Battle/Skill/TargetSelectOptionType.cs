﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("ターゲット選択オプションタイプ")]
	public enum TargetSelectOptionType
	{
		[Description("ステルス無視")]
		IgnoreStealth = 1,
		[Description("透明無視")]
		IgnoreNonTarget,
		[Description("挑発無視")]
		IgnoreTaunt,
		[Description("ロックオン無視")]
		IgnoreLockOn
	}
}
