<template>
    <div @keyup.enter="submitSearch" class="searchBox">
        <svg-icon icon-class="search"></svg-icon>
        <el-input v-model="searchKeyword" placeholder="Search"></el-input>
    </div>
</template>
<<script>
export default {
    props: {
        submitSearch: {
            type: Function,
            default: null
        },
        searchKeyword: {
            type: String,
            default: ''
        }
    }
};
</script>
<style scoped>
.searchBox {
    display: flex;
    align-items: center;
}
.svg-icon {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 1rem;
}
</style>
