// js/components/offcanvas.js

export default function createOffcanvas(el) {

    // 自动找 mask（不依赖外部传参）
    const mask = document.querySelector('[data-ui-mask]')

    function open() {
        el.classList.add('is-open')
        mask?.classList.add('is-show')
        document.body.classList.add('no-scroll')
    }

    function close() {
        el.classList.remove('is-open')
        mask?.classList.remove('is-show')
        document.body.classList.remove('no-scroll')
    }

    function toggle() {
        el.classList.contains('is-open') ? close() : open()
    }

    // 点击 mask 关闭
    function onMaskClick() {
        close()
    }

    mask?.addEventListener('click', onMaskClick)

    return {
        open,
        close,
        toggle,

        destroy() {
            mask?.removeEventListener('click', onMaskClick)
        }
    }
}