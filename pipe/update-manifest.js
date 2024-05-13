import fs from 'fs';
import packageJson from "../package.json" with { type: "json" };
import manifest from "../manifest.json" with { type: "json" };

const { version } = packageJson;

const updateManifest = async () => {
    const splittedVersion = version.split(".");
    const initial = splittedVersion.slice(0, 2)
    initial.push(+splittedVersion[2] + 1)
    const newVersion = initial.join(".");
    const newManifest = {
        ...manifest,
        version: newVersion,
    };
    const newPackageJson = {
        ...packageJson,
        version: newVersion,
    };
    fs.writeFileSync("./manifest.json", JSON.stringify(newManifest, null, 2));
    fs.writeFileSync("./package.json", JSON.stringify(newPackageJson, null, 2));
}
updateManifest()
