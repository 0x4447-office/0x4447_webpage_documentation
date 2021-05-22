---
title: SFTP Server - Single User Setup
summary: Ready to go SFTP server with infinite EFS storage.
---

# {{ $frontmatter.title }}

::: warning Note
This product is intended to be used by Cloud professionals who have experience with Linux, Cloud Networking, and understand Cloud pricing.
:::

## What is this product about

We took the simple idea of a SFTP server and extended it with a EFS drive, which converts the SFTP in to infinite sotrage.

Our solution removes the stress of running out of storeage forevere. The days are gone where you have to alockate huge ammount of storeage hoping it is going to be enough over time, while also monitoring if the storage is running out, and spend the time to migrate to another EBS drive.

We created a product that once is deployed, you can forget about it, and worring only about product updates while not loosing any data stored in the EFS drives.

### Key aspects

- Single user per server for better security, and organization.
- Unlimited storage for the uploaded data.
- Ability to easily browse pre-existing EFS drives.

### Example use cases

Your imagination is your limit, but here are some ideas that are worth considering:

- Ingest vast amount of data for with a predictable price.
- Allow financial institutions share data with you in a secure manner.
- Browse existing EFS drive that you might have in your account and forgot what is contained within them.

### Additional details

#### Resilience

Our product has built in resilience to make sure that you don't lose all your data, or lose connectivity by a changing IP. Our CloudFormation provides a quick way to be up end running with all that you need.

## Complete feature list

This section lists all the fetures of this product for easy referencing.

::: details Detailed list

**The  product itself**

1. Single user access using password.
1. No manual managment needed.
1. All the configuration is done through the EC2 Instance UserData section.
1. Infinite storage using a EFS drive

**Using our CloudFormation**

1. Alarm to check for CPU Bursts.
1. Alarm to check for CPU Load.
1. Alarm to autorecover the instance if it gets termianted suddenly by AWS due to hardware failiure.
1. SNS Topic for the alarms.
1. Same public IP for the server so even after termination the clients won't need reconfiguration.

:::

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

Before launching our product, you'll have to do some manual work to make everything work correctly. Please follow these steps (the steps are generally described since Cloud experiance is expected):

::: warning
Text starting with `PARAM_` needs to be replaced with real values.
:::

### Security Group

Our product configuration in the AWS Marketplace already have set all the ports that need to be open for the product to work. But if for whatever reason the correct Security Group is not created by AWS, bellow you can find a list and descriptions of all the ports needed:

- `22` over `TCP` for remote accessover SSH.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Our product needs a few dynamic values custom to your setup. To get access to this values our product checks for the content of this file `/home/ec2-user/.env`. By suing the UserData option that AWS provided for each EC2 Instance, you can create the `.env` file with ease by referencing the bash script from bellow - make sure to replace the placeholder values with your own ones.

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

This means you won't be able to stop the instance, update the UserData and have the changes executed. If you need to make changes to the UserData, you have the following options:

- Follow this [AWS solution](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Log-in to the instance, edit the `/home/ec2-user/.env` file, and restart the instance.
- Terminate the instance and redeploy the product from scratch.

:::

## The First Boot

The boot time of our product will be slower then if you started an instance from a clean AMI, this is due to our custom code that needs to be executed in order to prepare the product for you. This process can take few minutes longer then usual.

## Connecting to the Server

If you need to connect to the server: get it's IP, connect to the instance over SSH with the username `ec2-user`, while using the private key you selected at deployment time. If sucesfully connected, you should be greeted with a custom MOTD detailing the product information.

## Final Thought

### Test the setup

Before you go in to production, make sure to test the product; not because we don't believe it, but to make sure that you get used to how it works.

### Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Limit access to the server to just a fixed IP.
- Don't give root access to anyone but yourself.

### Backup Your Data

Make sure you regularly backup your drive(s). One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/).

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

## Support

If the above section didn't help you come up with a solution to your problem. Feel free to [get in touch with us](https://support.0x4447.com/), we'll try to help you out the best way we can.