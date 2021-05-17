---
title: Rsyslog server - Unlimited Connections
summary: Predictable price, central place and easy access.
---

# {{ $frontmatter.title }}

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

## Additional details

### Resilience

Our complementary CloudFormation is setup in a way that you have to provide a internal IP that you'd like the server to always use, this way even if the instance is temrinated for a server type chagne, the IP will remain the same and the clients will be able to reconnect without any chagnes.

### Security

Our product is configured to allow any server to send it logs. The data will be sent over an ecrypted connection, but there is not a credential system to prevent instances from sending data. For this reason, this product should not be acessible from the public Internet. It was designed to be deployed in a private subnet within a VPC, to allow only local servers to send it logs.

### Automation

Our product includes a bash script that when run on a client will autoamtically install and configure the Rsyslog service. The bash script will be uploaded to S3, and from there your cleitns can pull it and run it. Once the server instance is deployed, check the S3 bucket and review the script before using it on a client to make sure it is safe for your environment. If needed you can manaully configure wach client, or modify the script to fits your needs.

## Deploy Automatically

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-rsyslog&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/rsyslog-server.json"
  cloud-formation-url="https://s3.amazonaws.com/0x4447-drive-cloudformation/rsyslog-server.json"
  product-url="https://aws.amazon.com/marketplace/pp/B07YN9CCV4"
/>

### What will be deployed

- 1x EC2 instance with 0x4447 custom AMI.
  - 1x IAM Role.
  - 1x IAM Policy.
  - 1x Security Group.
  - 1x Instance profile.
- 4x CloudWatch Alarms:
  - CPU Burst.
  - CPU Load.
  - Disk Usage.
  - EC2 Instance Recovery.
- 1x SNS Topic.
  - 1x SNS Pilicy.
- 1x CloudWatch Dashboard for instance overview.
- 1x S3 Bucket to store external scripts.

## Deploy Manually

Before launching an instance, you'll have to do some manual work to make everything work correctly. Please follow these steps in the order displayed here:

::: warning
Text starting with `PARAM_` needs to be replaced with real values.
:::

### Security Group

Our product configuration in the AWS Marketplace already have set all the ports that need to be open for the product to work. But if for whatever reason the correct Security Group is not created by AWS, bellow you can find a list and descriptions of all the ports needed:

- `22` over `TCP` for remote managment.
- `6514` over `TCP` for Rsyslog to take logs in.

### Bash Script for UserData

Our product needs a few dynamic values custom to you setup. To get access to this values our product checks for the content of this file `/home/ec2-user/.env`. By suing the UserData option that AWS provided for each EC2 Instance you can create a file like this with all the necessary values. Copy the bash script from bellow and set your custom values.

```bash
#!/bin/bash

echo S3_BUCKET=PARAM_STRING >> /home/ec2-user/.env
echo LOG_TTL=PARAM_INTEGER >> /home/ec2-user/.env
```

::: tip Explanation

1. Set the name of the S3 bucket where to upload the files.
1. Set the logs retention period in days.

:::

::: warning Understand how UserData works

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be triggered if you stop and start the instance.

This means you won't be able to stop the instance, update the UserData and have the changes executed. If you need to make changes to the UserData, you have two options:

- Follow this [AWS solution](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Log-in to the instance, edit the `/home/ec2-user/.env` file, and restart the instance.
- Terminate the instance and redeploy the product from scratch

:::

### Custom Role

Our software uses a S3 bucket to copy over the custom client configuration script which is generated at boot time with all the necessary details to setup the Rsyslog client in a way where the client server knows where and how to send the logs to our product. To copy this file to S3 the instance itself needs a custom Role with S3 access for this to happen. Bellow you can find the role that you have to create for your EC2 Instance.

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
                "arn:aws:s3:::PARAM_BUCKET_NAME/*",
                "arn:aws:s3:::PARAM_BUCKET_NAME"
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

## Automatic Client Setup

Once the server (our product) is deployed correctly, you can configure your clients with the following commands (makes sure to replace the placeholders with real values, and make sure the EC2 instances you run this commands have access to the S3 bucket).

This commands can be executed:

- by hand
- by placing them in the EC2 Instance UserData
- by executing them remotely through AWS Systems Manager

```bash
#!/bin/bash

aws s3 cp s3://PARAM_BUCKET_RSYSLOG/bash/rsyslog-client-setup.sh /home/ec2-user/rsyslog-client-setup.sh

chmod +x /home/ec2-user/rsyslog-client-setup.sh

/home/ec2-user/rsyslog-client-setup.sh PARAM_RSYLOG_SERVER_IP
```

::: tip Explanation

1. Copy the bash script which will configure the client
1. Make the script executable
1. Configure the client to send the logs to the Rsyslog server

:::

## User Management

Since the idea of our product is to allow others to have easy access to remote servers logs, we made a custom group called `rsyslog`. This way you can create new users that when attached to this group will have only access to the remote logs.

Bellow you can find a reminder how to manage password users under Linux.

### How to create a user

```bash
sudo useradd -g rsyslog PARAM_USER_NAME
```

### How to set a password

```bash
sudo passwd PARAM_USER_NAME
```

### How to delete a user

```bash
sudo userdel PARAM_USER_NAME
```

### How to change a password

```bash
sudo passwd PARAM_USER_NAME
```

## Logs location

The logs can be found in the `/var/log/0x4447-rsyslog` folder. Inside it you will find more folder named after the remote hostname.

## Final Thought

### Test the setup

Before you go in to production, make sure to test the product; not because we don't believe it, but to make sure that you get used to how it works.

### Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send it logs.
- Allow logging only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
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