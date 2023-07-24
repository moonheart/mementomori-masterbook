using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("TowerBattleのボスのタイプ")]
	public enum TowerBattleBossType
	{
		[Description("通常ボス")]
		NormalBoss,
		[Description("中ボス")]
		StrongBoss,
		[Description("大ボス")]
		StrongestBoss
	}
}
