---
title: OpenVPN Server
summary: OpenVPN Server with unlimited users.
---

# OpenVPN Server

Our OpenVPN apliance is an OpenVPN server with no limits imposed by us. For example there isn't a limit on how many accounts or active connections you can have. The limits depends on the Instance type you select, and not on an arbitrary soft limits.

Meaning, the limiting factor is the performance of the server itself. If your user starts complaining about the connection being to slow, or you see the CPU time is above 75%, just change the instance type to a bigger one to accommodate the new traffic and users. It is this simple.

The setup also have built in resilience, meaning the EC2 Instance UserData can take in two Environment variables, one for the Elastic IP ID, and the other one for the EFS ID. 

If the first ID is present the instance will always get the same IP address at boot time. If the the EFS ID is present we will mount that drive, and keep the OpenVPN user database on it with all the `.ovpn` profiles files for your user. 

This means that even if your instance gets terminated, as long as you provide at boot time the same EFS ID, all the data and OpenVPN configuration will be preserved in the EFS drive.

# Our Diferenciating Faktor

What we build for the market place is what we use on a day to day basis ourselves. One of our signature trait is that we hate with a passion repetitive tasks that can be easily automate. This means that if in our day-to-day use of our products we find something repetitive, rest assure the repetition will be automated and removed. We don't wait for your obious feedback, we constatly seek to improve our products. Of course your feedback is welcome, we are aware that we might use our products differently then you do, and this is valubalbe information for us.

Our goal is to give you a good foundation for your company.

# Documentation

# Create the main certificate first

Before you start working with the OpenVPN, you have to generate the main SSL certificate that will be used to sign all the subsequent certificats for the individual users. This process will take few minutes depending on the instance type. Be patient.

Start the cert generation with the following command:

`sudo bash /opt/0x4447/openvpn/ov_generate_server_certs.sh`

# User Management

## How to create a OpenVPN user

1. Run this command and answer all the questions

	`sudo bash /opt/0x4447/openvpn/ov_user_add.sh "USER_NAME"`

2. Every time you do so, a new `.ovpn` file will be created in the `openvpn_users` folder.  You can copy the new file to your local computer using the `SCP` command like so:

	`scp 0x4447_marketplace_server:/home/ec2-user/openvpn_users/server.tlsauth .`

3. Share the file with the selected user

## How to delete a OpenVPN user

Just run the following command by changing the user name you want to remove

`sudo bash /opt/0x4447/openvpn/ov_user_delete.sh "USER_NAME"`

## How to list all the OpenVPN users

Since every time you create a user, the OpenVPN configuration for the connection will be created in your home folder under the `openvpn_users` fodler. Just list the content of that older to see all your users:

` ls -la /home/ec2-user/openvpn_users`

# Configuration files location

There are two places where new data is beeing created when you use our product

- `/etc/openvpn/easy-rsa/keys`: this folder holds all the user that you create, and OpenVPN uses this `.pem` files for authentication.
- `/home/ec2-user/openvpn_users`: holds all the OpenVPN cnfiguration files for your users to be used in their OpenVPN clients.

# How to enable resilience

Our OpenVPN Server has build in resilience to make sure that you are protected against Instance termination, or to allow you the setup of autoscaling with a setting of minimum 1 and max 1, to allow auto recovery of terminated instances.

## Fixed IP

For a VPN server it is important that it always has the same IP, this way even if you stop and start the server, or use autoscaling to mantain a minimum of one server, you need to have a way to set alays the same IP. To do so, you can take advantage of the UserData of the EC2 Instance.

### Before you set the UserData

Before you can set the UserData, you have to attach a Role to the Instance with a Policy that has this Policy Document:

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

This Policy Document will allow the instance to attach the Elastic IP to itself.

### UserData

Bellow is the Bash code needed to attach an Elastic IP to the instance at boot time.

```bash
#!/bin/bash
EFS_ID=fs-REPLACE_WITH_REAL_VALUE
EIP_ID=eipalloc-REPLACE_WITH_REAL_VALUE

INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null)
AWS_ZONE=$(curl http://169.254.169.254/latest/meta-data/placement/availability-zone 2>/dev/null)
AWS_REGION=${AWS_ZONE::-1}

echo $EFS_ID > /home/ec2-user/efs_id

aws ec2 associate-address --allocation-id $EIP_ID --instance-id $INSTANCE_ID --allow-reassociation --region=$AWS_REGION
```

Explanation:

1. Set the ID of the Elastic IP
2. Get the Instance ID
3. Get the Zone where the instance is
4. Remove the last letter which is the Zone, since we just need the Region of where the instance is
5. Associate the Elastic IP with the instance.

How to make the the UserData run each time

[https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/)

## External Drive

To keep your user backed up and always available, our server has support for a EFS drive. If in he EC2 Instance UserData you provide the following line:

`EFS_ID=fs-XXXXXX`

Our server will read this value, and will mount the EFS drive to the system. On this drive all the unique data for the OpenVPN server will be saved to, this way your data is safe, you can terminate the server, create a new one, and as long as the EFS ID is the same the OpenVPN server will work as if nothing happened.

# Before you go in production

Be sure to test the server to make sure it behaves the way we advertise it, not becasue we don't belive it works correctly, but to make sure you are confortable with the product and how it works. Especially the resiliance mode. 

Make sure to make a test user, see that all works, and then termiante the instace and start a new one with the correct userData, and see if after the instacne booted you can still connect to the OpenVPN without any chagnes on the client side. If all sucesfull the EFS shoul have mounted and the same data should be in place.
