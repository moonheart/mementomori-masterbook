using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("Backtraceに送信しないエラー")]
	[Flags]
	public enum BacktraceFilterFlags
	{
		[Description(null)]
		None = 0,
		[Description("カスタムメッセージ")]
		Message = 1,
		[Description("ハンドル済みエラー")]
		HandledException = 2,
		[Description("未ハンドルエラー")]
		UnhandledException = 4,
		[Description("ハング")]
		Hang = 8,
		[Description("Debug.LogError")]
		GameError = 16
	}
}
