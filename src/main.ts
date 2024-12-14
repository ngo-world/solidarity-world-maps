/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(async () => {
        setInterval(async () => {
            await WA.players.configureTracking();
            const players = WA.players.list();
            console.log(players);
        }, 1000);
        const myWebsite = await WA.ui.website.open({
            url: `https://127.0.0.1:8080?userId=${WA.player.playerId}`,
            allowApi: true,
            // ToDo
            allowPolicy: 'microphone',
            position: {
                vertical: "bottom",
                horizontal: "right",
            },
            size: {
                height: "30vh",
                width: "30vw",
            },
        });
        
        myWebsite.position.vertical = "top";

        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
