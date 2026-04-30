import { registry } from './core/registry.js';

import { createOffcanvas } from './components/offcanvas.js';
import { createAccordion } from './components/accordion.js';
import { createTabs } from './components/tabs.js';
import { createModal } from './components/modal.js';
import { createCarousel } from './components/carousel.js';

// =========================
// ① registry 注册组件
// =========================

// 👉 offcanvas（singleton）
registry.offcanvas = (el) => {
    const mask = document.getElementById('leoMask');
    return createOffcanvas(el, { mask });
};


// 👉 accordion（item UI）
registry.accordion = (el) => createAccordion(el);

// 👉 collapsible（复用 accordion）
registry.collapsible = (el) => createAccordion(el);

// 👉 tabs
registry.tabs = (el) => createTabs(el);

// 👉 modal
registry.modal = (el) => createModal(el);

// 👉 carousel
registry.carousel = (el) => createCarousel(el);


// =========================
// ② 自动初始化结构型组件
// =========================

document.querySelectorAll('[data-ui]').forEach(el => {

    const type = el.dataset.ui;

    // 防重复初始化
    if (el.dataset.uiInit === '1') return;
    el.dataset.uiInit = '1';

    registry[type]?.(el);
});


// =========================
// ③ runtime（必须在最后引入）
// =========================

import './core/runtime.js';