<template>
    <TemplateContacts />
</template>

<script setup>
    import TemplateContacts from '@/components/Templates/Contacts/Contacts.vue';

    // Мета теги
    useHead({
        title: 'Контакты . Компас',
        meta: [
            { 
                name: 'description', 
                content: 'Описание.' 
            },
        ],
    })
</script>
