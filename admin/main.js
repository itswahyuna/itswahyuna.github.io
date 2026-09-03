
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

const showPassword =
    document.getElementById("showPassword");

const logoutButton =
    document.getElementById("logoutButton");

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

        displayMessages(
            result.data
        );

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

function displayMessages(data) {

    messages.innerHTML = "";

    if (
        !data ||
        data.length === 0
    ) {

        messages.innerHTML = `
          <li class="loading">
            No messages yet.
          </li>
        `;

        return;
    }

    data.forEach(item => {

        const li =
            document.createElement("li");

        const date =
            getRelativeTime(
                item.timestamp
            );

        li.innerHTML = `
          <div class="date">
            ${escapeHTML(date)}
          </div>

          <div class="name">
            ${escapeHTML(item.name)}
          </div>

          <div class="message">
            ${escapeHTML(item.message)}
          </div>

          <div class="device">
            ${escapeHTML(item.device)}
          </div>
        `;

        messages.appendChild(li);

    });

}

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}

logoutButton.addEventListener(
    "click",
    () => {

        passwordInput.value = "";
        loginError.textContent = "";

        messagesScreen.style.display =
            "none";

        loginScreen.style.display =
            "flex";

    }
);