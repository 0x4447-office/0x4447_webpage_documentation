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

# Our Differentiating Factor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

We want to give you a good foundation for your ideas.

# Resilience

Our Rsyslog server has built in resilience to make sure that even if the server gets terminated, it has all the capability for the same configuration to be applied to a new instance. Meaning, if you provide a S3 bucket in the EC2 UserData, we will store all the necessary data in this bucket to allow you to automate the whole client setup in the most automated way possible. This way the clients can keep sending longs as soon as the server shows up.

A very important fact, the certificate relies in the internal IP of the server. This means that for the cert to work even after termination, the instance needs to start with the same internal (local) IP that was used to create the initial cert.

# 📚 Documentation

Not everything is automated, and here is all the work that you need to do yourself to create a healthy instance.

## S3 Role

You need to create a EC2 role to allow the Rsyslog Server to upload and get the certificate and bash script, for it - to reuse the same cert on termination, and for your clients to automatically pull the cert when they boot up. 

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

### Security group

To send logs to the Rsyslog server you need to have the `6514` port open over `TCP`. Of course if you need to log in to the instance you can also open port `22` for `SSH`. 

### Bash Script for UserData

When you start your instance to automate the whole process you should provide a bucket name so we can copy over to S3 the auto generate certificate which must be used by the clients to send encrypted data to the server.

```bash
#!/bin/bash
S3_BUCKET=BUCKET_NAME

echo S3_BUCKET=$S3_BUCKET >> /home/ec2-user/.env
```

At boot time, our product will check if a cert is already present in the bucket, and if so, we will download it instead of creating it again.

### Add users to the server

By default we create a custom user group in the system called `rsyslog`. This makes it easier for you to add developers as individual users to access the logs. This way they can freely look at the logs without having access to the whole system.

How to add a user:

```bash
sudo useradd -g rsyslog USER_NAME
```

How to set the password to the new user:

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
	
	# Support 
	
	If you have any questions regarding our product, go to our [support page](https://support.0x4447.com), and fill the form.