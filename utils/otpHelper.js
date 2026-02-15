import { execSync } from 'child_process';

function getLatestOTP() {
    const output = execSync(
        'adb shell content query --uri content://sms/inbox --projection body'
    ).toString();

    // Extract latest 6 digit number
    const matches = output.match(/\b\d{6}\b/g);
    if (!matches) return null;

    // Return the most recent OTP
    return matches[matches.length - 1];
}

export default { getLatestOTP };