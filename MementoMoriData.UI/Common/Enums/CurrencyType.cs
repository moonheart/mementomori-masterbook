﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("ダイヤ種別")]
	public enum CurrencyType
	{
		[Description("無償ダイヤ")]
		Free,
		[Description("有償ダイヤ(IOS)")]
		PaidIOS,
		[Description("有償ダイヤ(Android)")]
		PaidAndroid,
		[Description("有償ダイヤ(DMM)")]
		PaidDMM = 5
	}
}
