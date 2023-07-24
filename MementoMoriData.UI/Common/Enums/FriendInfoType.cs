using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("フレンド画面の取得データ")]
	public enum FriendInfoType
	{
		[Description("なし")]
		None,
		[Description("フレンド")]
		Friend,
		[Description("承認待ち")]
		ApprovalPending,
		[Description("申請中")]
		Applying,
		[Description("ブロック")]
		Block
	}
}
