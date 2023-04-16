export const formatNumber = (str: string) => {
	return str
		.split("")
		.reverse()
		.reduce((prev, next, index) => {
			return (index % 3 ? next : next + ".") + prev;
		});
};

export function buildFormData(data: any) {
	let formData = new FormData();
	for (let key in data) {
		if (Array.isArray(data[key])) {
			data[key].forEach((obj: any, index: any) => {
				let keyList = Object.keys(obj);
				keyList.forEach((keyItem) => {
					let keyName = [key, "[", index, "]", ".", keyItem].join("");
					formData.append(keyName, obj[keyItem]);
				});
			});
		} else if (typeof data[key] === "object") {
			for (let innerKey in data[key]) {
				formData.append(`${key}.${innerKey}`, data[key][innerKey]);
			}
		} else {
			formData.append(key, data[key]);
		}
	}
	return formData;
}

export function percent(price: number, discount: number) {
	const percent = 1 - discount / price;
	return `${Math.round(percent * 100)}%`;
}
