﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("サブスキルの種類")]
	public enum SubSkillType
	{
		[Description("HP変化系スキル")]
		HpSubSkill = 1,
		[Description("STATUS変化系スキル")]
		StatusSubSkill
	}
}
