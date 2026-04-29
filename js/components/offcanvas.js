export function createOffcanvas(el, { mask } = {}) {

    function open() {
        el.classList.add('is-open');
        mask?.classList.add('is-show');
        document.body.classList.add('no-scroll');
    }

    function close() {
        el.classList.remove('is-open');
        mask?.classList.remove('is-show');
        document.body.classList.remove('no-scroll');
    }

    function toggle() {
        el.classList.toggle('is-open');
        mask?.classList.toggle('is-show');
        document.body.classList.toggle('no-scroll');
    }

    // 内部 close
    el.addEventListener('click', (e) => {
        if (e.target.closest('[data-ui-action="drawer.close"]')) {
            close();
        }
    });

    mask?.addEventListener('click', close);

    return { open, close, toggle };
}