---
title: SFTP Server for AWS
summary: Single user SFTP with infinite storage.
---

# SFTP Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/sftp.png?raw=true">

We cutely call this product the Ingestor because it is a single account SFTP that takes no time and not configuration to setup. You are up and running with a server that can accept infinite amount of data thanks to the attached EFS drive in few minutes.

Our product has also resilience built in, meaning that you can change the instance type depending on your needs and not lose any data, since all the account credentials are tied to the EFS drive itself. So your data always has the same SFTP account. 

The server is configured thought the EC2 UserData. If you provide the user name, password and a EFS ID. You won’t even have to access the instance to do any configuration. Once the server is booted and the configuration finishes working, you will be ready to go to ingest data. 

# 📍 Our Differentiating Factor

We also want to let you know that this is not a regular product. What we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. So, if we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

Our goal is to provide you with the right foundation for your company.

# 📜 Understand the basics

### Resilience

Our product has built in resilience to make sure that you don't lose all your data, or lose connectivity by a changing IP. For this to work, you'll need to allocate an Elastic IP and create an EFS Drive. Also, take note of the IDs that you'll get so that you can use them in the EC2 UserData section.

# 🗂 CloudFormation

<a target="_blank" href="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-Samba&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/sftp-server.json">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"></a>

We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to check the CloudFormation yourself, follow [this link](https://github.com/0x4447-Paid-Products/0x4447_product_paid_sftp).

Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the stack by hand, from this point on you'll find the manual on how to do so.

---

# 📚  Manual

Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:

**WARNING**: text written in capital letters needs to be replaced with real values.

### Custom Role

Before you can set the UserData, you have to attach a Role to the Instance with a Policy that has this Document:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "ec2:AssociateAddress",
			"Resource": "*"
		}
	]
}
```

This Policy Document will give the Instance the ability to attach the Elastic IP to itself. The `"Resource": "*"` is stated this way intentionally, and the `AssociateAddress` actions is not resource specific.

### Security Group

A default security group will be created for you automatically from the product configuration, but if you'd like to make one by hand, you need to have one of these ports open towards the instance:

- `22` over `TCP` for remote managment.
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

Once the instance is up and running, get its IP and connect to the instance over SSH using the credentials that you provided. You can still access the server using thie defualt `ec2-user` account and the SSH you selected at boot time.

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we have described it; not because we don't belive it works correctly, but to make sure you are confortable with the product and know how it works, especially the resiliance mode.

## Test 1 - Termination and IP retention

Terminate the instance and start a new one with the correct UserData, and see if after the instance booted everything works as expected.

# 💾 Backup Your Data

Make sure you regularly backup your EFS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/) for EFS and snapshotting for EBS.

# 🔔 Security Concerns

Bellow we give you a list of potential ideas worth considiering regarding security, but this list is not exhaustive; it is just a good starting point.

- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our products, go to our [support page](https://support.0x4447.com/).

### Troubleshooting tips

These are some of the common solutions to problems you may run into:

#### My CloudFormation stack failed with the following error

```
API: ec2:RunInstances Not authorized for images:
```

**SOLUTION**

- Accept the subscription for this image on AWS marketplace and then re-launch your stack.