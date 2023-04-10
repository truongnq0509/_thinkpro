import React from "react";
import "./GlobalStyles.module.scss";

interface IProps {
	children: React.ReactNode;
}

const GlobalStyle: React.FC<IProps> = ({ children }): any => {
	return children;
};

export default GlobalStyle;
