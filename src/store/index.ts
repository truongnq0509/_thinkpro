import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appSlice from "./reducers/appSlice";
import authSlice from "./reducers/authSlice";
import collectionSlice from "./reducers/collectionSlice";

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
