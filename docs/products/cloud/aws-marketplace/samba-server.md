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

### Security

Our product is configured to only allow Guest access, meaning there are no user accounts. This makes is very straight forward for users to mount the drive and share data across the company. 

But this means that **you can't have the server deployed in a public network with a public IP**. You need to deploy the server in a private network, and use a VPN server to access it. 

This way the Samba-server can be accessed only thought a VPN connection. If you are looking for an affordable VPN server we can recommend the [openvpn-server](https://aws.amazon.com/marketplace/pp/B0839R5C7Z).

### Resilience

If you want to always be able to connect the same internal IP, make sure to start the EC2 Instance and setting the local IP to always be the same. This way even if the instance gets terminated, and you recreate it, the IP will stay the same and your user won't have to change anything in their configuration.

# CloudFormation

For our product, we provide a CloudFormation file that with one click of a button will deploy the product and the whole stack around it. Follow this [link](https://github.com/0x4447/0x4447_product_paid_samba), and read carefully the README.md file where we explain exactly what will be deployed. If you want to setup everything manually, you can keep reading.

# 📚  Manual

Before launching an instance you'll have to do some manual work to make everything work correctly. Please follow this steps in order displayed here.

**WARNING**: text written in capital letters needs to be replaced with real values.

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

- `445` over `TCP` for connectivity to Samba
- `2049` over `TCP` for connectivity to EFS

Opening port `22` is unnecessary since this product is unmanaged, meaning there is no manual work needed in the OS itself. 

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

It is important to note that the content of the UserData field will be only executed once, when the Instacne starts for the first time. Meaning it won't be trigered if you stop and start the instacne. If you chose to not enable resiliance, and skip the UserData script at boot time, you won't be able to later on update the UserData with the script and expect for the autoamtion to take place. You have to options: 

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new Instacne, this time with the right UserData, and then copy over from the old isntance to the new one all the configuration files.

### Connect to the server

Once the instance is up and running, get it's IP and connect to the instance over SSH uisng the slected key at deployment time.

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we advertise it, not becasue we don't belive it works correctly, but to make sure you are confortable with the product and knows how it works. Especially the resiliance mode.

Termiante the instace and start a new one with the correct UserData, and see if after the instacne booted everything works as expected.

# 💾 Backup your Data

Make sure you regularly backup your EFS and EBS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/) for EFS, and snapshotting for EBS.

# 🔔 Security Concerns

Bellow we give you a list of potentail ideas worth considiering regarding security, but this list dose not exausts all posobilities. It is just a good starting point.

- Never expose this server to the public. Use it only inside a private network to limit who can send logs to it.
- Allow mounting only from specific subnets.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our product, go to our [contact page](https://0x4447.com/contact.html), and fill the form.