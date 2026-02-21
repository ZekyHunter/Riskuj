import requests
from django.core.management import call_command
# from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from riskuj import models


def get_player_state(driver, username_to_find):
    """
    Returns the state of a player by username.

    :param driver: Selenium webdriver
    :param username_to_find: exact text of the username
    :return: dict {"points": int, "classes": [list of classes]}
    :raises: ValueError if player not found
    """
    # Find all player divs
    players = driver.find_elements(By.CSS_SELECTOR, ".playerContainer .player")

    for player in players:
        username = player.find_element(By.CSS_SELECTOR, ".username").text
        if username == username_to_find:
            points = int(player.find_element(By.CSS_SELECTOR, ".points").text)
            classes = player.get_attribute("class").split()
            return {
                "points": points,
                "classes": classes
            }

    raise ValueError(f"Player '{username_to_find}' not found in the DOM")


class UserButtonFlowTest(StaticLiveServerTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        cls.driver = webdriver.Chrome(options=chrome_options)
        call_command("prefill_db")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super().tearDownClass()

    def test_test(self):
        # create handles
        self.driver.get(self.live_server_url + "/player")
        baribal_handle = self.driver.current_window_handle

        self.driver.execute_script(
            "window.open(arguments[0]);",
            self.live_server_url + "/player"
        )
        rys_handle = self.driver.window_handles[1]

        # self.driver.execute_script(
        #     "window.open(arguments[0]);",
        #     self.live_server_url
        # )
        # observer_handle = self.driver.window_handles[2]

        # create first player
        self.driver.switch_to.window(baribal_handle)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        username_input = self.driver.find_element(By.ID, "name")
        username_input.clear()
        username_input.send_keys("BARIBAL")
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()

        # create second player
        self.driver.switch_to.window(rys_handle)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        username_input = self.driver.find_element(By.ID, "name")
        username_input.clear()
        username_input.send_keys("RYS")
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()

        # create gameboard
        self.driver.execute_script(
            "window.open(arguments[0]);",
            self.live_server_url
        )
        observer_handle = self.driver.window_handles[2]
        self.driver.switch_to.window(observer_handle)

        button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".button"))
        )
        button.click()

        WebDriverWait(self.driver, 10).until(
            lambda d: d.find_element(By.CSS_SELECTOR, ".game-board").get_attribute("innerHTML").strip() != ""
        )

        players = self.driver.find_elements(By.CSS_SELECTOR, ".playerContainer .player")
        expected_names = {"BARIBAL", "RYS"}
        usernames_in_dom = {p.find_element(By.CSS_SELECTOR, ".username").text for p in players}
        assert expected_names <= usernames_in_dom, f"Missing players: {expected_names - usernames_in_dom}"
        assert usernames_in_dom <= expected_names, f"Unexpected players: {usernames_in_dom - expected_names}"

        self.assertEqual(get_player_state(self.driver, "BARIBAL").get("points"), 0)
        self.assertEqual(get_player_state(self.driver, "RYS").get("points"), 0)

        current_player = self.driver.find_element(By.CSS_SELECTOR, ".current").find_element(By.CSS_SELECTOR, ".username")
        print(current_player.text)

        cell = self.driver.find_element(By.CSS_SELECTOR, ".question-cell")
        cell.click()

        try:
            question_elem = WebDriverWait(self.driver, 3).until(
                EC.presence_of_element_located((By.ID, "questionText"))
            )
        except TimeoutException:
            question_elem = None

        if not question_elem:
            self.assertEqual(int(get_player_state(self.driver, current_player.text).get("points")), int(cell.text))
        else:
            self.driver.switch_to.window(rys_handle)
            button = self.driver.find_element(By.CSS_SELECTOR, ".button")
            button.click()

            self.driver.switch_to.window(baribal_handle)
            button = self.driver.find_element(By.CSS_SELECTOR, ".button")
            button.click()

            self.driver.switch_to.window(observer_handle)
            print(get_player_state(self.driver, "RYS").get("classes"))
            self.assertTrue("active" in get_player_state(self.driver, "RYS").get("classes"))
            self.assertFalse("active" in get_player_state(self.driver, "BARIBAL").get("classes"))

            # print(self.driver.page_source)


    # def test_user_click_updates_db_and_ui(self):
    #     # 1️⃣ Visit the subpage
    #     self.driver.get(f"{self.live_server_url}/myapp/user")
    #
    #     # Find and click the button (adjust selector)
    #     button = self.driver.find_element(By.ID, "activate-button")
    #     button.click()
    #
    #     # 2️⃣ Wait for the backend request to complete if needed
    #     # In React, you may have a spinner or change in button state
    #     WebDriverWait(self.driver, 5).until(
    #         lambda d: button.get_attribute("disabled") == "true"
    #     )
    #
    #     # 3️⃣ Check database changed
    #     self.assertTrue(UserAction.objects.filter(user_name="Test User", active=True).exists())
    #
    #     # 4️⃣ Visit the main page where the name should light up
    #     self.driver.get(f"{self.live_server_url}/myapp/")
    #
    #     # Wait for the UI to render the active user
    #     WebDriverWait(self.driver, 5).until(
    #         EC.text_to_be_present_in_element((By.ID, "active-users"), "Test User")
    #     )
    #
    #     # 5️⃣ Check the HTML
    #     page_html = self.driver.page_source
    #     self.assertIn("Test User", page_html)