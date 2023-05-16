import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart as apiGetCart } from "~/services/cartService";

export const getQuantity = createAsyncThunk("cart", async (_, apiThunk) => {
	const response = await apiGetCart();
	return response?.data;
});

type initialStateType = {
	quantity: number;
	cart: {
		_id: string;
		products: any;
		bill: number;
	};
};

const initialState: initialStateType = {
	quantity: 0,
	cart: {
		_id: "",
		products: [],
		bill: 0,
	},
};

const cartSlice = createSlice({
	name: "cart",
	initialState: initialState,
	reducers: {
		setCartQuantity(state, action) {
			state.quantity += action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(getQuantity.fulfilled, (state, action) => {
			const { count, cart, bill } = action.payload;
			state.quantity = count;
			state.cart = {
				...cart,
				bill,
			};
		});
	},
});

export const { setCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
