<script setup lang="ts">
import { MoreVerticalIcon, PinIcon, UploadIcon } from '@modrinth/assets'
import { ButtonStyled, defineMessages, OverflowMenu, useVIntl } from '@modrinth/ui'
import { open } from '@tauri-apps/plugin-dialog'
import { computed, ref, watch } from 'vue'

import Instance from '@/components/ui/Instance.vue'
import { edit_icon } from '@/helpers/instance'
import type { GameInstance } from '@/helpers/types'

type InstanceCardLayout = 'spotlight' | 'row' | 'tile'

const props = withDefaults(
	defineProps<{
		instance: GameInstance
		pinned: boolean
		playing?: boolean
		layout?: InstanceCardLayout
	}>(),
	{
		playing: false,
		layout: 'row',
	},
)

const emit = defineEmits<{
	'pinned-change': [instance: GameInstance, pinned: boolean]
}>()

const { formatMessage } = useVIntl()
const messages = defineMessages({
	pin: { id: 'app.home.instances.pin', defaultMessage: 'Pin to Home' },
	unpin: { id: 'app.home.instances.unpin', defaultMessage: 'Unpin from Home' },
	changeCover: { id: 'app.home.instances.change-cover', defaultMessage: 'Change card cover' },
})

const compact = computed(() => props.layout !== 'tile')
const coverPath = ref(props.instance.icon_path)
watch(
	() => props.instance.icon_path,
	(path) => (coverPath.value = path),
)
const displayedInstance = computed(() => ({ ...props.instance, icon_path: coverPath.value }))

async function changeCover() {
	const picked = await open({
		multiple: false,
		filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'webp'] }],
	})
	if (!picked || Array.isArray(picked)) return
	const path = (picked as { path?: string }).path ?? picked
	if (typeof path !== 'string') return
	await edit_icon(props.instance.id, path)
	coverPath.value = path
}

const menuOptions = computed(() => [
	{
		id: 'change-cover',
		action: () => void changeCover(),
	},
	{
		id: props.pinned ? 'unpin' : 'pin',
		action: () => emit('pinned-change', props.instance, !props.pinned),
	},
])
</script>

<template>
	<div class="home-instance-card relative min-w-0" :data-layout="layout" :data-compact="compact">
		<Instance
			:instance="displayedInstance"
			:compact="compact"
			:flat="true"
			:variant="layout === 'tile' ? 'library' : 'standard'"
			:playing="playing"
			:first="layout === 'spotlight'"
		/>
		<div class="home-instance-menu" @click.stop>
			<ButtonStyled circular size="small" type="transparent">
				<OverflowMenu
					:options="menuOptions"
					:tooltip="formatMessage(pinned ? messages.unpin : messages.pin)"
				>
					<MoreVerticalIcon />
					<template #change-cover><UploadIcon /> {{ formatMessage(messages.changeCover) }}</template>
					<template #pin><PinIcon /> {{ formatMessage(messages.pin) }}</template>
					<template #unpin>
						<PinIcon class="rotate-45" /> {{ formatMessage(messages.unpin) }}
					</template>
				</OverflowMenu>
			</ButtonStyled>
		</div>
	</div>
</template>

<style scoped>
.home-instance-card[data-compact='true'] {
	padding-right: 2.25rem;
}

.home-instance-card[data-layout='tile'] {
	height: 100%;
	padding: 0;
	box-sizing: border-box;
	overflow: hidden;
	border: 1px solid var(--color-divider);
	border-radius: 1.5rem;
	background: var(--color-raised-bg);
	box-shadow: var(--shadow-card);
}

.home-instance-card[data-layout='tile'] :deep(> div) {
	height: 100%;
	box-sizing: border-box;
	border: 0;
	border-radius: 1.5rem;
	background: var(--color-raised-bg);
	box-shadow: none;
}

.home-instance-card[data-layout='tile'] :deep(.aspect-square) {
	border-radius: 1.15rem;
	box-shadow: inset 0 0 0 1px rgb(15 23 42 / 6%);
}

.home-instance-card[data-layout='tile'] :deep(.aspect-square img) {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.home-instance-menu {
	position: absolute;
	top: 0.25rem;
	right: 0.25rem;
	z-index: 2;
}

.home-instance-card[data-compact='true'] .home-instance-menu {
	top: 50%;
	right: 0;
	transform: translateY(-50%);
}

.home-instance-card[data-layout='tile'] .home-instance-menu {
	top: 0.65rem;
	right: 0.65rem;
	padding: 0.1rem;
	border-radius: 999px;
	background: rgb(255 255 255 / 86%);
	color: #222936;
	box-shadow: 0 0.2rem 0.7rem rgb(15 23 42 / 14%);
	backdrop-filter: blur(12px);
}
</style>
