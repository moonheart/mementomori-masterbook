using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("訓練結果タイプ")]
	public enum TrainingResultType
	{
		[Description("成功")]
		Success,
		[Description("大成功")]
		SuperSuccess,
		[Description("超成功")]
		SuperSuperSuccess
	}
}
