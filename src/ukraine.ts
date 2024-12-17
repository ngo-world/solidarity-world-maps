/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(async () => {
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

// When someone enters the bellZone area
WA.room.area.onEnter("bellZone").subscribe(() => {
  // Display the action message
  actionMessage = WA.ui.displayActionMessage({
    type: "message",
    message: "Press SPACE to ring the bell",
    callback: () => {
      // When space is pressed, we send a "bell-rang" signal to everyone on the map.
      WA.event.broadcast("bell-rang", {});
    }
  });
});

// When someone leaves the bellZone area
WA.room.area.onLeave("bellZone").subscribe(() => {
  if (actionMessage !== undefined) {
    // Hide the action message
    actionMessage.remove();
    actionMessage = undefined;
  }
});

}).catch(e => console.error(e));

export {};
