import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export const goPro = async () => {
  const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
    displayCloseButton: true,
  });

  switch (paywallResult) {
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
    case PAYWALL_RESULT.CANCELLED:
      return false;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      return true;
    default:
      return false;
  }
};
