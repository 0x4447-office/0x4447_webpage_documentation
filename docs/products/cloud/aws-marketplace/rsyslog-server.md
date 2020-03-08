---
title: Rsyslog Server for AWS
summary: Rsyslog Server for developers for ease debugging.
---

# Rsyslog Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/rsyslog.png?raw=true">

Collecting logs is useful for many purposes, but over time it can become very expensive to use solutions from Cloud providers. Such solutions may seem easy and convenient, but when you start sending thousands of entries a day, your Cloud bill will dramatically inflate.

Of course, the features of a managed Cloud solution outweigh the price in some cases, but in others, you just want to see what the OS or your app is doing for easy debugging.

Our rsyslog server can help you centralize all your log collections in one place for a fixed price, regardless of how many logs you send. Our server is set up in such a way that the logs have a 30-day retention period and are organized in folders using the host name of the client server. Logs are all stored in the default folder path `/var/log` for easy access.

Bring down your costs now.

# Our Diferenciating Faktor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

We want to give you a good foundation for your ideas.

# 📚 Documentation

After the instance is up and running, you'll have some manual work to do. Bellow you'll find all the necessary details.

**WARNING**: text written in capital letters needs to be replaced with real values.

# Resilience

Our Rsyslog server has built in resiliance to make sure that even if the server gets terminated, it has all the capability for the same configuration to be applied to a new instacne. Meaning, if you provide a bucket in the EC2 UserData, we will store all the necessary data in this bucket to allow you to automate the whole client setup in the most autoamted way possible. This way the clietns can keep sending longs as soon as the server shows up.

A very important fact, the certificate relises in the internal IP of the server. This means that for the cert to work even after termiantion, the instacne needs to start with the same intenral (local) IP that was used to create the initial cert.

# Manual Work

### S3 Role

You need to create a EC2 role to allow the Rsyslog Server to upload and get the certificate and bash script for it to reuse the same cert on termination, and for your clients to autoamtically pull the cert when they boot up. Or start fresh and need a new Rsyslog configiration.

```
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

To send logs to the Rsyslog server you need to have the 6514 port open over TCP. Of coruse if you need to log in to the instacne you can also open port 22 for SSH. 

### Bash Script for UserData

When you start your instacne to autmate the whole process you should provide a bucket name so we cen copy over to S3 the auto generate certificate which must be used by the clietns to send encrypted data to the server.

```
#!/bin/bash
S3_BUCKET=BUCKET_NAME

echo S3_BUCKET=$S3_BUCKET >> /home/ec2-user/.env
```

# Clietns setup

Once the server is deployed correctly, you can configure your clietns with the following UserData to setup evrything autoamtically. This whay at boo time everything will be setup automatically for you.

```
#!/bin/bash

BUCKET_RSYSLOG=BUCKET_NAME
IP=RSYLOG_INTERNAL_IP

aws s3 cp s3://$BUCKET_RSYSLOG/cert/ca-cert.pem /tmp

sudo mv /tmp/ca-cert.pem /etc/ssl/ca-cert.pem

aws s3 cp s3://$BUCKET_RSYSLOG/bash/client-setup.sh /home/ec2-user/client-setup.sh

chmod +x /home/ec2-user/client-setup.sh

/home/ec2-user/client-setup.sh $IP
```

# Completelly Manual Work

If you don't want to autome things, you can always do the whole setup manually, and the followign instruction shows you how.

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

## Where are my logs?

The logs can be found in the `/var/log` folder. There, you'll find folders for each client sending logs. The client host name will be used for the folder names.
