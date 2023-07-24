using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	public enum BanChatType
	{
		[Description("不明")]
		None,
		[Description("全てのチャット")]
		All,
		[Description("ワールド、ワールドグループチャット")]
		WorldAndWorldGroup
	}
}
