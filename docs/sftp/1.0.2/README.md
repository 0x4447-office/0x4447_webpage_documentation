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

Before launching an instance, you'll have to do some manual work to make everything work correctly. Please follow these steps in the order displayed here:

::: warning
Text starting with `PARAM_` needs to be replaced with real values.
:::

### Security Group

Our product configuration in the AWS Marketplace already have set all the ports that need to be open for the product to work. But if for whatever reason the correct Security Group is not created by AWS, bellow you can find a list and descriptions of all the ports needed:

- `22` over `TCP` for remote accessover SSH.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Our product needs a few dynamic values custom to you setup. To get access to this values our product checks for the content of this file `/home/ec2-user/.env`. By suing the UserData option that AWS provided for each EC2 Instance you can create a file like this with all the necessary values. Copy the bash script from bellow and set your custom values.

```bash
#!/bin/bash

echo SFTP_USER=PARAM_USER_NAME >> /home/ec2-user/.env
echo SFTP_PASS=PARAM_THE_PASSWORD >> /home/ec2-user/.env
echo EFS_ID=PARAM_THE_EFS_ID >> /home/ec2-user/.env
```

::: tip Explanation

1. Set the user name that will have access to the SFTP.
1. Set the passowrd for the user name from above.
1. Provide the EFS ID to be mounted in the system.

:::

::: warning Understand how UserData works

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be triggered if you stop and start the instance.

This means you won't be able to stop the instance, update the UserData and have the changes executed. If you need to make changes to the UserData, you have two options:

- Follow this [AWS solution](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Log-in to the instance, edit the `/home/ec2-user/.env` file, and restart the instance.
- Terminate the instance and redeploy the product from scratch

:::

## Final Thought

### Test the setup

Before you go in to production, make sure to test the product; not because we don't believe it, but to make sure that you get used to how it works.

### Backup Your Data

Make sure you regularly backup your EFS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/).

### Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Limit access to the server to just a fixed IP.
- Don't give root access to anyone but yourself.

## F.A.Q

These are some of the common solutions to problems you may run into:

### Not authorized for images

My CloudFormation stack failed with the following error `API: ec2:RunInstances Not authorized for images:...` in the Event tab.

::: tip Solution

You have to accept the subscription from the AWS Marketplace first, before you use our CloudFormation file.

:::

### The product is missbehaving

I did follow all the instruction from the documentation.

::: tip Solution

Check if the values entered in the UserData reached the instance itself.

```
sudo cat /var/lib/cloud/instance/user-data.txt
```

:::

### UserData seams ok...

The UserData reached the instacne, and yet the product is not acting as it should.

::: tip Solution

Use the following command to see if there were any errors douring the boot process.

```
sudo cat /var/log/messages | grep 0x4447
```

:::