// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	// nitro: {
	// 	runtimeConfig: {
	// 		app: {
	// 			// cdnURL: "https://compas.pro/landing/",
	// 			// baseURL: "/landing",
	// 			// buildAssetsDir: "/landing/_nuxt/",
	// 		},
	// 		public: {
	// 			baseURL: "https://compas.pro/",
	// 		},
	// 	},
	// },
	// runtimeConfig: {
	// 	public: {
	// 		baseURL: "https://compas.pro",
	// 	},
	// },

	// routeRules: {
	// 	"/guides/": {
	// 		ssr: true,
	// 		// prerender: false,
	// 	},
	// 	"/guides/**": {
	// 		ssr: true,
	// 		// prerender: false,
	// 	},
	// 	"/guides-category/": {
	// 		ssr: true,
	// 		// prerender: false,
	// 	},
	// 	"/guides-category/**": {
	// 		// ssr: false,
	// 		ssr: true,
	// 		// prerender: false,
	// 	},
	// },
	nitro: {
		cache: {
			rules: [
				{
					// Кэшируем запросы к API Nitro
					path: "/api/guides/**",
					swr: true, // stale-while-revalidate (старое отдается, пока новое регенерируется)
					maxAge: 60, // Кэш валиден 60 секунд
				},
			],
		},
	},

	hooks: {
		// async "prerender:routes"(ctx) {
		// 	const res = await fetch("https://compas.pro/api/pages");
		// 	let pages = await res.json();
		// 	pages = pages.map((i) => i.replace("https://compas.pro", "")).filter((i) => i);

		// 	// Добавляем маршруты на основе данных из API
		// 	pages.forEach((page) => {
		// 		ctx.routes.add(page);
		// 	});
		// },
	},

	// generate: {
	// 	fallback: true, // Создает `200.html` для обработки всех маршрутов
	// },

	app: {
		// cdnURL: "https://compas.pro/landing/",
		buildAssetsDir: '/public/_nuxt/',
		head: {
			viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
			link: [{ rel: "icon", type: "image/svg+xml", href: "/images/favicon.svg" }],
		},
	},
	spaLoadingTemplate: false,
	ssr: true,
	target: "hybrid",
	experimental: {
		asyncContext: true,
	},
	modules: ["nuxt-yandex-metrika", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "nuxt-lodash", "dayjs-nuxt"],
	yandexMetrika: {
		id: "98290837",
		options: {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
			defer: true,
		},
	},
	vite: {
		mode: "production",
		server: {
			fs: {
				allow: ["C:/node_modules/ufo/dist", "C:/node_modules/defu/dist"],
			},
			hmr: {
				clientPort: 3000,
			},
		},
	},
	build: {
		extend(config, ctx) {
			config.resolve.alias["vue$"] = "vue/dist/vue.esm.js";
		},
	},
	render: {
		bundleRenderer: {
			shouldPrefetch: () => false,
			shouldPreload: () => false,
		},
	},
});
