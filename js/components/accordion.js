// js/components/accordion.js

import { animate } from '../core/animate.js'

export default function createAccordion(root) {

    // =========================
    // 从 DOM 读取配置
    // =========================
    const single = root.dataset.single !== 'false'
    const defaultOpenIndex = Number(root.dataset.default || -1)
    const closeOnClick = root.dataset.close !== 'false'

    const getItems = () => root.querySelectorAll('[data-ui-item]')
    const getPanel = item => item.querySelector('[data-ui-role="panel"]')

    const openItem = (item) => {
        const panel = getPanel(item)
        if (!panel) return

        item.classList.add('is-open')
        animate(panel, 'collapse', { open: true })
    }

    const closeItem = (item) => {
        const panel = getPanel(item)
        if (!panel) return

        item.classList.remove('is-open')
        animate(panel, 'collapse', { open: false })
    }

    // =========================
    // 默认展开（无动画）
    // =========================
    const items = getItems()

    if (items[defaultOpenIndex]) {
        const item = items[defaultOpenIndex]
        item.classList.add('is-open')

        const panel = getPanel(item)
        if (panel) panel.style.height = 'auto'
    }

    // =========================
    // 事件（内部自管理）
    // =========================
    function onClick(e) {

        const trigger = e.target.closest('[data-ui-role="trigger"]')
        if (!trigger || !root.contains(trigger)) return

        const item = trigger.closest('[data-ui-item]')
        if (!item) return

        const isOpen = item.classList.contains('is-open')

        // 当前打开 → 关闭
        if (isOpen && closeOnClick) {
            closeItem(item)
            return
        }

        // 单开模式
        if (single) {
            getItems().forEach(i => {
                if (i !== item) closeItem(i)
            })
        }

        openItem(item)
    }

    root.addEventListener('click', onClick)

    // =========================
    // API（可选）
    // =========================
    return {

        open(index) {
            const item = getItems()[index]
            if (item) openItem(item)
        },

        close(index) {
            const item = getItems()[index]
            if (item) closeItem(item)
        },

        toggle(index) {
            const item = getItems()[index]
            if (!item) return

            item.classList.contains('is-open')
                ? closeItem(item)
                : openItem(item)
        },

        closeAll() {
            getItems().forEach(closeItem)
        },

        destroy() {
            root.removeEventListener('click', onClick)
        }
    }
}