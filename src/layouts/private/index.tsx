import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
	children: ReactNode;
};

const PrivateLayout = ({ children }: Props) => {
	return <>{children}</>;
};

export default PrivateLayout;
