using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("ガチャグループタイプ")]
	public enum GachaGroupType
	{
		[Description("グループ無し")]
		None,
		[Description("属性")]
		Element,
		[Description("聖天使の神託")]
		HolyAngel
	}
}
