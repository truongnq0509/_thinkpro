import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice";
import collectionSlice from "./reducers/collectionSlice";

const rootReducer = {
	app: appReducer,
	collection: collectionSlice,
};

const store = configureStore({
	reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
