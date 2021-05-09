---
title: SFTP Server - Single User Setup
summary: Ready to go SFTP server with infinite EFS storage.
---

# SFTP Server - Single User Setup

::: danger Note
This product is intended to be used by Cloud professionals how have experience with the Linux OS, networking in the cloud and understand Cloud pricing.
:::

## What is this product about

We took the simple idea of a SFTP server and added support for an AWS EFS drive out of the box.

The main idea is to allow only one user per server for those situations where securing the network is paramount, and each client using the SFTP must be siloed in its own environment.

There two good uses cases for this product, situations where you have to ingest an unknown amount of data since the EFS will grow alongside with the uploaded data. The second use case is a way to quickly check the content of a EFS drive that you are not sure anymore about. Provide the EFS ID at boot time, set the credentials, with 45 sec for the instance to boot and mount the drive, and you are in browsing the content of the drive.

### Key aspects

- Single user per server for better security, and organization.
- Unlimited storage for the uploaded data.
- Ability to easily browse pre-existing EFS drives.

### Example use cases

- Ingest vast amount of data for with a predictable price
- Allow financial institutions share data with you in a secure manner.
- Browse EFS drive that you might have in your account

## Additional details

### Resilience

Our product has built in resilience to make sure that you don't lose all your data, or lose connectivity by a changing IP. Our CloudFormation provides a quick way to be up end running with all that you need.

## Deploy Automatically

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-SFTP-Single-User&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/sftp-single-user-server.json"
  cloud-formation-url="https://s3.amazonaws.com/0x4447-drive-cloudformation/sftp-single-user-server.json"
  product-url="https://aws.amazon.com/marketplace/pp/B08R9BKR8Q"

/>

### What will be deployed

- 1x EC2 instance with 0x4447 custom AMI.
  - 1x IAM Role.
  - 1x IAM Policy.
  - 1x Security Group.
  - 1x Instance profile.
  - 1x Elastic IP.
  - 1x Elastic IP Association.
- 4x CloudWatch Alarms:
  - CPU Burst.
  - CPU Load.
  - EC2 Instance Recovery.
- 1x SNS Topic.
  - 1x SNS Pilicy.
- 1x CloudWatch Dashboard for instance overview.
- 1x EFS drive
  - 1x Mount target.
  - 1x Security group.
- 1x Backup
  - 1x Plan
  - 1x Role
  - 1x Selection
  - 1x Vault

## Deploy Manually

Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:

::: warning
Text written in capital-underscore notation needs to be replaced with real values.
:::

### Security Group

A default security group will be created for you automatically from the product configuration, but if you'd like to make one by hand, you need to have one of these ports open:

- `22` over `TCP` for remote accessover SSH.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Once you have everything setup, you can replace the place holder values with the real ID's. Make sure to replace the values that are in all CAPS that end with `_ID` with the real data.

```bash
#!/usr/bin/env bash

cat << EOF > /home/ec2-user/.env
SFTP_USER=USER_NAME
SFTP_PASS=THE_PASSWORD
EFS_ID=THE_EFS_ID
EOF
```

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be trigered if you stop and start the instance. If you choose to not enable resilience and want to skip the UserData script at boot time, then you won't be able to later update the UserData with the script and can't expect for the automation to take place. You have two options:

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new instance, this time with the right UserData, and then copy over all the configuration files from the old instance to the new one.

### Connect to the Server

Once the instance is up and running, get its IP and connect to the instance over SFTP using the credentials that you provided. You can still access the server using thie defualt `ec2-user` account and the SSH you selected at boot time.

## Test The Setup

Be sure to test the server to make sure it behaves the way we have described it; not because we don't belive it works correctly, but to make sure you are confortable with the product and know how it works, especially the resiliance mode.

### Test 1 - Termination and IP retention

Terminate the instance and start a new one with the correct UserData, and see if after the instance booted everything works as expected.

## Backup Your Data

Make sure you regularly backup your EFS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/) for EFS and snapshotting for EBS.

## Security Concerns

Bellow we give you a list of potential ideas worth considiering regarding security, but this list is not exhaustive; it is just a good starting point.

- Don't give root access to anyone but yourself.

## Troubleshooting tips

These are some of the common solutions to problems you may run into:

### My CloudFormation stack failed with the following error

```
API: ec2:RunInstances Not authorized for images:
```

**SOLUTION**

- Accept the subscription for this image on AWS marketplace and then re-launch your stack.

### The product is not behaving as expected

When the server got deployed after following the documentation the prodcut is not acting as documented.

**SOLUTION**

Forst check the user-data file, to see if what you entered while seting up the deployment actually ended up in the file. What you typed in the AWS should be represented in the file bellow.

```
cat /var/lib/cloud/instance/user-data.txt
```

If this looks OK, the next thing would to display the system logs and look for errors.

```
cat /var/log/messages
```
