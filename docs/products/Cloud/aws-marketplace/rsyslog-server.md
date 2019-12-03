---
title: Rsyslog Server for AWS
summary: Rsyslog Server for developers for ease debugging.
---

# Rsyslog Server for AWS

Collecting logs is useful for many things, but some time it's very expensive if you use managed Cloud solutions. It seams easy end convenient, but once you start sending thousands of entries a day, your Cloud bill will inflate dramatically for such a simple task. Of course there are use cases where the features of managed Cloud solutions outweigh the price, but in some cases you just want to see what the OS or your app is doing to debug issues.

We preconfigured an AMI with rsyslog to act as a log collection server and be the centralized place where you can get in, check the logs of all the clients, and find out the problem.

The AMI price is affordable and the total cost fixed, no matter how many logs you send.

The Rsyslog is setup in a way where the logs have a retention period of 30 days, and the logs are organized in folders using the host name of the client server. All the logs are stored in the default folder path `/var/log`

Once the server is deployed, give your developer the ssh key to access the instance, and let them debug.

# Documentation

After the instance is up and running, you'll have some manual work to do. Bellow you'll find all the necessary details.

**WARNING**: text written in capital letters needs to be replaced with real values.

The main frame of reference to be aware off, is that you'll use your computer as a proxy for the following operations.

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