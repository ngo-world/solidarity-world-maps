/// <reference types="@workadventure/iframe-api-typings" />

import { UIWebsite } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

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
  return (JSON.parse(WA.state.loadVariable("config") as string) as any)
    .solidarityWorldExtensionsUrl;
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
      horizontal: "right",
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
