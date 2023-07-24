﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("パッシブスキル種別")]
	public enum PassiveType
	{
		[Description("なし")]
		None,
		[Description("キャラパッシブタイプ")]
		EachUnit,
		[Description("チームパッシブタイプ")]
		Team
	}
}
