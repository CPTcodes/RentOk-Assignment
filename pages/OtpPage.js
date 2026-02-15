class OtpPage{

  get otpInput() {
     return $('android=new UiSelector().className(\"android.widget.EditText\")');
  }

  get verifyBtn() {
    return $("~Verify OTP");
  }

  async enterOtp(otp) {
    await this.otpInput.waitForDisplayed();
    await this.otpInput.click();
    await this.otpInput.clearValue();
    await this.otpInput.setValue(otp);
  }

  async tapVerify() {
    await this.verifyBtn.click();
  }
}

export default new OtpPage();