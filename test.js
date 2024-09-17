const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");

// Set up Chrome options
const options = new chrome.Options();

// Set up the WebDriver
const driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();

async function login(r_no) {
  try {
    // console.log(r_no);
    await driver.get("https://ubus.chitkara.edu.in/Login");

    await driver.wait(
      until.elementLocated(By.css(".login-form")),
      15000
    );

    const loginForm = await driver.findElement(By.css('.login-form'));

    const usernameField = await loginForm.findElement(
      By.css('input[name="username"]')
    );

    await usernameField.sendKeys(r_no);

    const passwordField = await loginForm.findElement(
      By.css('input[name="password"]')
    );

    const first_two_digits = "@" + r_no.toString().slice(0, 2);
    console.log(first_two_digits)
    await passwordField.sendKeys(r_no + first_two_digits);

    const submitButton = await loginForm.findElement(
      By.css('input[type="submit"]')
    );

    console.log("Submit button found. Clicking submit...");
    await submitButton.click();

    // await driver.get("https://ubus.chitkara.edu.in/studentdashboard/");

    {/* await driver.wait(until.urlContains("studentdashboard"), 15000); */ }
    const url = "https://ubus.chitkara.edu.in/changepassword";
    const currentUrl = await driver.getCurrentUrl();
    const status = currentUrl === url ? "logged_in" : "not_logged_in";
    if (status != "logged_in") {
      return {
        "error": "user changed his password"
      }
    }


    const userDetails = await driver.wait(
      until.elementLocated(By.css(".user-detail")),
      50000
    );

    const image = await userDetails
      .findElement(By.css("img"))
      .getAttribute("src");
    const name = await userDetails.findElement(By.css("h4")).getText();
    const fatherName = await userDetails.findElement(By.css("p")).getText();

    //code to logout the user
    await driver.get("https://ubus.chitkara.edu.in/Studentlogout");

    return { name, fatherName, image };
  } catch (err) {
    console.error("Error encountered:", err);
    if (err.name === "TimeoutError") {
      console.error(
        "TimeoutError: The element was not found within the timeout period."
      );
    } else {
      console.error("An unexpected error occurred:", err);
    }
    await driver.get("https://ubus.chitkara.edu.in/Studentlogout");
    return { "error": "user changed password" }
    {/* await driver.quit(); */ }
  }
}

async function main(r_no) {
  const arr = await login(r_no);
  return arr;
}

module.exports = main;
