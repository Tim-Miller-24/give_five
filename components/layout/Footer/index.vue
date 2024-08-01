<template>
    <footer class="footer container">
        <div class="footer__apps">
            <img src="/assets/images/app-store.png" alt="">
            <img src="/assets/images/google-play.png" alt="">
        </div>

        <p class="footer__extra-info">Дай 5, разработка <a href="https://xn--90agcwb4c1dc.xn--p1ai/">Люблю Еду</a> </p>
    </footer>
</template>

<style scoped lang="scss">
.footer {
    display: flex;

    margin-top: 30px;

    padding-bottom: 30px;

    flex-direction: column;

    align-items: center;

    &__apps {
        display: flex;

        gap: 8px;

        margin-bottom: 15px;
    }

    &__extra-info {
        font-family: 'Overpass';
        color: #545757;

        & > a {
            border-bottom: 1px solid #545757;
        }
    }
}
</style>