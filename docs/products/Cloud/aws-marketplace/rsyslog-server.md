---
title: Rsyslog Server for AWS
summary: Rsyslog Server for developers for ease debugging.
---

# Rsyslog Server for AWS

Collecting logs is useful for many purposes, but over time it can become very expensive to use solutions from Cloud providers. Such solutions may seem easy and convenient, but when you start sending thousands of entries a day, your Cloud bill will dramatically inflate.

Of course, the features of a managed Cloud solution outweigh the price in some cases, but in others, you just want to see what the OS or your app is doing for easy debugging.

Our rsyslog server can help you centralize all your log collections in one place for a fixed price, regardless of how many logs you send. Our server is set up in such a way that the logs have a 30-day retention period and are organized in folders using the host name of the client server. Logs are all stored in the default folder path `/var/log` for easy access.

Bring down your costs now.

# Our Diferenciating Faktor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

We want to give you a good foundation for your ideas.

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
