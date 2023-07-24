﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("キャラクターの所持状態")]
	[Flags]
	public enum CharacterPossessionFlags
	{
		Unowned = 1,
		Possession = 2,
		Available = 4
	}
}
