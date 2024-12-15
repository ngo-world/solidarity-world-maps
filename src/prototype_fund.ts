/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');


WA
    .onInit()
    .then(async () => await bootstrapExtra())
    .then(async () => {
        if (!WA.player.state.hasVariable("phoneNumber")) {
            const phoneNumber = getRandomPhoneNumber();
            console.info(`Saving random phone number: ${phoneNumber}`);
            WA.player.state.saveVariable("phoneNumber", phoneNumber, {
                public: true,
                persist: true,
                scope: "world"
            });
        }

        WA.controls.disableMapEditor();
        WA.controls.disableInviteButton();

        // WA.controls.disableRightClick();
        WA.controls.disableScreenSharing();
        // ToDo
        WA.controls.disableWheelZoom();
        WA.controls.disableRoomList();

        WA.controls.disableMicrophone();
        WA.controls.disableWebcam();

        console.log('Scripting API ready');
        console.log('Player tags: ', WA.player.tags)
        await WA.player.state.saveVariable('smartphoneShown', false);

        WA.ui.actionBar.addButton({
            id: 'toggleSmartPhoneButton',
            label: 'Toggle smartphone',
            callback: async (_) => {
                WA.player.state.saveVariable('smartphoneShown', !WA.player.state['smartphoneShown']);
            }
        });

        setInterval(async () => {
            const website = (await WA.ui.website.getAll()).find(x => x.url.endsWith('/smartphone'));
            if (!website) {
                openSmartphone();
            }
        }, 100);

        await openSmartphone();
    })
    .catch(e => console.error(e));;


async function openSmartphone() {
    await WA.ui.website.open({
        url: "https://127.0.0.1:4200/smartphone",
        allowApi: true,
        // ToDo
        allowPolicy: 'microphone',
        position: {
            vertical: "middle",
            horizontal: "right",
        },
        size: {
            height: "620px",
            width: "300px",
        },
    });
}

function getRandomPhoneNumber() {
    const min = 330000000;
    const max = 509999999;
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    return `+${randomNumber}`;
}

export { };
