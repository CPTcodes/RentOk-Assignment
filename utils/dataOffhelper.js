import { exec } from "child_process";
function setNetwork(state) {
  return new Promise((resolve, reject) => {
    const device = "emulator-5554"; // adjust if different
    const command =
      state === "off"
        ? `adb -s ${device} emu network status down`
        : `adb -s ${device} emu network status up`;

    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

export default { setNetwork };