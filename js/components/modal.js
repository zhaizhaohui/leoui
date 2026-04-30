import { animate } from '../core/animate.js';

export function createModal(el) {

    function open() {
        el.classList.add('is-open');
        document.body.classList.add('no-scroll');
        animate(el, 'fade', { open: true });
    }

    function close() {
        el.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        animate(el, 'fade', { open: false });
    }

    function toggle() {
        el.classList.contains('is-open') ? close() : open();
    }

    // mask 点击关闭
    el.addEventListener('click', (e) => {
        if (e.target.dataset.uiAction === 'modal.close') {
            close();
        }
    });

    return {
        open,
        close,
        toggle
    };
}