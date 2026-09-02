async function nos() {
    if (sessionStorage.getItem("number_of_senders") === "true") {
        return;
    }

    try {
        const response = await fetch(
            "https://wahyunaserver.wahyunadragon.workers.dev/number-of-senders",
            {
                method: "GET"
            }
        );

        const result = await response.json();

        if (
            response.ok &&
            result.success === true &&
            typeof result.total === "number"
        ) {
            const total = result.total;

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

            sessionStorage.setItem("number_of_senders", "true");
        }

    } catch (error) {
        console.error(error);
    }
}

nos();