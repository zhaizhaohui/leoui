export function createAccordion(root, options = {}) {

    const {
        single = true,
        defaultOpenIndex = -1,
        closeOnClick = true,
    } = options;

    // 👉 不缓存死（支持动态 DOM）
    const getItems = () => root.querySelectorAll('[data-ui-item]');

    // =========================
    // 初始化默认打开
    // =========================
    const items = getItems();
    if (defaultOpenIndex >= 0 && items[defaultOpenIndex]) {
        items[defaultOpenIndex].classList.add('is-open');
    }

    // =========================
    // 行为绑定
    // =========================
    function onClick(e) {

        const trigger = e.target.closest('[data-ui-role="trigger"]');
        if (!trigger || !root.contains(trigger)) return;

        const item = trigger.closest('[data-ui-item]');
        if (!item) return;

        const items = getItems();
        const isOpen = item.classList.contains('is-open');

        // 👉 点击关闭
        if (isOpen && closeOnClick) {
            item.classList.remove('is-open');
            return;
        }

        // 👉 单开
        if (single) {
            items.forEach(i => i.classList.remove('is-open'));
        }

        item.classList.add('is-open');
    }

    root.addEventListener('click', onClick);

    // =========================
    // API（核心）
    // =========================
    function open(index) {
        const items = getItems();
        if (!items[index]) return;

        if (single) {
            items.forEach(i => i.classList.remove('is-open'));
        }

        items[index].classList.add('is-open');
    }

    function close(index) {
        const items = getItems();
        if (items[index]) {
            items[index].classList.remove('is-open');
        }
    }

    function toggle(index) {
        const items = getItems();
        if (!items[index]) return;

        const isOpen = items[index].classList.contains('is-open');

        if (isOpen) {
            close(index);
        } else {
            open(index);
        }
    }

    function closeAll() {
        getItems().forEach(i => i.classList.remove('is-open'));
    }

    function destroy() {
        root.removeEventListener('click', onClick);
    }

    // =========================
    // 返回实例（关键）
    // =========================
    return {
        open,
        close,
        toggle,
        closeAll,
        destroy
    };
}