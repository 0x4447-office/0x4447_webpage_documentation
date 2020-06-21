---
title: OpenVPN Server for AWS
summary: OpenVPN Server with unlimited users.
---

# OpenVPN Server for AWS

<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://github.com/0x4447-office/0x4447_webpage_documentation/blob/master/docs/img/assets/openvpn.png?raw=true">

This is an OpenVPN server with no limits on how many accounts or active connections you can have. The limits depend on the Instance type you select rather than on arbitrary soft limits.

This means that the limiting factor is the performance of the server itself. If your user starts complaining about the connection being too slow, or you see the CPU time is above 75 percent, just change the instance type to a bigger one to accommodate the new traffic and users.

The setup also has built-in resilience; the EC2 Instance UserData takes in two environment variables, one for the Elastic IP ID, and the other for the EFS ID. If the first ID is present, the instance will always get the same IP address at boot time. If the EFS ID is present, we will mount that drive and keep the OpenVPN user database on it with all the `.ovpn` profiles files for your user. So even if your instance is terminated, as long as you provide the same EFS ID at boot time, all data and OpenVPN configuration will be present.

Secure your connection now.

# 📍 Our Differentiating Factor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

Our goal is to give you a good foundation for your company.

# 📜 Understand the basics

### Security

This product was designed for public access, but we recomend you don't allow SSH conections from the public intenret. Expose only the OpenVPN ports, and allow SSH access from a special instance within your private network. 

### Resilience

Our OpenVPN Server has build in resilience to make sure that you don't loose all your users, the VPN configuration, or lose connectiving by a chaning IP. For this to work you'll need to allocate an Elastic IP, and create a EFS Drive. And take note of the IDs that you'll get so you can use them in the EC2 UserData section.

# 🗂 CloudFormation

<a target="_blank" href="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-openvpn&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/openvpn-server.json">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"></a> We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to check the CloudFormation yourself, follow this [link](https://github.com/0x4447/0x4447_product_paid_openvpn).

Using our CF will allow you to deploy the stack with minimal work on your part. But if you'd like to do the deployment by hand, from this point on you'll find the manual how to do so.

---

# 📚  Manual

Before launching an instance you'll have to do some manual work to make everything work correctly. Please follow this steps in order displayed here.

**WARNING**: text written in capital letters needs to be replaced with real values.

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

This Policy Document will give the instance the ability to attach the Elastic IP to itself. The `"Resource": "*"` is on purpouse not becasue of lazyness, the `AssociateAddress` actions is not resource specific.

### Security Group

A default security group will be created for you automatically from the product configuration, but if you'd like to make one by hand, you need to have this ports open towards the instance:

- `22` over `TCP` for remote managment.
- `443` over `TCP` for OpenVPN connections.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Once you have evrything setup. You can replace the place holder values with the real IDs. Make srue to replace the values in all CAPS, with the real data.

```bash
#!/bin/bash
EFS_ID=fs-REPLACE_WITH_REAL_VALUE
EIP_ID=eipalloc-REPLACE_WITH_REAL_VALUE
SERVER_DNS=DNS_NAME

VPN_SPLIT_TUNNEL=DNS_NAME
VPN_SPLIT_TUNNEL_NETWORK=IP_OF_THE_NETWORK_FOR_EXAMPLE_10.0.0.0
VPN_SPLIT_TUNNEL_SUBNET=IP_OF_THE_NETWORK_MASK_FOR_EXAMPLE_255.255.255.0

echo EFS_ID=$EFS_ID >> /home/ec2-user/.env
echo EIP_ID=$EIP_ID >> /home/ec2-user/.env
echo SERVER_DNS=$SERVER_DNS >> /home/ec2-user/.env

echo VPN_SPLIT_TUNNEL=$VPN_SPLIT_TUNNEL >> /home/ec2-user/.env
echo VPN_SPLIT_TUNNEL_NETWORK=$VPN_SPLIT_TUNNEL_NETWORK >> /home/ec2-user/.env
echo VPN_SPLIT_TUNNEL_SUBNET=$VPN_SPLIT_TUNNEL_SUBNET >> /home/ec2-user/.env
```

Explanation:

1. Set the ID of the EFS drive.
1. Set the ID of the Elastic IP.
1. Set the DNS name that you will use to map the public instance IP. This will be used in the OpenVPN profile file.
1. Set if you want partial all traffic going thorugh the VPN
1. Set the Private VPN server IP.
1. Set the network mask for the IP.
1. Append all the values to the .env file.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, when the Instacne starts for the first time. Meaning it won't be trigered if you stop and start the instacne. If you chose to not enable resiliance, and skip the UserData script at boot time, you won't be able to later on update the UserData with the script and expect for the autoamtion to take place. You have to options: 

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new Instacne, this time with the right UserData, and then copy over from the old isntance to the new one all the configuration files.

### The First Boot

Grab a cup of caffe since the first boot will be slowwer then what you are use to. This is due to the certificate that we need to geenrate for OpenVPN. Since at boot time there isn't much goin on in the system this process can take around 12 min depending on the instance type. But not to warry, this happens only when the certificate is not found in the system.

### Connect to the server

Once the instance is up and running, get it's IP and connect to the instance over SSH uisng the slected key at deployment time.

# 👷‍♂️ User Management

### How to create a user

1. Run this command and answer all the questions:

	`sudo bash /opt/0x4447/openvpn/ov_user_add.sh "USER_NAME"`

2. Every time you do so, a new `.ovpn` file will be created in the `openvpn_users` folder located in the `ec2-user` folder.  You can copy the new file to your local computer using the `SCP` command like so:

	`scp -i /cert/path/ SERVER_IP:/home/ec2-user/openvpn_users/USER_NAME.ovpn .`

3. Share the file with the selected user.

### How to delete a user

Just run the following command and set the right user name:

`sudo bash /opt/0x4447/openvpn/ov_user_delete.sh "USER_NAME"`

### How to list all the users

Since every time you create a user, a `.ovpn` configuration file is created. You can just list the content of the `openvpn_users` folder, like so:

`ls -la /home/ec2-user/openvpn_users`

The output is the list of all the users you have available for your OpenVPN server.

# ⬇️ OpenVPN Clients

- Desktop
    - [Windows](https://openvpn.net/client-connect-vpn-for-windows/)
    - [MacOS](https://openvpn.net/client-connect-vpn-for-mac-os/)
    - [Linux](https://openvpn.net/vpn-server-resources/how-to-connect-to-access-server-from-a-linux-computer/)
- Mobile
    - [iOS](https://apps.apple.com/us/app/openvpn-connect/id590379981)
    - [Android](https://play.google.com/store/apps/details?id=net.openvpn.openvpn&hl=en)

# 🚨 Test The Setup

Be sure to test the server to make sure it behaves the way we advertise it, not becasue we don't belive it works correctly, but to make sure you are confortable with the product and knows how it works. Especially the resiliance mode.

Termiante the instace and start a new one with the correct UserData, and see if after the instacne booted everything works as expected.

# 💾 Backup your Data

Make sure you regullary backup your EFS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/).

# 🔔 Security Concerns

Bellow we give you a list of potentail ideas worth considiering regarding security, but this list dose not exausts all posobilities. It is just a good starting point.

- Expose to the pbulic only the ports needed for clients to connect to the VPN.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

# 🎗 Support 

If you have any questions regarding our product, go to our [support page](https://support.0x4447.com/).