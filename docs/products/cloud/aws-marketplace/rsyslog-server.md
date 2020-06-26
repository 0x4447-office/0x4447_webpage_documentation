---
title: Rsyslog Server for AWS
summary: Rsyslog Server for developers for ease debugging.
---

# Rsyslog Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/rsyslog.png?raw=true">

Collecting logs is useful for many purposes, but over time it can become very expensive to use solutions from Cloud providers. Such solutions may seem easy and convenient at first, but when you start sending thousands of entries a day, your Cloud bill will dramatically inflate.

Of course, the benefits of a managed Cloud solution often outweigh the price in some cases, but sometimes you just want to quickly and easily see what the OS or your app is doing for easy debugging.

Our Rsyslog server can help you centralize all your log collections in one place for a fixed price, regardless of how many logs you send. Our server is set up in such a way that the logs have a 30-day retention period and are organized in folders using the host name of the client server. Logs are all stored in the default folder path `/var/log/0x4447-rsyslog` for easy access.

Not to mention security, the connection is encrypted by default. Our setup automatically creates a SSL certificate and stores it in S3 to make sure that you can send data in an encrypted way, while also allowing the system to pull the generated cert from S3. This way the cert stays the same across the operation, allowing your clients to keep sending logs securely to the server.

Use our Rsyslog server to bring down your costs now.

# 📍 Our Differentiating Factor

We also want to let you know that this is not a regular product. What we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. So, if we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

Our goal is to provide you with the right foundation for your company.

# 📜 Understand the basics

### Security

Our product is configured to allow any server to send it logs. The data will be sent over an ecrypted connection, but there is not a credential system to prevent instances from sending data. For this reason, this product should not be acessible from the public Internet. It was designed to be deployed in a private subnet within a VPC, to allow only local servers to send it logs. 

You can block traffic and instances using ACL rules at the VPC or instance level.

### Resilience

Our Rsyslog server has built in resilience to make sure that even if the server gets terminated, it has the capability to apply the same configuration to each new instance. Meaning, if you provide a S3 bucket in the EC2 UserData, we will store all the necessary data in this bucket to allow you to automate the whole client setup in the most efficient, automated way possible. This way your clients can keep sending logs as soon as the server shows up.

Another important component is that the certificate relies on the internal IP of the server. This means that for the cert to work even after termination, the instance needs to start with the same internal (local) IP that was used to create the initial cert.

# 🗂 CloudFormation

<a target="_blank" href="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-rsyslog&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/rsyslog-server.json">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"></a>

We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to check the CloudFormation yourself, follow [this link](https://github.com/0x4447-Paid-Products/0x4447_product_paid_rsyslog).

Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the stack by hand, from this point on you'll find the manual on how to do so.

---

# 📚  Manual

Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:

**WARNING**: text written in capital letters needs to be replaced with real values.

### Custom Role

You need to create an EC2 role to allow the Rsyslog Server to upload and get the certificate and bash script, for it - to reuse the same cert on termination, and for your clients to automatically pull the cert when they boot up. This is the Policy Document you need add create.

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

echo S3_BUCKET=$S3_BUCKET >> /home/ec2-user/.env
```

Explanation:

1. Set the name of the S3 bucket.
1. Append the S3 bucket anem to the .env file.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be trigered if you stop and start the instance. If you choose to not enable resilience and want to skip the UserData script at boot time, then you won't be able to later update the UserData with the script and can't expect for the automation to take place. You have two options: 

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new instance, this time with the right UserData, and then copy over all the configuration files from the old instance to the new one.

### Connect to the server

Once the instance is up and running, get its IP and connect to the instance over SSH uisng the slected key at deployment time.

# 🖥 Clients Setup

Once the server is deployed correctly, you can configure your clients with the following `UserData` to setup everything automatically. This ensures that everything will be automatically set up at boot time.

```bash
#!/bin/bash

# Set the main variables
BUCKET_RSYSLOG=BUCKET_RSYSLOG
RSYLOG_INTERNAL_IP=RSYLOG_INTERNAL_IP

# Pull the cert from S3
aws s3 cp s3://0x4447-marketplace-us-east-1-rsylog-v2/certs/ca-cert.pem /tmp

# move the cert in to the final destination
sudo mv /tmp/ca-cert.pem /etc/ssl/ca-cert.pem

# Copy the bash script which will configure the client
aws s3 cp s3://$BUCKET_RSYSLOG/bash/client-setup.sh /home/ec2-user/client-setup.sh

# Make the script executable
chmod +x /home/ec2-user/client-setup.sh

# Configure the client to send the logs to the Rsyslog server
/home/ec2-user/client-setup.sh $RSYLOG_INTERNAL_IP
```

# 👷‍♂️ User Management

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

# ✍️ Manual Client Setup

You can also setup a client manually if you can't use the EC2 UserData.

### Copy the SSL cert to your client server

1. Copy the cert to your local computer.

	`scp -i /path/to/key ec2-user@INSTANCE_IP:/etc/ssl/ca-cert.pem`

2. Upload the cert to the client server in the `tmp` folder.

	`scp -i /path/to/key ca-cert.pem ec2-user@INSTANCE_IP:/tmp`

3. Move the cert to the final location using `sudo` since SCP dose not support running commands using `sudo`.

	`ssh -i /path/to/key ec2-user@INSTANCE_IP sudo mv /tmp/ca-cert.pem /etc/ssl`

### How to configure the Rsyslog Client

1. Copy the script to your local computer.

	`scp -i /path/to/key ec2-user@INSTANCE_IP:/home/ec2-user/client-setup.sh`

2. Upload the script to the client server in the `tmp` folder.

	`scp -i /path/to/key client-setup.sh ec2-user@INSTANCE_IP:/tmp`

3. Once the file gets uploaded, make sure it's executable.

	`ssh -i /path/to/key ec2-user@INSTANCE_IP chmod +x /tmp/client-setup.sh`

4. For the last step, log in to your client server and run the script.

	`/tmp/client-setup.sh IP_OR_DNS_TO_THE_RSYSLOGSERVER`

# ❓ Where are my logs?

The logs can be found in the `/var/log/0x4447-rsyslog` folder. There you'll find folders for each client's sending logs. The client host name will be used for the folder names.

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we advertise it; not becasue we don't belive it works correctly, but to make sure that you are confortable with the product and knows how it works, especially the resiliance mode.

Terminate the instance and start a new one with the correct UserData in order to see if everything works as expected after the instance booted.

# 🔔 Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send it logs.
- Allow logging only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our products, go to our [support page](https://support.0x4447.com/).
