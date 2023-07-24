using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("新規ユーザー管理種別")]
	public enum ManagementNewUserType
	{
		[Description("タイムサーバー単位")]
		TimeServer,
		[Description("ワールド単位")]
		World
	}
}
