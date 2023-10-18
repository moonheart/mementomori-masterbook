using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("RawDataダウンロードタイプ")]
	public enum RawDataDownloadType
	{
		[Description("なし")]
		None,
		[Description("タイトルダウンロード")]
		Title
	}
}
