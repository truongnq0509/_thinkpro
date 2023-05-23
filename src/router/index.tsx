import type { RouteObject } from "react-router";

// private router
import PrivateRouter from "~/layouts/private";
// client
import { DefaultLayout } from "~/layouts/client/DefaultLayout";
import { LayoutProfile } from "~/layouts/client/LayoutProfile";
import { HomePage } from "~/pages/client/Home";
import { CollectionPage } from "~/pages/client/Collection";
import { SkuPage } from "~/pages/client/Sku";
import { NotFoundPage } from "~/pages/client/NotFound";
import { LoginPage } from "~/pages/client/Login";
import { RegisterPage } from "~/pages/client/Register";
import { SearchPage } from "~/pages/client/Search";
import { VerifyPage } from "~/pages/client/Verify";
import { SendEmailPage } from "~/pages/client/SendEmail";
import { ResetPasswordPage } from "~/pages/client/ResetPassword";
import { ProfilePage } from "~/pages/client/Profile";
import { ChangePasswordPage } from "~/pages/client/ChangePassword";
import { CartPage } from "~/pages/client/Cart";
import { CheckoutPage } from "~/pages/client/Checkout";
import { PurchasePage } from "~/pages/client/Purchase";
import { OrderPage } from "~/pages/client/Order";
import { ThanksPage } from "~/pages/client/Thanks";

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
import { CategoriesManagerPage } from "~/pages/admin/Categories";

const routes: RouteObject[] = [
	{
		path: "/dang-nhap",
		element: <LoginPage />,
	},
	{
		path: "/dang-ky",
		element: <RegisterPage />,
	},
	{
		path: "/xac-minh/:state",
		element: <VerifyPage />,
	},
	{
		path: "/quen-mat-khau",
		element: <SendEmailPage />,
	},
	{
		path: "/reset-mat-khau",
		element: <ResetPasswordPage />,
	},
	{
		path: "/thanks",
		element: <ThanksPage />,
	},
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "tim-kiem",
				element: <SearchPage />,
			},
			{
				path: "tai-khoan",
				element: <LayoutProfile />,
				children: [
					{
						path: "profile",
						element: <ProfilePage />,
					},
					{
						path: "mat-khau",
						element: <ChangePasswordPage />,
					},
					{
						path: "don-mua",
						element: <PurchasePage />,
					},
					{
						path: "don-mua/:id",
						element: <OrderPage />,
					},
				],
			},
			{
				path: "gio-hang",
				element: <CartPage />,
			},
			{
				path: "checkout",
				element: <CheckoutPage />,
			},
			{
				path: ":slug",
				children: [
					{
						index: true,
						element: <CollectionPage />,
					},
					{
						path: ":slug",

						element: <SkuPage />,
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
			<PrivateRouter roles={["editor", "admin"]}>
				<AdminLayout />
			</PrivateRouter>
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
			{
				path: "categories",
				element: <CategoriesManagerPage />,
			},
		],
	},
];

export default routes;
