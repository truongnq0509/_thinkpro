import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, ICategory, IBrand } from "~/interfaces";
import { getCategory as apiGetCategory } from "~/services/categoryService";
import { getBrand as apiGetBrand } from "~/services/brandService";

export const getCategory = createAsyncThunk("category/getSingle", async (slug: string, thunkApi) => {
	const response = await apiGetCategory(slug);
	return response?.data;
});

export const getBrand = createAsyncThunk("brand/getSingle", async (slug: string, thunkApi) => {
	const response = await apiGetBrand(slug);
	return response?.data;
});

type initialStateType = {
	category: ICategory;
	brand: IBrand;
	brands: IBrand[];
	products: IProduct[];
	isLoading: boolean;
};

const initialState: initialStateType = {
	category: {},
	brand: {},
	brands: [],
	products: [],
	isLoading: false,
};

const appSlice = createSlice({
	name: "collection",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCategory.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getCategory.fulfilled, (state, action) => {
			const { products, brands, name, description } = action.payload;
			state.isLoading = false;
			state.products = products;
			state.brands = brands;
			state.category = {
				name,
				description,
			};
			state.brand = {};
		});
		builder.addCase(getCategory.rejected, (state) => {
			state.isLoading = false;
		});
		builder.addCase(getBrand.fulfilled, (state, action) => {
			const { name, image, description, products, children } = action.payload;
			state.brand = {
				name,
				image,
				description,
			};
			state.products = products;
			state.brands = children;
			state.category = {};
		});
	},
});

export default appSlice.reducer;
