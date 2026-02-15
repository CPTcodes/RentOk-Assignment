import { log } from "node:console";
import LoginPage from "../pages/LoginPage";
import OtpPage from "../pages/OtpPage";
import { expect } from "@wdio/globals";

describe("RentOk Login - Phone Number Screen", () => {
  beforeEach(async () => {
    await driver.terminateApp("net.eazypg.eazypgmanager");
    await driver.activateApp("net.eazypg.eazypgmanager");

    await LoginPage.clickContinue();
  });

  it("should click Continue button successfully", async () => {
    await LoginPage.enterPhoneNumber("1234567893");
    await LoginPage.tapSendOtp();
  });

  it("should reject input containing only spaces", async () => {
    await LoginPage.enterPhoneNumber("          ");
    await LoginPage.tapSendOtp();

    await driver.pause(800);
    const toast = await $("//android.widget.Toast");

    const toastText = await toast.getText();

    expect(toastText).includes("Please enter valid mobile number");
  });

  it("should show toast for invalid mobile number with spaces", async () => {
    await LoginPage.enterPhoneNumber("88566  859");
    await LoginPage.tapSendOtp();
    await driver.pause(800);

    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();

    expect(toastText).toContain("wrong");
  });

  it("should show toast for invalid mobile number", async () => {
    await LoginPage.enterPhoneNumber("123");
    await LoginPage.tapSendOtp();

    await driver.pause(800);

    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();

    expect(toastText).toContain("Please enter valid mobile number");
  });

  it("should show error for less than 10 digits", async () => {
    await LoginPage.enterPhoneNumber("12345");
    await LoginPage.tapSendOtp();

    await driver.pause(800);

    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();

    expect(toastText).toContain("Please enter valid mobile number");
  });

  it("should show error for blank input", async () => {
    await LoginPage.enterPhoneNumber("          ");
    await LoginPage.tapSendOtp();

    await driver.pause(800);

    const toast = await $("//android.widget.Toast");
    await toast.waitForDisplayed({ timeout: 3000 });

    const toastText = await toast.getText();
    expect(toastText).toBe("Please enter valid mobile number");

    const otpField = await $(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    const isOtpVisible = await otpField.isDisplayed().catch(() => false);

    expect(isOtpVisible).toBe(false);
  });

  it("should restrict more than 10 digits", async () => {
    await LoginPage.enterPhoneNumber("123456789012345");

    const phoneInput = await $(
      'android=new UiSelector().className("android.widget.EditText")',
    );
    const value = await phoneInput.getText();

    expect(value.length).toBeLessThanOrEqual(10);
  });

  it("should reject alphabetic characters in phone field", async () => {
    await LoginPage.enterPhoneNumber("abcdefghij");
    await LoginPage.tapSendOtp();

    await driver.pause(800);

    const toast = await $("//android.widget.Toast");

    const toastText = await toast.getText();
    expect(toastText).toContain("Something went wrong");
  });

  it("should show toast message for wrong OTP", async () => {
    await LoginPage.enterPhoneNumber("8745985632");
    await LoginPage.tapSendOtp();

    await OtpPage.enterOtp("000000");
    await OtpPage.tapVerify();

    await driver.pause(800);
    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();
    expect(toastText).toContain("OTP not match");
  });

  it("should show toast message for OTPs with only spaces", async () => {
    await LoginPage.enterPhoneNumber("8745985632");
    await LoginPage.tapSendOtp();

    await OtpPage.tapVerify();

    await driver.pause(800);
    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();
    expect(toastText).toContain("Please enter valid otp");
  });

  it("should show toast message for OTPs with less than 6 digits", async () => {
    await LoginPage.enterPhoneNumber("8428475632");
    await LoginPage.tapSendOtp();

    await OtpPage.enterOtp("0000");
    await OtpPage.tapVerify();

    await driver.pause(800);
    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();
    expect(toastText).toContain("Please enter valid otp");
  });

  it("should show toast message for max OTP attempts", async () => {
    await LoginPage.enterPhoneNumber("8745875632");
    await LoginPage.tapSendOtp();

    for (let i = 0; i < 6; i++) {
      await OtpPage.enterOtp(`000` + i + `00`);
      await OtpPage.tapVerify();
    }
    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();
    // console.log(toastMessageArr);
    expect(toastText).toContain("Max limit reached for this otp verification");
  });

  it.only("should handle gracefully when internet is turned off and show toast", async () => {
    await LoginPage.enterPhoneNumber("8745985632");

    // await dataOffhelper.setNetwork("off");
    await driver.setNetworkConnection(0); // 0 = Airplane mode (all off)
    await driver.pause(5000);

    await LoginPage.tapSendOtp();

    const toast = await $("//android.widget.Toast");
    const toastText = await toast.getText();

    expect(toastText).toContain("Something went wrong!");

    // await dataOffhelper.setNetwork("on");
    await driver.setNetworkConnection(6); // 6 = All network on (WiFi + Data)   
    await driver.pause(5000);

    await LoginPage.tapSendOtp();
    const otpInputs = await $$(
      'android=new UiSelector().className("android.widget.EditText")',
    );

    expect(otpInputs).toBeDisplayed();
  });
});
