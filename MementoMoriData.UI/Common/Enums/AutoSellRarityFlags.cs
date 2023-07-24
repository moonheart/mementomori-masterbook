﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("自動販売フラグ")]
	[Flags]
	public enum AutoSellRarityFlags
	{
		[Description("AutoSellRarityD")]
		AutoSellRarityD = 1,
		[Description("AutoSellRarityC")]
		AutoSellRarityC = 2,
		[Description("AutoSellRarityB")]
		AutoSellRarityB = 4,
		[Description("AutoSellRarityA")]
		AutoSellRarityA = 8,
		[Description("AutoSellCanNotEquip")]
		AutoSellCanNotEquip = 16
	}
}
