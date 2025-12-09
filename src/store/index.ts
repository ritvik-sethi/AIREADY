import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import jssoAuthReducer from './slices/jssoAuthSlice';
import analyticsReducer from './slices/analyticsSlice';
import configReducer from './slices/configSlice';
import loginFlowReducer from './slices/loginFlowSlice';

// Create logger middleware (only in development)
const logger = createLogger({
  // Options for redux-logger
  collapsed: (getState, action) => {
    // Collapse actions by default, expand on error
    return !action.error;
  },
  duration: true, // Print the duration of each action
  timestamp: true, // Print the timestamp with each action
  logErrors: true, // Log errors even if they are caught
  diff: true, // Show diff between states
  // Only log in development mode
  predicate: () => import.meta.env.DEV,
  // Customize which actions to log (optional - comment out to log all)
  // predicate: (getState, action) => {
  //   // Only log specific actions
  //   return !action.type.includes('analytics'); // Example: exclude analytics actions
  // },
});

// Configure middleware array
const middleware = (getDefaultMiddleware: any) => {
  const defaultMiddleware = getDefaultMiddleware({
    // Redux Toolkit's default middleware options
    serializableCheck: {
      // Ignore these action types
      ignoredActions: [
        'jssoAuth/setUserInfo',
        'jssoAuth/setPermissionObj',
        'jssoAuth/setUserProductDetails',
      ],
      // Ignore these field paths in all actions
      ignoredActionPaths: ['payload.response', 'payload.data'],
      // Ignore these paths in the state
      ignoredPaths: ['jssoAuth.oauthUrlResponse', 'jssoAuth.userInfo'],
    },
  });

  // Add logger only in development
  if (import.meta.env.DEV) {
    return defaultMiddleware.concat(logger);
  }

  return defaultMiddleware;
};

export const store = configureStore({
  reducer: {
    jssoAuth: jssoAuthReducer,
    analytics: analyticsReducer,
    config: configReducer,
    loginFlow: loginFlowReducer,
  },
  middleware,
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
