const mode_button = document.getElementById("th");
const sidebarModeButton = document.getElementById('sidebarThemeToggle');
const floatingTriggerButton = document.getElementById("floatingTriggerButton");
const copyLinkButton = document.getElementById("copyLinkButton");
const copyLinkConfirmBackdrop = document.getElementById('copyLinkConfirmBackdrop');
const copyLinkConfirmCancel = document.getElementById('copyLinkConfirmCancel');
const copyLinkConfirm = document.getElementById('copyLinkConfirm');
const typing = document.getElementById("typ");
const text = "Hi, I'm Wahyuna.";
let copyLinkConfirmTrigger = null;

function openCopyLinkConfirmDialog(trigger) {
    if (!copyLinkConfirmBackdrop) return;

    copyLinkConfirmTrigger = trigger;
    copyLinkConfirmBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    copyLinkConfirmCancel?.focus();
}

function closeCopyLinkConfirmDialog() {
    if (!copyLinkConfirmBackdrop) return;

    copyLinkConfirmBackdrop.classList.add('hidden');
    document.body.style.overflow = floatingCommentIsOpen ? 'hidden' : '';
    copyLinkConfirmTrigger?.focus();
    copyLinkConfirmTrigger = null;
}

async function copyProfileLink() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        toastt('Profile link copied');
    } catch {
        toastt('Failed to copy');
    }
}

copyLinkButton?.addEventListener('click', () => {
    openCopyLinkConfirmDialog(copyLinkButton);
});

copyLinkConfirmCancel?.addEventListener('click', closeCopyLinkConfirmDialog);
copyLinkConfirm?.addEventListener('click', async () => {
    closeCopyLinkConfirmDialog();
    await copyProfileLink();
});
copyLinkConfirmBackdrop?.addEventListener('click', (event) => {
    if (event.target === copyLinkConfirmBackdrop) closeCopyLinkConfirmDialog();
});
document.addEventListener('keydown', (event) => {
    if (
        event.key === 'Escape' &&
        copyLinkConfirmBackdrop &&
        !copyLinkConfirmBackdrop.classList.contains('hidden')
    ) {
        closeCopyLinkConfirmDialog();
    }
});

function change_mode() {
    const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
    if (!metaThemes.length) return;
    const color = document.body.classList.contains('bright') ? '#ffffff' : '#010203';
    metaThemes.forEach((metaTheme) => {
        metaTheme.content = color;
    });
}

function change_modee() {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const isBright = document.body.classList.contains('bright');

    if (!themeColor) return;

    const nextModeIcon = isBright ? 'fa-moon' : 'fa-sun';
    const nextModeLabel = isBright ? 'Switch to dark mode' : 'Switch to light mode';
    const themeColorValue = isBright ? '#ffffff' : '#010203';
    [mode_button, sidebarModeButton].forEach(button => {
        if (!button) return;
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add('fa-solid', nextModeIcon);
        }
        button.setAttribute('aria-label', nextModeLabel);
    });
    const sidebarModeText = sidebarModeButton?.querySelector('span');
    if (sidebarModeText) sidebarModeText.textContent = isBright ? 'Dark Mode' : 'Light Mode';
    themeColor.setAttribute('content', themeColorValue);

    change_mode();
}

async function save_mode() {
    const nextMode = document.body.classList.contains('bright') ? 'bright' : 'dark';
    await encryptedStorage.setItem('mode', nextMode);
    await encryptedStorage.removeItem('modea');
    await encryptedStorage.removeItem('wahyuna-theme');
}

async function load_mode() {
    const savedTheme = await encryptedStorage.getItem('mode') ??
        await encryptedStorage.getItem('modea') ??
        await encryptedStorage.getItem('wahyuna-theme');

    if (savedTheme === 'dark' || savedTheme === 'bright') {
        await encryptedStorage.setItem('mode', savedTheme);
    }
    await encryptedStorage.removeItem('modea');
    await encryptedStorage.removeItem('wahyuna-theme');

    if (savedTheme === 'dark') {
        document.body.classList.remove('bright');
        return;
    }

    if (savedTheme === 'bright') {
        document.body.classList.add('bright');
        return;
    }

    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //     document.body.classList.remove('bright');
    // } else {
    //     document.body.classList.add('bright');
    // }

    document.body.classList.add('bright');
}

async function _apply_() {
    await load_mode();
    change_modee();
}

function toggleColorMode() {
    document.body.classList.toggle("bright");
    save_mode().catch(error => {
        console.error(error);
        toastt('Unable to save theme preference');
    });
    change_modee();
    change_mode();
}

mode_button?.addEventListener("click", toggleColorMode);
sidebarModeButton?.addEventListener('click', () => {
    toggleColorMode();
    closeSiteSidebar();
});

let lastScrollY = window.scrollY;
let scrollHideTimer;

function updateNavbarState() {
    document.body.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', () => {
    updateNavbarState();
}, { passive: true });

_apply_().catch(error => {
    console.error(error);
});
change_mode();
updateNavbarState();

const profileImg = document.querySelector('.profile-img');
const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalImageEl = document.getElementById('modalImage');
const modalLoader = document.getElementById('modalLoader');
const profilePopupMessage = document.getElementById('profilePopupMessage');
const profilePopupCopy = document.getElementById('profilePopupCopy');

function openModal() {
    if (!imageModal) return;

    if (modalLoader) modalLoader.classList.remove('hidden');
    imageModal.classList.add('open');
    imageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();

    if (modalImageEl) {
        if (modalImageEl.complete) {
            if (modalLoader) modalLoader.classList.add('hidden');
        } else {
            modalImageEl.addEventListener('load', () => {
                if (modalLoader) modalLoader.classList.add('hidden');
            }, { once: true });
        }
    }
}

function closeModal(restoreFocus = true) {
    if (!imageModal) return;

    imageModal.classList.remove('open');
    imageModal.setAttribute('aria-hidden', 'true');
    if (modalLoader) modalLoader.classList.add('hidden');
    document.body.style.overflow = floatingCommentIsOpen ? 'hidden' : '';
    if (restoreFocus) profileImg?.focus();
}

profileImg?.addEventListener('click', openModal);
profileImg?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openModal();
});
modalClose?.addEventListener('click', () => closeModal());
modalBackdrop?.addEventListener('click', event => {
    if (event.target === modalBackdrop) closeModal();
});
profilePopupCopy?.addEventListener('click', () => {
    closeModal(false);
    copyLinkButton?.click();
});
profilePopupMessage?.addEventListener('click', () => {
    closeModal(false);
    floatingTriggerButton?.focus();
    floatingTriggerButton?.click();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && imageModal?.classList.contains('open')) {
        closeModal();
    }
});

let i = 0;
let deleting = false;
let typeTimer = null;

function stopTypingLoop() {
    if (typeTimer) {
        clearTimeout(typeTimer);
        typeTimer = null;
    }
}

function startTypingLoop() {
    stopTypingLoop();
    i = 0;
    deleting = false;
    type();
}

function type() {
    if (!typing) return;

    if (window.innerWidth <= 200) {
        stopTypingLoop();
        typing.textContent = text;
        return;
    }

    if (!deleting) {
        typing.textContent = text.substring(0, i + 1);
        i++;
        if (i <= text.length) {
            typeTimer = setTimeout(type, 120);
        } else {
            deleting = true;
            typeTimer = setTimeout(type, 2000);
        }
    } else {
        typing.textContent = text.substring(0, i - 1);
        i--;
        if (i > 0) {
            typeTimer = setTimeout(type, 70);
        } else {
            deleting = false;
            typeTimer = setTimeout(type, 300);
        }
    }
}

function syncTypingState() {
    if (window.innerWidth <= 200) {
        stopTypingLoop();
        typing.textContent = text;
        return;
    }

    startTypingLoop();
}

window.addEventListener('resize', syncTypingState);
syncTypingState();


(function () {
    const pageLoader = document.getElementById('pageLoader');
    const loaderStart = performance.now();
    const minSplashMs = 800;

    function hidePageLoader() {
        const elapsed = performance.now() - loaderStart;
        const wait = Math.max(0, minSplashMs - elapsed);
        setTimeout(() => {
            if (!pageLoader) return;
            pageLoader.classList.add('hidden');
            setTimeout(() => {
                if (pageLoader && pageLoader.parentNode) pageLoader.parentNode.removeChild(pageLoader);
            }, 450);
        }, wait);
    }

    window.addEventListener('load', hidePageLoader);

    setTimeout(hidePageLoader, 4500);
})();




function toastt(text) {
    const toast = document.getElementById("toast");

    if (!toast) {
        console.error("Toast element is missing");
        return;
    }

    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

if (window.__pendingOfflineCacheToast) {
    window.__pendingOfflineCacheToast = false;
    window.notifyOfflineCacheUsed?.();
}


const floatingCommentWidget = document.getElementById('floatingCommentWidget');
const floatingCommentClose = document.getElementById('floatingCommentClose');
const floatingCommentForm = document.getElementById('floatingCommentForm');
const floatingCommentOverlay = document.getElementById('floatingCommentOverlay');
const floatingCommentHeader = document.getElementById('floatingCommentHeader');
const floatingCommentTitleText = document.getElementById('floatingCommentTitleText');
const floatingSubmitText = document.getElementById('floatingSubmitText');
const floatingTextarea = floatingCommentForm?.querySelector('textarea');
const floatingNameInput = document.getElementById('floatingNameInput');
const floatingSubmitButton = document.getElementById('floatingSubmitText');
const sentHistoryToggle = document.getElementById('sentHistoryToggle');
const sentHistory = document.getElementById('sentHistory');
const floatingCommentContent = floatingCommentWidget?.querySelector('.floating-comment-content');
const sentHistoryHeader = sentHistory?.querySelector('.sent-history-header');
const sentHistoryList = document.getElementById('sentHistoryList');
const sentHistoryClose = document.getElementById('sentHistoryClose');
const historyDeleteBackdrop = document.getElementById('historyDeleteBackdrop');
const historyDeleteCancel = document.getElementById('historyDeleteCancel');
const historyDeleteConfirm = document.getElementById('historyDeleteConfirm');
const messageOverlayHistoryKey = '__messageOverlay';
let floatingCommentOpenTimer = null;
let floatingCommentCloseTimer = null;
let floatingCommentIsOpen = false;
let ignoreMessageOverlayPopstate = false;
let sentHistoryBaseHeight = null;
let sentHistoryResizeTimer = null;
let sentHistoryDragStartY = null;
let historyDeleteTargetIndex = null;
let historyDeleteTrigger = null;

function getMessageOverlayHistoryLayer() {
    const state = window.history.state;
    return state && typeof state === 'object'
        ? state[messageOverlayHistoryKey]
        : null;
}

function pushMessageOverlayHistoryLayer(layer) {
    const currentState = window.history.state;
    const state = currentState && typeof currentState === 'object'
        ? { ...currentState }
        : {};
    state[messageOverlayHistoryKey] = layer;
    window.history.pushState(state, '', window.location.href);
}

function goBackThroughMessageOverlayHistory() {
    const layer = getMessageOverlayHistoryLayer();
    const steps = layer === 'history' ? 2 : layer === 'message' ? 1 : 0;
    if (!steps) return;

    ignoreMessageOverlayPopstate = true;
    window.history.go(-steps);
}

function escapeHTML(value) {
    const element = document.createElement('span');
    element.textContent = String(value ?? '');
    return element.innerHTML;
}

function formatSentMessageTime(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'Unknown time';

    const elapsedSeconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
    if (elapsedSeconds < 60) return 'Just now';

    const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
    if (elapsedSeconds < 60 * 60) {
        return relativeTime.format(-Math.floor(elapsedSeconds / 60), 'minute');
    }
    if (elapsedSeconds < 24 * 60 * 60) {
        return relativeTime.format(-Math.floor(elapsedSeconds / (60 * 60)), 'hour');
    }
    if (elapsedSeconds < 30 * 24 * 60 * 60) {
        return relativeTime.format(-Math.floor(elapsedSeconds / (24 * 60 * 60)), 'day');
    }
    if (elapsedSeconds < 60 * 24 * 60 * 60) {
        return relativeTime.format(-1, 'month');
    }

    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

async function renderSentMessageHistory() {
    if (!sentHistoryList) return;

    let messages;
    try {
        const savedMessages = await encryptedStorage.getItem('anonymous-messages');
        messages = JSON.parse(savedMessages || '[]');
    } catch (error) {
        console.error(error);
        sentHistoryList.innerHTML = '<p class="sent-history-empty">Unable to load sent messages.</p>';
        return;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        sentHistoryList.innerHTML = '<p class="sent-history-empty">You haven’t sent any messages from this device yet.</p>';
        return;
    }

    sentHistoryList.innerHTML = messages.map((item, index) => `
        <div class="sent-history-item" data-message-index="${index}">
            <article class="sent-history-card">
                <div class="sent-history-card-top">
                    <strong>${escapeHTML(item?.name || 'Anonymous')}</strong>
                    <time>${escapeHTML(formatSentMessageTime(item?.timestamp))}</time>
                    <button type="button" class="sent-history-delete" aria-label="Delete this message">
                        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    </button>
                </div>
                <p>${escapeHTML(item?.message || '')}</p>
                <span class="sent-history-device">${escapeHTML(item?.device || 'Unknown device')}</span>
            </article>
        </div>
    `).reverse().join('');
}

function openHistoryDeleteDialog(index, trigger) {
    if (!historyDeleteBackdrop || !Number.isInteger(index)) return;

    historyDeleteTargetIndex = index;
    historyDeleteTrigger = trigger;
    historyDeleteBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    historyDeleteCancel?.focus();
}

function closeHistoryDeleteDialog() {
    if (!historyDeleteBackdrop) return;

    historyDeleteBackdrop.classList.add('hidden');
    document.body.style.overflow = floatingCommentIsOpen ? 'hidden' : '';
    historyDeleteTargetIndex = null;
    historyDeleteTrigger?.focus();
    historyDeleteTrigger = null;
}

async function deleteHistoryMessage() {
    if (historyDeleteTargetIndex === null) return;

    try {
        const savedMessages = await encryptedStorage.getItem('anonymous-messages');
        const messages = JSON.parse(savedMessages || '[]');
        if (
            !Array.isArray(messages) ||
            historyDeleteTargetIndex < 0 ||
            historyDeleteTargetIndex >= messages.length
        ) {
            throw new Error('The selected message is no longer available.');
        }

        messages.splice(historyDeleteTargetIndex, 1);
        await encryptedStorage.setItem('anonymous-messages', JSON.stringify(messages));
    } catch (error) {
        console.error(error);
        toastt('Could not delete this message');
        closeHistoryDeleteDialog();
        return;
    }

    closeHistoryDeleteDialog();
    renderSentMessageHistory();
    toastt('Message history has been deleted');
}

sentHistoryList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const deleteButton = target.closest('.sent-history-delete');
    if (!deleteButton) return;

    const item = deleteButton.closest('.sent-history-item');
    const index = Number(item?.dataset.messageIndex);
    openHistoryDeleteDialog(index, deleteButton);
});

historyDeleteCancel?.addEventListener('click', closeHistoryDeleteDialog);
historyDeleteConfirm?.addEventListener('click', deleteHistoryMessage);
historyDeleteBackdrop?.addEventListener('click', (event) => {
    if (event.target === historyDeleteBackdrop) closeHistoryDeleteDialog();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && historyDeleteBackdrop && !historyDeleteBackdrop.classList.contains('hidden')) {
        closeHistoryDeleteDialog();
    }
});

function setSentHistoryOpen(isOpen, updateHistory = true) {
    if (!floatingCommentWidget || !sentHistory || !floatingCommentForm || !sentHistoryToggle) return;

    const isCurrentlyOpen = floatingCommentWidget.classList.contains('show-sent-history');
    if (isOpen === isCurrentlyOpen) return;
    clearTimeout(sentHistoryResizeTimer);

    if (isOpen) {
        pushMessageOverlayHistoryLayer('history');
    } else if (updateHistory && getMessageOverlayHistoryLayer() === 'history') {
        ignoreMessageOverlayPopstate = true;
        window.history.back();
    }

    const currentHeight = floatingCommentWidget.getBoundingClientRect().height;
    floatingCommentWidget.style.height = `${currentHeight}px`;

    if (isOpen) renderSentMessageHistory();
    floatingCommentWidget.classList.remove('history-closing');
    sentHistory.classList.remove('is-dragging');
    sentHistory.style.transform = '';
    floatingCommentWidget.classList.toggle('show-sent-history', isOpen);
    sentHistory.classList.toggle('hidden', !isOpen);
    sentHistory.setAttribute('aria-hidden', String(!isOpen));
    sentHistoryToggle.setAttribute('aria-expanded', String(isOpen));
    sentHistoryToggle.setAttribute('aria-label', isOpen ? 'Hide my messages' : 'Show my messages');

    if (isOpen) {
        const messageContentHeight = floatingCommentContent?.getBoundingClientRect().height ?? 0;
        sentHistoryBaseHeight = messageContentHeight > 0
            ? Math.min(currentHeight, Math.ceil(messageContentHeight) + 2)
            : currentHeight;
        requestAnimationFrame(() => {
            if (!floatingCommentWidget.classList.contains('show-sent-history')) return;

            const isMobile = window.innerWidth <= 600;
            const maxHeight = window.innerHeight * (isMobile ? 0.78 : 0.82);
            const desiredHeight = isMobile
                ? Math.max(0, window.innerHeight - 160)
                : Math.min(maxHeight, 720);
            floatingCommentWidget.style.height = `${desiredHeight}px`;
        });
    } else {
        floatingCommentWidget.classList.add('history-closing');
        const targetHeight = sentHistoryBaseHeight ?? currentHeight;
        requestAnimationFrame(() => {
            floatingCommentWidget.style.height = `${targetHeight}px`;
        });
        sentHistoryResizeTimer = window.setTimeout(() => {
            if (floatingCommentWidget.classList.contains('closing')) return;
            floatingCommentWidget.classList.remove('history-closing');
            floatingCommentWidget.style.height = '';
            sentHistoryBaseHeight = null;
        }, 280);
    }
}

function handleSentHistoryPointerDown(event) {
    if (!floatingCommentWidget?.classList.contains('show-sent-history')) return;
    if (event.target instanceof Element && event.target.closest('#sentHistoryClose')) return;

    sentHistoryDragStartY = event.clientY;
    floatingCommentWidget?.classList.add('history-dragging');
    sentHistory?.classList.add('is-dragging');
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    event.preventDefault();
}

function handleSentHistoryPointerMove(event) {
    if (sentHistoryDragStartY === null || !sentHistory || !floatingCommentWidget) return;

    const dragDistance = Math.max(0, event.clientY - sentHistoryDragStartY);
    if (dragDistance === 0) return;

    event.preventDefault();
    const boundedDragDistance = Math.min(
        dragDistance,
        floatingCommentWidget.getBoundingClientRect().height
    );
    const horizontalTransform = window.innerWidth <= 600 ? 'translate(0,' : 'translate(-50%,';
    floatingCommentWidget.style.transform = `${horizontalTransform} ${boundedDragDistance}px)`;
}

function handleSentHistoryPointerUp(event) {
    if (sentHistoryDragStartY === null) return;

    const dragDistance = event.clientY - sentHistoryDragStartY;
    sentHistoryDragStartY = null;
    floatingCommentWidget?.classList.remove('history-dragging');
    sentHistory?.classList.remove('is-dragging');

    if (dragDistance > 56) {
        setSentHistoryOpen(false);
        if (floatingCommentWidget) floatingCommentWidget.style.transform = '';
    } else if (floatingCommentWidget) {
        floatingCommentWidget.style.transform = '';
    }
}

function cancelSentHistoryPointer() {
    sentHistoryDragStartY = null;
    floatingCommentWidget?.classList.remove('history-dragging');
    sentHistory?.classList.remove('is-dragging');
    if (floatingCommentWidget) floatingCommentWidget.style.transform = '';
}

sentHistoryToggle?.addEventListener('click', () => {
    setSentHistoryOpen(!floatingCommentWidget?.classList.contains('show-sent-history'));
});
sentHistoryClose?.addEventListener('click', () => setSentHistoryOpen(false));
sentHistoryHeader?.addEventListener('pointerdown', handleSentHistoryPointerDown);
sentHistoryHeader?.addEventListener('pointermove', handleSentHistoryPointerMove);
sentHistoryHeader?.addEventListener('pointerup', handleSentHistoryPointerUp);
sentHistoryHeader?.addEventListener('pointercancel', cancelSentHistoryPointer);
floatingCommentWidget?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('#sentHistoryToggle')) return;

    if (
        floatingCommentWidget.classList.contains('show-sent-history') &&
        !sentHistory?.contains(event.target)
    ) {
        setSentHistoryOpen(false);
    }
});

function updateFloatingLabelText() {
    const compactLabel = window.innerWidth <= 160 ? 'Msg' : 'Message';
    if (floatingCommentTitleText) floatingCommentTitleText.textContent = compactLabel;
    if (floatingTriggerButton) {
        floatingTriggerButton.textContent = window.innerWidth < 380 ? 'Message' : 'Anonymous Message';
    }
    if (floatingSubmitText) floatingSubmitText.textContent = 'Send';
}

function validateFloatingForm() {
    if (!floatingCommentForm || !floatingSubmitButton || !floatingNameInput || !floatingTextarea) return;

    floatingNameInput.maxLength = 100;
    floatingTextarea.maxLength = 1000;

    const name = floatingNameInput.value.trim();
    const message = floatingTextarea.value.trim();
    const isFormValid = name.length > 0 && message.length > 0;

    floatingSubmitButton.disabled = !isFormValid;

}

function setFloatingCommentOpen(isOpen) {
    if (!floatingCommentWidget) return;

    if (isOpen) {
        clearTimeout(sentHistoryResizeTimer);
        floatingCommentWidget.classList.remove('history-closing');
        if (floatingCommentIsOpen && !floatingCommentWidget.classList.contains('hidden')) return;
        if (!['message', 'history'].includes(getMessageOverlayHistoryLayer())) {
            pushMessageOverlayHistoryLayer('message');
        }
    } else {
        const widgetWasOpen = floatingCommentIsOpen || !floatingCommentWidget.classList.contains('hidden');
        if (widgetWasOpen) {
            const historyIsOpen = floatingCommentWidget.classList.contains('show-sent-history');
            if (historyIsOpen) setSentHistoryOpen(false, false);
            goBackThroughMessageOverlayHistory();
        }
    }

    const isMobile = window.innerWidth <= 600;
    const transformValues = isMobile ? {
        openStart: 'translate(0, 30px) scaleY(0.94)',
        openEnd: 'translate(0, 0) scaleY(1)',
        resting: 'translate(0, 0)',
        closeEnd: 'translate(0, 18px) scaleY(0.08)'
    } : {
        openStart: 'translate(-50%, 30px) scaleY(0.94)',
        openEnd: 'translate(-50%, 0) scaleY(1)',
        resting: 'translate(-50%, 0)',
        closeEnd: 'translate(-50%, 18px) scaleY(0.08)'
    };

    clearTimeout(floatingCommentOpenTimer);
    clearTimeout(floatingCommentCloseTimer);

    if (isOpen) {
        floatingCommentWidget.classList.remove('hidden', 'closing');
        floatingCommentWidget.classList.remove('is-opening');
        floatingCommentWidget.style.height = '';
        floatingCommentWidget.style.maxHeight = '';
        floatingCommentWidget.style.opacity = '0';
        floatingCommentWidget.style.transform = transformValues.openStart;
        floatingCommentWidget.style.visibility = 'visible';
        if (floatingCommentOverlay) {
            floatingCommentOverlay.classList.remove('hidden');
        }
        document.body.style.overflow = 'hidden';

        // cek limit
        validateFloatingForm();

        requestAnimationFrame(() => {
            floatingCommentWidget.classList.add('is-opening');
            floatingCommentWidget.style.opacity = '1';
            floatingCommentWidget.style.transform = transformValues.openEnd;
        });
        floatingCommentOpenTimer = window.setTimeout(() => {
            floatingCommentWidget.classList.remove('is-opening');
            floatingCommentWidget.style.opacity = '';
            floatingCommentWidget.style.transform = '';
            floatingCommentIsOpen = true;
        }, 420);
        return;
    }

    if (!floatingCommentIsOpen && floatingCommentWidget.classList.contains('hidden')) return;

    const closeDuration = 800;
    const currentHeight = floatingCommentWidget.offsetHeight || floatingCommentWidget.scrollHeight || 360;

    floatingCommentIsOpen = false;
    floatingCommentWidget.classList.remove('hidden');
    floatingCommentWidget.classList.remove('closing');
    floatingCommentWidget.style.setProperty('--sheet-close-height', `${currentHeight}px`);
    floatingCommentWidget.style.visibility = 'visible';
    floatingCommentWidget.style.height = `${currentHeight}px`;
    floatingCommentWidget.style.maxHeight = `${currentHeight}px`;
    floatingCommentWidget.style.opacity = '1';
    floatingCommentWidget.style.transform = transformValues.resting;

    if (floatingCommentOverlay) {
        floatingCommentOverlay.classList.add('hidden');
    }

    document.body.style.overflow = '';

    requestAnimationFrame(() => {
        floatingCommentWidget.classList.add('closing');
    });

    floatingCommentCloseTimer = window.setTimeout(() => {
        floatingCommentWidget.classList.add('hidden');
        floatingCommentWidget.classList.remove('closing');
        floatingCommentWidget.style.height = '';
        floatingCommentWidget.style.maxHeight = '';
        floatingCommentWidget.style.opacity = '';
        floatingCommentWidget.style.transform = '';
        floatingCommentWidget.style.overflow = '';
        floatingCommentWidget.style.visibility = 'hidden';
        floatingCommentWidget.style.removeProperty('--sheet-close-height');
        floatingCommentWidget.classList.remove('history-closing');
        sentHistoryBaseHeight = null;
    }, closeDuration);
}

window.addEventListener('popstate', event => {
    if (linkSearchIsOpen) {
        if (
            linkSearchClosePending ||
            !event.state ||
            typeof event.state !== 'object' ||
            event.state[linkSearchHistoryKey] !== true
        ) {
            linkSearchClosePending = false;
            closeLinkSearch(false);
        }
        return;
    }

    if (linkSearchBackdrop?.classList.contains('open')) return;

    if (ignoreMessageOverlayPopstate) {
        ignoreMessageOverlayPopstate = false;
        return;
    }

    if (floatingCommentWidget?.classList.contains('show-sent-history')) {
        setSentHistoryOpen(false);
        return;
    }

    if (floatingCommentWidget && !floatingCommentWidget.classList.contains('hidden')) {
        setFloatingCommentOpen(false);
    }
});

function autoGrowTextarea() {
    if (!floatingTextarea) return;

    floatingTextarea.style.height = 'auto';
    const nextHeight = Math.min(floatingTextarea.scrollHeight, window.innerHeight * 0.3);
    floatingTextarea.style.height = `${nextHeight}px`;
    validateFloatingForm();
}

function resetFloatingForm() {
    if (floatingCommentForm) {
        floatingCommentForm.reset();
    }
    if (deviceInput) {
        deviceInput.value = '';
    }
    validateFloatingForm();
    autoGrowTextarea();
}

let dragState = null;
let dragHandlersBound = false;

function handleSheetPointerDown(event) {
    if (!floatingCommentWidget) return;
    if (event.target && event.target.closest('.floating-comment-close')) return;

    const rect = floatingCommentWidget.getBoundingClientRect();
    dragState = {
        startY: event.clientY,
        startHeight: rect.height,
    };

    floatingCommentWidget.style.transition = 'none';
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    event.preventDefault();
}

function handleSheetPointerMove(event) {
    if (!dragState || !floatingCommentWidget) return;
    const deltaY = event.clientY - dragState.startY;
    if (deltaY <= 0) return;
    event.preventDefault();
    const minHeight = 140;
    const nextHeight = Math.max(minHeight, dragState.startHeight - deltaY * 1.2);
    floatingCommentWidget.style.height = `${nextHeight}px`;
}

function handleSheetPointerUp() {
    if (!dragState || !floatingCommentWidget) return;

    const currentHeight = floatingCommentWidget.getBoundingClientRect().height;
    const closeThreshold = Math.max(170, dragState.startHeight * 0.48);
    floatingCommentWidget.style.transition = 'height 0.28s ease, transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1), max-height 0.38s ease, opacity 0.28s ease, box-shadow 0.28s ease';

    if (currentHeight <= closeThreshold) {
        floatingCommentWidget.style.height = '0px';
        window.setTimeout(() => setFloatingCommentOpen(false), 180);
    } else {
        floatingCommentWidget.style.height = `${dragState.startHeight}px`;
        window.requestAnimationFrame(() => {
            floatingCommentWidget.style.height = '';
        });
    }

    dragState = null;
}

function bindSheetDragHandlers() {
    if (!floatingCommentHeader || dragHandlersBound) return;
    floatingCommentHeader.addEventListener('pointerdown', handleSheetPointerDown);
    floatingCommentHeader.addEventListener('pointermove', handleSheetPointerMove);
    floatingCommentHeader.addEventListener('pointerup', handleSheetPointerUp);
    floatingCommentHeader.addEventListener('pointerleave', handleSheetPointerUp);
    floatingCommentHeader.addEventListener('pointercancel', handleSheetPointerUp);
    dragHandlersBound = true;
}

function unbindSheetDragHandlers() {
    if (!floatingCommentHeader || !dragHandlersBound) return;
    floatingCommentHeader.removeEventListener('pointerdown', handleSheetPointerDown);
    floatingCommentHeader.removeEventListener('pointermove', handleSheetPointerMove);
    floatingCommentHeader.removeEventListener('pointerup', handleSheetPointerUp);
    floatingCommentHeader.removeEventListener('pointerleave', handleSheetPointerUp);
    floatingCommentHeader.removeEventListener('pointercancel', handleSheetPointerUp);
    dragHandlersBound = false;
}

function syncSheetMode() {
    bindSheetDragHandlers();
}

async function setAnonymousMessageBlocked() {
    const storageKey = 'anonymous-message-blocked';
    const today = getTodayKey();
    const savedBlocked = await encryptedStorage.getItem(storageKey);
    const blocked = JSON.parse(savedBlocked || '{}');
    blocked[today] = true;
    await encryptedStorage.setItem(storageKey, JSON.stringify(blocked));
}

syncSheetMode();

const urlParams = new URLSearchParams(window.location.search);
const shouldAutoOpenAnonymousMessage = urlParams.get('message')?.trim().toLowerCase() === 'anonymous';

if (shouldAutoOpenAnonymousMessage) {
    setFloatingCommentOpen(false);
    window.setTimeout(() => {
        setFloatingCommentOpen(true);
    }, 1150);
} else {
    setFloatingCommentOpen(false);
}

updateFloatingLabelText();
validateFloatingForm();
autoGrowTextarea();

floatingTriggerButton?.addEventListener('click', () => {
    setFloatingCommentOpen(true);
});
floatingCommentClose.addEventListener('click', () => setFloatingCommentOpen(false));
floatingCommentOverlay.addEventListener('click', () => {
    if (floatingCommentWidget?.classList.contains('show-sent-history')) {
        setSentHistoryOpen(false);
        return;
    }

    setFloatingCommentOpen(false);
});
floatingNameInput?.addEventListener('input', validateFloatingForm);
floatingTextarea?.addEventListener('input', () => {
    autoGrowTextarea();
    validateFloatingForm();
});
window.addEventListener('resize', () => {
    updateFloatingLabelText();
    syncSheetMode();
});

// API
const API = "https://wahyunaserver.wahyunadragon.workers.dev/am";

function detectDevice() {
    const ua = navigator.userAgent;

    if (/android/i.test(ua)) return 'Android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
    if (/windows/i.test(ua)) return 'Windows';
    if (/macintosh|mac os x/i.test(ua)) return 'MacOS';
    if (/linux/i.test(ua)) return 'Linux';

    return 'Unknown';
}

// sisi client
function getTodayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function canSendToday() {
    const storageKey = 'anonymous-message-daily-count';
    const today = getTodayKey();
    const storedData = await encryptedStorage.getItem(storageKey);
    const savedData = JSON.parse(storedData || '{}');

    const count = Number(savedData.date === today ? savedData.count : 0);

    if (count >= 200) {
        return false;
    }

    return true;
}

async function markSentToday() {
    const storageKey = 'anonymous-message-daily-count';
    const today = getTodayKey();
    const storedData = await encryptedStorage.getItem(storageKey);
    const savedData = JSON.parse(storedData || '{}');

    const currentCount = savedData.date === today
        ? Number(savedData.count || 0)
        : 0;

    const newCount = currentCount + 1;

    await encryptedStorage.setItem(storageKey, JSON.stringify({
        date: today,
        count: newCount
    }));
}

async function saveSentMessage(name, message, device) {
    const storageKey = 'anonymous-messages';
    const storedMessages = await encryptedStorage.getItem(storageKey);
    const messages = JSON.parse(storedMessages || '[]');

    messages.push({
        name: name,
        message: message,
        timestamp: new Date().toISOString(),
        device: device
    });

    await encryptedStorage.setItem(storageKey, JSON.stringify(messages));
}

floatingCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (floatingSubmitButton.disabled) {
        false
        return;
    }

    const name = (floatingNameInput?.value || '').toString().trim();
    const message = (floatingTextarea?.value || '').toString().trim();
    const device = detectDevice();
    const deviceInput = document.getElementById('deviceInput');

    if (!name) {
        toastt('Please enter your anonymous name');
        return;
    }

    if (!message) {
        toastt('Please enter your anonymous message');
        return;
    }

    if (!device) {
        toastt('Device is required');
        return;
    }

    let allowedToSend;
    try {
        allowedToSend = await canSendToday();
    } catch (error) {
        console.error(error);
        toastt('Unable to check message limit');
        return;
    }

    if (!allowedToSend) {
        resetFloatingForm();
        setFloatingCommentOpen(false);
        return;
    }

    if (deviceInput) {
        deviceInput.value = device;
    }

    setFloatingCommentOpen(false);

    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                message: message,
                device: device
            })
        });

        const result = await response.json();


        if (!response.ok || !result.success) {
            throw new Error(result.error || 'error');
        }

        toastt('The message has been sent.');
        resetFloatingForm();

        try {
            await markSentToday();
            await saveSentMessage(name, message, device);
            await incrementAnonymousMessages();
        } catch (storageError) {

            toastt('Message sent (error)');
        }

    } catch (error) {

        console.error(error);

        const errorMessage = error.message || "";

        if (
            errorMessage.includes("Failed to fetch") ||
            errorMessage.includes("NetworkError") ||
            errorMessage.includes("network error") ||
            errorMessage.includes("Network request failed")
        ) {
            toastt("No internet connection");
            resetFloatingForm();
            return;
        }

        const isSpam = error.message === 'spam detected';
        const isDailyLimit = error.message === 'You have already sent 3 messages today';

        if (isSpam || isDailyLimit) {
            resetFloatingForm();
            setFloatingCommentOpen(false);
            try {
                await setAnonymousMessageBlocked();
            } catch (storageError) {
                console.error(storageError);
            }
            toastt('You have already sent 3 messages today');
            return;
        }

        setFloatingCommentOpen(true);

        if (error.message === 'success') {
            toastt('This message has already been sent');
        }
        else {
            toastt('error');
        }
    }

    // end api

    resetFloatingForm();
});

const linkCards = document.getElementById('linkCards');
const fromMeCards = document.getElementById('fromMeCards');
const profileLinkCarousel = document.getElementById('profileLinkCarousel');
const sidebarToggle = document.getElementById('sidebarToggle');
const siteSidebar = document.getElementById('siteSidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const sidebarClose = document.getElementById('sidebarClose');
const searchToggle = document.getElementById('searchToggle');
const linkSearchBackdrop = document.getElementById('linkSearchBackdrop');
const linkSearchInput = document.getElementById('linkSearchInput');
const linkSearchClose = document.getElementById('linkSearchClose');
const linkSearchResults = document.getElementById('linkSearchResults');
const linkActionBackdrop = document.getElementById('linkActionBackdrop');
const linkActionImageContainer = document.getElementById('linkActionImageContainer');
const linkActionTitle = document.getElementById('linkActionTitle');
const linkActionDescription = document.getElementById('linkActionDescription');
const linkActionCopy = document.getElementById('linkActionCopy');
const linkActionOpen = document.getElementById('linkActionOpen');
const linkActionCancel = document.getElementById('linkActionCancel');
const linkActionRemoveHistory = document.getElementById('linkActionRemoveHistory');
let linkActionCard = null;
let linkActionTrigger = null;
let linkActionPreviousOverflow = '';
const linkSearchHistoryKey = '__linkSearch';
const openedLinkHistoryStorageKey = 'search_history_link';
const legacyOpenedLinkHistoryStorageKey = '__openedLinkHistory';
let linkSearchIsOpen = false;
let linkSearchClosePending = false;
let linkCardPressTimer = null;
let linkCardPressTarget = null;
let linkCardPressStart = null;
let linkCardPointerIsDown = false;
let suppressLinkCardClick = null;
let suppressLinkCardClickTimer = null;
let loadedLinkData = [];
let loadedFromMeData = [];
let linkCarouselId = 0;
let linkSearchPreviousOverflow = '';
let sidebarPreviousOverflow = '';

function openSiteSidebar() {
    if (!siteSidebar || !sidebarBackdrop || siteSidebar.classList.contains('open')) return;

    sidebarPreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    siteSidebar.classList.add('open');
    siteSidebar.setAttribute('aria-hidden', 'false');
    sidebarBackdrop.classList.add('open');
    sidebarBackdrop.setAttribute('aria-hidden', 'false');
    sidebarToggle?.setAttribute('aria-expanded', 'true');
    sidebarToggle?.setAttribute('aria-label', 'Close navigation menu');
    siteSidebar.querySelector('button')?.focus({ preventScroll: true });
}

function closeSiteSidebar(restoreFocus = true) {
    if (!siteSidebar || !sidebarBackdrop || !siteSidebar.classList.contains('open')) return;

    siteSidebar.classList.remove('open');
    siteSidebar.setAttribute('aria-hidden', 'true');
    sidebarBackdrop.classList.remove('open');
    sidebarBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = sidebarPreviousOverflow;
    sidebarToggle?.setAttribute('aria-expanded', 'false');
    sidebarToggle?.setAttribute('aria-label', 'Open navigation menu');
    if (restoreFocus) sidebarToggle?.focus({ preventScroll: true });
}

sidebarToggle?.addEventListener('click', () => {
    if (siteSidebar?.classList.contains('open')) {
        closeSiteSidebar();
    } else {
        openSiteSidebar();
    }
});
sidebarBackdrop?.addEventListener('click', () => closeSiteSidebar());
sidebarClose?.addEventListener('click', () => closeSiteSidebar());
siteSidebar?.addEventListener('click', event => {
    const policyButton = event.target.closest('[data-policy-type]');
    if (!policyButton) return;

    const policyType = policyButton.dataset.policyType;
    closeSiteSidebar(false);
    if (policyType) window.openPolicyModal(policyType);
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteSidebar?.classList.contains('open')) {
        closeSiteSidebar();
    }
});

function createLinkCard(link, index) {
    const card = document.createElement('div');
    const mainLink = document.createElement('a');
    const image = document.createElement('img');
    const icon = document.createElement('div');
    const text = document.createElement('div');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    const menu = document.createElement('button');
    const arrowIcon = document.createElement('i');

    card.className = `link-card${link.contact ? ' contact' : ''}`;
    card.style.setProperty('--link-card-index', String(index));
    mainLink.className = 'link-card-main';
    mainLink.href = link.url;
    if (link.target === '_blank') {
        mainLink.target = '_blank';
        mainLink.rel = 'noopener noreferrer';
    }

    icon.className = 'link-icon';
    image.alt = `${link.name} icon`;
    const imageSkeleton = document.createElement('span');
    imageSkeleton.className = 'link-image-skeleton';
    imageSkeleton.setAttribute('aria-hidden', 'true');
    icon.classList.add('is-image-loading');
    icon.append(imageSkeleton, image);
    image.addEventListener('load', () => {
        icon.classList.remove('is-image-loading');
        imageSkeleton.remove();
    }, { once: true });
    image.addEventListener('error', () => {
        icon.classList.remove('is-image-loading');
        icon.classList.add('image-error');
        imageSkeleton.remove();
    }, { once: true });
    image.src = link.image;

    text.className = 'link-text';
    title.textContent = link.name;
    description.textContent = link.description;
    text.append(title, description);

    menu.className = 'link-card-menu';
    menu.type = 'button';
    menu.setAttribute('aria-label', `More options for ${link.name}`);
    arrowIcon.className = 'fa-solid fa-ellipsis-vertical';
    arrowIcon.setAttribute('aria-hidden', 'true');
    menu.appendChild(arrowIcon);

    mainLink.append(icon, text);
    card.append(mainLink, menu);
    return card;
}

function validateLinkData(links) {
    if (!Array.isArray(links) || links.length === 0) {
        throw new Error('Link data must be a non empty array');
    }

    return links.map(link => {
        if (
            !link ||
            typeof link.name !== 'string' ||
            typeof link.description !== 'string' ||
            typeof link.url !== 'string' ||
            typeof link.image !== 'string'
        ) {
            throw new Error('Link data contains an invalid entry');
        }

        const url = new URL(link.url, window.location.href);
        if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
            throw new Error(`Unsupported link protocol for ${link.name}.`);
        }

        const imageUrl = new URL(link.image, window.location.href);
        if (!['http:', 'https:'].includes(imageUrl.protocol)) {
            throw new Error(`error`);
        }

        if (link.target !== undefined && link.target !== '_blank' && link.target !== '_self') {
            throw new Error(`error`);
        }

        return {
            name: link.name,
            description: link.description,
            url: url.href,
            image: imageUrl.href,
            target: link.target,
            contact: link.contact === true
        };
    });
}

function createLinkSlideCarousel(socialLinks, fromMeLinks, recentLinks = {}, suggestedLinks = {}) {
    const carouselId = `link-carousel-${++linkCarouselId}`;
    const carousel = document.createElement('div');
    const navigation = document.createElement('div');
    const slides = document.createElement('div');
    const categories = [
        { key: 'social', label: 'Social', links: socialLinks },
        { key: 'fromMe', label: 'From me', links: fromMeLinks }
    ];

    carousel.className = 'link-slide-carousel link-search-slide-carousel';
    navigation.className = 'link-slide-nav';
    navigation.setAttribute('role', 'tablist');
    navigation.setAttribute('aria-label', 'Search link categories');
    slides.className = 'link-slides';
    slides.setAttribute('aria-label', 'Swipe between Social and From me');

    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        const panel = document.createElement('section');
        const heading = document.createElement('h2');
        const links = document.createElement('div');
        const tabId = `${carouselId}-tab-${index}`;
        const panelId = `${carouselId}-panel-${index}`;

        tab.className = `link-slide-tab${index === 0 ? ' active' : ''}`;
        tab.type = 'button';
        tab.id = tabId;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(index === 0));
        tab.setAttribute('aria-controls', panelId);
        tab.dataset.linkSlide = String(index);
        tab.textContent = category.label;

        panel.className = 'link-slide';
        panel.id = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabId);

        heading.className = 'link-slide-title';
        heading.textContent = category.label;
        links.className = 'links';

        panel.append(heading);

        if (recentLinks[category.key]?.length || suggestedLinks[category.key]?.length) {
            const history = document.createElement('div');
            const historyHeading = document.createElement('h3');
            const suggestions = document.createElement('div');
            const suggestionsHeading = document.createElement('h3');
            history.className = 'link-search-slide-section';
            historyHeading.className = 'link-search-history-title';
            historyHeading.textContent = 'Recently opened';
            suggestions.className = 'link-search-slide-section';
            suggestionsHeading.className = 'link-search-history-title';
            suggestionsHeading.textContent = 'Suggestions';

            const categoryRecentLinks = recentLinks[category.key] ?? [];
            if (categoryRecentLinks.length) {
                history.append(
                    historyHeading,
                    ...categoryRecentLinks.map(link => {
                        const card = createLinkCard(link);
                        card.dataset.searchHistoryUrl = link.url;
                        return card;
                    })
                );
            }

            const categorySuggestions = suggestedLinks[category.key] ?? [];
            if (categorySuggestions.length) {
                suggestions.append(
                    suggestionsHeading,
                    ...categorySuggestions.map(createLinkCard)
                );
            } else {
                const emptySuggestions = document.createElement('p');
                emptySuggestions.className = 'link-search-empty';
                emptySuggestions.textContent = 'No suggestions available';
                suggestions.append(suggestionsHeading, emptySuggestions);
            }

            if (categoryRecentLinks.length) panel.append(history);
            if (categorySuggestions.length) panel.append(suggestions);
        } else {
            if (category.links.length) {
                links.replaceChildren(...category.links.map(createLinkCard));
            } else {
                const emptyState = document.createElement('p');
                emptyState.className = 'link-search-empty';
                emptyState.textContent = `No ${category.label} links found`;
                links.append(emptyState);
            }
            panel.append(links);
        }

        navigation.append(tab);
        slides.append(panel);
    });

    carousel.append(navigation, slides);
    setupLinkSlideCarousel(carousel);
    return carousel;
}

function setupLinkSlideCarousel(carousel) {
    const slides = carousel.querySelector('.link-slides');
    const panels = Array.from(carousel.querySelectorAll('.link-slide'));
    const tabs = Array.from(carousel.querySelectorAll('.link-slide-tab'));
    if (!slides || panels.length !== tabs.length) return;

    const navigation = carousel.querySelector('.link-slide-nav');
    const getActiveSlideIndex = () => {
        if (!slides.clientWidth) return 0;
        return Math.min(
            Math.max(Math.round(slides.scrollLeft / slides.clientWidth), 0),
            panels.length - 1
        );
    };
    const updateActiveSlideHeight = () => {
        if (carousel.id !== 'profileLinkCarousel') return;
        const activePanel = panels[getActiveSlideIndex()];
        if (!activePanel) return;
        slides.style.setProperty('--active-link-slide-height', `${activePanel.scrollHeight}px`);
    };
    const updateBiodataHeight = () => {
        if (carousel.id !== 'profileLinkCarousel') return;
        const biodata = document.querySelector('.biodata');
        if (!biodata) return;
        slides.style.setProperty('--biodata-height', `${biodata.getBoundingClientRect().height}px`);
    };
    const profileSlideHistoryKey = '__profileLinkSlide';
    let profileSlideUrlTimer;

    if (carousel.id === 'profileLinkCarousel') {
        const panelResizeObserver = new ResizeObserver(() => {
            updateActiveSlideHeight();
            updateBiodataHeight();
        });
        panels.forEach(panel => panelResizeObserver.observe(panel));
        const biodata = document.querySelector('.biodata');
        if (biodata) panelResizeObserver.observe(biodata);
        updateActiveSlideHeight();
        updateBiodataHeight();
        window.addEventListener('resize', updateBiodataHeight);
    }

    if (carousel.id === 'profileLinkCarousel' && navigation) {
        const tabLabels = tabs.map(tab => tab.querySelector('.link-slide-tab-label'));
        let stickyUpdateFrame = 0;
        const updateStickyNavigation = () => {
            stickyUpdateFrame = 0;
            const stickyTop = Number.parseFloat(getComputedStyle(navigation).top) || 0;
            const navigationRect = navigation.getBoundingClientRect();
            const carouselRect = carousel.getBoundingClientRect();
            const hasReachedStickyPosition = navigationRect.top <= stickyTop + 1;
            const carouselHasRoomBelow = carouselRect.bottom > stickyTop + navigationRect.height;
            const shouldStick = hasReachedStickyPosition && carouselHasRoomBelow;
            if (navigation.classList.contains('is-stuck') === shouldStick) return;

            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const activeAnimations = [...tabs, ...tabLabels.filter(Boolean)]
                .map(element => element.getAnimations());
            activeAnimations.flat().forEach(animation => animation.cancel());
            const beforeRects = tabs.map(tab => tab.getBoundingClientRect());
            const beforeLabelRects = tabLabels.map(label => label?.getBoundingClientRect());

            navigation.classList.toggle('is-stuck', shouldStick);
            if (reduceMotion) return;

            const afterRects = tabs.map(tab => tab.getBoundingClientRect());
            const afterLabelRects = tabLabels.map(label => label?.getBoundingClientRect());
            tabs.forEach((tab, index) => {
                const before = beforeRects[index];
                const after = afterRects[index];
                if (!before.width || !after.width) return;

                tab.animate(
                    [
                        {
                            width: `${before.width}px`,
                            transform: `translateX(${before.left - after.left}px)`
                        },
                        {
                            width: `${after.width}px`,
                            transform: 'translateX(0)'
                        }
                    ],
                    {
                        duration: 360,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                    }
                );

                const label = tabLabels[index];
                const beforeLabel = beforeLabelRects[index];
                const afterLabel = afterLabelRects[index];
                if (!label || !beforeLabel || !afterLabel) return;
                const beforeLabelOffset = beforeLabel.left - before.left;
                const afterLabelOffset = afterLabel.left - after.left;
                label.animate(
                    [
                        { transform: `translateX(${beforeLabelOffset - afterLabelOffset}px)` },
                        { transform: 'translateX(0)' }
                    ],
                    {
                        duration: 360,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                    }
                );
            });
        };
        const scheduleStickyNavigationUpdate = () => {
            if (stickyUpdateFrame) return;
            stickyUpdateFrame = window.requestAnimationFrame(updateStickyNavigation);
        };

        window.addEventListener('scroll', scheduleStickyNavigationUpdate, { passive: true });
        window.addEventListener('resize', scheduleStickyNavigationUpdate);
        updateStickyNavigation();
    }

    const setActiveTab = index => {
        tabs.forEach((tab, tabIndex) => {
            const active = tabIndex === index;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
        });
    };

    const setActiveSlideFromHistory = index => {
        const targetIndex = Math.min(Math.max(index, 0), panels.length - 1);
        slides.scrollTo({ left: panels[targetIndex].offsetLeft, behavior: 'auto' });
        setActiveTab(targetIndex);
        updateActiveSlideHeight();
    };

    let profileSlideHistoryReady = false;
    if (carousel.id === 'profileLinkCarousel') {
        const currentUrl = new URL(window.location.href);
        const isFromMeQuery = currentUrl.searchParams.get('k') === 'from-me';
        if (isFromMeQuery) {
            currentUrl.searchParams.delete('k');
            window.history.replaceState(
                { ...(window.history.state ?? {}), [profileSlideHistoryKey]: 'social' },
                '',
                currentUrl
            );

            const fromMeUrl = new URL(currentUrl);
            fromMeUrl.searchParams.set('k', 'from-me');
            window.history.pushState(
                { ...(window.history.state ?? {}), [profileSlideHistoryKey]: 'from-me' },
                '',
                fromMeUrl
            );
            setActiveSlideFromHistory(1);
            profileSlideHistoryReady = true;
        } else {
            window.history.replaceState(
                { ...(window.history.state ?? {}), [profileSlideHistoryKey]: 'social' },
                '',
                currentUrl
            );
            profileSlideHistoryReady = true;
        }

        window.addEventListener('popstate', event => {
            clearTimeout(profileSlideUrlTimer);
            const routeIsFromMe = new URL(window.location.href).searchParams.get('k') === 'from-me' ||
                event.state?.[profileSlideHistoryKey] === 'from-me';
            setActiveSlideFromHistory(routeIsFromMe ? 1 : 0);
        });
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            slides.scrollTo({
                left: panels[index].offsetLeft,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth'
            });
            setActiveTab(index);
        });
    });

    slides.addEventListener('scroll', () => {
        const index = getActiveSlideIndex();
        setActiveTab(Math.min(Math.max(index, 0), tabs.length - 1));
        updateActiveSlideHeight();

        if (carousel.id === 'profileLinkCarousel') {
            clearTimeout(profileSlideUrlTimer);
            profileSlideUrlTimer = window.setTimeout(() => {
                if (!profileSlideHistoryReady) return;
                const currentUrl = new URL(window.location.href);
                const isFromMeQuery = currentUrl.searchParams.get('k') === 'from-me';
                if (index === 1 && !isFromMeQuery) {
                    currentUrl.searchParams.set('k', 'from-me');
                    window.history.pushState(
                        { ...(window.history.state ?? {}), [profileSlideHistoryKey]: 'from-me' },
                        '',
                        currentUrl
                    );
                } else if (index === 0 && isFromMeQuery) {
                    if (window.history.state?.[profileSlideHistoryKey] === 'from-me') {
                        window.history.back();
                    } else {
                        currentUrl.searchParams.delete('k');
                        window.history.replaceState(
                            { ...(window.history.state ?? {}), [profileSlideHistoryKey]: 'social' },
                            '',
                            currentUrl
                        );
                    }
                }
            }, 180);
        }
    }, { passive: true });
}

function createLinkCardSkeleton(cardToMatch) {
    const skeleton = document.createElement('div');
    skeleton.className = 'link-card-skeleton';
    skeleton.setAttribute('aria-hidden', 'true');

    const icon = document.createElement('span');
    icon.className = 'link-skeleton-icon';
    const text = document.createElement('span');
    text.className = 'link-skeleton-text';
    const title = document.createElement('span');
    title.className = 'link-skeleton-bar title';
    const description = document.createElement('span');
    description.className = 'link-skeleton-bar description';
    text.append(title, description);
    const arrow = document.createElement('span');
    arrow.className = 'link-skeleton-arrow';
    skeleton.append(icon, text, arrow);

    if (cardToMatch) {
        const cardRect = cardToMatch.getBoundingClientRect();
        skeleton.style.height = `${cardRect.height}px`;
        skeleton.style.minHeight = `${cardRect.height}px`;
        skeleton.style.flexBasis = `${cardRect.height}px`;

        const sourceIcon = cardToMatch.querySelector('.link-icon');
        if (sourceIcon) {
            const iconRect = sourceIcon.getBoundingClientRect();
            const iconStyle = getComputedStyle(sourceIcon);
            icon.style.display = iconStyle.display;
            icon.style.width = `${iconRect.width}px`;
            icon.style.height = `${iconRect.height}px`;
            icon.style.marginRight = iconStyle.marginRight;
        }

        const sourceMenu = cardToMatch.querySelector('.link-card-menu');
        if (sourceMenu) {
            const menuRect = sourceMenu.getBoundingClientRect();
            const menuStyle = getComputedStyle(sourceMenu);
            arrow.style.width = `${menuRect.width}px`;
            arrow.style.height = `${menuRect.height}px`;
            arrow.style.marginLeft = menuStyle.marginLeft;
        }
    }

    return skeleton;
}

function createLinksLoadError() {
    const message = document.createElement('div');
    message.className = 'links-load-error';
    message.setAttribute('role', 'status');

    const title = document.createElement('strong');
    title.className = 'links-load-error-title';
    title.textContent = 'Failed to load data';

    const description = document.createElement('span');
    description.className = 'links-load-error-description';
    description.textContent = 'Check your connection and try again.';

    const retry = document.createElement('button');
    retry.className = 'links-load-retry';
    retry.type = 'button';
    retry.textContent = 'Retry';

    message.append(title, description, retry);
    return message;
}

async function loadLinkCards({ refresh = false } = {}) {
    const cardContainers = [linkCards, fromMeCards].filter(Boolean);
    if (!cardContainers.length) return;

    const skeletonStartedAt = performance.now();
    const previousCards = cardContainers.map(container => refresh
        ? Array.from(container.querySelectorAll('.link-card'))
        : []);
    cardContainers.forEach((container, containerIndex) => {
        const cards = previousCards[containerIndex];
        const skeletonCount = cards.length || 4;
        if (refresh) container.classList.add('refreshing-cards');
        container.setAttribute('aria-busy', 'true');
        container.replaceChildren(...Array.from(
            { length: skeletonCount },
            (_, index) => createLinkCardSkeleton(cards[index])
        ));
    });

    let refreshedLinks;
    let refreshedFromMeLinks;
    let loadError;
    try {
        const [socialResponse, fromMeResponse] = await Promise.all([
            fetch('./data/links.json', { cache: 'no-store' }),
            fetch('./data/from_me.json', { cache: 'no-store' })
        ]);
        if (!socialResponse.ok) {
            throw new Error(`Failed to load Social links (HTTP ${socialResponse.status})`);
        }
        if (!fromMeResponse.ok) {
            throw new Error(`Failed to load From me links (HTTP ${fromMeResponse.status})`);
        }

        [refreshedLinks, refreshedFromMeLinks] = await Promise.all([
            socialResponse.json().then(validateLinkData),
            fromMeResponse.json().then(validateLinkData)
        ]);
    } catch (error) {
        console.error(error);
        loadError = error;
    }

    if (refresh) {
        const remainingSkeletonTime = 800 - (performance.now() - skeletonStartedAt);
        if (remainingSkeletonTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingSkeletonTime));
        }
    }

    try {
        if (loadError) {
            cardContainers.forEach(container => container.replaceChildren(createLinksLoadError()));
        } else if (refreshedLinks && refreshedFromMeLinks) {
            loadedLinkData = refreshedLinks;
            loadedFromMeData = refreshedFromMeLinks;
            linkCards?.replaceChildren(...loadedLinkData.map(createLinkCard));
            fromMeCards?.replaceChildren(...loadedFromMeData.map(createLinkCard));
            renderLinkSearchResults();
        }
    } catch (error) {
        console.error(error);
        cardContainers.forEach(container => container.replaceChildren(createLinksLoadError()));
    } finally {
        cardContainers.forEach(container => {
            container.setAttribute('aria-busy', 'false');
            if (refresh) container.classList.remove('refreshing-cards');
        });
    }
}

async function handleLinkCardClick(event, container) {
    const retryButton = event.target instanceof Element
        ? event.target.closest('.links-load-retry')
        : null;
    if (retryButton) {
        loadLinkCards();
        return;
    }

    const card = event.target instanceof Element ? event.target.closest('.link-card') : null;
    if (!card || !container.contains(card)) return;

    const menuButton = event.target instanceof Element
        ? event.target.closest('.link-card-menu')
        : null;
    if (menuButton) {
        event.preventDefault();
        showLinkActionDialog(card, menuButton);
        return;
    }

    if (suppressLinkCardClick === card) {
        event.preventDefault();
        suppressLinkCardClick = null;
        clearTimeout(suppressLinkCardClickTimer);
        return;
    }

    const mainLink = card.querySelector('.link-card-main');
    const href = mainLink?.getAttribute('href');
    if (!href || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const target = mainLink.getAttribute('target') || '_self';
    if (container === linkSearchResults) {
        try {
            await rememberOpenedSearchLink(href);
        } catch (error) {
            console.error(error);
        }
        closeLinkSearch();
    }
    setTimeout(() => {
        if (target.toLowerCase() === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = href;
        }
    }, 170);
}

[linkCards, fromMeCards, linkSearchResults].filter(Boolean).forEach(container => {
    container.addEventListener('click', event => {
        handleLinkCardClick(event, container).catch(error => {
            console.error(error);
        });
    });
});

function showLinkActionDialog(card, trigger = card) {
    if (!linkActionBackdrop || !linkActionImageContainer || !linkActionTitle || !linkActionDescription) return;

    const isAlreadyOpen = linkActionBackdrop.classList.contains('open');
    linkActionImageContainer.replaceChildren();
    linkActionCard = card;
    linkActionTrigger = trigger;
    const image = card.querySelector('.link-icon img');
    if (image) {
        const renderImagePreview = () => {
            if (
                linkActionCard !== card ||
                !image.naturalWidth ||
                !image.naturalHeight
            ) {
                return;
            }

            const previewCanvas = document.createElement('canvas');
            previewCanvas.className = 'link-action-image';
            previewCanvas.width = image.naturalWidth;
            previewCanvas.height = image.naturalHeight;
            const context = previewCanvas.getContext('2d');
            if (!context) {
                console.error('error');
                return;
            }

            context.drawImage(image, 0, 0);
            linkActionImageContainer.replaceChildren(previewCanvas);
        };

        if (image.complete) {
            renderImagePreview();
        } else {
            image.addEventListener('load', renderImagePreview, { once: true });
        }
    }
    linkActionTitle.textContent = card.querySelector('h3')?.textContent ?? '';
    linkActionDescription.textContent = card.querySelector('.link-text p')?.textContent ?? '';
    if (linkActionRemoveHistory) {
        linkActionRemoveHistory.hidden = !card.dataset.searchHistoryUrl;
    }
    if (isAlreadyOpen) return;

    linkActionBackdrop.classList.add('open');
    linkActionBackdrop.setAttribute('aria-hidden', 'false');
    linkActionPreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    linkActionCancel?.focus();
}

function restoreLinkActionImage() {
    linkActionImageContainer?.replaceChildren();
}

function closeLinkActionDialog(restoreFocus = true) {
    if (!linkActionBackdrop) return;

    linkActionBackdrop.classList.remove('open');
    linkActionBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = linkActionPreviousOverflow;
    restoreLinkActionImage();
    clearTimeout(suppressLinkCardClickTimer);
    suppressLinkCardClick = null;
    linkActionCard = null;
    if (restoreFocus) linkActionTrigger?.focus();
    linkActionTrigger = null;
}

function markLinkCardClickSuppressed(card) {
    suppressLinkCardClick = card;
    clearTimeout(suppressLinkCardClickTimer);
    suppressLinkCardClickTimer = window.setTimeout(() => {
        suppressLinkCardClick = null;
    }, 1000);
}

function clearLinkCardPress() {
    clearTimeout(linkCardPressTimer);
    linkCardPointerIsDown = false;
    linkCardPressTarget = null;
    linkCardPressStart = null;
}

function handleLinkCardPointerMove(event) {
    if (!linkCardPointerIsDown || !linkCardPressStart) return;
    if (
        Math.abs(event.clientX - linkCardPressStart.x) > 10 ||
        Math.abs(event.clientY - linkCardPressStart.y) > 10
    ) {
        clearTimeout(linkCardPressTimer);
        linkCardPointerIsDown = false;
    }
}

[linkCards, fromMeCards, linkSearchResults].filter(Boolean).forEach(container => {
    container.addEventListener('pointerdown', event => {
        if (event.button !== 0 || !(event.target instanceof Element)) return;
        const card = event.target.closest('.link-card');
        if (!card || !container.contains(card)) return;

        clearTimeout(linkCardPressTimer);
        linkCardPressTarget = card;
        linkCardPressStart = { x: event.clientX, y: event.clientY };
        linkCardPointerIsDown = true;
        const pressTrigger = event.target instanceof HTMLElement && event.target.matches('.link-card-menu')
            ? event.target
            : card;
        linkCardPressTimer = window.setTimeout(() => {
            if (!linkCardPointerIsDown || !linkCardPressTarget) return;
            markLinkCardClickSuppressed(linkCardPressTarget);
            showLinkActionDialog(linkCardPressTarget, pressTrigger);
        }, 150);
    });

    container.addEventListener('contextmenu', event => {
        const card = event.target instanceof Element ? event.target.closest('.link-card') : null;
        if (!card || !container.contains(card)) return;

        event.preventDefault();
        clearLinkCardPress();
        markLinkCardClickSuppressed(card);
        const trigger = event.target instanceof HTMLElement && event.target.matches('.link-card-menu')
            ? event.target
            : card;
        showLinkActionDialog(card, trigger);
    });
});

document.addEventListener('pointermove', handleLinkCardPointerMove);
document.addEventListener('pointerup', clearLinkCardPress);
document.addEventListener('pointercancel', clearLinkCardPress);

async function getOpenedLinkHistory() {
    let storedHistory = await encryptedStorage.getItem(openedLinkHistoryStorageKey);
    if (storedHistory === null) {
        storedHistory = await encryptedStorage.getItem(legacyOpenedLinkHistoryStorageKey);
        if (storedHistory !== null) {
            await encryptedStorage.setItem(openedLinkHistoryStorageKey, storedHistory);
            await encryptedStorage.removeItem(legacyOpenedLinkHistoryStorageKey);
        }
    }
    if (storedHistory === null) return [];

    const parsedHistory = JSON.parse(storedHistory);
    if (!Array.isArray(parsedHistory) || !parsedHistory.every(url => typeof url === 'string')) {
        throw new Error('Stored link history is invalid');
    }
    return parsedHistory;
}

async function rememberOpenedSearchLink(href) {
    if (![...loadedLinkData, ...loadedFromMeData].some(link => link.url === href)) return;

    const updatedHistory = [
        href,
        ...(await getOpenedLinkHistory()).filter(savedHref => savedHref !== href)
    ];

    await encryptedStorage.setItem(openedLinkHistoryStorageKey, JSON.stringify(updatedHistory));
}

async function removeOpenedSearchLink(href) {
    const updatedHistory = (await getOpenedLinkHistory()).filter(savedHref => savedHref !== href);

    try {
        if (updatedHistory.length) {
            await encryptedStorage.setItem(openedLinkHistoryStorageKey, JSON.stringify(updatedHistory));
        } else {
            await encryptedStorage.removeItem(openedLinkHistoryStorageKey);
        }
        return true;
    } catch (error) {
        console.error(error);
        toastt('Failed to remove link from search history');
        return false;
    }
}

async function getOpenedLinkHistoryData() {
    const savedUrls = await getOpenedLinkHistory();
    const getLinksForUrls = links => savedUrls
        .map(url => links.find(link => link.url === url))
        .filter(link => link !== undefined);
    return {
        social: getLinksForUrls(loadedLinkData),
        fromMe: getLinksForUrls(loadedFromMeData)
    };
}

function getRandomSuggestions(links, recentLinks = []) {
    const recentUrls = new Set(recentLinks.map(link => link.url));
    const candidates = links.filter(link => !recentUrls.has(link.url));
    for (let index = candidates.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [candidates[index], candidates[randomIndex]] = [candidates[randomIndex], candidates[index]];
    }
    return candidates.slice(0, 5);
}

async function renderLinkSearchResults(query = linkSearchInput?.value ?? '') {
    if (!linkSearchResults) return;

    const normalizedQuery = query.trim().toLocaleLowerCase();
    let recentLinks = {};
    let suggestedLinks = {};
    if (!normalizedQuery) {
        try {
            recentLinks = await getOpenedLinkHistoryData();
            suggestedLinks = {
                social: getRandomSuggestions(loadedLinkData, recentLinks.social),
                fromMe: getRandomSuggestions(loadedFromMeData, recentLinks.fromMe)
            };
        } catch (error) {
            console.error(error);
            const message = document.createElement('p');
            message.className = 'link-search-empty';
            message.textContent = 'Unable to load link history';
            linkSearchResults.replaceChildren(
                createLinkSlideCarousel(
                    loadedLinkData,
                    loadedFromMeData,
                    {},
                    {
                        social: getRandomSuggestions(loadedLinkData),
                        fromMe: getRandomSuggestions(loadedFromMeData)
                    }
                ),
                message
            );
            return;
        }
    }

    const matchesSocial = loadedLinkData.filter(link =>
        `${link.name} ${link.description} ${link.url}`.toLocaleLowerCase().includes(normalizedQuery)
    );
    const matchesFromMe = loadedFromMeData.filter(link =>
        `${link.name} ${link.description} ${link.url}`.toLocaleLowerCase().includes(normalizedQuery)
    );
    const carousel = createLinkSlideCarousel(
        matchesSocial,
        matchesFromMe,
        recentLinks,
        suggestedLinks
    );
    linkSearchResults.replaceChildren(carousel);
}

function setLinkSearchUrl(query) {
    const url = new URL(window.location.href);
    const normalizedQuery = query.trim();
    if (normalizedQuery) {
        url.searchParams.set('search', normalizedQuery);
    } else {
        url.searchParams.delete('search');
    }

    window.history.replaceState(window.history.state, '', url);
}

function openLinkSearch(initialQuery = '') {
    if (!linkSearchBackdrop || !linkSearchInput || linkSearchIsOpen) return;

    linkSearchClosePending = false;
    const baseUrl = new URL(window.location.href);
    baseUrl.searchParams.delete('search');
    window.history.replaceState(window.history.state, '', baseUrl);

    const currentState = window.history.state;
    const state = currentState && typeof currentState === 'object'
        ? { ...currentState }
        : {};
    state[linkSearchHistoryKey] = true;
    window.history.pushState(state, '', window.location.href);
    linkSearchIsOpen = true;
    linkSearchInput.value = initialQuery;
    searchToggle?.setAttribute('aria-expanded', 'true');
    linkSearchPreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    linkSearchBackdrop.classList.add('open');
    linkSearchBackdrop.setAttribute('aria-hidden', 'false');
    setLinkSearchUrl(initialQuery);
    linkSearchInput.focus({ preventScroll: true });
    renderLinkSearchResults(initialQuery);
    requestAnimationFrame(() => {
        if (linkSearchIsOpen) linkSearchInput.focus({ preventScroll: true });
    });
    if (window.matchMedia('(min-width: 601px)').matches) {
        window.setTimeout(() => {
            if (linkSearchIsOpen) linkSearchInput.focus({ preventScroll: true });
        }, 0);
    }
}

function closeLinkSearch(updateHistory = true) {
    if (!linkSearchBackdrop || !linkSearchInput) return;

    if (!linkSearchIsOpen) return;
    const state = window.history.state;
    if (updateHistory && state && typeof state === 'object' && state[linkSearchHistoryKey] === true) {
        if (!linkSearchClosePending) {
            linkSearchClosePending = true;
            window.history.back();
        }
        return;
    }

    linkSearchIsOpen = false;
    linkSearchClosePending = false;
    searchToggle?.setAttribute('aria-expanded', 'false');
    linkSearchBackdrop.classList.remove('open');
    linkSearchBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = linkSearchPreviousOverflow;
    linkSearchInput.value = '';
    renderLinkSearchResults('');
    searchToggle?.focus();

    const url = new URL(window.location.href);
    if (url.searchParams.has('search')) {
        url.searchParams.delete('search');
        window.history.replaceState(window.history.state, '', url);
    }
}

searchToggle?.addEventListener('click', () => openLinkSearch());
searchToggle?.addEventListener('pointerdown', event => {
    if (event.isPrimary && event.pointerType === 'touch') {
        openLinkSearch();
    }
});
linkSearchClose?.addEventListener('click', closeLinkSearch);
linkSearchBackdrop?.addEventListener('click', event => {
    if (event.target === linkSearchBackdrop) closeLinkSearch();
});
linkSearchInput?.addEventListener('input', () => {
    setLinkSearchUrl(linkSearchInput.value);
    renderLinkSearchResults();
});
document.addEventListener('keydown', event => {
    if (
        event.key === 'Escape' &&
        linkSearchIsOpen &&
        !linkActionBackdrop?.classList.contains('open')
    ) {
        closeLinkSearch();
    }
});

const initialSearchUrl = new URL(window.location.href);
if (initialSearchUrl.searchParams.has('search')) {
    const initialSearchQuery = initialSearchUrl.searchParams.get('search') ?? '';
    initialSearchUrl.searchParams.delete('search');
    window.history.replaceState(window.history.state, '', initialSearchUrl);
    openLinkSearch(initialSearchQuery);
}

linkActionCancel?.addEventListener('click', closeLinkActionDialog);
linkActionBackdrop?.addEventListener('click', event => {
    if (event.target === linkActionBackdrop) closeLinkActionDialog();
});
linkActionCopy?.addEventListener('click', async () => {
    const href = linkActionCard?.querySelector('.link-card-main')?.getAttribute('href');
    if (!href) return;

    try {
        const copyUrl = new URL(href, window.location.href);
        copyUrl.searchParams.set('wahyuna-feature', 'copylink');
        const valueToCopy = copyUrl.href;
        await navigator.clipboard.writeText(valueToCopy);
        closeLinkActionDialog();
        toastt('Link copied to clipboard');
    } catch (error) {
        console.error(error);
        toastt('Failed to copy link');
    }
});
linkActionRemoveHistory?.addEventListener('click', async () => {
    try {
        const href = linkActionCard?.dataset.searchHistoryUrl;
        if (!href || !await removeOpenedSearchLink(href)) return;

        closeLinkActionDialog(false);
        renderLinkSearchResults();
        linkSearchInput?.focus({ preventScroll: true });
    } catch (error) {
        console.error(error);
        toastt('Failed to remove link from search history');
    }
});
linkActionOpen?.addEventListener('click', () => {
    if (!linkActionCard) return;

    const mainLink = linkActionCard.querySelector('.link-card-main');
    const href = mainLink?.getAttribute('href');
    const target = mainLink?.getAttribute('target') || '_self';
    closeLinkActionDialog();
    if (!href) return;

    if (target.toLowerCase() === '_blank') {
        window.open(href, '_blank', 'noopener,noreferrer');
    } else {
        window.location.href = href;
    }
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && linkActionBackdrop?.classList.contains('open')) {
        closeLinkActionDialog();
    }
});

if (profileLinkCarousel) setupLinkSlideCarousel(profileLinkCarousel);
loadLinkCards();


const pullRefreshIndicator = document.getElementById('pullRefreshIndicator');
const pullRefreshContent = document.getElementById('pullRefreshContent');
const pullRefreshThreshold = 68;
const pullRefreshMaxDistance = 92;
let pullRefreshStartY = null;
let pullRefreshDistance = 0;
let pullRefreshInProgress = false;
let pullRefreshReturnTimer = null;
let edgeOverscrollGesture = null;
let edgeOverscrollResetTimer = null;
const edgeOverscrollMaxDistance = 72;

function isPullRefreshExcludedTarget(target) {
    return target instanceof Element &&
        target.closest(
            '.floating-comment-widget, .link-search-backdrop, .history-delete-backdrop, ' +
            '.image-modal, .site-sidebar, .modal-card, .modal-backdrop, .link-action-backdrop, ' +
            '[role="dialog"], [role="alertdialog"], input, textarea, select, [contenteditable="true"]'
        ) !== null;
}

function isAtPageBottom() {
    const scrollElement = document.scrollingElement || document.documentElement;
    return window.scrollY + window.innerHeight >= scrollElement.scrollHeight - 2;
}

function isEdgeOverscrollExcludedTarget(target) {
    return target instanceof Element &&
        target.closest(
            '.top-navbar, input, textarea, select, [contenteditable="true"]'
        ) !== null;
}

function findEdgeOverscrollTarget(target) {
    if (!(target instanceof Element) || isEdgeOverscrollExcludedTarget(target)) return null;

    for (let element = target; element && element !== document.body; element = element.parentElement) {
        const overflowY = window.getComputedStyle(element).overflowY;
        if (
            (overflowY === 'auto' || overflowY === 'scroll') &&
            element.scrollHeight > element.clientHeight + 1
        ) {
            return element;
        }
    }

    return pullRefreshContent?.contains(target) ? pullRefreshContent : null;
}

function findEdgeOverscrollVisualTarget(scrollTarget) {
    if (scrollTarget === pullRefreshContent) return scrollTarget;
    if (scrollTarget.matches('.modal-body, .sent-history-list')) return scrollTarget;
    return scrollTarget.closest('.sent-history, .link-search-panel') || scrollTarget;
}

function isScrollTargetAtEdge(target, edge) {
    if (target === pullRefreshContent) {
        return edge === 'bottom'
            ? isAtPageBottom()
            : window.scrollY <= 1;
    }

    const maxScrollTop = target.scrollHeight - target.clientHeight;
    return edge === 'top'
        ? target.scrollTop <= 1
        : target.scrollTop >= maxScrollTop - 1;
}

function handleEdgeOverscrollStart(event) {
    if (
        event.touches.length !== 1 ||
        pullRefreshInProgress ||
        isEdgeOverscrollExcludedTarget(event.target)
    ) {
        edgeOverscrollGesture = null;
        return;
    }

    const scrollTarget = findEdgeOverscrollTarget(event.target);
    if (!scrollTarget) {
        edgeOverscrollGesture = null;
        return;
    }

    edgeOverscrollGesture = {
        target: scrollTarget,
        visualTarget: findEdgeOverscrollVisualTarget(scrollTarget),
        movesInnerContent: scrollTarget.matches('.modal-body, .sent-history-list'),
        lastY: event.touches[0].clientY,
        edge: null,
        distance: 0
    };
}

function handleEdgeOverscrollMove(event) {
    if (!edgeOverscrollGesture || event.touches.length !== 1) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - edgeOverscrollGesture.lastY;
    edgeOverscrollGesture.lastY = currentY;
    if (deltaY === 0) return;

    const gesture = edgeOverscrollGesture;
    if (gesture.edge) event.preventDefault();
    const requestedEdge = deltaY > 0 ? 'top' : 'bottom';
    if (gesture.distance !== 0) {
        const nextDistance = gesture.distance + deltaY * 0.36;
        gesture.distance = Math.sign(nextDistance) === Math.sign(gesture.distance)
            ? nextDistance
            : 0;
        if (gesture.distance === 0) {
            gesture.edge = null;
            gesture.visualTarget.classList.remove('edge-overscroll-pulling');
            gesture.visualTarget.classList.add('edge-overscroll-return');
            gesture.visualTarget.classList.add('edge-overscroll-target');
            if (gesture.movesInnerContent) gesture.visualTarget.classList.add('edge-overscroll-inner');
            gesture.visualTarget.style.setProperty('--edge-overscroll-offset', '0px');
            clearTimeout(edgeOverscrollResetTimer);
            edgeOverscrollResetTimer = window.setTimeout(() => {
                gesture.visualTarget.classList.remove(
                    'edge-overscroll-target',
                    'edge-overscroll-return',
                    'edge-overscroll-inner'
                );
                gesture.visualTarget.style.removeProperty('--edge-overscroll-offset');
            }, 560);
            return;
        }
    } else {
        if (
            (gesture.target === pullRefreshContent && requestedEdge === 'top') ||
            !isScrollTargetAtEdge(gesture.target, requestedEdge)
        ) return;
        gesture.edge = requestedEdge;
        gesture.distance = deltaY * 0.36;
    }

    event.preventDefault();
    clearTimeout(edgeOverscrollResetTimer);
    gesture.distance = Math.max(
        -edgeOverscrollMaxDistance,
        Math.min(gesture.distance, edgeOverscrollMaxDistance)
    );
    gesture.visualTarget.classList.remove('edge-overscroll-return');
    gesture.visualTarget.classList.add('edge-overscroll-pulling');
    gesture.visualTarget.classList.add('edge-overscroll-target');
    if (gesture.movesInnerContent) gesture.visualTarget.classList.add('edge-overscroll-inner');
    gesture.visualTarget.style.setProperty('--edge-overscroll-offset', `${gesture.distance}px`);
}

function resetEdgeOverscroll() {
    const gesture = edgeOverscrollGesture;
    edgeOverscrollGesture = null;
    if (!gesture || gesture.distance === 0) return;

    gesture.visualTarget.classList.remove('edge-overscroll-pulling');
    gesture.visualTarget.classList.add('edge-overscroll-return');
    gesture.visualTarget.classList.add('edge-overscroll-target');
    if (gesture.movesInnerContent) gesture.visualTarget.classList.add('edge-overscroll-inner');
    gesture.visualTarget.style.setProperty('--edge-overscroll-offset', '0px');
    clearTimeout(edgeOverscrollResetTimer);
    edgeOverscrollResetTimer = window.setTimeout(() => {
        gesture.visualTarget.classList.remove(
            'edge-overscroll-target',
            'edge-overscroll-return',
            'edge-overscroll-inner'
        );
        gesture.visualTarget.style.removeProperty('--edge-overscroll-offset');
    }, 560);
}

function handlePullRefreshStart(event) {
    if (
        event.touches.length !== 1 ||
        window.scrollY > 0 ||
        pullRefreshInProgress ||
        !(event.target instanceof Element) ||
        isPullRefreshExcludedTarget(event.target)
    ) {
        pullRefreshStartY = null;
        return;
    }

    clearTimeout(pullRefreshReturnTimer);
    pullRefreshContent?.classList.remove('pull-return');
    pullRefreshStartY = event.touches[0].clientY;
    pullRefreshDistance = 0;
}

function handlePullRefreshMove(event) {
    if (pullRefreshStartY === null || pullRefreshInProgress || event.touches.length !== 1) return;

    const distance = event.touches[0].clientY - pullRefreshStartY;
    if (distance < 0) {
        handlePullRefreshCancel();
        return;
    }
    if (distance === 0) return;

    event.preventDefault();
    pullRefreshDistance = Math.min(distance * 0.55, pullRefreshMaxDistance);
    pullRefreshContent?.classList.add('pulling');
    pullRefreshContent?.style.setProperty('--pull-content-distance', `${pullRefreshDistance}px`);
    pullRefreshIndicator?.classList.add('pulling');
    pullRefreshIndicator?.style.setProperty('--pull-distance', `${pullRefreshDistance}px`);
    document.body.classList.add('pull-refresh-active');
}

async function refreshPageContent(visibleDistance) {
    pullRefreshInProgress = true;
    pullRefreshIndicator?.classList.remove('pulling');
    pullRefreshIndicator?.classList.add('refreshing');
    pullRefreshContent?.classList.remove('pulling');
    pullRefreshContent?.classList.add('refreshing');
    pullRefreshIndicator?.style.setProperty('--pull-distance', `${visibleDistance}px`);
    pullRefreshIndicator?.setAttribute('aria-label', 'Refreshing page content');

    try {
        await Promise.all([
            loadLinkCards({ refresh: true }),
            window.refreshProfileStats?.()
        ]);
    } finally {
        pullRefreshInProgress = false;
        pullRefreshStartY = null;
        pullRefreshDistance = 0;
        clearTimeout(pullRefreshReturnTimer);
        pullRefreshContent?.style.removeProperty('--pull-content-distance');
        pullRefreshContent?.classList.remove('pulling', 'refreshing', 'pull-return');
        pullRefreshIndicator?.classList.remove('refreshing');
        pullRefreshIndicator?.style.removeProperty('--pull-distance');
        pullRefreshIndicator?.setAttribute('aria-label', 'Pull to refresh');
        document.body.classList.remove('pull-refresh-active');
    }
}

function handlePullRefreshEnd() {
    if (pullRefreshStartY === null) return;

    const shouldRefresh = pullRefreshDistance >= pullRefreshThreshold;
    const visibleDistance = pullRefreshDistance;
    pullRefreshStartY = null;
    pullRefreshDistance = 0;

    if (shouldRefresh) {
        if (typeof navigator.vibrate === 'function') {
            navigator.vibrate(8);
        }
        refreshPageContent(visibleDistance);
        return;
    }

    pullRefreshContent?.classList.remove('pulling', 'refreshing');
    pullRefreshContent?.classList.add('pull-return');
    pullRefreshContent?.style.setProperty('--pull-content-distance', '0px');
    pullRefreshReturnTimer = window.setTimeout(() => {
        pullRefreshContent?.classList.remove('pull-return');
        pullRefreshContent?.style.removeProperty('--pull-content-distance');
    }, 560);
    pullRefreshIndicator?.classList.remove('pulling');
    pullRefreshIndicator?.style.removeProperty('--pull-distance');
    document.body.classList.remove('pull-refresh-active');
}

function handlePullRefreshCancel() {
    const hadPullDistance = pullRefreshDistance > 0;
    pullRefreshStartY = null;
    pullRefreshDistance = 0;
    pullRefreshIndicator?.classList.remove('pulling');
    pullRefreshIndicator?.style.removeProperty('--pull-distance');
    pullRefreshContent?.classList.remove('pulling', 'refreshing');
    if (hadPullDistance) {
        pullRefreshContent?.classList.add('pull-return');
        pullRefreshContent?.style.setProperty('--pull-content-distance', '0px');
        clearTimeout(pullRefreshReturnTimer);
        pullRefreshReturnTimer = window.setTimeout(() => {
            pullRefreshContent?.classList.remove('pull-return');
            pullRefreshContent?.style.removeProperty('--pull-content-distance');
        }, 560);
    } else {
        pullRefreshContent?.style.removeProperty('--pull-content-distance');
    }
    document.body.classList.remove('pull-refresh-active');
}

document.addEventListener('touchstart', handlePullRefreshStart, { passive: true, capture: true });
document.addEventListener('touchmove', handlePullRefreshMove, { passive: false, capture: true });
document.addEventListener('touchend', handlePullRefreshEnd, { passive: true, capture: true });
document.addEventListener('touchcancel', handlePullRefreshCancel, { passive: true, capture: true });
document.addEventListener('touchstart', handleEdgeOverscrollStart, { passive: true });
document.addEventListener('touchmove', handleEdgeOverscrollMove, { passive: false });
document.addEventListener('touchend', resetEdgeOverscroll, { passive: true });
document.addEventListener('touchcancel', resetEdgeOverscroll, { passive: true });


// sender toast
let senderTimer;
let senderPointer = null;

function finishSenderSwipe(direction) {
    const toast = document.getElementById("senderToast");
    if (!toast) return;

    clearTimeout(senderTimer);
    toast.classList.remove("dragging", "show");
    toast.classList.add(`dismiss-${direction}`);
    toast.style.transform = "";
    senderPointer = null;
}

function handleSenderPointerDown(event) {
    const toast = event.currentTarget;
    if (!event.isPrimary || event.button !== 0 || !toast.classList.contains("show")) return;

    senderPointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: 0,
        y: 0
    };
    toast.setPointerCapture(event.pointerId);
    toast.classList.add("dragging");
}

function handleSenderPointerMove(event) {
    const toast = event.currentTarget;
    if (!senderPointer || senderPointer.id !== event.pointerId) return;

    senderPointer.x = event.clientX - senderPointer.startX;
    senderPointer.y = event.clientY - senderPointer.startY;
    toast.style.transform =
        `translate(calc(-50% + ${senderPointer.x}px), ${Math.min(senderPointer.y, 0)}px)`;
}

function handleSenderPointerUp(event) {
    const toast = event.currentTarget;
    if (!senderPointer || senderPointer.id !== event.pointerId) return;

    const { x, y } = senderPointer;
    const horizontalSwipe = Math.abs(x) >= 70 && Math.abs(x) > Math.abs(y);
    const upwardSwipe = y <= -55 && Math.abs(y) > Math.abs(x);

    if (horizontalSwipe) {
        finishSenderSwipe(x < 0 ? "left" : "right");
        return;
    }
    if (upwardSwipe) {
        finishSenderSwipe("up");
        return;
    }

    senderPointer = null;
    toast.classList.remove("dragging");
    toast.style.transform = "";
}

function handleSenderPointerCancel(event) {
    const toast = event.currentTarget;
    if (!senderPointer || senderPointer.id !== event.pointerId) return;

    senderPointer = null;
    toast.classList.remove("dragging");
    toast.style.transform = "";
}

const senderToast = document.getElementById("senderToast");
senderToast?.addEventListener("pointerdown", handleSenderPointerDown);
senderToast?.addEventListener("pointermove", handleSenderPointerMove);
senderToast?.addEventListener("pointerup", handleSenderPointerUp);
senderToast?.addEventListener("pointercancel", handleSenderPointerCancel);

function sender(text) {
    const toast = document.getElementById("senderToast");
    const textElement = toast.querySelector(".sender-text");

    clearTimeout(senderTimer);
    senderPointer = null;
    toast.style.transform = "";
    toast.classList.remove("dragging", "dismiss-left", "dismiss-right", "dismiss-up");

    textElement.textContent = text;

    toast.classList.remove("show");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });
    });

    senderTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}