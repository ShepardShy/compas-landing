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
				@click.prevent="() => scroll(item.link)"
				class="docs-nav__item"
				:class="[`docs-nav__item_${item.nodeName}`, { 'docs-nav__item_scrolled': item.isScrolled, 'docs-nav__item_active': item.isActive }]"
				v-for="item in docsNav"
			>
				{{ item.text.replace(/[.,\/#1234567890!]/g, "") }}
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

	const scroll = link => {
		const item = document.getElementById(link.replace("#", ""));
		item.parentNode.classList.add("active-bg");
		setTimeout(() => {
			item.parentNode.classList.remove("active-bg");
		}, 2000);

		item.scrollIntoView();
		window.scrollBy({ top: -200 });
	};

	onMounted(() => {
		const titles = personalDocRef.value.querySelectorAll("h1,h2,h3");
		setTimeout(() => {
			for (let i = 0; i < titles.length; i++) {
				if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(titles[i].nodeName)) {
					titles[i].id = i;
					titles[i].classList.add("header-link");
					docsNav.value.push({
						id: i,
						isActive: docsNav.value.length == 0,
						link: `#${titles[i].id}`,
						text: titles[i].textContent,
						nodeName: titles[i].nodeName,
					});
				}
			}
			headers.value = personalDocRef.value.querySelectorAll(".header-link");
		}, 100);

		window.addEventListener("scroll", throt_funScroll);
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", throt_funScroll);
	});

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
	};
</script>
