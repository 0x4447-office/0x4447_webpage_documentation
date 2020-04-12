---
title: Rsyslog Server for AWS
summary: Rsyslog Server for developers for ease debugging.
---

# Rsyslog Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/rsyslog.png?raw=true">

Collecting logs is useful for many purposes, but over time it can become very expensive to use solutions from Cloud providers. Such solutions may seem easy and convenient at first, but when you start sending thousands of entries a day, your Cloud bill will dramatically inflate.

Of course, the features of a managed Cloud solution outweigh the price in some cases, but in others, you just want to see what the OS or your app is doing for easy debugging.

Our Rsyslog server can help you centralize all your log collections in one place for a fixed price, regardless of how many logs you send. Our server is set up in such a way that the logs have a 30-day retention period and are organized in folders using the host name of the client server. Logs are all stored in the default folder path `/var/log/0x4447-rsyslog` for easy access.

Not to mention security. Our setup creates a SSL certificate automatically, and stores it in S3 to make sure that you can send data in an encrypted way, while also allowing the system to pull the generated cert from S3. This way the cert stays the same across the operation allowing your clients to keep sending logs securely to the server.

Bring down your costs now.

## Our Differentiating Factor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

# 📜 Understand the basics

## Security

Our product is configured to only allow Guest access, meaning there are no user accounts. This makes is very straight forward for users to mount the drive and share data across the company. 

But this means that **you can't have the server deployed in a public network with a public IP**. You need to deploy the server in a private network, and use a VPN server to access it. 

This way the Samba-server can be accessed only thought a VPN connection. If you are looking for an affordable VPN server we can recommend the [openvpn-server](https://aws.amazon.com/marketplace/pp/B0839R5C7Z).

## Resilience

Our Rsyslog server has built in resilience to make sure that even if the server gets terminated, it has all the capability for the same configuration to be applied to a new instance. Meaning, if you provide a S3 bucket in the EC2 UserData, we will store all the necessary data in this bucket to allow you to automate the whole client setup in the most automated way possible. This way the clients can keep sending longs as soon as the server shows up.

A very important fact, the certificate relies in the internal IP of the server. This means that for the cert to work even after termination, the instance needs to start with the same internal (local) IP that was used to create the initial cert.

# 📚 Documentation

Before launching an instance you'll have to do some manual work to make everything work correctly. Please follow this steps in order displayed here.

**WARNING**: text written in capital letters needs to be replaced with real values.

## S3 Role

You need to create a EC2 role to allow the Rsyslog Server to upload and get the certificate and bash script, for it - to reuse the same cert on termination, and for your clients to automatically pull the cert when they boot up. This is the Poliyc Document you need add create.

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

## Security group

To send logs to the Rsyslog server you need to have the `6514` port open over `TCP`. Of course if you need to log in to the instance you can also open port `22` for `SSH`. 

## Bash Script for UserData

When you start your instance to automate the whole process you should provide a bucket name so we can copy over to S3 the auto generate certificate which must be used by the clients to send encrypted data to the server.

```bash
#!/bin/bash
S3_BUCKET=BUCKET_NAME

echo S3_BUCKET=$S3_BUCKET >> /home/ec2-user/.env
```

At boot time, our product will check if a cert is already present in the bucket, and if so, we will download it instead of creating it again. By doing this we ensure that the server settings are alwasy the same.

# 📞 Connect to the server

Once the instance is up and running, get it's IP and connect to the instance over SSH uisng the slected key at deployment time.

# 👷‍♂️ User Management

By default we create a custom user group in the system called `rsyslog`. This makes it easier for you to add developers as individual users to access the logs. This way they can freely look at the logs without having access to the whole system.

## How to create a user

```bash
sudo useradd -g rsyslog USER_NAME
```

## How to set a password

```bash
sudo passwd USER_NAME
```

## How to delete a user

```bash
sudo userdel USER_NAME
```

## How to change a password

```bash
sudo passwd USER_NAME
```

# Clients Setup

Once the server is deployed correctly, you can configure your clients with the following `UserData` to setup everything automatically. This way at boot time everything will be setup automatically for you.

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

# Where are my logs?

The logs can be found in the `/var/log/0x4447-rsyslog` folder. There, you'll find folders for each client sending logs. The client host name will be used for the folder names.

# Completely Manual Work

If you don't want to automate the whole process, you can always do the whole setup manually, and the following instruction shows you how.

## Copy the SSL cert to your client server

1. Copy the cert to your local computer.

	`scp -i /path/to/key ec2-user@INSTANCE_IP:/etc/ssl/ca-cert.pem`

2. Upload the cert to the client server in the `tmp` folder.

	`scp -i /path/to/key ca-cert.pem ec2-user@INSTANCE_IP:/tmp`

3. Move the cert I the final location using `sudo` since SCP dose not support running commands using `sudo`.

	`ssh -i /path/to/key ec2-user@INSTANCE_IP sudo mv /tmp/ca-cert.pem /etc/ssl`

## How to configure the Rsyslog Client

1. Copy the script to your local computer.

	`scp -i /path/to/key ec2-user@INSTANCE_IP:/home/ec2-user/client-setup.sh`

2. Upload the script to the client server in the `tmp` folder.

	`scp -i /path/to/key client-setup.sh ec2-user@INSTANCE_IP:/tmp`

3. Once the file gets uploaded, we need to make it executable.

	`ssh -i /path/to/key ec2-user@INSTANCE_IP chmod +x /tmp/client-setup.sh`

4. As the last step we have to log in to your client server and run the script.

	`/tmp/client-setup.sh IP_OR_DNS_TO_THE_RSYSLOGSERVER`

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we advertise it, not becasue we don't belive it works correctly, but to make sure you are confortable with the product and knows how it works. Especially the resiliance mode.

Termiante the instace and start a new one with the correct UserData, and see if after the instacne booted everything works as expected.

# 🔔 Security Concerns

Bellow we give you a list of potentail ideas worth considiering regarding security, but this list dose not exausts all posobilities. It is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send logs to it.
- Allow logging only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our product, go to our [contact page](https://0x4447.com/contact.html), and fill the form.