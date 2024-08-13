<template>
	<nav
		class="nav"
		ref="docsNavRef"
	>
		<div class="nav__header">Содержание</div>
		<div class="nav__list">
			<a
				:href="item.link"
				@click.prevent="() => scroll(item.link, item.nodeName)"
				class="nav__item"
				:class="{ nav__item_H3: item.nodeName == 'H3', nav__item_H4: item.nodeName == 'H4', nav__item_scrolled: item.isScrolled, nav__item_active: item.isActive }"
				v-for="item in docsNav"
			>
				{{ item.text }}
			</a>
		</div>
	</nav>
</template>

<script setup>
	const $articleContent = inject("$articleContent");
	const $articleWrapper = inject("$articleWrapper");

	let docsNav = ref([]);
	const docsNavRef = ref(null);
	const headers = ref([]);

	const scroll = (link, tag) => {
		const item = document.getElementById(link.replace("#", ""));
		if (tag) {
			item.parentNode.classList.add("active-bg");
			setTimeout(() => {
				item.parentNode.classList.remove("active-bg");
			}, 2000);
		}

		item.scrollIntoView();
		window.scrollBy({ top: -200 });
	};

	onMounted(() => {
		setTimeout(() => {
			const titles = $articleContent.value.querySelectorAll("h2,h3");
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
			headers.value = $articleContent.value.querySelectorAll(".header-link");
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

<style scoped>
	@import url(./Nav.scss);
</style>
