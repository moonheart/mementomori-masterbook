﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums
{
	[Description("バトルパラメータの種類")]
	public enum BattleParameterType
	{
		[Description("HP")]
		Hp = 1,
		[Description("攻撃力")]
		AttackPower,
		[Description("物理ダメージ緩和")]
		PhysicalDamageRelax,
		[Description("魔法ダメージ緩和")]
		MagicDamageRelax,
		[Description("命中")]
		Hit,
		[Description("回避")]
		Avoidance,
		[Description("クリティカル")]
		Critical,
		[Description("クリティカル耐性")]
		CriticalResist,
		[Description("クリダメ強化")]
		CriticalDamageEnhance,
		[Description("物理クリダメ緩和")]
		PhysicalCriticalDamageRelax,
		[Description("魔法クリダメ緩和")]
		MagicCriticalDamageRelax,
		[Description("防御貫通力")]
		DefensePenetration,
		[Description("防御力")]
		Defense,
		[Description("物魔防御貫通")]
		DamageEnhance,
		[Description("弱体効果命中")]
		DebuffHit,
		[Description("弱体効果耐性")]
		DebuffResist,
		[Description("リフレクト")]
		DamageReflect,
		[Description("HP吸収")]
		HpDrain,
		[Description("スピード")]
		Speed
	}
}
