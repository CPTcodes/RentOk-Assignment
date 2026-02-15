class LoginPage {
  get continueBtn() {
    return $("~Continue");
  }

  get phoneInput() {
    return $('android=new UiSelector().className("android.widget.EditText")'); // accessibility id
  }

  get sendOtp() {
    return $("~Send OTP");
  }

  async enterPhoneNumber(number) {
    await this.phoneInput.waitForDisplayed();
    await this.phoneInput.click();
    await this.phoneInput.setValue(number);
  }

  async tapSendOtp() {
    await this.sendOtp.click();
  }

  async clickContinue() {
    await this.continueBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Continue button not visible after 10s",
    });
    await this.continueBtn.click();
  }
}

export default new LoginPage();
