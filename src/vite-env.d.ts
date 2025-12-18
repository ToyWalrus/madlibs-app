interface ViteTypeOptions {
	strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	readonly VITE_FB_APP_ID: string;
	readonly VITE_FB_API_KEY: string;
	readonly VITE_FB_AUTH_DOMAIN: string;
	readonly VITE_FB_PROJ_ID: string;
	readonly VITE_FB_MESSAGING_SENDER_ID: string;
	readonly VITE_FB_MEASUREMENT_ID: string;
	readonly VITE_FB_STORAGE_BUCKET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
