using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("武具強化アイテムのタイプ")]
	public enum EquipmentReinforcementItemType
	{
		[Description("強化石")]
		ReinforcedStone = 1,
		[Description("強化結晶")]
		ReinforcedCrystal
	}
}
