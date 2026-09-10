const trimTrailingSlash = (url: string) => url.replace(/\/$/, '')

export const AxolotlBrandConfig = Object.freeze({
	productName: 'Lin Client',
	shortProductName: 'Lin Client',
	website: '',
	repositoryUrl: '',
	supportUrl: '',
	qqGroupNumber: '737601250',
	qqChannelUrl: 'https://pd.qq.com/s/9nfp5rlz0',
	sponsorUrl: 'https://afdian.com/a/Mystic-Stars',
	surveyUrl: 'https://gcnpznwdnhl4.feishu.cn/share/base/form/shrcndevRao1jpNw3cATAX4NbGh',
	bundleIdentifier: 'dev.lin.client',
	deepLinkScheme: 'linclient',
	userAgent: (version: string, os: string) => `lin-client/${version} (${os})`,
	capabilities: Object.freeze({
		publicModrinthApi: true,
		privateModrinthServices: false,
		ghsTelemetry: false,
	}),
})

const siteUrl = trimTrailingSlash(import.meta.env.MODRINTH_URL || 'https://modrinth.com')
const officialLabrinthBaseUrl = trimTrailingSlash(
	import.meta.env.MODRINTH_API_BASE_URL || 'https://api.modrinth.com',
)
type DownloadSourceMode = 'auto' | 'official_only' | 'mirror_preferred' | 'official_preferred'

// The Modrinth API always uses the official source; Modrinth download mirror
// routing is handled by the Rust download layer.
export function setModrinthSourceMode(_sourceMode: DownloadSourceMode) {}

export function setModrinthMirrorEnabled(_enabled: boolean) {}

export function getOfficialLabrinthBaseUrl() {
	return officialLabrinthBaseUrl
}

export function getLabrinthBaseUrl() {
	return officialLabrinthBaseUrl
}

export const config = {
	siteUrl,
	labrinthBaseUrl: getLabrinthBaseUrl,
}
