import fs from 'fs';
import packageJson from "../package.json" with { type: "json" };
import manifest from "../manifest.json" with { type: "json" };

const { version } = packageJson;

const updateManifest = async () => {
    const newManifest = {
        ...manifest,
        version,
    };

    fs.writeFileSync("./manifest.json", JSON.stringify(newManifest, null, 2));
}
updateManifest()
