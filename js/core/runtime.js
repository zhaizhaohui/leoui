document.addEventListener('click', (e) => {

    const actionEl = e.target.closest('[data-action]')
    if (!actionEl) return

    const action = actionEl.dataset.action

    // 🔥 优先用 data-target
    const targetId = actionEl.dataset.target
    let root = null

    if (targetId) {
        root = document.getElementById(targetId)
    } else {
        root = actionEl.closest('[data-ui]')
    }

    if (!root) return

    const type = root.dataset.ui
    const instance = root.__ui__?.[type]

    instance?.[action]?.()
})