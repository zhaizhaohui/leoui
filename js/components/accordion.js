import { animate } from '../core/animate.js';

export function createAccordion(root, options = {}) {

    const {
        single = true,
        defaultOpenIndex = -1,
        closeOnClick = true,
    } = options;

    const getItems = () => root.querySelectorAll('[data-ui-item]');
    const getPanel = item => item.querySelector('[data-ui-role="panel"]');

    const openItem = item => {
        const panel = getPanel(item);
        if (!panel) return;

        item.classList.add('is-open');
        animate(panel, 'collapse', { open: true });
    };

    const closeItem = item => {
        const panel = getPanel(item);
        if (!panel) return;

        item.classList.remove('is-open');
        animate(panel, 'collapse', { open: false });
    };

    // 👉 默认打开（无动画）
    const items = getItems();
    if (items[defaultOpenIndex]) {
        items[defaultOpenIndex].classList.add('is-open');
        const panel = getPanel(items[defaultOpenIndex]);
        if (panel) panel.style.height = 'auto';
    }

    root.addEventListener('click', e => {

        const trigger = e.target.closest('[data-ui-role="trigger"]');
        if (!trigger || !root.contains(trigger)) return;

        const item = trigger.closest('[data-ui-item]');
        if (!item) return;

        const isOpen = item.classList.contains('is-open');

        if (isOpen && closeOnClick) {
            closeItem(item);
            return;
        }

        if (single) {
            getItems().forEach(i => i !== item && closeItem(i));
        }

        openItem(item);
    });

    return {
        open: i => getItems()[i] && openItem(getItems()[i]),
        close: i => getItems()[i] && closeItem(getItems()[i]),
        toggle: i => {
            const item = getItems()[i];
            if (!item) return;
            item.classList.contains('is-open') ? closeItem(item) : openItem(item);
        },
        closeAll: () => getItems().forEach(closeItem),
        destroy: () => root.replaceWith(root.cloneNode(true))
    };
}