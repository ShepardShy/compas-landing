<template>
	<div
		class="auth"
		ref="authRef"
	>
		<div class="auth__main">
			<div class="auth__wrapper">
				<AuthAccounts
					v-if="activeTab == 'accounts'"
					:authRef="authRef"
					@changeActiveTab="tab => changeActiveTab(tab)"
				/>

				<AuthEntry
					v-else-if="activeTab == 'entry'"
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


			<div class="auth__text auth__subtext">
				Вернуться на 
				<NuxtLink
					class="auth__link"
					to="/"
				>
					основной сайт
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
	import "./AuthPage.scss";

	import AuthEntry from "./Entry/Entry.vue";
	import AuthAccounts from "./Accounts/Accounts.vue";
	import AuthRegistration from "./Registration/Registration.vue";
	import { useUserStore } from "@/stores/userStore.js";
	import { useCommonStore } from "@/stores/commonStore.js";
	const userStore = useUserStore();
	const commonStore = useCommonStore();

	const route = useRoute();

	let activeTab = ref(route.params.tab);
	const authRef = ref(null);
	const router = useRoute();

	const changeActiveTab = tab => {
		userStore.authError.text = "";
		activeTab.value = tab;
		navigateTo(`/auth/${tab}`);
	};

	onMounted(() => {
		if (activeTab.value != "registration" && activeTab.value != "entry" && activeTab.value != "accounts") {
			navigateTo("/404");
		}
	});

	onMounted(() => {
		if (router.params.tab) {
			activeTab.value = router.params.tab;
		} else {
			commonStore.accounts.length > 0 ? (activeTab.value = "accounts") : (activeTab.value = "entry");
			navigateTo(`/auth/${activeTab.value}`);
		}

		localStorage.clear();
	});

	onMounted(() => {
		userStore.$patch({
			authData: {
				domain: "",
			},
			regData: {
				email: "",
				emailError: [],
				password: "",
				passwordError: [],
				domain: "",
				tariff: "",
				tariffError: "",
				domainError: [],
				passwordConfirmation: "",
				passwordConfirmationError: [],
				confidence: false,
			},
		});
	});

	watch(
		() => router.params,
		() => {
			if (router.params.tab) {
				activeTab.value = router.params.tab;
			} else {
				commonStore.accounts.length > 0 ? (activeTab.value = "accounts") : (activeTab.value = "entry");
				navigateTo(`/auth/${activeTab.value}`);
			}
		},
		{
			deep: true,
		}
	);
</script>
