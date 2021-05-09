---
title: VPN Server - Using OpenVPN
summary: Ready to go VPN server using OpenVPN with no soft limits.
---

# VPN Server - Using OpenVPN

::: danger Note
This product is intended to be used by Cloud professionals how have experience with the Linux OS, networking in the cloud and understand Cloud pricing.
:::

## What is this product about

We took the popular OpenVPN server, and created a preconfigured, easy to use and resilient product that once booted is ready to go.

We took away the complexity of setting all the certificates and keys, added support to resilience by keeping all the suers and unique data in to a EFS drive, this way even if for whatever reason the server gets terminated by whatever reason, as long as the EFS drive stays in place, you can boot another instance of the product, provide the EFS ID, and all will be as you left it. Minimizing drastically the down Tim for the users.

### Key aspects

- Removed the complexity of configuration.
- All or partial traffic option.
- Minimized downtime thanks to our custom resilience feature
- No more stress to recreated all the certificate users if you lose the server or the drive.

### Example use cases

- Route all the traffic over the VPN server for remote workers
- Secure offie resources in a private subnet and allow partial traffic for employees to access them.
- Connect tow or more offices together with a secure link

## Additional details

### Resilience

Our VPN Server has built in resilience to make sure that you don't lose all your users, lose the VPN configuration, or lose connectivity by a changing IP. For this to work, you'll need to allocate an Elastic IP and create an EFS Drive. Also, take note of the IDs that you'll get so that you can use them in the EC2 UserData section.

### Security

This product was designed for public access, but we recommend you don't allow SSH connections from the public Internet. Expose only the VPN ports and allow SSH access from a special instance within your private network.

## Setup - Automated with CloudFormation

<cloud-formation
  deploy-url="https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-openvpn&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/openvpn-server.json"
  cloud-formation-url="https://s3.amazonaws.com/0x4447-drive-cloudformation/openvpn-server.json"
  product-url="https://aws.amazon.com/marketplace/pp/B0839R5C7Z"
/>

## Setup - Manual Approach

Before launching an instance, you'll have to do some manual work to make everything work correctly. Please follow these steps in order displayed here:

::: warning
Text written in capital-underscore notation needs to be replaced with real values.
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

### Security Group

A default security group will be created for you automatically from the product configuration, but if you'd like to make one by hand, you need to have one of these ports open towards the instance:

- `22` over `TCP` for remote managment.
- `443` over `TCP` for VPN connections.
- `2049` over `TCP` for EFS to be mounted.

### Bash Script for UserData

Once you have everything setup, you can replace the place-holder values with the real IDs. Make sure to replace the values that are in all CAPS with the real data.

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
1. Set the DNS name that you will use to map the public instance IP. This will be used in the VPN profile file.
1. Set if you want partial or all traffic going thorugh the VPN.
1. Set the Private VPN server IP.
1. Set the network mask for the IP.
1. Append all the values to the .env file.

**Understand how UserData works**

It is important to note that the content of the UserData field will be only executed once, when the instance starts for the first time. This means it won't be triggered if you stop and start the instance. If you chose to not enable resilience and skip the UserData script at boot time, then later on you won't be able to update the UserData with the script or expect for the automation to take place. You have two options:

- Either you follow [this link](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/) for a work around.
- Or your start a new instance, this time with the right UserData, and then copy over from the old instance to the new one all the configuration files.

### The First Boot

Grab a cup of coffee since the first boot will be slower then what you are used to. This is due to the certificate that we need to generate for VPN. Since at boot time there isn't much going on in the system, this process can take around 12 min, depending on the instance type. But not to worry; this only happens when the certificate is not found in the system.

### Connect to the server

Once the instance is up and running, get its IP and connect to the instance over SSH using the selected key at deployment time.
**Note**: SSH access is restricted to the public and to the root user. You will need to allow your specific system access by adding an inbound rule to the Security group used by the VPN EC2 instance. You can then access the VPN server using the EC2 key pair and login as *ec2-user*.

## User Management

### How to create a user

1. Run this command and answer all the questions:

	`sudo bash /opt/0x4447/openvpn/ov_user_add.sh "USER_NAME"`

2. Every time you do so, a new `.ovpn` file will be created in the `openvpn_users` folder located in the `ec2-user` folder. You can copy the new file to your local computer using the `SCP` command, like so:

	`scp -i /cert/path/ SERVER_IP:/home/ec2-user/openvpn_users/USER_NAME.ovpn .`

3. Share the file with the selected user.

### How to delete a user

Just run the following command and set the right user name:

`sudo bash /opt/0x4447/openvpn/ov_user_delete.sh "USER_NAME"`

### How to list all the users

Since every time you create a user a `.ovpn` configuration file is created, you can just list the content of the `openvpn_users` folder, like so:

`ls -la /home/ec2-user/openvpn_users`

The output is the list of all the users you have available for your VPN server.

## VPN Clients

- Desktop
    - [Windows](https://openvpn.net/client-connect-vpn-for-windows/)
    - [MacOS](https://openvpn.net/client-connect-vpn-for-mac-os/)
    - [Linux](https://openvpn.net/vpn-server-resources/how-to-connect-to-access-server-from-a-linux-computer/)
- Mobile
    - [iOS](https://apps.apple.com/us/app/openvpn-connect/id590379981)
    - [Android](https://play.google.com/store/apps/details?id=net.openvpn.openvpn&hl=en)

## Test The Setup

Be sure to test the server to confirm that it behaves the way we advertise it; not becasue we don't belive it works correctly, but to make sure you are comfortable with the product and know how it works, especially the resiliance mode.

### Step 1 - Generate Ubuntu and Windows Clients

```bash
### Login to your VPN Server
$ ssh -i ec2_key_pair ec2-user@<your-elastic-ip>

### On your VPN Server
$ sudo bash /opt/0x4447/openvpn/ov_user_add.sh "win-client"
$ sudo bash /opt/0x4447/openvpn/ov_user_add.sh "ubuntu-client"

### Download the keys to the system that has access to your VPN server
$ scp -i openssh_key ec2-user@<your-elastic-ip>:openvpn_users/win-client.ovpn .
$ scp -i openssh_key ec2-user@<your-elastic-ip>:openvpn_users/ubuntu-client.ovpn .
```

### Step 2 - Test connectivity from a Ubuntu instance

```bash
### Install and run the VPN client on a Ubuntu instance
$ sudo apt install openvpn
$ openvpn --config ubuntu-client.ovpn

### Check if a TUN interface has been created
$ ifconfig
tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.8.0.3  netmask 255.255.0.0  destination 10.8.0.3
        inet6 fe80::38d4:cb89:46f6:a288  prefixlen 64  scopeid 0x20<link>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 100  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1  bytes 48 (48.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

### Ping the VPN gateway
$ ping 10.8.0.1
PING 10.8.0.1 (10.8.0.1) 56(84) bytes of data.
64 bytes from 10.8.0.1: icmp_seq=1 ttl=118 time=1.02 ms
64 bytes from 10.8.0.1: icmp_seq=2 ttl=118 time=0.978 ms
--- 10.8.0.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
```

### Step 3 - Test connectivity from a windows client

```bash
### Download the VPN client for windows and load the win-client.ovpn that was created in Step 1
### Run ipconfig on windows cmd prompt or ifconfig on WSL
ipconfig/ifconfig:
eth6: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.8.0.2  netmask 255.255.0.0  broadcast 10.8.255.255
        inet6 fe80::24c4:b8be:de58:cf4c  prefixlen 64  scopeid 0xfd<compat,link,site,host>
        ether 00:ff:7c:48:11:38  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

### Ping the VPN gateway
$ ping 10.8.0.1
PING 10.8.0.1 (10.8.0.1) 56(84) bytes of data.
64 bytes from 10.8.0.1: icmp_seq=1 ttl=118 time=1.02 ms
64 bytes from 10.8.0.1: icmp_seq=2 ttl=118 time=0.978 ms
--- 10.8.0.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
```
### Step 4 - Test instance scale-up or scale-down

Stop the EC2 instance and change the instance type to a larger or smaller one based on your need. Both the Ubuntu and the windows clients should connect automatically once the VPN Server is up.

### Step 5 - Site to Site connectivity

```bash
### Login to your VPN Server
$ ssh -i ec2_key_pair ec2-user@<your-elastic-ip>

### On your VPN Server
$ sysctl net.ipv4.ip_forward=1

### Ping the windows client from the ubuntu client. On you Ubuntu client:
$ ping 10.8.0.2
PING 10.8.0.2 (10.8.0.2) 56(84) bytes of data.
64 bytes from 10.8.0.2: icmp_seq=1 ttl=118 time=1.02 ms
64 bytes from 10.8.0.2: icmp_seq=2 ttl=118 time=0.978 ms
--- 10.8.0.2 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
```

## Backup your Data

Make sure you regularly backup your EFS drive. One simple solution would be to use [AWS backup](https://aws.amazon.com/backup/).

## Security Concerns

Below we give you a list of potentail ideas that are worth considiering regarding security, but this list dose not exhaust all possibilities; it is just a good starting point.

- Expose to the public only the ports needed for clients to connect to the VPN.
- Block public SSH access.
- Allow SSH connection only from limited subnets.
- Ideally allow SSH connection only from another central instance.
- Don't give root access to anyone but yourself.

## Troubleshooting tips

These are some of the common solutions to problems you may run into:

## My CloudFormation stack failed with the following error

```
API: ec2:RunInstances Not authorized for images:
```

**SOLUTION**:
- Accept the subscription for this image on AWS marketplace and then re-launch your stack.

## Failed to access the VPN server using SSH

**SOLUTION**:
- Ensure that your public IP address is allowed to access the VPN EC2 instance. You will need to add an inbound rule to the Security Group used by the VPN EC2 instance.
- Ensure you are using the right EC2 Key Pair that you provided when you launched your stack using Cloud Formation.
- Ensure you are not using the *root* user to login as this is disabled. You need to login as *ec2-user*

## User Management failed with an error

```
sh-4.2$ sudo bash /opt/0x4447/openvpn/ov_user_add.sh "test-client"
/opt/0x4447/openvpn/ov_user_add.sh: line 23: vars: No such file or directory
```

**SOLUTION**:
- The above error indicates that this instance failed to mount your EFS drive. You will also see the following message in your dmesg

```
amazon/efs/mount.log:2020-09-04 23:29:58,803 - ERROR - Failed to mount fs-90d252e8.efs.us-east-2.amazonaws.com at /etc/openvpn/easy-rsa: retu Connection timed out"
```

- Ensure that your EFS Drive allows inbound connections on TCP Port 2049 from your Elastic IP and the EC2 subnet being used by the VPN Server

## Ping to another client instance over VPN fails

**SOLUTION**:
- If you can ping the default gateway 10.8.0.1 but cannot reach another client behind VPN, check if you have enabled ip_forward on the VPN Server.

```bash
### On your VPN Server
$ sysctl net.ipv4.ip_forward=1
```
