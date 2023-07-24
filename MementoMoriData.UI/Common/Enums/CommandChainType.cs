using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("次のコマンドにつながる条件")]
	[Obsolete("α2でスキルの構造が変わったため、削除予定です！")]
	public enum CommandChainType
	{
		[Description("つながらない")]
		None,
		[Description("常につながる")]
		Always,
		[Description("誰かを倒すとつながる")]
		KillAny = 10
	}
}
