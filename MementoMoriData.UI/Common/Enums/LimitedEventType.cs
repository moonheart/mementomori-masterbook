using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("期間限定イベントの種類")]
	public enum LimitedEventType
	{
		[Description("不明")]
		None,
		[Description("属性の塔全開放")]
		ElementTowerAllRelease,
		[Description("シリアルコード入力")]
		SerialCode,
		[Description("課金で古いシステムを使用する")]
		InAppPurchaseOldSystem = 9999
	}
}
