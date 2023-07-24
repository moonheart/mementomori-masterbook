using Ortega.Share.Enums;
using Ortega.Share.Enums.Battle.Skill;
using Ortega.Share.Enums.Story;

namespace MementoMoriData.UI.Common;

public static class Util
{
    private static Dictionary<string, Dictionary<long, string>> _enumValueCache = new();

    static Util()
    {
        AddEnumCache<ActiveSkillType>();
        AddEnumCache<AttackOptionSubType>();
        AddEnumCache<AttackOptionType>();
        AddEnumCache<EffectGroupType>();
        AddEnumCache<EffectType>();
        AddEnumCache<HitType>();
        AddEnumCache<HpEffectType>();
        AddEnumCache<PassiveTrigger>();
        AddEnumCache<PassiveType>();
        AddEnumCache<RemoveEffectType>();
        AddEnumCache<SkillCategory>();
        AddEnumCache<SkillDisplayType>();
        AddEnumCache<SubSetType>();
        AddEnumCache<TargetGroupType>();
        AddEnumCache<TargetSelectType>();

        AddEnumCache<StoryMapCommandEffectType>();
        AddEnumCache<StoryMapCommandType>();
        AddEnumCache<StoryObjectType>();

        AddEnumCache<AccountSuspensionType>();
        AddEnumCache<ActivityMedalType>();
        AddEnumCache<AnimationType>();
        AddEnumCache<ApiStatusCode>();
        AddEnumCache<AppAssetVersionEnvType>();
        AddEnumCache<AttributeEnhancementItemType>();
        AddEnumCache<AutoSellRarityFlags>();
        AddEnumCache<BacktraceFilterFlags>();
        AddEnumCache<BadgeType>();
        AddEnumCache<BanChatType>();
        AddEnumCache<BaseParameterType>();
        AddEnumCache<BattleActionAdditionalFlags>();
        AddEnumCache<BattleActionType>();
        AddEnumCache<BattleCommonSeType>();
        AddEnumCache<BattleDamageType>();
        AddEnumCache<BattleFieldCharacterGroupType>();
        AddEnumCache<BattleParameterType>();
        AddEnumCache<BattleScheduleType>();
        AddEnumCache<BattleType>();
        AddEnumCache<BlinkAnimationType>();
        AddEnumCache<BountyQuestAppearanceType>();
        AddEnumCache<BountyQuestConditionType>();
        AddEnumCache<BountyQuestPlayerType>();
        AddEnumCache<BountyQuestRarityFlags>();
        AddEnumCache<BountyQuestType>();
        AddEnumCache<CastleType>();
        AddEnumCache<ChangeItemType>();
        AddEnumCache<ChangeParameterType>();
        AddEnumCache<CharacterBloodType>();
        AddEnumCache<CharacterColorType>();
        AddEnumCache<CharacterPossessionFlags>();
        AddEnumCache<CharacterRarityFlags>();
        AddEnumCache<CharacterSortType>();
        AddEnumCache<CharacterStrengtheningItemType>();
        AddEnumCache<CharacterTrainingMaterialType>();
        AddEnumCache<CharacterType>();
        AddEnumCache<CharacterVoiceCategory>();
        AddEnumCache<CharacterVoiceType>();
        AddEnumCache<ChatType>();
        AddEnumCache<CommandChainType>();
        AddEnumCache<CountryCodeType>();
        AddEnumCache<CurrencyType>();
        AddEnumCache<DateAddTimeType>();
        AddEnumCache<DeckUseContentType>();
        AddEnumCache<DeviceType>();
        AddEnumCache<DungeonBattleDifficultyType>();
        AddEnumCache<DungeonBattleGridState>();
        AddEnumCache<DungeonBattleGridType>();
        AddEnumCache<DungeonBattleRelicBattlePowerBonusTargetType>();
        AddEnumCache<DungeonBattleRelicRarityType>();
        AddEnumCache<EffectGroupIconType>();
        AddEnumCache<ElementBonusConditionType>();
        AddEnumCache<ElementBonusPhaseType>();
        AddEnumCache<ElementClassificationType>();
        AddEnumCache<ElementType>();
        AddEnumCache<EmotionFlags>();
        AddEnumCache<EquipmentCategory>();
        AddEnumCache<EquipmentRarityFlags>();
        AddEnumCache<EquipmentReinforcementItemType>();
        AddEnumCache<EquipmentSlotType>();
        AddEnumCache<ErrorHandlingType>();
        AddEnumCache<ErrorLevel>();
        AddEnumCache<ErrorMessageType>();
        AddEnumCache<EventExchangePlaceItemType>();
        AddEnumCache<EvolutionType>();
        AddEnumCache<ExchangePlaceItemType>();
        AddEnumCache<ExchangePlaceType>();
        AddEnumCache<FriendInfoType>();
        AddEnumCache<FriendStatusType>();
        AddEnumCache<GachaAddCharacterType>();
        AddEnumCache<GachaBonusGaugeType>();
        AddEnumCache<GachaCaseFlags>();
        AddEnumCache<GachaCategoryType>();
        AddEnumCache<GachaDestinyType>();
        AddEnumCache<GachaGroupType>();
        AddEnumCache<GachaRelicType>();
        AddEnumCache<GachaResetType>();
        AddEnumCache<GachaSelectListType>();
        AddEnumCache<GachaTicketType>();
        AddEnumCache<GachaTitleColorType>();
        AddEnumCache<GlobalGvgGroupType>();
        AddEnumCache<GlobalGvgPhaseType>();
        AddEnumCache<GrowthPackBuffType>();
        AddEnumCache<GuerrillaLotteryGroupType>();
        AddEnumCache<GuildActivityPolicyType>();
        AddEnumCache<GuildRaidAutoOpenFailType>();
        AddEnumCache<GuildRaidBossType>();
        AddEnumCache<GvgCastleState>();
        AddEnumCache<GvgDialogType>();
        AddEnumCache<HelpParameterType>();
        AddEnumCache<ImagePositionFormatType>();
        AddEnumCache<InquiryButtonType>();
        AddEnumCache<ItemRarityFlags>();
        AddEnumCache<ItemType>();
        AddEnumCache<JobFlags>();
        AddEnumCache<LanguageType>();
        AddEnumCache<LegendLeagueClassType>();
        AddEnumCache<LimitedEventType>();
        AddEnumCache<LocalNotificationSendType>();
        AddEnumCache<LocalNotificationType>();
        AddEnumCache<LocalRaidEventType>();
        AddEnumCache<LocalRaidQuestGroupType>();
        AddEnumCache<LocalRaidQuestType>();
        AddEnumCache<LocalRaidRoomConditionsType>();
        AddEnumCache<LockEquipmentDeckType>();
        AddEnumCache<LoopAnimationType>();
        AddEnumCache<LotteryType>();
        AddEnumCache<MaintenanceAreaType>();
        AddEnumCache<MaintenanceFunctionType>();
        AddEnumCache<MaintenancePlatformType>();
        AddEnumCache<MaintenanceServerType>();
        AddEnumCache<ManagementNewUserType>();
        AddEnumCache<MatchlessSacredTreasureExpItemType>();
        AddEnumCache<MemoryLogType>();
        AddEnumCache<MissionAchievementType>();
        AddEnumCache<MissionActivityRewardStatusType>();
        AddEnumCache<MissionActivityRewardType>();
        AddEnumCache<MissionGroupType>();
        AddEnumCache<MissionStatusType>();
        AddEnumCache<MissionTransitionDestinationType>();
        AddEnumCache<MissionType>();
        AddEnumCache<NoticeAccessType>();
        AddEnumCache<NoticeButtonImageType>();
        AddEnumCache<NoticeCategoryType>();
        AddEnumCache<NotificationType>();
        AddEnumCache<OpenCommandType>();
        AddEnumCache<OpenContentType>();
        AddEnumCache<PlayerGuildPositionType>();
        AddEnumCache<PlayerOrderType>();
        AddEnumCache<PlayerSettingsType>();
        AddEnumCache<PresentType>();
        AddEnumCache<PrivacySettingsType>();
        AddEnumCache<PurchaseAgeGroupType>();
        AddEnumCache<PvpRankingRewardType>();
        AddEnumCache<QuestDifficultyType>();
        AddEnumCache<QuestQuickExecuteType>();
        AddEnumCache<QuestQuickTicketRewardFlags>();
        AddEnumCache<QuestQuickTicketType>();
        AddEnumCache<RankUpType>();
        AddEnumCache<RemoteNotificationType>();
        AddEnumCache<RewardMostElementType>();
        AddEnumCache<RewardRarityPointGroupType>();
        AddEnumCache<SacredTreasureType>();
        AddEnumCache<SecondaryFrameType>();
        AddEnumCache<ShopBuyLimitType>();
        AddEnumCache<ShopChargeBonusMissionType>();
        AddEnumCache<ShopCountResetType>();
        AddEnumCache<ShopCurrencyMissionType>();
        AddEnumCache<ShopDisplayPeriodType>();
        AddEnumCache<ShopGuerrillaPackOpenType>();
        AddEnumCache<ShopGuerrillaPackRankType>();
        AddEnumCache<ShopProductGrowthPackType>();
        AddEnumCache<ShopProductType>();
        AddEnumCache<ShopProductUiType>();
        AddEnumCache<SkillEnhancementItemFlag>();
        AddEnumCache<SkillType>();
        AddEnumCache<SnsType>();
        AddEnumCache<SphereType>();
        AddEnumCache<StartEndTimeZoneType>();
        AddEnumCache<SubSkillResultType>();
        AddEnumCache<SubSkillType>();
        AddEnumCache<SystemChatMessageIdType>();
        AddEnumCache<SystemChatType>();
        AddEnumCache<TargetType>();
        AddEnumCache<TimeServerType>();
        AddEnumCache<TowerBattleBossType>();
        AddEnumCache<TowerBattleRewardsType>();
        AddEnumCache<TowerType>();
        AddEnumCache<TradeShopAutoUpdateType>();
        AddEnumCache<TradeShopType>();
        AddEnumCache<TrainingItemType>();
        AddEnumCache<TrainingResultType>();
        AddEnumCache<TransferSpotType>();
        AddEnumCache<TreasureChestItemListType>();
        AddEnumCache<TreasureChestKeyType>();
        AddEnumCache<TreasureChestLotteryType>();
        AddEnumCache<UnitIconType>();
        AddEnumCache<UnitType>();
        AddEnumCache<UnlockCharacterDetailVoiceType>();
        AddEnumCache<UserSettingsType>();
        AddEnumCache<ViewTransitionType>();
    }

    private static void AddEnumCache<T>() where T : struct, Enum
    {
        var values = Enum.GetValues<T>();
        var dict = new Dictionary<long, string>();
        foreach (var value in values)
        {
            dict[Convert.ToInt64(value)] = value.ToString();
        }
        _enumValueCache.Add(typeof(T).Name, dict);
    }
    
    public static string? GetEnumValue(string enumName, long value)
    {
        return _enumValueCache.TryGetValue(enumName, out var dict)
            ? dict.TryGetValue(value, out var result) ? result : value.ToString()
            : value.ToString();
    }
}