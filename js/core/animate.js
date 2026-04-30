// js/core/animate.js

const animations = {

    collapse(el, { open = true, duration = 300 } = {}) {

        return new Promise(resolve => {

            el.style.overflow = 'hidden';
            el.style.transition = `height ${duration}ms ease`;

            if (open) {
                // =========================
                // 👉 打开
                // =========================
                el.style.height = '0px';

                requestAnimationFrame(() => {
                    el.style.height = el.scrollHeight + 'px';
                });

            } else {
                // =========================
                // 👉 关闭（关键修复）
                // =========================

                // 先锁定当前高度（从 auto → px）
                el.style.height = el.scrollHeight + 'px';

                requestAnimationFrame(() => {
                    el.style.height = '0px';
                });
            }

            function done() {
                el.style.transition = '';
                el.style.height = open ? 'auto' : '0px';
                el.removeEventListener('transitionend', done);
                resolve();
            }

            el.addEventListener('transitionend', done);
        });
    },

    fade(el, { open = true, duration = 200 } = {}) {
        return new Promise(resolve => {

            el.style.transition = `opacity ${duration}ms ease`;

            if (open) {
                el.style.opacity = 0;
                el.style.display = 'block';

                requestAnimationFrame(() => {
                    el.style.opacity = 1;
                });
            } else {
                el.style.opacity = 1;

                requestAnimationFrame(() => {
                    el.style.opacity = 0;
                });
            }

            function done() {
                if (!open) el.style.display = 'none';
                el.style.transition = '';
                el.removeEventListener('transitionend', done);
                resolve();
            }

            el.addEventListener('transitionend', done);
        });
    },

    slideX(el, { x = 0, duration = 300 } = {}) {
        return new Promise(resolve => {

            el.style.transition = `transform ${duration}ms ease`;
            el.style.transform = `translateX(${x}px)`;

            function done() {
                el.style.transition = '';
                el.removeEventListener('transitionend', done);
                resolve();
            }

            el.addEventListener('transitionend', done);
        });
    }
};

export function animate(el, type, options = {}) {
    const handler = animations[type];
    if (!handler) return Promise.resolve();
    return handler(el, options);
}