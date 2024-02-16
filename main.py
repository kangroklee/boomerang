import requests
from bs4 import BeautifulSoup

URL = "https://cse.cau.ac.kr/sub05/sub0501.php"
page = requests.get(URL)
page.encoding = 'utf-8'

soup = BeautifulSoup(page.content, "html.parser")

notice_elems = soup.find_all("tr")[1:]
for elem in notice_elems:
    chunk1 = elem.find("td", class_="aleft")
    title = chunk1.text.strip()
    link_url = URL+elem.find("a")["href"].strip()
    print(title, link_url)

    chunk2 = elem.find_all("td", class_="pc-only")
    publisher = chunk2[1].text.strip()
    publish_date = chunk2[2].text.strip()
    print(publisher, publish_date)

