const cron = require('node-cron');
// const crawlJob = require('./crawl');
const NoticeBoard = require('./noticeBoard').NoticeBoard;

// cron.schedule('*/30 * * * *', () => {
//     console.log('Running the crawl job...');
//     crawlJob();
// });

async function main() {
    // list = await crawlJob.scrapeData();
    // console.log(list);  
    const cseboard = new NoticeBoard("noticeBoard");
    const noticelist = await cseboard.fetchBoard();
    console.log(noticelist);

    
    await cseboard.searchForUpdates(noticelist);
    
    console.log("all done");
}


main()