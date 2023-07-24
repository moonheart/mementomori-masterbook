using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("祈りの泉：プレイヤータイプ")]
	public enum BountyQuestPlayerType
	{
		[Description("自分")]
		Self,
		[Description("フレンドとギルドメンバー")]
		FriendAndGuildMember
	}
}
