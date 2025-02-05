/// <reference types="@workadventure/iframe-api-typings" />

const solidarityWorldUrl = "https://127.0.0.1:4200"
// https://aws-load-balancer.solidarity-world.de

import { UIWebsite } from "@workadventure/iframe-api-typings";
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

        WA.ui.actionBar.addButton({
            id: 'openAdminDashboard',
            label: 'Open admin dashboard',
            callback: openAdminDashboard
        });

        setInterval(async () => {
            if (!await getOpenWebsite('/smartphone')) {
                openSmartphone();
            }
        }, 100);

        await openSmartphone();
        await openBackgroundPage();
    })
    .catch(e => console.error(e));

async function getOpenWebsite(urlSuffix: string): Promise<UIWebsite | undefined> {
    return (await WA.ui.website.getAll()).find(x => x.url.endsWith(urlSuffix));
}

async function openBackgroundPage() {
    await WA.ui.website.open({
        url: `${solidarityWorldUrl}/background`,
        allowApi: true,
        position: {
            vertical: "bottom",
            horizontal: "right",
        },
        size: {
            height: "1px",
            width: "1px",
        },
    });
}


function openAdminDashboard() {
    WA.ui.modal.openModal({
        title: "yes",
        src: `${solidarityWorldUrl}/admin-dashboard`,
        allowApi: true,
        position: "center",
        allow: null
    });
}

async function openSmartphone() {
    await WA.ui.website.open({
        url: `${solidarityWorldUrl}/smartphone`,
        allowApi: true,
        // ToDo
        allowPolicy: 'microphone *; screen-wake-lock *',
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
