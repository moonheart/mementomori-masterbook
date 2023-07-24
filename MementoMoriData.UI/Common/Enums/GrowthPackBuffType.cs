using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("成長パックバフタイプ")]
	public enum GrowthPackBuffType
	{
		[Description("放置バトル")]
		Auto = 1,
		[Description("バトルリーグ")]
		BattleLeague,
		[Description("ギルドレイド")]
		GuildRaid
	}
}
