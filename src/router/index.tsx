import type { RouteObject } from "react-router";

// private router
import PrivateLayout from "~/layouts/private";
// client
import { DefaultLayout } from "~/layouts/client/DefaultLayout";
import { HomePage } from "~/pages/client/Home";
import { ProductsPage } from "~/pages/client/Products";
import { NotFoundPage } from "~/pages/client/NotFound";
import { LoginPage } from "~/pages/client/Login";
import { RegisterPage } from "~/pages/client/Register";

// admin
import { AdminLayout } from "~/layouts/admin/AdminLayout";
import { DashboardPage } from "~/pages/admin/Dashboard";
import {
	DefaultProductPage,
	ProductManagerPage,
	AddProductPage,
	StoreProductPage,
	UpdateProductPage,
} from "~/pages/admin/Products";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "products",
				children: [
					{
						index: true,
						element: <ProductsPage />,
					},
					{
						path: ":slug",
					},
				],
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
	{
		path: "/admin",
		element: (
			<PrivateLayout>
				<AdminLayout />
			</PrivateLayout>
		),
		children: [
			{
				index: true,
				element: <DashboardPage />,
			},
			{
				path: "products",
				element: <DefaultProductPage />,
				children: [
					{
						index: true,
						element: <ProductManagerPage />,
					},
					{
						path: "create",
						element: <AddProductPage />,
					},
					{
						path: "store",
						element: <StoreProductPage />,
					},
					{
						path: ":slug",
						element: <UpdateProductPage />,
					},
				],
			},
		],
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
];

export default routes;
