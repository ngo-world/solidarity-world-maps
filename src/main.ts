/// <reference types="@workadventure/iframe-api-typings" />

import {ActionMessage} from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
  let actionMessage: ActionMessage | undefined;

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
