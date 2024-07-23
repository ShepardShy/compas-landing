<template>
	<nav
		class="personal-docs__nav docs-nav"
		ref="docsNavRef"
		:style="`--contentPos: ${contentPos}px`"
	>
		<div class="docs-nav__header">Содержание</div>
		<div class="docs-nav__list">
			<a
				:href="item.link"
				class="docs-nav__item"
				:class="(`docs-nav__item_${item.nodeName}`, item.isScrolled ? 'docs-nav__item_scrolled' : '', item.isActive ? 'docs-nav__item_active' : '')"
				v-for="item in docsNav"
			>
				{{ item.text }}
			</a>
		</div>
	</nav>
</template>

<script setup>
	import "./Nav.scss";

	const personalDocRef = inject("personalDocRef");
	const personalDocWrapperRef = inject("personalDocWrapperRef");

	let docsNav = ref([]);
	const docsNavRef = ref(null);
	const headers = ref([]);
	const contentPos = ref(0);

	onMounted(() => {
		setTimeout(() => {
			for (let i = 0; i < personalDocRef.value.children.length; i++) {
				if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(personalDocRef.value.children[i].nodeName)) {
					personalDocRef.value.children[i].id = i;
					personalDocRef.value.children[i].classList.add("header-link");
					docsNav.value.push({
						id: i,
						isActive: docsNav.value.length == 0,
						link: `#${personalDocRef.value.children[i].id}`,
						text: personalDocRef.value.children[i].textContent,
						nodeName: personalDocRef.value.children[i].nodeName,
					});
				}
			}
			setNavPos();
			headers.value = personalDocRef.value.querySelectorAll(".header-link");
		}, 100);

		window.addEventListener("resize", setNavPos);
		window.addEventListener("scroll", throt_funScroll);
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", throt_funScroll);
		window.removeEventListener("resize", setNavPos);
	});

	const setNavPos = () => {
		let docRect = document.querySelector(".personal-docs__content").getBoundingClientRect();
		contentPos.value = Number((docRect.left + docRect.width).toFixed(0)) + 25;
	};

	// Троттлинг скролла по вертикали
	const throt_funScroll = () => {
		let data = [];
		for (let i = 0; i < headers.value.length; i++) {
			if (headers.value[i].getBoundingClientRect().top < 300) {
				data.push(headers.value[i]);
				docsNav.value.find(element => element.id == headers.value[i].id).isScrolled = true;
			} else {
				docsNav.value.find(element => element.id == headers.value[i].id).isScrolled = false;
			}
		}

		if (data.length > 0) {
			docsNav.value.forEach(element => {
				if (element.id == data[data.length - 1].id) {
					element.isActive = true;
				} else {
					element.isActive = false;
				}
			});
		}

		if (personalDocWrapperRef.value.getBoundingClientRect().top < 0) {
			docsNavRef.value.classList.add("docs-nav_fixed");
		} else {
			docsNavRef.value.classList.remove("docs-nav_fixed");
		}
	};
</script>
