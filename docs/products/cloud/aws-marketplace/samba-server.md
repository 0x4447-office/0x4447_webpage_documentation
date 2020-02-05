---
title: Samba Server for AWS
summary: Mount dozens of drive under one Samba server.
---

# Samba Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/samba.png?raw=true">

This is a Samba server which has the ability to mount multiple drive at once, and have them all available at once.

Technically: You can attach an infinite amount of EFS drives, and up to 25 EBS ones. There is also no limits on how many active connections you can have.

This means that the limiting factor is the performance of the server itself. If your user starts complaining about the connection being too slow, or you see the CPU time is above 75 percent, just change the instance type to a bigger one to accommodate the new traffic and users.

The setup also has built-in resilience; as long as you provide the same UserData for the new EC2 instance, our product will mount all those drives automatically. This way you have no data los, and your user can re-connect as soon as the instance is up and running. Just remember to set the same fixed local IP to the instance.

Share your drives now.

## Our Differentiating Factor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

Our goal is to give you a good foundation for your company.

# 📜 Understand the basics

## Security

Our product is configured to only allow Guest access, meaning there are no user accounts. This makes is very straight forward for users to mount the drive and share data across the company. 

But this means that **you can't have the server deployed in a public network with a public IP**. You need to deploy the server in a private network, and use a VPN server to access it. 

This way the Samba-server can be accessed only thought a VPN connection. If you are looking for an affordable VPN server we can recommend the [openvpn-server](https://aws.amazon.com/marketplace/pp/B0839R5C7Z).

## Resilience

If you want to always be able to connect the same internal IP, make sure to start the EC2 Instance and setting the local IP to always be the same. This way even if the instance gets terminated, and you recreate it, the IP will stay the same and your user won't have to change anything in their configuration.

# 📚 Documentation

Before launching an instance you'll have to do some manual work to make everything work correctly.

### Custom Role

Create a new Role for the instance that will carry our product.   The role must be for the `EC2` resource, it needs to have attached the `AmazonEC2ReadOnlyAccess` managed policy, and have this inline policy 

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AttachVolume",
                "ec2:DetachVolume",
                "ec2:DescribeVolumes",
                "elasticfilesystem:List*",
                "elasticfilesystem:Describe*",
                "elasticfilesystem:ClientMount"
            ],
            "Resource": "*"
        }
    ]
}
```

### Security Group

A default security group will be created for you automatically from the product configuration, but if you'd like to make one by hand, you need to have this ports open towards the instance:

- 2049 over TCP for connectivity to EFS
- 445 over TCP for connectivity to Samba

Opening port 22 is unnecessary since this product is unmanaged, meaning there is no manual work needed in the OS itself. 

### Bash Script for UserData

Once you have everything setup. You can replace the place holder values with the real ID's. Make sure to replace the values in all CAPS that ends with `_ID`, with the real data.

```bash
#!/usr/bin/env bash

cat << EOF > /home/ec2-user/.env
PERSISTENCE=(EFS_ID EBS_ID MORE_ID)
EOF
```

Explanation:

1. Create a .env file in the home folder of the main user
1. Write in the file the content till EOF, which is one variable with an `array` of IDs. Meaning you can add `one` or `multiple` id's, and mix EBS drives and EFS ones.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, when the Instance starts for the first time. Meaning it won't be triggered if you stop and start the instance. But there are two work arounds:

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/).
- Or you start a new Instance with updated UserData.

# 💪 Connect to the server

Once the instance is up and running in your private network, and you are connected to the VPN, you can mount the network drive by using the local IP of the instance, and choose Guest access.

# 🚨 Before you go in production

Be sure to test the server to make sure it behaves the way we advertise it, not because we don't believe it works correctly, but to make sure you are comfortable with the product and knows how it works. Especially the resilience mode.

Make sure copy some data to the drives, then terminate the instance, start a new one, and after re-connecting to the server, you should have the copied data still present.

# 💾 Backup your data

Make sure you regularly backup your EFS and EBS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/) for EFS, and snapshotting for EBS.
