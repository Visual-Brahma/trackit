import { cleanData } from "./clean";
import { mergeData } from "./merge";
import downloadData from "./donwload";

async function main() {
    // Donwload data
    // await downloadData();

    // clean data
    await cleanData();

    // Merge into a single json file
    await mergeData();
}

main();