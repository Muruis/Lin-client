<template>
	<Transition name="splash-fade" @after-leave="onAfterLeave">
		<div v-if="!doneLoading" class="fixed inset-0 z-[10000] dark">
			<div class="absolute h-screen w-full flex flex-col justify-center items-center gap-4 z-[9998]" data-tauri-drag-region>
				<div class="startup-brand" aria-label="Lin Client Launcher">
					<div class="startup-logo"><AxolotlLogo icon-only /></div>
					<div class="startup-wordmark">
						<span class="startup-wordmark-core" data-wordmark="Lin Client">Lin Client</span>
						<span class="startup-wordmark-suffix" data-wordmark="Launcher">Launcher</span>
					</div>
				</div>
				<ProgressBar class="max-w-xs" :progress="Math.min(loadingProgress, 100)" />
				<span v-if="message">{{ message }}</span>
			</div>
			<div class="gradient-bg" data-tauri-drag-region></div>
			<div class="cube-bg"></div>
			<div class="absolute top-0 left-0 w-full h-full bg-bg z-[9995]"></div>
		</div>
	</Transition>
</template>

<script setup>
import { defineMessages, injectLoadingState, useVIntl } from '@modrinth/ui'
import { ref, watch } from 'vue'

import AxolotlLogo from '@/components/ui/AxolotlLogo.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { loading_listener } from '@/helpers/events.js'

const doneLoading = ref(false)
const loadingProgress = ref(0)
const message = ref()

const MIN_DISPLAY_MS = 3000
const mountedAt = Date.now()

const loading = injectLoadingState()
const { formatMessage } = useVIntl()

const messages = defineMessages({
	updatingAppDirectory: {
		id: 'app.splash.updating-app-directory',
		defaultMessage: 'Updating app directory...',
	},
	checkingForUpdates: {
		id: 'app.splash.checking-for-updates',
		defaultMessage: 'Checking for updates...',
	},
})

function onAfterLeave() {
	loading.setEnabled(true)
}

watch(
	[loading.barEnabled, loading.pending],
	([barEnabled, pending]) => {
		if (barEnabled) {
			return
		}

		if (pending) {
			loadingProgress.value = 0
			fakeLoadingIncrease()
			return
		}

		const elapsed = Date.now() - mountedAt
		const delay = Math.max(0, MIN_DISPLAY_MS - elapsed)

		setTimeout(() => {
			if (loading.pending.value) {
				return
			}
			doneLoading.value = true
		}, delay)
	},
	{ immediate: true },
)

function fakeLoadingIncrease() {
	if (loadingProgress.value < 95) {
		setTimeout(() => {
			loadingProgress.value += 2
			fakeLoadingIncrease()
		}, 5)
	}
}

loading_listener(async (e) => {
	if (e.event.type === 'directory_move') {
		loadingProgress.value = 100 * (e.fraction ?? 1)
		message.value = formatMessage(messages.updatingAppDirectory)
	} else if (e.event.type === 'checking_for_updates') {
		loadingProgress.value = 100 * (e.fraction ?? 1)
		message.value = formatMessage(messages.checkingForUpdates)
	}
})
</script>

<style scoped lang="scss">
.splash-fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.splash-fade-leave-to {
	opacity: 0;
}

.startup-brand {
	display: flex;
	align-items: center;
	gap: clamp(0.75rem, 2vw, 1.5rem);
}

.startup-logo {
	width: clamp(7rem, 15vw, 11rem);
	height: clamp(7rem, 15vw, 11rem);
	animation: startup-logo-reveal 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.startup-wordmark {
	display: flex;
	align-items: baseline;
	gap: 0.35em;
	max-width: 0;
	overflow: hidden;
	font-size: clamp(2.5rem, 6vw, 4.5rem);
	font-weight: 800;
	line-height: 1;
	white-space: nowrap;
	animation: startup-wordmark-reveal 1050ms 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.startup-wordmark span {
	position: relative;
	display: inline-block;
	transform: translateX(-4rem);
	animation: startup-wordmark-flight 1050ms 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.startup-wordmark-core {
	background-image: linear-gradient(90deg, var(--color-contrast), var(--color-base));
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
	-webkit-text-fill-color: transparent;
}

.startup-wordmark-suffix {
	color: var(--color-secondary);
	font-weight: 650;
}

.startup-wordmark span::after {
	position: absolute;
	inset: 0;
	color: var(--color-brand);
	content: attr(data-wordmark);
	animation: startup-brand-scan 700ms 2050ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.startup-wordmark-suffix::after {
	animation-delay: 2400ms;
}

.gradient-bg {
	position: absolute;
	height: 100vh;
	width: 100vw;
	background:
		linear-gradient(180deg, rgba(255, 77, 157, 0.24) 0%, rgba(48, 16, 40, 0.56) 97.29%),
		linear-gradient(0deg, rgba(22, 18, 28, 0.68), rgba(22, 18, 28, 0.68));
	z-index: 9997;
}

.cube-bg {
	position: absolute;

	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	width: 180vw;
	height: 180vh;
	opacity: 0.8;
	background: #16181c url('@/assets/loading/cube.png') center no-repeat;
	background-size: contain;

	z-index: 9996;
}

@keyframes startup-logo-reveal {
	0% { opacity: 0; transform: scale(0.72); }
	65% { opacity: 1; transform: scale(1.04); }
	100% { opacity: 1; transform: scale(1); }
}

@keyframes startup-wordmark-reveal {
	from { max-width: 0; }
	to { max-width: 56rem; }
}

@keyframes startup-wordmark-flight {
	from { opacity: 0; transform: translateX(-4rem); }
	to { opacity: 1; transform: translateX(0); }
}

@keyframes startup-brand-scan {
	0%, 12% { clip-path: inset(0 0 0 0); }
	100% { clip-path: inset(0 0 0 100%); }
}

</style>
