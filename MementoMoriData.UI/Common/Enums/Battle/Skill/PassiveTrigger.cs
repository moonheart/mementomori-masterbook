﻿using System;
using System.ComponentModel;

namespace Ortega.Share.Enums.Battle.Skill
{
	[Description("パッシブスキルトリガー")]
	public enum PassiveTrigger
	{
		[Description("なし")]
		None,
		[Description("ターン開始時")]
		TurnStart,
		[Description("ターン終了時")]
		TurnEnd,
		[Description("計算前パッシブ")]
		BeforeCalculation,
		[Description("被致命的ダメージ時")]
		InstantDeathDamage = 5,
		[Description("自分死亡時")]
		SelfDead,
		[Description("第三者味方死亡時")]
		AllyDead,
		[Description("被攻撃時")]
		ReceiveDamage,
		[Description("攻撃時")]
		GiveDamage,
		[Description("第三者の攻撃時、味方の被攻撃時")]
		AllyReceiveDamage,
		[Description("被デバフ時")]
		ReceiveDebuff,
		[Description("デバフ時")]
		GiveDeBuff,
		[Description("第三者のデバフ時")]
		AllyReceiveDeBuff,
		[Description("回復時")]
		GiveHeal,
		[Description("第三者の回復時")]
		AllyReceiveHeal,
		[Description("与バフ時")]
		GiveBuff,
		[Description("自身以外の味方の与バフ時")]
		AllyGiveBuff,
		[Description("敵復活時")]
		EnemyRecovery,
		[Description("自分復活時")]
		SelfRecovery,
		[Description("第三者敵死亡時パッシブ")]
		OtherEnemyDead,
		[Description("敵死亡時")]
		EnemyDead,
		[Description("第三者味方の攻撃時")]
		AllyGiveDamage,
		[Description("第三者敵の与回復時")]
		EnemyReceiveHeal,
		[Description("被バフ時")]
		ReceiveBuff,
		[Description("敵の与バフ時")]
		EnemyGiveBuff,
		[Description("戦闘開始時")]
		BattleStart,
		[Description("戦闘終了時")]
		BattleEnd,
		[Description("ターン開始時(行動順決定前)")]
		TurnStartBeforeSpeedCheck,
		[Description("被攻撃時（命中or回避）")]
		TargetAttack,
		[Description("被回復時")]
		ReceiveHeal,
		[Description("被連携ダメージ時")]
		ReceiveResonanceDamage,
		[Description("行動開始時")]
		ActionStart,
		[Description("行動終了時")]
		ActionEnd,
		[Description("被ダメージ量判定(自分の情報だけ参照)")]
		CheckReceiveDamageSelf = 41,
		[Description("被ダメージ量判定")]
		CheckReceiveDamage,
		[Description("被持続ダメージ量判定(P41)時パッシブトリガー")]
		NextCheckReceiveDamageSelf,
		[Description("被ダメージ量判定")]
		NextCheckReceiveDamage,
		[Description("被致命的ダメージ時回復")]
		RecoveryFromInstantDeathDamage = 52,
		[Description("特殊ダメージ死亡(毒、共鳴など)")]
		SpecialDamageDead = 62
	}
}
