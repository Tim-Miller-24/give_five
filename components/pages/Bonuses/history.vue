<template>
    <div class="history">
        <button class="history__button">
            <p>История начислений</p>
            <UIIcon class="ui-icon" name="arrow-down" />
        </button>
    </div>
</template>

<script></script>

<style lang="scss" scoped>
.history {
    position: relative;

    margin-top: 16px;

    z-index: 15;

    color: var(--white);

    &__button {
        width: 100%;
        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;

        font-family: 'Overpass';

        border-radius: 8px;

        padding: 12px 16px;

        & > p {
            display: flex;
            font-weight: 600;
        }
    }

    .ui-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);

        :deep svg path {
            fill: var(--white);
        }
    }
}
</style>