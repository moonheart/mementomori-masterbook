﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("装備固定誘導ダイアログタイプ")]
	public enum LeadLockEquipmentDialogType
	{
		[Description("ダイアログ表示無し")]
		None,
		[Description("新キャラ入手")]
		NewCharacter,
		[Description("最後の更新から7日経過")]
		PassedDays
	}
}
