<template>
    <div class="docs">
        <div class="docs__list">
            <NuxtLink :to="`docs/${doc.url}`" class="docs__item" v-for="doc in docs">
                <div class="docs__title">
                    {{ doc.title }}
                </div>
                <div class="docs__desc">
                    {{ doc.desc }}
                </div>
                <div class="docs__footer">
                    <div class="docs__subtitle">
                        Дата размещения версии
                    </div>
                    <div class="docs__date">
                        {{ setDate(doc.date) }}
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
    import './List.scss';
    
    import docs from '../docs.json'

    const setDate = (date) => {
        return new Date(date).toLocaleDateString("ru-RU", {year:"numeric", month: "2-digit", day:"2-digit"})
    }
</script>
