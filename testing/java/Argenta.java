package fixtures.cmb.test;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.io.DataOutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import util.UtilAccess;

public class Argenta 
{
	private WebDriver browser;
	private UtilAccess utils;
	private String username;
	
	public Argenta(WebDriver browser, UtilAccess utils)
	{
		this.browser = browser;
		this.utils = utils;
	}
	
	public void clickOnButtonUp(int counter)
	{
		for(int i = 0; i <= counter; i++)
		{
			browser.findElement(By.cssSelector(".navigate-up")).click();
			utils.wd.doWait(1);
		}
	}
	
	public void clickOnButtonDown(int counter)
	{
		for(int i = 0; i <= counter; i++)
		{
			browser.findElement(By.cssSelector(".navigate-down")).click();
			utils.wd.doWait(1);
		}
	}
	
	public void clickOnButtonLeft(int counter)
	{
		for(int i = 0; i <= counter; i++)
		{
			browser.findElement(By.cssSelector(".navigate-left")).click();
			utils.wd.doWait(1);
		}
	}
	
	public void clickOnButtonRight(int counter)
	{
		for(int i = 0; i <= counter; i++)
		{
			browser.findElement(By.cssSelector(".navigate-right")).click();
			utils.wd.doWait(1);
		}
	}
	
	public void enterUsername(String username)
	{
		WebElement usernameInput = browser.findElement(By.cssSelector(".ng-pristine.ng-invalid.ng-invalid-required.ng-touched"));
		usernameInput.clear();
		usernameInput.sendKeys(username);
		
		setUsername(username);
	}
	
	public void enterPassword(String password)
	{
		WebElement passwordInput = browser.findElement(By.cssSelector(".password.ng-pristine.ng-untouched.ng-invalid.ng-invalid-required"));
		passwordInput.clear();
		passwordInput.sendKeys(password);
	}
	
	public void clickOnLogin() throws InterruptedException
	{
		utils.wd.doWait(1);
		browser.findElement(By.cssSelector("[ng-click='logIn()']")).click();
	}
	
	public void verifyUsername()
	{
		String displayedUsername = utils.wd.waitForVisible(By.cssSelector(".ng-binding")).getText();
		displayedUsername = displayedUsername.substring(6, displayedUsername.length());
		assertThat(displayedUsername, is(getUsername()));
	}
	
	public void clickOnIHaveAQuestion()
	{
		browser.findElement(By.cssSelector("[class=\"buttonStyle leftButton\"][ng-hide=\"questionRaised\"] [ng-click=\"ask()\"]")).click();
		
		utils.wd.doWait(5);
	}
	
	public void choosePresentation(String name)
	{
		browser.findElement(By.xpath(".//*[@id='presentationSelector']/span[text()='"+ name +"']")).click();
	}
	
	public void clickOnVoteYes()
	{
		browser.findElement(By.xpath(".//*[@id='slides']/section/form/button[1]")).click();
	}
	
	public void clickOnVoteNo()
	{
		browser.findElement(By.xpath(".//*[@id='slides']/section/form/button[2]")).click();
	}
	
	public void clickOnFollow()
	{
		browser.findElement(By.cssSelector("[onclick='follow()']")).click();
	}
	
	public void verifyOutOfSync()
	{
		WebElement outOfSync = browser.findElement(By.cssSelector("[class=\"outOfSyncContainer\"]"));
		
		boolean isOutOfSync = outOfSync.isDisplayed();
		
		if (isOutOfSync == true)
		{
			clickOnFollow();
		}
	}
	
	public void selectMasterSlide() throws Exception
	{
		URL url = new URL("http://192.168.101.198/meister");
		URLConnection urlConn = url.openConnection();

		urlConn.setDoInput(true);
		urlConn.setDoOutput(true);
		urlConn.setUseCaches(false);
		urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		
		// Send POST output.
		DataOutputStream cgiInput = new DataOutputStream(urlConn.getOutputStream());
		
		String content = "meister?user=meister&password=preso123&presentationName=preso.html";
		
		cgiInput.writeBytes(content);
		cgiInput.flush();
		cgiInput.close();
		
		browser.get("http://192.168.101.198/meister#");
	}
	
	public void clickOnStopPresentation()
	{
		browser.findElement(By.cssSelector("[ng-click='stopPresentation()']")).click();
	}
	
	public void verifyLogout()
	{
		WebElement usernameInput = browser.findElement(By.cssSelector(".ng-pristine.ng-invalid.ng-invalid-required.ng-touched"));
		assertTrue(usernameInput.isDisplayed());
	}
	
	public void clickOnTakingNotes()
	{
		browser.findElement(By.cssSelector("[class=\"fa fa-pencil-square-o\"]")).click();
	}
	
	public void fillInEmailForm(String text, String email)
	{
		WebElement textareaInput = browser.findElement(By.cssSelector("[ng-model=\"notes\"]"));
		textareaInput.clear();
		textareaInput.sendKeys(text);
		
		WebElement emailInput = browser.findElement(By.cssSelector("[ng-model=\"email\"]"));
		emailInput.clear();
		emailInput.sendKeys(email);
	}
	
	public void clickOnSendEmail()
	{
		browser.findElement(By.cssSelector("[ng-click=\"emailNotes()\"]")).click();
	}
	
	public void setUsername(String username)
	{
		this.username = username;
	}
	
	public String getUsername()
	{
		return username;
	}
}
