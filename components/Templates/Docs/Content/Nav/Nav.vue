<template>
    <nav class="personal-docs__nav docs-nav" ref="docsNavRef" :style="`--scrollPercent: ${scrollPercent}%;`">
        <div class="docs-nav__header">
            Содержание
        </div>
        <div class="docs-nav__list">
            <a :href="item.link" class="docs-nav__item" :class="`docs-nav__item_${item.nodeName}`, item.isActive ? 'docs-nav__item_active' : ''" v-for="item in docsNav">
                {{ item.text }}
            </a>
        </div>
    </nav>
</template>

<script setup>
    import './Nav.scss';

    const personalDocRef = inject('personalDocRef')

    let docsNav = ref([])
    const docsNavRef = ref(null)
    const headers = ref([])

    let scrollPercent = ref(0)

    onMounted(() => {
        setTimeout(() => {
            for (let i = 0; i < personalDocRef.value.children.length; i++) {
                if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(personalDocRef.value.children[i].nodeName)) {
                    personalDocRef.value.children[i].id = i
                    personalDocRef.value.children[i].classList.add('header-link')
                    docsNav.value.push({
                        id: i,
                        isActive: docsNav.value.length == 0,
                        link: `#${personalDocRef.value.children[i].id}`,
                        text: personalDocRef.value.children[i].textContent,
                        nodeName: personalDocRef.value.children[i].nodeName
                    })
                } 
            }

            headers.value = personalDocRef.value.querySelectorAll('.header-link')
        }, 100);

        window.addEventListener('scroll', throt_funScroll)
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', throt_funScroll)
    })

    // Троттлинг скролла по вертикали
    const throt_funScroll = () => {
        let data = []

        
        scrollPercent.value = (window.pageYOffset * 100 / (document.querySelector('main').clientHeight - (document.querySelector('footer').offsetHeight + document.querySelector('header').offsetHeight))).toFixed(2)
        if (scrollPercent.value >= 100) {
            scrollPercent.value = 100
        }

        for (let i = 0; i < headers.value.length; i++) {
            if (headers.value[i].getBoundingClientRect().top < 100) {
                data.push(headers.value[i])
            }
        }

        if (data.length > 0) {
            docsNav.value.forEach(element => {
                if (element.id == data[data.length - 1].id) {
                    element.isActive = true
                } else {
                    element.isActive = false
                }
            });
        }

        if (personalDocRef.value.getBoundingClientRect().top < 0) {
            docsNavRef.value.classList.add('docs-nav_fixed')
        } else {
            docsNavRef.value.classList.remove('docs-nav_fixed')
        }
    }
</script>
