import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  isGRX: boolean;
  isLive: boolean;
  subsDomain: string;
  buyDomain: string;
  jssoSDK: string;
  objAuthDomain: string;
  etOnBoardDomain: string;
  merchantCode: string;
  clientId: string;
  appCode: string;
  loginUrl: string;
  channelType: string;
}

const getInitialConfig = (): ConfigState => {
  const lh = window.location.host;
  const isLive = lh.indexOf('dev-buy') === -1 && lh.indexOf('localhost') === -1;
  
  // Get merchant code from planparams or localStorage
  let merchantCode = '';
  try {
    if ((window as any).planparams?.product) {
      merchantCode = (window as any).planparams.product;
    } else if (localStorage.getItem('planparams')) {
      const planparams = JSON.parse(localStorage.getItem('planparams') || '{}');
      merchantCode = planparams.product || '';
    }
  } catch (e) {
    console.error('Error parsing planparams:', e);
  }

  const subsDomain = isLive
    ? 'https://subscriptions.economictimes.indiatimes.com'
    : 'https://qcsubscription.economictimes.indiatimes.com';

  const buyDomain = isLive ? 'buy' : 'dev-buy';

  const jssoSDK = isLive
    ? 'https://jssocdn.indiatimes.com/crosswalk_sdk/sdk/jsso_crosswalk_legacy_0.8.1.min.js'
    : 'https://jssocdnstg.indiatimes.com/crosswalk_sdk/sdk/jsso_crosswalk_0.8.1.js';

  const objAuthDomain = isLive ? 'oauth' : 'qa-oauth';
  const etOnBoardDomain = isLive ? 'etonboard' : 'etonboard-stg';

  const clientId = (window as any).planparams?.CLIENT_ID || '';
  const appCode = (window as any).planparams?.appCode || '';

  const loginUrl = `https://${
    isLive
      ? merchantCode === 'TH'
        ? 'timeshealthplus.com'
        : 'buy.indiatimes.com'
      : 'dev-buy.indiatimes.com'
  }/clogin.cms`;

  const channelType = getChannel(merchantCode, isLive);

  return {
    isGRX: true,
    isLive,
    subsDomain,
    buyDomain,
    jssoSDK,
    objAuthDomain,
    etOnBoardDomain,
    merchantCode,
    clientId,
    appCode,
    loginUrl,
    channelType,
  };
};

function getChannel(merchantCode: string, isLive: boolean): string {
  switch (merchantCode) {
    case 'TOI':
      return 'toi';
    case 'MATA':
      return 'epapermata';
    case 'MIRROR':
      return 'epapermirror';
    case 'TH':
      return isLive ? 'timeshealthplus' : 'toi';
    case 'ETH':
      return 'ethindi';
    default:
      return 'epaperet';
  }
}

const initialState: ConfigState = getInitialConfig();

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      return { ...state, ...action.payload };
    },
    setMerchantCode: (state, action: PayloadAction<string>) => {
      state.merchantCode = action.payload;
      state.channelType = getChannel(action.payload, state.isLive);
      state.loginUrl = `https://${
        state.isLive
          ? action.payload === 'TH'
            ? 'timeshealthplus.com'
            : 'buy.indiatimes.com'
          : 'dev-buy.indiatimes.com'
      }/clogin.cms`;
    },
  },
});

export const { updateConfig, setMerchantCode } = configSlice.actions;
export default configSlice.reducer;

