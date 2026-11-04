
const API =
    "https://wahyunaserver.wahyunadragon.workers.dev";

const RECEIVE_API =
    API + "/receive-anonymous-messages";

const loginScreen =
    document.getElementById("loginScreen");

const messagesScreen =
    document.getElementById("messagesScreen");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const messages =
    document.getElementById("messages");

const messagesError =
    document.getElementById("messagesError");

const showPassword =
    document.getElementById("showPassword");

const logoutButton =
    document.getElementById("logoutButton");

const inboxTab =
    document.getElementById("inboxTab");

const archiveTab =
    document.getElementById("archiveTab");

const archiveStorageKey =
    "adminArchivedMessages";

let currentMessages = [];
let currentView = "inbox";

async function applySavedTheme() {
    const savedTheme = await encryptedStorage.getItem("mode") ??
        await encryptedStorage.getItem("modea") ??
        await encryptedStorage.getItem("wahyuna-theme");
    const isBright = savedTheme !== "dark";

    document.body.classList.toggle("bright", isBright);
    document.querySelector('meta[name="theme-color"]').content =
        isBright ? "#f2f2f7" : "#000000";
}

applySavedTheme().catch(error => {
    console.error("Unable to load saved theme preference", error);
});

window.addEventListener("storage", event => {
    if (event.key === "mode" || event.key === "modea" || event.key === "wahyuna-theme") {
        applySavedTheme().catch(error => {
            console.error("Unable to update saved theme preference", error);
        });
    }
});

showPassword.addEventListener(
    "click",
    () => {

        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type = "text";
            showPassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            showPassword.textContent = "Show";

        }

    }
);

loginButton.addEventListener(
    "click",
    login
);

passwordInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            login();
        }

    }
);

async function login() {

    const password =
        passwordInput.value;

    loginError.textContent = "";

    if (!password) {

        loginError.textContent =
            "Please enter your password.";

        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Checking...";

    try {

        const response =
            await fetch(
                RECEIVE_API,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        password: password
                    })
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Invalid password"
            );

        }

        loginScreen.style.display =
            "none";

        messagesScreen.style.display =
            "block";

        currentMessages = Array.isArray(result.data) ? result.data : [];
        setCurrentView("inbox");

    } catch (error) {

        console.error(error);

        loginError.textContent =
            "Incorrect password";

    } finally {

        loginButton.disabled =
            false;

        loginButton.textContent =
            "Sign In";

    }

}

function getRelativeTime(timestamp) {

    const messageDate =
        new Date(timestamp);

    const now =
        new Date();

    const difference =
        now.getTime() -
        messageDate.getTime();

    const seconds =
        Math.floor(difference / 1000);

    const minutes =
        Math.floor(seconds / 60);

    const hours =
        Math.floor(minutes / 60);

    const days =
        Math.floor(hours / 24);

    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return minutes === 1
            ? "1 minute ago"
            : `${minutes} minutes ago`;
    }

    if (hours < 24) {
        return hours === 1
            ? "1 hour ago"
            : `${hours} hours ago`;
    }

    if (days < 30) {
        return days === 1
            ? "1 day ago"
            : `${days} days ago`;
    }

    return messageDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}

function getMessageId(item) {
    return JSON.stringify([
        item.timestamp ?? null,
        String(item.name ?? ""),
        String(item.message ?? ""),
        String(item.device ?? "")
    ]);
}

async function getArchivedMessages() {
    const savedArchive = await encryptedStorage.getItem(archiveStorageKey);
    if (!savedArchive) return [];

    const archive = JSON.parse(savedArchive);
    if (
        !Array.isArray(archive) ||
        archive.some(record =>
            !record ||
            typeof record.id !== "string" ||
            !record.item ||
            typeof record.item !== "object"
        )
    ) {
        throw new Error("Saved message archive has an invalid format");
    }

    return archive;
}

async function saveArchivedMessages(archive) {
    await encryptedStorage.setItem(archiveStorageKey, JSON.stringify(archive));
}

function setCurrentView(view) {
    currentView = view;
    const inboxIsActive = view === "inbox";
    inboxTab.classList.toggle("active", inboxIsActive);
    inboxTab.setAttribute("aria-selected", String(inboxIsActive));
    archiveTab.classList.toggle("active", !inboxIsActive);
    archiveTab.setAttribute("aria-selected", String(!inboxIsActive));
    messages.setAttribute("aria-labelledby", inboxIsActive ? "inboxTab" : "archiveTab");
    return renderMessages();
}

async function renderMessages() {
    messages.replaceChildren();
    messagesError.hidden = true;
    messagesError.textContent = "";

    let archive;
    try {
        archive = await getArchivedMessages();
    } catch (error) {
        console.error(error);
        messagesError.textContent = "Unable to load the message archive.";
        messagesError.hidden = false;
        return;
    }

    const archivedIds = new Set(archive.map(record => record.id));
    const visibleMessages = currentView === "archive"
        ? archive
        : currentMessages
            .filter(item => !archivedIds.has(getMessageId(item)))
            .map(item => ({ id: getMessageId(item), item }));

    if (!visibleMessages.length) {
        const emptyState = document.createElement("li");
        emptyState.className = "loading";
        emptyState.textContent = currentView === "archive"
            ? "No archived messages."
            : "No messages yet.";
        messages.appendChild(emptyState);
        return;
    }

    visibleMessages.forEach(record => {
        const item = record.item;
        const li = document.createElement("li");
        const date = getRelativeTime(item.timestamp);

        li.innerHTML = `
          <div class="date">${escapeHTML(date)}</div>
          <div class="name">${escapeHTML(item.name)}</div>
          <div class="message">${escapeHTML(item.message)}</div>
        `;

        const footer = document.createElement("div");
        const device = document.createElement("div");
        const action = document.createElement("button");
        footer.className = "message-footer";
        device.className = "device";
        device.textContent = String(item.device ?? "");
        action.className = "message-action";
        action.type = "button";
        action.textContent = currentView === "archive" ? "Restore to Inbox" : "Archive";
        action.addEventListener("click", () => updateMessageArchive(record));
        footer.append(device, action);
        li.appendChild(footer);
        messages.appendChild(li);
    });
}

async function updateMessageArchive(record) {
    try {
        const archive = await getArchivedMessages();
        const existingIndex = archive.findIndex(item => item.id === record.id);

        if (currentView === "archive") {
            if (existingIndex !== -1) archive.splice(existingIndex, 1);
            if (!currentMessages.some(item => getMessageId(item) === record.id)) {
                currentMessages.push(record.item);
            }
        } else if (existingIndex === -1) {
            archive.push(record);
        }

        await saveArchivedMessages(archive);
        await renderMessages();
    } catch (error) {
        console.error(error);
        messagesError.textContent = "Unable to update the message archive.";
        messagesError.hidden = false;
    }
}

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}

inboxTab.addEventListener("click", () => setCurrentView("inbox"));
archiveTab.addEventListener("click", () => setCurrentView("archive"));

logoutButton.addEventListener(
    "click",
    () => {

        passwordInput.value = "";
        loginError.textContent = "";

        messagesScreen.style.display =
            "none";

        loginScreen.style.display =
            "flex";

        currentMessages = [];
        setCurrentView("inbox");

    }
);