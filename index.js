const sqlite3 = require("sqlite3");
const csv = require("csvtojson");

const db = new sqlite3.Database("./Core.db", (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        console.err("cant open db");
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }

    csv()
        .fromFile("./updateassdatapoints.csv")
        .then(async (jsonObj) => {
            assupdates = jsonObj;
            await Promise.all(
                assupdates.map(async (assupdate) => {
                    let assString = await getAssIdString(assupdate);
                    let JSONData = await getCurrentDataFromDB(assupdate?.code);
                    console.log("Updating ", JSONData, "with AssString", assString);
                    if (!JSONData) {
                        JSONData = {};
                    }
                    JSONData.associateddatapoints = assString;
                    let response = await updateAssInDB(
                        assupdate?.code,
                        JSON.stringify(JSONData),
                    );
                    console.log(response);
                }),
            );
            closeDb(db);
        });
});
let assupdates;
//TODO: Update the property on the datapoint with the created code
//TODO: get datapoint from db with the old data
//TODO: update data
//TODO: write new data to database

function getAssIdString(assupdate) {
    return new Promise(async (resolve, reject) => {
        let assIds = Buffer.alloc(0); // collecting all the assIds as a concatenated buffer

        await Promise.all(
            assupdate?.ass.map(async (ass) => {
                await getAssIdFromDb(ass)
                    .then((response) => {
                        let currentBufferlength = assIds.length;
                        assIds = Buffer.concat(
                            [assIds, response],
                            currentBufferlength + 16,
                        );
                    })
                    .catch((reason) => {
                        console.log(reason);
                        reject(reason);
                    });
            }),
        );

        let assString = new Buffer.from(assIds).toString("base64");
        console.log(assString);
        resolve(new Buffer.from(assIds).toString("base64"));
    });
}

function getAssIdFromDb(code) {
    return new Promise((resolve, reject) => {
        db.get(
            "select id from datapoint where code = $code",
            { $code: code },
            function (err, row) {
                if (err) {
                    console.log("Getting error " + err);
                    reject(err);
                } else if (row) {
                    resolve(row?.id);
                } else {
                    console.log("shits lit yo");
                    reject(err);
                }
            },
        );
    });
}

function getCurrentDataFromDB(code) {
    return new Promise((resolve, reject) => {
        db.get(
            "select obj_props from datapoint where code = $code",
            { $code: code },
            function (err, row) {
                if (err) {
                    console.log("Getting error(test) " + err);
                    reject(err);
                } else if (row) {
                    resolve(JSON.parse(row?.obj_props));
                } else {
                    console.log("shits lit yo");
                    reject(err);
                }
            },
        );
    });
}

function updateAssInDB(code, string) {
    return new Promise((resolve, reject) => {
        db.run(
            "update datapoint set obj_props = json($string) where code = $code",
            { $code: code, $string: string },
            function (runResult, err) {
                if (err) {
                    console.log("Getting error(update) " + err);
                    reject("Frigging errog", err);
                } else if (!runResult) {
                    resolve("successful");
                } else {
                    console.log("shits lit yo");
                    reject(runResult);
                }
            },
        );
    });
}

function closeDb(db) {
    db.close((err) => {
        if (err) {
            console.error(err);
        }
    });
}
