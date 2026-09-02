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

            const text =
                total === 1
                    ? "1 person sent an anonymous message to Wahyuna"
                    : `${total} people sent anonymous messages to Wahyuna`;

            sender(text);

            sessionStorage.setItem("number_of_senders", "true");
        }

    } catch (error) {
        console.error(error);
    }
}

nos();