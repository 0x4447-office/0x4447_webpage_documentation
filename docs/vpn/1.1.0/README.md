---
title: VPN Server - Using OpenVPN
summary: Ready to go VPN server using OpenVPN with no soft limits.
---

# {{ $frontmatter.title }}

::: warning Note
This product is intended to be used by Cloud professionals who have experience with Linux, Cloud Networking, and understand Cloud pricing.
:::

## What is this product about

We took the popular OpenVPN server, and created a preconfigured, easy to use and resilient product that once booted is ready to go, and virtually impossible to take donw.

We removed the compleksity of setting it up and added mechanism that no matter what you do you user will be able to reconect to the server. As long as you don't phisically delete the EFS drive that is used to store all the unique data of the setup, you can reboot the server, termiante it, recreated it, and as long as the same EFS ID is sued, all the configuration will be there, all you users certs and more is preserved and always restored at boot time.

We made the most stress free OpenVPN prodcut out there.

### Key aspects

- Removed the complexity of configuration.
- All or partial traffic option.
- Minimized downtime thanks to our custom resilience feature.
- No more stress to recreated all the users if you lose the server.
- The downtime minimized to the time it takes to boot the EC2 Instacne and mount the EFS drive.

### Example use cases

- Route all the traffic over the VPN server for remote workers.
- Secure offie resources in a private subnet and allow partial traffic for employees to access them.
- Connect tow or more offices together with a secure link.

### Additional details

#### Resilience

Our VPN Server has built in resilience to make sure that you don't lose all your users, lose the VPN configuration, or lose connectivity by a changing IP. For this to work, you'll need to allocate an Elastic IP and create an EFS Drive. Also, take note of the IDs that you'll get so that you can use them in the EC2 UserData section.

#### Security

This product was designed for public access, but we recommend you don't allow SSH connections from the public Internet. Expose only the VPN ports and allow SSH access from a special instance within your private network.

## Deploy Automatically

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-openvpn&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/openvpn-server.json"
  cloud-formation-url="https://s3.amazonaws.com/0x4447-drive-cloudformation/openvpn-server.json"
  product-url="https://aws.amazon.com/marketplace/pp/B0839R5C7Z"
/>

### What will be deployed

- 1x EC2 instance with 0x4447 custom AMI.
  - 1x IAM Role.
  - 1x IAM Policy.
  - 1x Security Group.
  - 1x Instance profile.
  - 1x Elastic IP.
  - 1x Elastic IP Association.
- 4x CloudWatch Alarms:
  - CPU Burst.
  - CPU Load.
  - EC2 Instance Recovery.
- 1x SNS Topic.
  - 1x SNS Pilicy.
- 1x CloudWatch Dashboard for instance overview.
- 1x EFS drive
  - 1x Mount target.
  - 1x Security group.
- 1x Backup
  - 1x Plan
  - 1x Role
  - 1x Selection
  - 1x Vault

## Deploy Manually

Before launching our product, you'll have to do some manual work to make everything work correctly. Please follow these steps (the steps are generally described since Cloud experiance is expected):

::: warning
Text starting with `PARAM_` needs to be replaced with real values.
:::

### Security Group

Our product configuration in the AWS Marketplace already have set all the ports that need to be open for the product to work. But if for whatever reason the correct Security Group is not created by AWS, bellow you can find a list and descriptions of all the ports needed:

- `22` over `TCP` for remote managment.
- `443` over `TCP` for VPN connections.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Our product needs a few dynamic values custom to your setup. To get access to this values our product checks for the content of this file `/home/ec2-user/.env`. By suing the UserData option that AWS provided for each EC2 Instance, you can create the `.env` file with ease by referencing the bash script from bellow - make sure to replace the placeholder values with your own ones.

```bash
#!/bin/bash

echo EFS_ID=PARAM_EFS_ID >> /home/ec2-user/.env
echo EIP_ID=PARAM_ELASTIC_IP >> /home/ec2-user/.env
echo SERVER_DNS=PARAM_DNS_NAME >> /home/ec2-user/.env

echo VPN_SPLIT_TUNNEL=PARAM_TRUE_OR_FALSE >> /home/ec2-user/.env
echo VPN_SPLIT_TUNNEL_NETWORK=PARAM_IP_OF_THE_NETWORK_FOR_EXAMPLE_10.0.0.0 >> /home/ec2-user/.env
echo VPN_SPLIT_TUNNEL_SUBNET=PARAM_IP_OF_THE_NETWORK_MASK_FOR_EXAMPLE_255.255.255.0 >> /home/ec2-user/.env
```

::: tip Explanation

1. Set the ID of the EFS drive.
1. Set the ID of the Elastic IP.
1. Set the DNS name that you will use to map the public instance IP. This will be used in the VPN profile file.
1. Set if you want partial or all traffic going thorugh the VPN.
1. Set the Private VPN server IP.
1. Set the network mask for the IP.

:::

::: warning Understand how UserData works

It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be triggered if you stop and start the instance.

This means you won't be able to stop the instance, update the UserData and have the changes executed. If you need to make changes to the UserData, you have the following options:

- Follow this [AWS solution](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Log-in to the instance, edit the `/home/ec2-user/.env` file, and restart the instance.
- Terminate the instance and redeploy the product from scratch.

:::

### Custom Role

Before you can set the UserData, you have to attach a Role to the Instance with a Policy that has this Document:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "ec2:AssociateAddress",
			"Resource": "*"
		}
	]
}
```

This Policy Document will give the Instance the ability to attach the Elastic IP to itself. The `"Resource": "*"` is stated this way intentionally, and the `AssociateAddress` actions is not resource specific.

## The First Boot

The boot time of our product will be slower then if you started an instance from a clean AMI, this is due to our custom code that needs to be executed in order to prepare the product for you. This process can take few minutes longer then usual.

## Connecting to the Server

If you need to connect to the server: get it's IP, connect to the instance over SSH with the username `ec2-user`, while using the private key you selected at deployment time. If sucesfully connected, you should be greeted with a custom MOTD detailing the product information.

## User Management

### How to create a user

1. Run this command and answer all the questions:

    ```sh
    sudo bash /opt/0x4447/openvpn/ov_user_add.sh "USER_NAME"
    ```

2. Every time you do so, a new `.ovpn` file will be created in the `openvpn_users` folder located in the `ec2-user` folder. You can copy the new file to your local computer using the `SCP` command, like so:

    ```sh
    scp -i ./ssh.key SERVER_IP:/home/ec2-user/openvpn_users/USER_NAME.ovpn .
    ```

3. Share the file with the selected user.

### How to delete a user

Just run the following command and set the right user name:

```sh
sudo bash /opt/0x4447/openvpn/ov_user_delete.sh "USER_NAME"
```

### How to list all the users

Since every time you create a user a `.ovpn` configuration file is created, you can just list the content of the `openvpn_users` folder, like so:

```sh
ls -la /home/ec2-user/openvpn_users
```

The output is the list of all the users you have available for your VPN server.

## VPN Clients

- Desktop
    - [Windows](https://openvpn.net/client-connect-vpn-for-windows/)
    - [MacOS](https://openvpn.net/client-connect-vpn-for-mac-os/)
    - [Linux](https://openvpn.net/vpn-server-resources/how-to-connect-to-access-server-from-a-linux-computer/)
- Mobile
    - [iOS](https://apps.apple.com/us/app/openvpn-connect/id590379981)
    - [Android](https://play.google.com/store/apps/details?id=net.openvpn.openvpn&hl=en)

## Final Thought

### Test the setup

Before you go in to production, make sure to test the product; not because we don't believe it, but to make sure that you get used to how it works.

### Security Concerns

Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.

- Expose to the public only the ports needed for clients to connect to the VPN.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
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

### Issue with remote access

Unable to access the server over SSH.

::: tip Solution
- Ensure that your public IP address is allowed to access the EC2 instance. You will need to add an inbound rule to the Security Group used by the EC2 instance.
- Ensure you are using the right EC2 Key Pair that you provided when you launched your stack.
- Ensure you are not using the `root` user to login as this is disabled. You need to login as `ec2-user`
:::

### Issue with user management

The bellow error indicates that this instance failed to mount your EFS drive.

```sh
sh-4.2$ sudo bash /opt/0x4447/openvpn/ov_user_add.sh "test-client"
/opt/0x4447/openvpn/ov_user_add.sh: line 23: vars: No such file or directory
```

You will also see the following message in your dmesg.

```sh
amazon/efs/mount.log:2020-09-04 23:29:58,803 - ERROR - Failed to mount fs-90d252e8.efs.us-east-2.amazonaws.com at /etc/openvpn/easy-rsa: retu Connection timed out"
```

::: tip Solution
Ensure that your EFS Drive allows inbound connections on TCP Port `2049` from your Elastic IP and the EC2 subnet being used by the VPN Server.
:::

## Support

If the above section didn't help you come up with a solution to your problem. Feel free to [get in touch with us](https://support.0x4447.com/), we'll try to help you out the best way we can.