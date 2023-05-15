import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, ICategory } from "~/interfaces";
import { IQuery } from "~/interfaces/query";
import { getCategories as apiGetCategories, getCategory as apiGetCategory } from "~/services/categoryService";

export const getCategories = createAsyncThunk("category/getAll", async (_, thunkApi) => {
	const response = await apiGetCategories();
	return response?.data;
});

export const getCategory = createAsyncThunk("category/getSingle", async (query: IQuery, thunkApi) => {
	const response = await apiGetCategory(query);
	return response?.data;
});

type initialStateType = {
	categories: ICategory[];
	products: IProduct[];
	loading: boolean;
	results: [];
};

const initialState: initialStateType = {
	categories: [],
	products: [],
	loading: false,
	results: [],
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setResults(state, action) {
			state.results = action.payload;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getCategories.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
			state.loading = false;
			state.categories = action.payload;
		});
		builder.addCase(getCategories.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(getCategory.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getCategory.fulfilled, (state, action) => {
			const { products } = action.payload;
			state.loading = false;
			state.products = products;
		});
		builder.addCase(getCategory.rejected, (state) => {
			state.loading = false;
		});
	},
});

export const { setResults, setLoading } = appSlice.actions;
export default appSlice.reducer;
