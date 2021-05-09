---
title: Rsyslog server - Unlimited Connections
summary: Predictable price, central place and easy access.
---

# Rsyslog server - Unlimited Connections

::: danger Note
This product is intended to be used by Cloud professionals how have experience with the Linux OS, networking in the cloud and understand Cloud pricing.
:::

## What is this product about

We took the best what Rsyslog has to offer and create a product that gose beyond the default aspects of Rsyslog. We create a solution that can accept logs from any server or product that uses the Rsyslog standard over a secure connection while providing you the ability to give access to this logs to selected people over SSH.

We wanted to create a product that can help you secure your infrastructure even more by allowing you to lockdown remote access to the production servers, while still letting your team know what is going on those servers.

### Key aspects

- SSL is enabled by default to only accept logs over a secure channel.
- User access is over SSH using passwords, and limited only to the log folder.
- Logs are organized in separated folders using the remote host name.

### Example use cases

Your imagination is your limit, but here are some ideas that are worth considering.

- If you design your infrastructure where you don't give remote access to production server to anyone, you can stream the logs from those server in to our product for secure access to production logs - ideal for developers to debug potential issues
- Stream logs from docker containers by setting docker to pass the logs in to the host OS, which then can forward those messages to our product.

## Understand the basics

### Resilience

Our complementary CloudFormation is setup in a way that you have to provide a internal IP that you'd like the server to always use, this way even if the instance is temrinated for a server type chagne, the IP will remain the same and the clients will be able to reconnect without any chagnes.

### Security

Our product is configured to allow any server to send it logs. The data will be sent over an ecrypted connection, but there is not a credential system to prevent instances from sending data. For this reason, this product should not be acessible from the public Internet. It was designed to be deployed in a private subnet within a VPC, to allow only local servers to send it logs.

### Automation

Our product includes a bash script that when run on a client will autoamtically install and configure the Rsyslog service. The bash script will be uploaded to S3, and from there your cleitns can pull it and run it. Once the server instance is deployed, check the S3 bucket and review the script before using it on a client to make sure it is safe for your environment. If needed you can manaully configure wach client, or modify the script to fits your needs.

## Setup - Automated with CloudFormation

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-rsyslog&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/rsyslog-server.json"
  cloud-formation-url="https://github.com/0x4447-Paid-Products/0x4447_product_paid_rsyslog"
  product-url="https://aws.amazon.com/marketplace/pp/B07YN9CCV4"
/>

## Setup - Manual Approach

Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:

::: warning
Text written in capital-underscore notation needs to be replaced with real values.
:::

### Custom Role

You need to create an EC2 role to allow the Rsyslog Server to upload and get files from S3. Below is the Policy Document that you need add to create this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::BUCKET_NAME/*",
                "arn:aws:s3:::BUCKET_NAME"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3:HeadBucket"
            ],
            "Resource": "*"
        }
    ]
}
```

### Security Group

A default security group will automatically be created for you from the product configuration, but if you'd like to make one by hand, you'll need to have these ports open towards the instance:

- `22` over `TCP` for remote managment.
- `6514` over `TCP` for Rsyslog to take logs in.

### Bash Script for UserData

When you start to automate your instance, the whole process will provide you with a bucket name so that we can copy the auto generate certificate over to S3, which must be used by the client to send encrypted data to the server.

```bash
#!/bin/bash
S3_BUCKET=BUCKET_NAME
LOG_TTL=DAYS

echo S3_BUCKET=$S3_BUCKET >> /home/ec2-user/.env
echo LOG_TTL=$LOG_TTL >> /home/ec2-user/.env
```

Explanation:

1. Set the name of the S3 bucket where to upload the files.
1. Set the logs retention period in days.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be trigered if you stop and start the instance. You won't be able to later update the UserData and expect the configuration to change. If you need to make chagnes to the user data, you have two options:

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new instance, this time with the right UserData, and then copy over all the configuration files from the old instance to the new one.

### Connect to the server

Once the instance is up and running, get its IP and connect to the instance over SSH uisng the slected key at deployment time.

## Automatic Client Setup

Once the server is deployed correctly, you can configure your clients with the following `UserData` to setup everything automatically. This ensures that everything will be automatically set up at boot time.

```bash
#!/bin/bash

# Set the main variables, Replace S3_BUCKET_RSYSLOG with the name of the S3 bucket that you provided as a parameter to the Cloud Formation
BUCKET_RSYSLOG=S3_BUCKET_RSYSLOG
RSYLOG_INTERNAL_IP=RSYLOG_SERVER_INTERNAL_IP

# Copy the bash script which will configure the client
aws s3 cp s3://$BUCKET_RSYSLOG/bash/rsyslog-client-setup.sh /home/ec2-user/rsyslog-client-setup.sh

# Make the script executable
chmod +x /home/ec2-user/rsyslog-client-setup.sh

# Configure the client to send the logs to the Rsyslog server
/home/ec2-user/rsyslog-client-setup.sh $RSYLOG_INTERNAL_IP
```

## User Management

By default we create a custom user group in the system called `rsyslog`. This makes it easier for you to add developers as individual users to access the logs. Developers can then freely look at the logs without having access to the whole system.

### How to create a user

```bash
sudo useradd -g rsyslog USER_NAME
```

### How to set a password

```bash
sudo passwd USER_NAME
```

### How to delete a user

```bash
sudo userdel USER_NAME
```

### How to change a password

```bash
sudo passwd USER_NAME
```

## Where are my logs?

The logs can be found in the `/var/log/0x4447-rsyslog` folder. There you'll find folders for each client's sending logs. The client host name will be used for the folder names.

## Test The Setup

Be sure to test the server to make sure it behaves the way we advertise it; not becasue we don't belive it works correctly, but to make sure that you are confortable with the product and knows how it works, especially the resiliance mode.

Terminate the instance and start a new one with the correct UserData in order to see if everything works as expected after the instance booted.

## Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send it logs.
- Allow logging only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.
