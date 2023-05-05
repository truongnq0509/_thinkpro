import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

type Props = {};

const Verify = (props: Props) => {
	const { state } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (state === "success") {
			Swal.fire("Thành công", "Bạn đã đăng ký tài khoản thành công", "success").then(() =>
				navigate("/dang-nhap")
			);
		} else {
			let message = "Đăng ký tài khoản không thành công";
			state !== "expired" ? message : (message = "Link đã hết hạn hoặc lỗi server");
			Swal.fire("Thất bại", message, "error").then(() => navigate("/dang-nhap"));
		}
	}, [state]);

	return (
		<div
			style={{
				width: "100%",
				height: " 100%",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#f6f9fc",
			}}
		></div>
	);
};

export default Verify;
