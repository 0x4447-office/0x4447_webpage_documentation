---
title: Samba Server for AWS
summary: Mount dozens of drive under one Samba server.
---

# Samba Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/samba.png?raw=true">

# 📍 Our Differentiating Factor

We also want to let you know that this is not a regular product. What we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. So, if we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

Our goal is to provide you with the right foundation for your company.

# 📜 Understand the basics

### Security

Our product is configured to only allow guest access, meaning there are no user accounts. This makes it very straight forward for users to mount the drive and share data across the company. 

But this also means that **you can't have the server deployed on a public network with a public IP**. You need to deploy the server in a private network and use a VPN server to access it. By default we do set a public IP using the CloudFormation file, for you to access the server to manage it if needed, but the default setting for the security group is not to have the SSH port open. This way there is no remote access to the public, but the server is always set to be accesed publicly if needed.

This way the Samba-server can be accessed only through a VPN connection. If you are looking for an affordable VPN server, we recommend the [openvpn-server](https://aws.amazon.com/marketplace/pp/B0839R5C7Z).

### Resilience

If you want to always be able to connect the same internal IP, make sure to start the EC2 Instance and keep the same local IP settings. This way, even if the instance gets terminated and you have to recreate it, the IP will stay the same and your user won't have to change any of their configurations.

# 🗂 CloudFormation

<a target="_blank" href="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-Samba&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/samba-server.json">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"></a>

We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to check the CloudFormation yourself, follow [this link](https://github.com/0x4447-Paid-Products/0x4447_product_paid_samba).

Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the stack by hand, from this point on you'll find the manual on how to do so.

---

# 📚  Manual

Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:

**WARNING**: text written in capital letters needs to be replaced with real values.

### Custom Role

Create a new role for the instance that will carry our product. The role must be for the `EC2` resource; it needs to have attached the `AmazonEC2ReadOnlyAccess` managed policy and have this inline policy: 

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AttachVolume",
                "ec2:DetachVolume",
                "ec2:DescribeVolumes"
            ],
            "Resource": "*"
        }
    ]
}
```

### Security Group

A default security group will be automatically created for you from the product configuration, but if you'd like to make one by hand, you need to have this port open towards the instance:

- `445` over `TCP` for connectivity to Samba

Opening port `22` is unnecessary since this product is unmanaged, meaning there is no manual input needed in the OS itself. 

### Bash Script for UserData

Once you have everything setup, you can replace the place holder values with the real ID's. Make sure to replace the values that are in all CAPS that end with `_ID` with the real data.

```bash
#!/usr/bin/env bash

cat << EOF > /home/ec2-user/.env
DRIVES=EBS_ID,EBS_ID,EBS_ID,EBS_ID,ETC...
HOSTNAME=THE_NAME_OF_THE_HOST
EOF
```

Explanation:

1. Set the variable with a list (separated by commas) of EBS drives to be mounted - max 25.
1. Set the hostname of the instance, so you you can name your server.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be trigered if you stop and start the instance. If you choose to not enable resilience and want to skip the UserData script at boot time, then you won't be able to later update the UserData with the script and can't expect for the automation to take place. You have two options: 

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new instance, this time with the right UserData, and then copy over all the configuration files from the old instance to the new one.

### Connect to the Server

Once the instance is up and running, get its IP and connect to the instance over SSH using the slected key at deployment time.

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we have described it; not because we don't belive it works correctly, but to make sure you are confortable with the product and know how it works, especially the resiliance mode.

## Test 1 - Viewing shares from your Ubuntu Client

```
# sudo apt install smbclient
# smbclient -L \\<samba-local-ip>\
Enter WORKGROUP\ubuntu's password:

        Sharename       Type      Comment
        ---------       ----      -------
        vol-02df7017709d5ec45 Disk
        IPC$            IPC       IPC Service (samba_server)
```

## Test 2 - Mounting the Samba Drive from your Ubuntu Client

```
# sudo apt install cifs-utils
# sudo mount -t cifs //172.31.0.21/vol-02df7017709d5ec45 /mnt/samba
# cd /mnt/samba
```

## Test 3 - Termination and IP retention

Terminate the instance and start a new one with the correct UserData, and see if after the instance booted everything works as expected.

# 💾 Backup Your Data

Make sure you regularly backup your EFS and EBS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/) for EFS and snapshotting for EBS.

# 🔔 Security Concerns

Bellow we give you a list of potential ideas worth considiering regarding security, but this list is not exhaustive; it is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send logs.
- Allow mounting only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our products, go to our [support page](https://support.0x4447.com/).
