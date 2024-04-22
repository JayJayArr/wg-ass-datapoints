## wg-ass-datapoints

###### Compatibility is limited to X5 databases

This tool aims to update the associated datapoints in an existing WinGuard X5 installation, an update while an active WinGuard Service/UI is running at the same time is not supported.

### Prerequisites:

- Database file, CSV and this script have to be saved in the same path.
- The script needs to be provided with an CSV-file, a example can be found in updateassdatapoints.csv, only Datapoint-Codes are supported in the CSV
- the format of the csv cannot be changed, more columns can be appended though
  start the

```
npm run start
```

- a windows.exe can be optained from the releases

### Remarks:

Cases which are covered by this script:

- no datapoints were associated with the datapoint before
- datapoints were associated with the datapoint and the list shall be updated

This tool also works with other properties set in the same field in the database as only the required JSON is updated
