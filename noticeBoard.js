// improved (allegedly) version of crawl.js lol

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const hash = require('object-hash');
const db = require('./db');

class NoticeBoard {
    constructor(boardName, url) {
        this.boardName = boardName;
        this.url = url;
    }

    async fetchBoard(url = "https://cse.cau.ac.kr/sub05/sub0501.php") {
        const noticeItemList = [];
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
    
        await page.goto(url, { waitUntil: 'domcontentloaded' });
    
        const content = await page.content();
        const $ = cheerio.load(content);
    
        const noticeElems = $("tr").slice(1);
    
        noticeElems.each((index, element) => {
            const chunk1 = $(element).find(".aleft");
            const title = chunk1.text().trim();
            const linkUrl = url + $(element).find("a").attr("href").trim();
            //console.log(title, linkUrl);
    
            const chunk2 = $(element).find(".pc-only");
            const publisher = chunk2.eq(1).text().trim();
            const publishDate = chunk2.eq(2).text().trim();
            //console.log(publisher, publishDate);
            
            const concat = title+linkUrl+publisher+publishDate;
            const uid = hash(concat);
            const noticeObj = { 
                "uid" : uid,
                "title" : title,
                "linkUrl" : linkUrl,
                "publisher" : publisher,
                "publishDate" : publishDate
            }
            noticeItemList.push(noticeObj);
        });
        
        await browser.close();
        return noticeItemList;
    }

    async searchForUpdates(noticeItemList) {
        const promisesList = noticeItemList.map((item) => {
            console.log(item.uid);
            return db.lookupNoticeEntry(item);
        });

        Promise.allSettled(promisesList)
            .then(results => { // (*)
                results.forEach((result) => {
                    //result.value 얻기 위해선
                    //엔트리가 존재하지 않았을때 fulfilled 나와야 한다.
                    // 그담에 이걸 push 보내고 -> DB에 저장한다.
                    if (result.status == "fulfilled") {
                        //send push to subscribers
                        console.log(` new item, ${JSON.stringify(result.value)}`);
                        // save to DB
                        console.log(this.boardName);
                        db.saveNoticeItem(this.boardName, result.value);
                    }
                    if (result.status == "rejected") {
                        console.log(` existing item, ${result.reason}`);
                    }
                });
            });

    }
}

module.exports = { 
    NoticeBoard
}