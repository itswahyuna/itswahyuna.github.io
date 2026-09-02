const themeBtn = document.getElementById("th");
const floatingTriggerButton = document.getElementById("floatingTriggerButton");
const copyLinkButton = document.getElementById("copyLinkButton");
const typing = document.getElementById("typ");
const text = "Hi, I'm Wahyuna.";

function updateThemeColor() {
    const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
    if (!metaThemes.length) return;
    const color = document.body.classList.contains('bright') ? '#ffffff' : '#010203';
    metaThemes.forEach((metaTheme) => {
        metaTheme.content = color;
    });
}

function updateThemeButton() {
    const icon = themeBtn.querySelector('i');
    if (!icon) return;

    if (document.body.classList.contains("bright")) {
        icon.className = 'fa-solid fa-moon';
        themeBtn.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        icon.className = 'fa-solid fa-sun';
        themeBtn.setAttribute('aria-label', 'Switch to light mode');
    }
    updateThemeColor();
}

function saveThemePreference() {
    const nextMode = document.body.classList.contains('bright') ? 'bright' : 'dark';
    localStorage.setItem('modea', nextMode);
    localStorage.removeItem('mode');
    localStorage.removeItem('wahyuna-theme');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('modea') ?? localStorage.getItem('mode') ?? localStorage.getItem('wahyuna-theme');

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

function applyInitialTheme() {
    loadThemePreference();
    updateThemeButton();
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("bright");
    saveThemePreference();
    updateThemeButton();
    updateThemeColor();
});

let lastScrollY = window.scrollY;
let scrollHideTimer;

function updateNavbarState() {
    document.body.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', () => {
    updateNavbarState();
}, { passive: true });

copyLinkButton?.addEventListener('click', async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        toastt('Profile link copied');
    } catch {
        toastt('Failed to copy');
    }
});

applyInitialTheme();
updateThemeColor();
updateNavbarState();

const profileImg = document.querySelector('.profile-img');
const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

const modalImageEl = document.getElementById('modalImage');
const modalLoader = document.getElementById('modalLoader');

function openModal() {
    if (modalLoader) modalLoader.classList.remove('hidden');
    imageModal.classList.add('open');
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

function closeModal() {
    imageModal.classList.remove('open');
    if (modalLoader) modalLoader.classList.add('hidden');
}

profileImg.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

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

    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
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
let floatingCommentOpenTimer = null;
let floatingCommentCloseTimer = null;
let floatingCommentIsOpen = false;

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
        if (floatingCommentIsOpen && !floatingCommentWidget.classList.contains('hidden')) return;

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
    }, closeDuration);
}

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

function setAnonymousMessageBlocked() {
    const storageKey = 'anonymous-message-blocked';
    const today = getTodayKey();
    const blocked = JSON.parse(localStorage.getItem(storageKey) || '{}');
    blocked[today] = true;
    localStorage.setItem(storageKey, JSON.stringify(blocked));
}

function isAnonymousMessageBlockedToday() {
    const storageKey = 'anonymous-message-blocked';
    const today = getTodayKey();
    const blocked = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return Boolean(blocked[today]);
}

syncSheetMode();

const urlParams = new URLSearchParams(window.location.search);
const shouldAutoOpenAnonymousMessage = urlParams.get('message')?.trim().toLowerCase() === 'anonymous';
const isBlocked = isAnonymousMessageBlockedToday();

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
floatingCommentOverlay.addEventListener('click', () => setFloatingCommentOpen(false));
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
    if (/iphone|ipad|ipod/i.test(ua)) return 'iPhone/iPad/iPod';
    if (/windows/i.test(ua)) return 'Windows';
    if (/macintosh|mac os x/i.test(ua)) return 'Mac';
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

function canSendToday() {
    const storageKey = 'anonymous-message-daily-count';
    const today = getTodayKey();
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const count = Number(savedData.date === today ? savedData.count : 0);

    if (count >= 200) {
        return false;
    }

    return true;
}

function markSentToday() {
    const storageKey = 'anonymous-message-daily-count';
    const today = getTodayKey();
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const currentCount = savedData.date === today
        ? Number(savedData.count || 0)
        : 0;

    const newCount = currentCount + 1;

    localStorage.setItem(storageKey, JSON.stringify({
        date: today,
        count: newCount
    }));
}

function saveSentMessage(name, message, device) {
    const storageKey = 'anonymous-messages';
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');

    messages.push({
        name: name,
        message: message,
        device: device,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem(storageKey, JSON.stringify(messages));
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

    if (!canSendToday()) {
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

        markSentToday();
        saveSentMessage(name, message, device);

        toastt('The message has been sent.');

        resetFloatingForm();

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
            setAnonymousMessageBlocked();
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

document.querySelectorAll(".link-card").forEach(card => {

    card.addEventListener("click", function (event) {
        const href = this.getAttribute("href");
        if (!href) return;
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();

        const target = this.getAttribute("target") || "_self";
        const delay = 170;

        setTimeout(() => {
            if (target && target.toLowerCase() === "_blank") {
                window.open(href, "_blank", "noopener,noreferrer");
            } else {
                window.location.href = href;
            }
        }, delay);
    });

    card.addEventListener("contextmenu", async function (e) {

        e.preventDefault();

        const nama = this.querySelector("h3").textContent;

        let url = this.getAttribute("href");
        let toastText = "";

        if (url.startsWith("mailto:")) {

            url = url.replace(/^mailto:/, "");

            toastText = "Wahyuna's email has been copied.";

        } else {

            const u = new URL(url);

            u.searchParams.set("utm_source", "itswahyuna");

            url = u.toString();

            toastText = `${nama} link copied`;
        }


        try {

            await navigator.clipboard.writeText(url);

            toastt(toastText);

        } catch {

            toastt("Failed to copy");

        }

    });

});


// sender toast
let senderTimer;

function sender(text) {
    const toast = document.getElementById("senderToast");
    const textElement = toast.querySelector(".sender-text");

    clearTimeout(senderTimer);

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