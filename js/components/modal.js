// js/components/modal.js

import { animate } from '../core/animate.js'

export default function createModal(el) {

    function open() {
        el.classList.add('is-open')
        document.body.classList.add('no-scroll')
        animate(el, 'fade', { open: true })
    }

    function close() {
        el.classList.remove('is-open')
        document.body.classList.remove('no-scroll')
        animate(el, 'fade', { open: false })
    }

    function toggle() {
        el.classList.contains('is-open') ? close() : open()
    }

    return {
        open,
        close,
        toggle
    }
}