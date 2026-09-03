let visitor_count_text = "";

async function nos() {
    if (sessionStorage.getItem("visitors") !== null) {
        visitor_count_text = sessionStorage.getItem("visitors");
        document.getElementById("visitors").innerText = vstrs(Number(visitor_count_text));
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
            typeof result.totalMessages === "number"
        ) {
            const visitors = result.visitors;
            const total = result.totalMessages;

            sessionStorage.setItem("visitors", visitors.toString());

            visitor_count_text = visitors.toString();

            document.getElementById("visitors").innerText =
                vstrs(visitors);

            let frmtd;

            if (total >= 1000000) {
                frmtd = `${(total / 1000000).toFixed(1)}M`;
            } else if (total >= 10000) {
                frmtd = `${Math.round(total / 1000)}K`;
            } else if (total >= 1000) {
                frmtd = `${(total / 1000).toFixed(1)}K`;
            } else {
                frmtd = total.toString();
            }

            const text =
                total === 1
                    ? `${frmtd} anonymous message to Wahyuna`
                    : `${frmtd} anonymous messages to Wahyuna`;

            setTimeout(() => {
                sender(text);
            }, 1500);
        }

    } catch (error) {
        console.error(error);
    }
}

function vstrs(number) {
    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M visitors`;
    } else if (number >= 10000) {
        return `${Math.round(number / 1000)}K visitors`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K visitors`;
    } else {
        return `${number} visitors`;
    }
}

nos();