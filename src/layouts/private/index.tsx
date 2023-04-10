import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
	children: ReactNode;
};

const PrivateLayout = ({ children }: Props) => {
	const storage = localStorage.getItem("user");

	const {
		data: { role },
	} = JSON.parse(storage as any);

	return <>{role === "admin" ? children : <Navigate to="/" />}</>;
};

export default PrivateLayout;
