const sqlite3 = require('sqlite3');
const csv=require('csvtojson');

const db = new sqlite3.Database("./Core.db", (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        console.err("cant open db")
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    
    csv().fromFile("./updateassdatapoints.csv")
    .then((jsonObj) => {
    assupdates = jsonObj;
    console.log(assupdates);
    assupdates.forEach((assupdate) => {
        updateAss(assupdate);
    })
    closeDb(db);
})
})
let assupdates;


function runQueries(db){
    db.all("SELECT * FROM datapoint;", function(err, rows) {
        if (err) {
            console.log("Getting error " + err);
        }
        else if(rows) {
            rows.forEach((row) => {
                if(JSON.parse(row?.obj_props)?.associateddatapoints) {
                    console.log(
                        JSON.parse(row?.obj_props), 
                        'has an ass-string\r\n',
                    );
                }
                else {
                    console.log((new Buffer.from(row?.id).toString("base64")), "has no associated datapoints ", "\r\n")
                }

            })
        }
    });
}

function updateAss(assupdate) {
    //TODO: get all ass datapoints and their id from the DB
    let assIds = Buffer.alloc(0); // collecting all the assIds as a concatenated string
    assupdate?.ass.forEach((ass) => {
        getAssIdFromDb(ass)
        .then(response => {
            let currentBufferlength = assIds.length;
            assIds = Buffer.concat([assIds, response], currentBufferlength + 16);
            console.log(assIds);
            
        })
        .catch(reason => {
            console.log(reason);
        });
    })
    //let assString = (new Buffer.from(assIds).toString("base64"));
    //console.log(assString);
    //TODO: convert all ids to the desired Format using concat and (new Buffer.from(row?.id).toString("base64"))
    //TODO: Update the property on the datapoint with the code to

}
function getAssIdFromDb(code) {
    return new Promise((resolve, reject) => {
        console.log(code);
        db.get("select id from datapoint where code = $code", {$code: code}, function(err, row) {
            if (err) {
                console.log("Getting error " + err);
                reject(err);
            }   
            else if(row) {
                resolve(row?.id);
            }
            else {
                console.log("shits lit yo")
                reject(err);
            }
        })
    })

    
}

function closeDb(db) {
    db.close((err) => {
        if(err) {
            console.error(err);
        }
    });
}
