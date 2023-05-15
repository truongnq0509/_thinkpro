import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState, AppDispatch } from "~/store";
import { setCurrentUser } from "~/store/reducers/authSlice";
import { me as apiGetCurrentUser } from "~/services/authService";

type Props = {
	children: ReactNode;
	roles: string[];
};

const PrivateRouter = ({ children, roles }: Props) => {
	const { loggedIn, user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchApi = async () => {
			const { data } = await apiGetCurrentUser();
			dispatch(
				setCurrentUser({
					firstName: data.firstName,
					lastName: data.lastName,
					avatar: data.avatar,
					role: data.role,
				})
			);
		};
		fetchApi();
	}, [loggedIn]);

	if (!loggedIn) {
		return (
			<Navigate
				to="/dang-nhap"
				replace
			/>
		);
	}

	return (
		<>
			{roles.find((role) => role == user.role) ? (
				children
			) : (
				<Navigate
					to="/"
					replace
				/>
			)}
		</>
	);
};

export default PrivateRouter;
