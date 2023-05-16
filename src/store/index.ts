import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appSlice from "./reducers/appSlice";
import authSlice from "./reducers/authSlice";
import collectionSlice from "./reducers/collectionSlice";
import cartSlice from "./reducers/cartSlice";

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

const cartPersistConfig = {
	key: "cart",
	storage,
	whitelist: ["quantity"],
};

const reducers = combineReducers({
	app: appSlice,
	collection: collectionSlice,
	auth: persistReducer(authPersistConfig, authSlice),
	cart: persistReducer(cartPersistConfig, cartSlice),
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
