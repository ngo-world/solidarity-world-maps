/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    if (!WA.player.state.hasVariable("phoneNumber")) {
        const phoneNumber = getRandomPhoneNumber();
        console.info(`Saving random phone number: ${phoneNumber}`);
        WA.player.state.saveVariable("phoneNumber", phoneNumber, {
            public: true,
            persist: true,
            scope: "world"
        });
    }
    

    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
    bootstrapExtra().then(async () => {
        await WA.ui.website.open({
            url: `https://127.0.0.1:4200?userId=${WA.player.playerId}`,
            allowApi: true,
            // ToDo
            allowPolicy: 'microphone',
            position: {
                vertical: "bottom",
                horizontal: "right",
            },
            size: {
                height: "530px",
                width: "235px",
            },
        });
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


function getRandomPhoneNumber() {
    const min = 100000000;
    const max = 999999999;
    const randomNumber = Math.floor(Math. random() * (max - min) + min);
    return `+${randomNumber}`;
}

export {};
