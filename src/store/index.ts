import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./reducers/appSlice";
import collectionSlice from "./reducers/collectionSlice";
import authSlice from "./reducers/authSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

const persistConfig = {
	key: "root",
	storage,
	blacklist: ["app", "collection"],
};

const authPersistConfig = {
	key: "auth",
	storage,
	whitelist: ["loggedIn", "accessToken", "user"],
};

const reducers = combineReducers({
	app: appSlice,
	collection: collectionSlice,
	auth: persistReducer(authPersistConfig, authSlice),
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
