import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { updateOrder as apiUpdateOrder } from "~/services/orderService";

type Props = {};

const Thanks = (props: Props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	let payment: any = {};

	for (const entry of searchParams.entries()) {
		const [param, value] = entry;
		payment = {
			...payment,
			[param]: value,
		};
	}

	useEffect(() => {
		const fetchApi = async () => {
			await apiUpdateOrder(payment, payment?._id);
		};

		if (payment?.message == "Successful.") {
			fetchApi();
			navigate("/tai-khoan/don-mua/" + payment?._id);
		} else {
			navigate("/tai-khoan/don-mua/" + payment?._id);
		}
	}, []);

	return <div></div>;
};

export default Thanks;
