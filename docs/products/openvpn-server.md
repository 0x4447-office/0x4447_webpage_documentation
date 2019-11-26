---
title: OpenVPN Server
summary: OpenVPN Server with unlimited users.
---

# OpenVPN Server

This is a OpenVPN server with no limits. There isn't a limit on how many accounts or active connections you can have. The limits depends on the Instance type you selected, and not on an arbitrary soft limits.

Meaning, the limiting factor is the performance of the server itself. If your user starts complaining about the connection being to slow, or you see the CPU time is above 75%, just change the instance type to a bigger one to accommodate the new traffic and users.

The setup also have built in resilience, meaning the EC2 Instance UserData takes in to Environment variables, one for the Elastic IP ID, and the other for the EFS ID. If the first ID is present the instance will always get the same IP address at boot time. If the the EFS ID is present we will mount that drive, and keep the OpenVPN user database on it with all the `.ovpn` profiles files for your user. This means that even if your instance gets terminated, as long as you provide at boot time the same EFS ID, all the data and OpenVPN configuration will be present.

We also want to let you know that this is not a regular product, what we build for the market place is what we use on a day to day basis ourselves. One of our signature trait is that we hate with a passion repetitive tasks that can be easily automate. This means that if in our day-to-day use of our products we find something repetitive, rest assure the repetition will be automated.

We want to give you a good foundation for your ideas.

# Documentation

After the instance is up and running, you'll have some manual work to do. Bellow you'll find all the necessary details.

**WARNING**: text written in capital letters needs to be replaced with real values.

The main frame of reference to be aware off, is that you'll use your computer as a proxy for the following operations.

# Create the main certificate first

Create the main certificate by running this command, when prompted answer all the questions.

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

# Where are the OpenVPN configuration files?

The configuration files are located in the `openvpn_users` folder located in your `ec2-user` home folder. This files are for your users. The OpenVPN users are located in this folder `/etc/openvpn/easy-rsa/keys`.

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
EFS_ID=fs-d5e77b54
EIP_ID=eipalloc-018778e2501d4e432

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
