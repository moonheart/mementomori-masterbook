using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("懸賞カウンタータイプ")]
	public enum BountyQuestType
	{
		[Description("ソロ")]
		Solo,
		[Description("チーム")]
		Team,
		[Description("ゲリラ")]
		Guerrilla
	}
}
