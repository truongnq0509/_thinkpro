import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const processEnvValues = {
		"process.env": Object.entries(env).reduce((prev, [key, val]) => {
			return {
				...prev,
				[key]: val,
			};
		}, {}),
	};
	return {
		plugins: [react()],
		define: processEnvValues,
		server: {
			port: 3000,
		},
		css: {
			devSourcemap: true,
		},
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
			},
		},
	};
});
