// js/components/tabs.js

export default function createTabs(root) {

    // =========================
    // 防重复初始化
    // =========================
    if (root.__tabs_inited__) return root.__tabs_instance__
    root.__tabs_inited__ = true

    const items = Array.from(root.querySelectorAll('[data-ui-item]'))

    let activeIndex = 0

    function getPanel(item) {
        return item.querySelector('[data-ui-role="panel"]')
    }

    // =========================
    // 高度控制
    // =========================
    function setHeight(panel, open) {

        if (!panel) return

        if (open) {
            panel.style.height = panel.scrollHeight + 'px'
        } else {
            panel.style.height = panel.scrollHeight + 'px'
            panel.offsetHeight
            panel.style.height = '0px'
        }
    }

    // =========================
    // 激活 tab
    // =========================
    function activate(index) {

        const item = items[index]
        if (!item) return

        items.forEach((i, idx) => {
            const panel = getPanel(i)
            i.classList.remove('is-active')

            if (panel) setHeight(panel, false)
        })

        const panel = getPanel(item)
        item.classList.add('is-active')

        if (panel) setHeight(panel, true)

        activeIndex = index
    }

    // =========================
    // click 事件
    // =========================
    function onClick(e) {

        const trigger = e.target.closest('[data-ui-role="trigger"]')
        if (!trigger || !root.contains(trigger)) return

        const item = trigger.closest('[data-ui-item]')
        const index = items.indexOf(item)

        if (index !== -1) {
            activate(index)
        }
    }

    root.addEventListener('click', onClick)

    // =========================
    // init
    // =========================
    if (items[0]) {
        activate(0)
    }

    // =========================
    // API
    // =========================
    const instance = {
        next() {
            const next = (activeIndex + 1) % items.length
            activate(next)
        },

        prev() {
            const prev = (activeIndex - 1 + items.length) % items.length
            activate(prev)
        },

        go(i) {
            activate(i)
        },

        getActive() {
            return activeIndex
        },

        destroy() {
            root.removeEventListener('click', onClick)
            root.__tabs_inited__ = false
        }
    }

    root.__tabs_instance__ = instance

    return instance
}