import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice";

const rootReducer = {
	app: appReducer,
};

const store = configureStore({
	reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;