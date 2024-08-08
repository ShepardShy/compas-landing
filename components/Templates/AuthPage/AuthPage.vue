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

				<!-- <AuthForget
					v-else-if="activeTab == 'forget'"
					@changeActiveTab="tab => changeActiveTab(tab)"
				/> -->

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
	import AuthRegistration from "./Registration/Registration.vue";
	import { useUserStore } from "@/stores/userStore.js";
	const userStore = useUserStore();

	let activeTab = ref("entry");
	const authRef = ref(null);
	const router = useRoute();

	const changeActiveTab = tab => {
		userStore.authError.text = "";
		activeTab.value = tab;
		navigateTo(`/auth/${tab}`);
	};

	onMounted(() => {
		if (router.params.tab) {
			activeTab.value = router.params.tab;
		} else {
			activeTab.value = "entry";
			navigateTo(`/auth/${activeTab.value}`);
		}

		localStorage.clear();
	});

	watch(
		() => router.params,
		() => {
			if (router.params.tab) {
				activeTab.value = router.params.tab;
			} else {
				activeTab.value = "entry";
				navigateTo(`/auth/${activeTab.value}`);
			}
		},
		{
			deep: true,
		}
	);
</script>
