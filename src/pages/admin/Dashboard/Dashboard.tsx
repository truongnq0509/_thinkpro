import React from "react";
import { List, Card, Statistic } from "antd";
import { CiShoppingCart } from "react-icons/ci";
import CountUp from "react-countup";

type Props = {};

interface IDashboard {
	title: string;
	statistic: number;
	icon: React.ReactNode;
	color: string;
}

const data: IDashboard[] = [
	{
		title: "Order",
		statistic: 999,
		icon: <CiShoppingCart />,
		color: "#ffa8a8",
	},
	{
		title: "Payment",
		statistic: 999,
		icon: <CiShoppingCart />,
		color: "#ffa8a8",
	},
	{
		title: "Test",
		statistic: 999,
		icon: <CiShoppingCart />,
		color: "#ffa8a8",
	},
	{
		title: "Test",
		statistic: 999,
		icon: <CiShoppingCart />,
		color: "#ffa8a8",
	},
	{
		title: "Test",
		statistic: 999,
		icon: <CiShoppingCart />,
		color: "#ffa8a8",
	},
];

const Dashboard = (props: Props) => {
	return (
		<>
			<List
				grid={{ gutter: 16, column: 5 }}
				dataSource={data}
				renderItem={(item) => (
					<List.Item>
						<Card bordered={false}>
							<Statistic
								title={item.title}
								value={item.statistic}
								precision={2}
								valueStyle={{ color: item.color }}
								prefix={item.icon}
								formatter={() => (
									<CountUp
										end={item.statistic}
										separator="."
									/>
								)}
							/>
						</Card>
					</List.Item>
				)}
			/>
		</>
	);
};

export default Dashboard;
