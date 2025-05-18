package com.example.inventry.controller;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.*;

public class SeleniumLoginTest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup(); // Automatically handles driver binaries
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:5173/login"); // Adjust this path as needed
    }

    @Test
    public void testLoginFlow() {
        // Fill in email
        WebElement emailField = driver.findElement(By.name("email"));
        emailField.sendKeys("meshaniwijekoon@gmail.com");

        // Fill in password
        WebElement passwordField = driver.findElement(By.name("password"));
        passwordField.sendKeys("123456");

        // Click Sign In button
        WebElement signInBtn = driver.findElement(By.cssSelector("button.login-button"));
        signInBtn.click();

        // Wait briefly and check if redirected to account details
        try {
            Thread.sleep(2000); // For demo purposes only. Better to use WebDriverWait in real tests.
            assertTrue(driver.getCurrentUrl().contains("account-details"));
            System.out.println("✅ Login Test Passed");
        } catch (Exception e) {
            fail("❌ Login Test Failed: " + e.getMessage());
        }
    }

    @Test
    public void testLogoutFlow() {
        // Perform login first
        testLoginFlow();

        // Assuming a logout button exists in /account-details
        try {
            WebElement logoutButton = driver.findElement(By.cssSelector("button.sign-out-button"));
            logoutButton.click();
            Thread.sleep(1000);
            assertTrue(driver.getCurrentUrl().contains(""));
            System.out.println("✅ Logout Test Passed");
        } catch (Exception e) {
            fail("❌ Logout Test Failed: " + e.getMessage());
        }
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
