import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
	loggedIn: boolean;
	accessToken: string;
	user: {
		firstName: string;
		lastName: string;
		avatar: string;
		role: string;
	};
};

const initialState: initialStateType = {
	loggedIn: false,
	accessToken: "",
	user: {
		firstName: "",
		lastName: "",
		avatar: "",
		role: "",
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action) {
			const { accessToken, loggedIn } = action.payload;
			state.loggedIn = loggedIn;
			state.accessToken = accessToken;
		},
		setCurrentUser(state, action) {
			state.user = action.payload;
		},
	},
});

export const { login, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
