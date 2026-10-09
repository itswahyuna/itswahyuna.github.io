const statsStorageKey = "__x7f3a91c2b6e4d8a__";

function formatCount(number) {
    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 10000) {
        return `${Math.round(number / 1000)}K`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }

    return number.toString();
}

function renderStats(stats) {
    const visitorsElement = document.getElementById("visitors");
    const messagesElement = document.getElementById("anonymous-messages");

    if (visitorsElement) {
        visitorsElement.textContent = `${formatCount(stats.visitors)} visitors`;
    }

    if (!messagesElement) return;
    const messageLabel = stats.totalMessages === 1
        ? "anonymous message"
        : "anonymous messages";

    messagesElement.textContent = `${formatCount(stats.totalMessages)} ${messageLabel}`;
}

function getCachedStats() {
    try {
        const savedStats = localStorage.getItem(statsStorageKey);
        if (savedStats === null) return null;

        const stats = JSON.parse(savedStats);
        if (
            typeof stats?.visitors === "number" &&
            Number.isFinite(stats.visitors) &&
            stats.visitors >= 0 &&
            typeof stats.totalMessages === "number" &&
            Number.isFinite(stats.totalMessages) &&
            stats.totalMessages >= 0
        ) {
            return stats;
        }


    } catch (error) {
        console.error(error);
    }

    return null;
}

async function nos() {
    if (!navigator.onLine) {
        const cachedStats = getCachedStats();
        if (cachedStats) renderStats(cachedStats);
        return;
    }

    try {
        const response = await fetch(
            "https://wahyunaserver.wahyunadragon.workers.dev/number-of-senders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const result = await response.json();

        if (
            response.ok &&
            result.success === true &&
            typeof result.visitors === "number" &&
            Number.isFinite(result.visitors) &&
            result.visitors >= 0 &&
            typeof result.totalMessages === "number" &&
            Number.isFinite(result.totalMessages) &&
            result.totalMessages >= 0
        ) {
            const stats = {
                visitors: result.visitors,
                totalMessages: result.totalMessages
            };

            renderStats(stats);

            try {
                localStorage.setItem(statsStorageKey, JSON.stringify(stats));
            } catch (error) {
                console.error(error);
            }

            const messageLabel = stats.totalMessages === 1
                ? "anonymous message to Wahyuna"
                : "anonymous messages to Wahyuna";

            setTimeout(() => {
                sender(`${formatCount(stats.totalMessages)} ${messageLabel}`);
            }, 1500);
            return;
        }

    } catch (error) {
        console.error(error);
    }

    const cachedStats = getCachedStats();
    if (cachedStats) renderStats(cachedStats);
}

nos();
