import { registry } from './registry.js';

const instances = new Map();

// =========================
// 获取实例（缓存版）
function getInstance(type, el) {
    if (!instances.has(el)) {
        const factory = registry[type];
        if (!factory) return null;

        instances.set(el, factory(el));
    }
    return instances.get(el);
}

// =========================
// 解析 data-ui
function parseUI(value) {
    // open:modal#modal1
    const [actionPart, rest] = value.split(':');
    if (!rest) return null;

    const [type, id] = rest.split('#');

    return {
        action: actionPart,
        type,
        id: id || null
    };
}

// =========================
// 自动绑定
document.addEventListener('click', (e) => {

    const el = e.target.closest('[data-ui]');
    if (!el) return;

    const parsed = parseUI(el.dataset.ui);
    if (!parsed) return;

    const { action, type, id } = parsed;

    // =========================
    // 目标查找策略
    // =========================
    let target = null;

    if (id) {
        target = document.getElementById(id);
    } else {
        // fallback：最近 UI
        target = document.querySelector(`[data-ui="${type}"]`);
    }

    if (!target) return;

    const instance = getInstance(type, target);
    if (!instance) return;

    instance[action]?.();
});