---
title: Samba Server - Ready to Go
summary: A Samba Server with supports to up to 25 EBS drives.
---

# {{ $frontmatter.title }}

::: warning Note
This product is intended to be used by Cloud professionals who have experience with Linux, Cloud Networking, and understand Cloud pricing.
:::

## What is this product about

Samba is an old technology that we decided to refrehs to fit the modern Cloud era, by givving you the ability to mount multiple EBS drives and share them across your private network within the VPC or with remote offices ofver a VPN connecction.

The ease of use was paramount for this product to the point that by defualt you don't need SSH acccess, since there is nothing for you to do. All the configuration is done at deployment time. You have to wait for few minutes, and you are ready to mount locally your drives.

### Key aspects

- Mount up to 25 EBS drives
- Mount the drives as if they were on the local lan while using a VPN.
- Share data across instances within the same VPC.

### Example use cases

Your imagination is your limit, but here are some ideas that are worth considering:

- Share data between servers inside a VPC
- Mount drive(s) locally when using a VPN.
- Remote storage with easy backup options to access the data anywhere in the world.
- Browse existing EBS drive that you might have in your account and forgot what is contained within them.

### Additional details

#### Resilience

If you want to always be able to connect the same internal IP, make sure to start the EC2 Instance and keep the same local IP settings. This way, even if the instance gets terminated and you have to recreate it, the IP will stay the same and your user won't have to change any of their configurations.

#### Security

Our product is configured to only allow guest access, meaning there are no user accounts. This makes it very straight forward for users to mount the drive and share data across the company.

But this also means that **you can't have the server deployed on a public network with a public IP**. You need to deploy the server in a private network and use a VPN server to access it. By default we do set a public IP using the CloudFormation file, for you to access the server to manage it if needed, but the default setting for the security group is not to have the SSH port open. This way there is no remote access to the public, but the server is always set to be accesed publicly if needed.

This way the Samba-server can be accessed only through a VPN connection. If you are looking for an affordable VPN server, we recommend the [openvpn-server](https://aws.amazon.com/marketplace/pp/B0839R5C7Z).

## Complete feature list

This section lists all the fetures of this product for easy referencing.

::: details Detailed list

**The  product itself**

1. Mount up to 25 EBS drives.
1. No manual managment needed.
1. All the configuration is done through the EC2 Instance UserData section.
1. Drive are mounted using Guest access.
1. Anyone in the same subnet is free to mount the drives.
1. Mount one or all of the drives.

**Using our CloudFormation**

1. Alarm to check for CPU Bursts.
1. Alarm to check for CPU Load.
1. Alarm to autorecover the instance if it gets termianted suddenly by AWS due to hardware failiure.
1. SNS Topic for the alarms.
1. Same local IP for the server so even after termination the clients won't need reconfiguration.

:::

## Deploy Automatically

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-Samba&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/samba-server.json"
  cloud-formation-url="https://s3.amazonaws.com/0x4447-drive-cloudformation/samba-server.json"
  product-url="https://aws.amazon.com/marketplace/pp/B084HF14KL"
/>

### What will be deployed

- 1x EC2 instance with 0x4447 custom AMI.
  - 1x IAM Role.
  - 1x IAM Policy.
  - 1x Security Group.
  - 1x Instance profile.
- 4x CloudWatch Alarms:
  - CPU Burst.
  - CPU Load.
  - EC2 Instance Recovery.
- 1x SNS Topic.
  - 1x SNS Pilicy.
- 1x CloudWatch Dashboard for instance overview.

## Deploy Manually

Before launching our product, you'll have to do some manual work to make everything work correctly. Please follow these steps (the steps are generally described since Cloud experiance is expected):

::: warning
Text starting with `PARAM_` needs to be replaced with real values.
:::

### Security Group

Our product configuration in the AWS Marketplace already have set all the ports that need to be open for the product to work. But if for whatever reason the correct Security Group is not created by AWS, bellow you can find a list and descriptions of all the ports needed:

- `445` over `TCP` for connectivity to Samba

Opening port `22` is unnecessary since this product is unmanaged, meaning there is no manual input needed in the OS itself.

### Bash Script for UserData

Our product needs a few dynamic values custom to your setup. To get access to this values our product checks for the content of this file `/home/ec2-user/.env`. By suing the UserData option that AWS provided for each EC2 Instance, you can create the `.env` file with ease by referencing the bash script from bellow - make sure to replace the placeholder values with your own ones.

```bash
#!/bin/bash

echo DRIVES=PARAM_EBS_ID1,PARAM_EBS_ID2,PARAM_EBS_ID3,PARAM_EBS_ID25 >> /home/ec2-user/.env
```

::: tip Explanation

1. Set the variable with a list (separated by commas and no space) of EBS drives to be mounted - max 25.

:::

::: warning Understand how UserData works

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be triggered if you stop and start the instance.

This means you won't be able to stop the instance, update the UserData and have the changes executed. If you need to make changes to the UserData, you have the following options:

- Follow this [AWS solution](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Log-in to the instance, edit the `/home/ec2-user/.env` file, and restart the instance.
- Terminate the instance and redeploy the product from scratch.

:::

### Custom Role

Create a new role for the instance that will carry our product. The role must be for the `EC2` resource; it needs to have attached the `AmazonEC2ReadOnlyAccess` managed policy and have the following inline policy:

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

## The First Boot

The boot time of our product will be slower then if you started an instance from a clean AMI, this is due to our custom code that needs to be executed in order to prepare the product for you. This process can take few minutes longer then usual.

## Connecting to the Server

If you need to connect to the server: get it's IP, connect to the instance over SSH with the username `ec2-user`, while using the private key you selected at deployment time. If sucesfully connected, you should be greeted with a custom MOTD detailing the product information.

## Mount the drives

Once the server is up and running, need to be on the same network that our prodcut is (over VPN, in the same VPC (Subnet), etc). Bellow you can find detailed instructions how to mount the drive under the most popular operating systems.

### Windows 10

1. Open the File Manager.
1. On the left side, right click on Network.
1. Select Map network drive....
1. In the new window in the Folder field, type this: `\\PARAM_SAMBA_LOCAL_IP` (the slashes are important)
1. Then click Browse....
1. From the drop down menu you will see a list of driver(s) select the one that you want and, click OK.
1. Then click Finish.
1. If you get a popup asking for credentials, type in the `Username` field: `guest`.

### MacOS 11.x

1. Open Finder.
1. In the menu follow: `Go` > `Connect to Server...`
1. In the new Window type the local IP of the server.
1. Click Connect.
1. When prompted, select `Guest` as the user to log in as.
1. The connection might take a moment, but once all is done you should see the Samba server on the left side of Finder.

### Ubuntu 20.x

Other distribution might have a simmilar approach.

```sh
sudo apt install cifs-utils
sudo mount -t cifs //172.31.0.21/vol-PARAM_ID_OF_THE_COLUME /mnt/samba
cd /mnt/samba
```

## Final Thought

### Test the setup

Before you go in to production, make sure to test the product; not because we don't believe it, but to make sure that you get used to how it works.

### Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Allow access only from within the same subnet.
- Don't put the server on to the public internet.
- Don't give root access to anyone but yourself.

### Backup Your Data

Make sure you regularly backup your drive(s). One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/).

## F.A.Q

These are some of the common solutions to problems you may run into:

### Not authorized for images

My CloudFormation stack failed with the following error `API: ec2:RunInstances Not authorized for images:...` in the Event tab.

::: tip Solution

You have to accept the subscription from the AWS Marketplace first, before you use our CloudFormation file.

:::

### The product is missbehaving

I did follow all the instruction from the documentation.

::: tip Solution

Check if the values entered in the UserData reached the instance itself.

```
sudo cat /var/lib/cloud/instance/user-data.txt
```

:::

### UserData seams ok...

The UserData reached the instacne, and yet the product is not acting as it should.

::: tip Solution

Use the following command to see if there were any errors douring the boot process.

```
sudo cat /var/log/messages | grep 0x4447
```

:::

## Support

If the above section didn't help you come up with a solution to your problem. Feel free to [get in touch with us](https://support.0x4447.com/), we'll try to help you out the best way we can.