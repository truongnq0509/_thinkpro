import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, ICategory, IBrand } from "~/interfaces";
import { getCategory as apiGetCategory } from "~/services/categoryService";
import { getBrand as apiGetBrand } from "~/services/brandService";
import { IQuery } from "~/interfaces/query";

export const getCategory = createAsyncThunk("category/getSingle", async (query: IQuery, thunkApi) => {
	const response = await apiGetCategory(query);
	return response?.data;
});

export const getBrand = createAsyncThunk("brand/getSingle", async (query: IQuery, thunkApi) => {
	const response = await apiGetBrand(query);
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

const collectionSlice = createSlice({
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
			const { name, image, description, children, products } = action.payload;
			state.brand = {
				name,
				image,
				description,
				children,
			};
			state.products = products;
			state.brands = children;
			state.category = {};
		});
	},
});

export default collectionSlice.reducer;
