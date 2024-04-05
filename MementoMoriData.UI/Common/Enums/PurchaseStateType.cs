﻿using System;

namespace Ortega.Common.Enums
{
	public enum PurchaseStateType
	{
		None,
		Initializing,
		InitializingError,
		Ready,
		Purchasing,
		ProductError,
		PurchasingError,
		Pending,
		RequestBuyProductWait,
		RequestBuyProductError,
		Restore,
		RestoreError,
		ShowCompleteDialogWait,
		ShowDeferredDialog,
		ServiceDisconnect,
		RequestGetDmmPointWait,
		RequestGetDmmSubscriptionWait,
		PurchaseSubscriptionWait,
		FetchProductWait,
		WaitingPurchase,
		RestoreTransactionWait,
		RequestSelectShopProductWait,
		RequestCancelShopProductWait
	}
}
