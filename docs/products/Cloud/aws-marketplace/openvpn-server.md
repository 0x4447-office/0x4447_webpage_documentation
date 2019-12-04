---
title: OpenVPN Server for AWS
summary: OpenVPN Server with unlimited users.
---

# OpenVPN Server for AWS

This is an OpenVPN server with no limits on how many accounts or active connections you can have. The limits depend on the Instance type you select rather than on arbitrary soft limits.

This means that the limiting factor is the performance of the server itself. If your user starts complaining about the connection being too slow, or you see the CPU time is above 75 percent, just change the instance type to a bigger one to accommodate the new traffic and users.

The setup also has built-in resilience; the EC2 Instance UserData takes in two environment variables, one for the Elastic IP ID, and the other for the EFS ID. If the first ID is present, the instance will always get the same IP address at boot time. If the EFS ID is present, we will mount that drive and keep the OpenVPN user database on it with all the `.ovpn` profiles files for your user. So even if your instance is terminated, as long as you provide the same EFS ID at boot time, all data and OpenVPN configuration will be present.

Secure your connections now.

# Our Diferenciating Faktor

We also want to let you know that this is not a regular product; what we build for the marketplace is what we use ourselves on a day-to-day basis. One of our signature traits is that we hate repetitive tasks that can easily be automated. If we find something repetitive in our day-to-day use of our products, rest assured that we'll automate the repetition.

We want to give you a good foundation for your ideas.

# Documentation

# Create the main certificate first

Before you start working with the OpenVPN, you have to generate the main SSL certificate that will be used to sign all the subsequent certificats for the individual users. This process will take few minutes depending on the instance type. Be patient.

Start the cert generation with the following command:

`sudo bash /opt/0x4447/openvpn/ov_generate_server_certs.sh`

# User Management

## How to create a OpenVPN user

1. Run this command and answer all the questions:

	`sudo bash /opt/0x4447/openvpn/ov_user_add.sh "USER_NAME"`

2. Every time you do so, a new `.ovpn` file will be created in the `openvpn_users` folder located in the `ec2-user` folder.  You can copy the new file to your local computer using the `SCP` command like so:

	`scp -i /cert/path/ SERVER_IP:/home/ec2-user/openvpn_users/USER_NAME.ovpn .`

3. Share the file with the selected user.

## How to delete a OpenVPN user

Just run the following command and set the right user name:

`sudo bash /opt/0x4447/openvpn/ov_user_delete.sh "USER_NAME"`

## How to list all the OpenVPN users

Since every time you create a user, a `.ovpn` configuration file is created. You can just list the content of the `openvpn_users` folder, like so:

` ls -la /home/ec2-user/openvpn_users`

The output is the list of all the users you have available for your OpenVPN server.

# How to enable resilience

Our OpenVPN Server has build in resilience to make sure that you don't loose all your users that are added in the system. Or the IP of the server. This way you can protect yourself by the following scenarious:

- accitental instance termination.
- you can build an autoscaling group with minimum of 1 so even if the server gose down it will be recreated.
- you can chagne the instance type whenever needed.
- no matter what, the IP of the instacne stais the same.

# UserData

To achive this we use the UserData feature of EC2, where you can set a Bash script that will be execute the first time the Instacne boots. This way without havign access to the instacne we can automate the EFS mounting process and the Elastic IP attachement.

### Before you set the UserData

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

This Policy Document will allow the instance the ability to attach the Elastic IP to itself. The `"Resource": "*"` is on purpouse not becasue of lazyness, the `AssociateAddress` actions is not resource specific.

### Bash Script for UserData

And this is the whole Bash script file that you have to copy and past in the UserData field when you start the instacne for the first time. Make srue to replace the values in all CAPS, with the real data.

```bash
#!/bin/bash
EFS_ID=fs-REPLACE_WITH_REAL_VALUE
EIP_ID=eipalloc-REPLACE_WITH_REAL_VALUE

INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null)
AWS_ZONE=$(curl http://169.254.169.254/latest/meta-data/placement/availability-zone 2>/dev/null)
AWS_REGION=${AWS_ZONE::-1}

echo EFS_ID=$EFS_ID > /home/ec2-user/efs.sh

aws ec2 associate-address --allocation-id $EIP_ID --instance-id $INSTANCE_ID --allow-reassociation --region=$AWS_REGION

yum install -y amazon-efs-utils
```

Explanation:

1. Set the ID of the EFS drive.
1. Set the ID of the Elastic IP.
1. Get the Instance ID.
1. Get the Availability Zone where the istance was deployed.
1. Remove the last letter from the AZ to be let with the Region.
1. Save the EFS ID to disk for our script.
1. Associate the Elastic IP with the instance.
1. Install the EFS tools needed to mount the EFS drive.

# Understand how UserData works

It is important to note that the content of the UserData field, will be only executed once, when the Instacne starts for the first time. Meaning it won't be trigered if you stop and start the instacne. Meaning you can't test our product, make some users, and then decide to add resiliance to the Instacne, since the UserData will never trigger. You'll have to start a new Instacne, and then copy over your users.

But there is also a work around, and you can force the UserData to be triggered at each boot, follow this link for more:
[https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/)

# Understant our files:

In our appliance we create files needed to make the server works, and here is the full list with an explanation:

- `/etc/openvpn/easy-rsa/keys`: this folder holds all the user that you create, and OpenVPN uses this `.pem` files for authentication.
- `/home/ec2-user/openvpn_users`: holds all the OpenVPN cnfiguration files for your users to be used in their OpenVPN clients.
- `/home/ec2-user/efs.sh`: is where the EFS ID is saved when the UserData is executed

# Before you go in production

Be sure to test the server to make sure it behaves the way we advertise it, not becasue we don't belive it works correctly, but to make sure you are confortable with the product and knows how it works. Especially the resiliance mode.

Make sure to make a test user, see that all works, and then termiante the instace and start a new one with the correct UserData, and see if after the instacne booted you can still connect to the OpenVPN without any chagnes on the client side. If all sucesfull the EFS shoul have mounted and the same data should be in place.

# OpenVPN Clients

- Desktop
    - [Windows](https://openvpn.net/client-connect-vpn-for-windows/)
    - [MacOS](https://openvpn.net/client-connect-vpn-for-mac-os/)
    - [Linux](https://openvpn.net/vpn-server-resources/how-to-connect-to-access-server-from-a-linux-computer/)
- Mobile
    - [iOS](https://apps.apple.com/us/app/openvpn-connect/id590379981)
    - [Android](https://play.google.com/store/apps/details?id=net.openvpn.openvpn&hl=en)
