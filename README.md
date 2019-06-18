# az-storage-action #

Github action to upload blob files to an Azure storage account.

**Note:** Project is still in progress. Readme might not be correct!

## Usage ##

Register the _az-storage-action_ in your `.github/main.workflow` according to the following.

```bash
workflow "Upload to Azure storage" {
  on = "push"
  resolves = ["blob-upload"]
}

action "blob-upload" {
  uses = "floriandorau/az-storage-action@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## Variables ##

In order to run the deployment, the action requires the following variables provided via the enviroment.

### Azure storage variables ###

| Option                | Description
| -------------------- | ---------------------------------------
| AZ_STORAGE_ACCOUNT   | Name of the Azure storage account
| AZ_STORAGE_TOKEN     | Access token of the storage account
| AZ_STORAGE_CONTAINER | Name of the container where the file should be uploaded

### Blob file variables ###

| Option    | Description
| --------- | ---------------------------------------
| BLOB_NAME | Desired name of the blob
| VERSION   | Version of the uploaded blob
| FILE_PATH | Path of the file to be uploaded.
