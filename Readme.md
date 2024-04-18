### wg-ass-datapoints

###### Compatibility is limited to X5 databases

This script aims to update the associated datapoints in an existing WinGuard X5 installation, an update while an active WinGuard Service/UI is running at the same time is not supported. Database file, CSV and this script have to be saved in the same path.
The script needs to be provided with an CSV-file, a example can be found in updateassdatapoints.csv, in the CSV only Datapoint-Codes are supported

Cases which are covered by this script:

- no datapoints were associated with the datapoint before
- datapoints were associated with the datapoint and the list shall be updated

This script also works with other properties set in the same field in the database as only the required JSON is updated
