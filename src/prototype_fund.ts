/// <reference types="@workadventure/iframe-api-typings" />

import { UIWebsite } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

const DEVELOPMENT_UUIDS: string[] = [
  "trainer@davidgengenbach.de",
  //"DemoDayPlayer1@davidgengenbach.de",
];

console.log("Script started successfully");

WA.onInit()
  .then(async () => await bootstrapExtra())
  .then(async () => {
    await openBackgroundPage();
    await openSmartphone();

    setInterval(async () => {
      if (!(await getOpenWebsite("/smartphone"))) {
        openSmartphone();
      }
    }, 500);
  })
  .catch((e) => console.error(e));

function getSolidarityWorldUrl() {
  if (DEVELOPMENT_UUIDS.indexOf(WA.player.uuid!) > -1) {
    console.error("ToDo: change back to production url!");
    return "https://localhost:4200";
  } else {
    return "https://web.solidarity-world.de";
  }
}

async function openBackgroundPage() {
  await WA.ui.website.open({
    url: `${getSolidarityWorldUrl()}/background`,
    allowApi: true,
    position: {
      vertical: "top",
      horizontal: "left",
    },
    size: {
      height: "140px",
      width: "220px",
    },
  });
}

async function openSmartphone() {
  await WA.ui.website.open({
    url: `${getSolidarityWorldUrl()}/smartphone`,
    allowApi: true,
    // ToDo
    allowPolicy: "microphone *; screen-wake-lock *",
    position: {
      vertical: "middle",
      horizontal: "left",
    },
    size: {
      height: "620px",
      width: "300px",
    },
  });
}
async function getOpenWebsite(
  urlSuffix: string
): Promise<UIWebsite | undefined> {
  return (await WA.ui.website.getAll()).find((x) => x.url.endsWith(urlSuffix));
}

export {};
