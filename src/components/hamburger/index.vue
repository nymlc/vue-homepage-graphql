<template>
    <div @click="toggleClick" class="hamburger" :class="{'is-active': isActive}">
        <svg-icon icon-class="bread_crumb"></svg-icon>
    </div>
</template>
<<script>
export default {
    props: {
        toggleClick: {
            type: Function,
            default: null
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style scoped>
.hamburger {
    display: inline-block;
    cursor: pointer;
    transform: rotate(0deg);
    transition: 0.38s;
    transform-origin: 50% 50%;
}
.svg-icon {
    width: 1em;
    height: 1em;
}
.hamburger.is-active {
    transform: rotate(90deg);
}
</style>
