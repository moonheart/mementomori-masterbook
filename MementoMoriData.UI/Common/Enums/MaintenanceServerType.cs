using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("ターゲットサーバータイプ")]
	public enum MaintenanceServerType
	{
		[Description("全て")]
		All,
		[Description("認証サーバー")]
		AuthServer,
		[Description("ゲームサーバー")]
		GameServer
	}
}
