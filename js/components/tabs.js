export function createTabs(root) {

    const items = root.querySelectorAll('[data-ui-item]');

    function getPanel(item) {
        return item.querySelector('[data-ui-role="panel"]');
    }

    function setHeight(panel, open) {

        if (open) {
            panel.style.height = panel.scrollHeight + 'px';
        } else {
            panel.style.height = panel.scrollHeight + 'px';

            // 强制回流（关键）
            panel.offsetHeight;

            panel.style.height = '0px';
        }
    }

    function activate(item) {

        items.forEach(i => {
            const panel = getPanel(i);
            if (!panel) return;

            i.classList.remove('is-active');
            setHeight(panel, false);
        });

        const panel = getPanel(item);
        if (!panel) return;

        item.classList.add('is-active');
        setHeight(panel, true);
    }

    // =========================
    // click
    // =========================
    root.addEventListener('click', e => {

        const trigger = e.target.closest('[data-ui-role="trigger"]');
        if (!trigger || !root.contains(trigger)) return;

        const item = trigger.closest('[data-ui-item]');
        if (!item) return;

        activate(item);
    });

    // =========================
    // init
    // =========================
    if (items[0]) {
        activate(items[0]);
    }

    return {};
}