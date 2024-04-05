using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("アイテム変換タイプ")]
	public enum ChangeItemType
	{
		[Description("販売")]
		Sell,
		[Description("ゴールド交換")]
		GoldExchange
	}
}
