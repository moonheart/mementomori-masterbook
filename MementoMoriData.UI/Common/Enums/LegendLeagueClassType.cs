using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("レジェンドリーグ階級の種類")]
	public enum LegendLeagueClassType
	{
		None,
		[Description("シュバリエ")]
		Chevalier,
		[Description("パラディン")]
		Paladin,
		[Description("デューク")]
		Duke,
		[Description("ロイヤルランク")]
		Royal,
		[Description("レジェンドランク")]
		Legend,
		[Description("ワールド・ルーラー")]
		WorldRuler
	}
}
