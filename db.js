const mongoose = require('mongoose');
require('dotenv').config();

const subscriptionSchema = require('./subscriptionSchema');
const noticeSchema = require('./noticeSchema')

const uri = process.env.MONGODB_ATLAS_URI;

async function saveUser(userSubscriptionObj) {
    try {
        await mongoose.connect(uri);
        //compile model from schema
        const Subscription = mongoose.model('Subscription', subscriptionSchema); //.model(nameOfCollection, Schema)

        const user = new Subscription(userSubscriptionObj);

        //save to DB
        await user.save();

        //if connection to DB and saving to DB is OK:
        return 0;

    } catch(e) {
        console.error(e);
    }
}

async function getAllUsers() {
    try {
        await mongoose.connect(uri);
        //compile model from schema
        const Subscription = mongoose.model('Subscription', subscriptionSchema); //.model(nameOfCollection, Schema)

        const subscriptions = await Subscription.find({});
        console.log(subscriptions);
        return subscriptions;
    } catch (err) {
        console.error(err);
    }
}

async function getMine() {
    try {
        await mongoose.connect(uri);
        const Subscription = mongoose.model('Subscription', subscriptionSchema);

        const mySub = await Subscription.find({"_id": "65657a891a043b38e4f50013"});
        console.log(mySub[0]);
        return mySub[0];
    } catch(err) {
        console.error(err);
    }
}

// async function lookupNoticeEntry(elem) {
//     try {
//         await mongoose.connect(uri);
//         const Notice = mongoose.model('noticeBoard', noticeSchema);

//         const promise = await Notice.find({"uid" : elem.uid}).exec();

//         console.log(promise.length)
//         return promise;
//     } catch(err) {
//         console.error(err);
//     }
// }

function lookupNoticeEntry(elem) {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(uri);
            const Notice = mongoose.model('noticeBoard', noticeSchema);

            const matchingEntry = await Notice.findOne({"uid": elem.uid});

            if (matchingEntry) {
                reject('Notice entry exists');
            } else {
                // 이제는 matchingEntry가 없을경우 elem을 보내준다.
                resolve(elem);
            }
        } catch(err) {
            console.error(err);
            reject(err); // Reject the promise in case of an error
        }
    });
}

async function saveNoticeItem(collectionName='noticeBoard', noticeObj) {
    try {
        await mongoose.connect(uri);
        //compile model from schema
        const Notice = mongoose.model('noticeBoard', noticeSchema, collectionName); //.model(nameOfCollection, Schema)
        const notice = new Notice(noticeObj);
        //save to DB
        await notice.save();
    } catch(e) {
        console.error(e);
    }
}

async function packSandwich(id) {
    try {
        await mongoose.connect(uri);
        const Subscription = mongoose.model('Subscription', subscriptionSchema);
        const promise = Subscription.findOne({"_id": id}).exec();
        return promise;

    } catch(e) {
        console.error(e, "packSandwich has an error fix it");
    }
} 


// Close the MongoDB connection when the application is terminating
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = {
    saveUser,
    getAllUsers,
    getMine,
    lookupNoticeEntry,
    saveNoticeItem
};