import requests
from bs4 import BeautifulSoup

url = "https://www.snu.ac.kr/academics/undergraduate/colleges#"

response = requests.get(url)

if response.status_code == 200:
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    
    colleges = dict()

    html_colleges_wrap = soup.select_one('.colleges-wrap')
    html_colleges = html_colleges_wrap.select('.list-content')
    for college in html_colleges:
        college_name = college.select_one('.common-smalltitle').find(text=True)
        college_departments = college.select('.link-list > a')
        departments = []
        for department in college_departments:
            departments.append(department.text)
        colleges[college_name] = departments

    print(repr(colleges))
else : 
    print(response.status_code)