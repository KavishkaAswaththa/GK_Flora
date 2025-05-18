package com.example.inventry.controller;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SeleniumLoginAndInventoryFlowTest {

    private static WebDriver driver;
    private static WebDriverWait wait;

    @BeforeAll
    static void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    @Order(1)
    void loginTest() {
        driver.get("http://localhost:5173/login");

        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("email")));
        WebElement passwordInput = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));

        emailInput.sendKeys("gamindumpasan1997@gmail.com");
        passwordInput.sendKeys("123456");
        loginButton.click();

        try {
            wait.until(ExpectedConditions.urlContains("account-details"));
            assertTrue(driver.getCurrentUrl().contains("account-details"));
            System.out.println("✅ Login Test Passed");
        } catch (TimeoutException e) {
            fail("❌ Login Test Failed: " + e.getMessage());
        }
    }

    @Test
    @Order(2)
    void checkInventoryPageLoads() {
        driver.get("http://localhost:5173/inventory");

        WebElement header = wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
        assertTrue(header.getText().contains("All Bouquets"));
        System.out.println("✅ Inventory Page Load Test Passed");
    }

    @Test
    @Order(3)
    void addInventoryFormLoads() {
        driver.get("http://localhost:5173/form");

        WebElement nameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("name")));
        assertTrue(nameInput.isDisplayed());
        System.out.println("✅ Add Inventory Form Load Test Passed");
    }

    @Test
    @Order(4)
    void addInventoryFormSubmission() {
        driver.get("http://localhost:5173/form");

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("name"))).sendKeys("Selenium Test Bouquet");
        driver.findElement(By.name("id")).sendKeys("S123");
        driver.findElement(By.name("category")).sendKeys("Birthday");
        driver.findElement(By.name("description")).sendKeys("This is a test bouquet from Selenium.");
        driver.findElement(By.name("price")).sendKeys("2500");
        driver.findElement(By.name("qty")).sendKeys("10");

        // Select first two bloom tags
        java.util.List<WebElement> tagButtons = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("tag-button")));
        for (int i = 0; i < Math.min(2, tagButtons.size()); i++) {
            tagButtons.get(i).click();
        }

        // Upload image(s) - make sure the image file path exists on your machine
        WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
        fileInput.sendKeys("C:\\Users\\akdas\\OneDrive\\Documents\\GitHub\\GK_Flora\\Test-image.jpg"); // Replace with a valid file path

        // Submit form
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        // Wait for alert
        try {
            wait.until(ExpectedConditions.alertIsPresent());
            Alert alert = driver.switchTo().alert();
            System.out.println("✅ Form Submission Alert: " + alert.getText());
            alert.accept();
        } catch (TimeoutException e) {
            fail("❌ Inventory form submission failed or no alert appeared.");
        }
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
