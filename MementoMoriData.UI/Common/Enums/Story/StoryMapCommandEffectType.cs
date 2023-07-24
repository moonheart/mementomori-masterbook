using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Story
{
	[Description("ストーリーマップ演出のエフェクトタイプ")]
	public enum StoryMapCommandEffectType
	{
		[Description("なし")]
		None,
		[Description("光の柱")]
		Shine,
		[Description("土ぼこり")]
		Dust,
		[Description("キラキラ")]
		Twinkle = 101
	}
}
