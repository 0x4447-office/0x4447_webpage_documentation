---
title: OpenVPN Server
summary: OpenVPN Server with unlimited users.
---

# OpenVPN Server

Collecting logs is useful for many things, but some time it's very expensive if you use managed Cloud solutions. It seams easy end convenient, but once you start sending thousands of entries a day, your Cloud bill will inflate dramatically for such a simple task. Of course there are use cases where the features of managed Cloud solutions outweigh the price, but in some cases you just want to see what the OS or your app is doing to debug issues.

We preconfigured an AMI with rsyslog to act as a log collection server and be the centralized place where you can get in, check the logs of all the clients, and find out the problem.

The AMI price is affordable and the total cost fixed, no matter how many logs you send.

The Rsyslog is setup in a way where the logs have a retention period of 30 days, and the logs are organized in folders using the host name of the client server. All the logs are stored in the default folder path `/var/log`

Once the server is deployed, give your developer the ssh key to access the instance, and let them debug.