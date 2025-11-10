import { configureStore, combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../redux/slice/counterSlice'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // 기본: localStorage

const rootReducer = combineReducers({
	counter: counterReducer,
})

const persistConfig = {
	key: 'root',
	storage,
	whitelist:['counter'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Toolkit + redux-persist 미들웨어 충돌 방지 설정 포함
export const store = configureStore({
  reducer: persistedReducer, // ✅ persistedReducer로 교체
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

