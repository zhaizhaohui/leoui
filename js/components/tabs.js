export function createTabs(root) {

    const items = root.querySelectorAll('[data-ui-item]');

    root.addEventListener('click', (e) => {

        const trigger = e.target.closest('[data-ui-role="trigger"]');
        if (!trigger || !root.contains(trigger)) return;

        const item = trigger.closest('[data-ui-item]');
        if (!item) return;

        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
    });

    return {};
}