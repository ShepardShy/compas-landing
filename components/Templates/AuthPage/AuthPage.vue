<template>
	<div
		class="auth"
		ref="authRef"
	>
		<div class="auth__main">
			<div class="auth__wrapper">
				<AuthEntry
					v-if="activeTab == 'entry'"
					:authRef="authRef"
					@changeActiveTab="tab => changeActiveTab(tab)"
				/>

				<AuthForget
					v-else-if="activeTab == 'forget'"
					@changeActiveTab="tab => changeActiveTab(tab)"
				/>

				<AuthRegistration
					v-else-if="activeTab == 'registration'"
					@changeActiveTab="tab => changeActiveTab(tab)"
				/>
			</div>

			<figure class="ibg auth__background">
				<img
					src="/pages/auth/background.svg"
					alt=""
				/>
			</figure>
		</div>
	</div>
</template>

<script setup>
	import "./AuthPage.scss";

	import AuthEntry from "./Entry/Entry.vue";
	import AuthForget from "./Forget/Forget.vue";
	import AuthRegistration from "./Registration/Registration.vue";
	import commonScripts from "@/commonScripts/commonScripts";
	import { useGlobalStore } from "~/stores/globalStore";

	const globalStore = useGlobalStore();
	globalStore.isShowOnlyLogo = true;
	onUnmounted(() => {
		globalStore.isShowOnlyLogo = false;
	});

	let activeTab = ref("entry");
	const authRef = ref(null);
	const router = useRoute();

	const changeActiveTab = tab => {
		activeTab.value = tab;
		router.query.tab = tab;
		commonScripts.setURLParams({ tab: tab });
	};

	onMounted(() => {
		if (router.query.tab) {
			activeTab.value = router.query.tab;
		} else {
			activeTab.value = "entry";
			commonScripts.setURLParams({ tab: activeTab.value });
		}

		localStorage.clear();
	});

	watch(
		() => router.query,
		() => {
			if (router.query.tab) {
				activeTab.value = router.query.tab;
			} else {
				activeTab.value = "entry";
				commonScripts.setURLParams({ tab: activeTab.value });
			}
		},
		{
			deep: true,
		}
	);
</script>
