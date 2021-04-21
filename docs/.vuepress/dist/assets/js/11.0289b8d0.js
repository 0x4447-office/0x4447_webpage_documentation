(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{365:function(t,e,s){"use strict";s.r(e);var a=s(45),n=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"prerequisites"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#prerequisites"}},[t._v("#")]),t._v(" Prerequisites")]),t._v(" "),s("p",[t._v("Before you start you need to be aware this is not a product for everyone. This product is for DevOps that know AWS, and all its intricacy. You need to be experience with AWS, to use this product.")]),t._v(" "),s("h1",{attrs:{id:"understand-the-basics"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#understand-the-basics"}},[t._v("#")]),t._v(" Understand the basics")]),t._v(" "),s("h3",{attrs:{id:"resilience"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#resilience"}},[t._v("#")]),t._v(" Resilience")]),t._v(" "),s("p",[t._v("Our Rsyslog server has built in resilience to make sure that even if the server gets terminated, it has the capability to apply the same configuration to each new instance. Meaning, if you provide a S3 bucket in the EC2 UserData, we will store all the necessary data in this bucket to allow you to automate the whole client setup in the most efficient, automated way possible. This way your clients can keep sending logs as soon as the server shows up.")]),t._v(" "),s("p",[t._v("Another important component is that the certificate relies on the internal IP of the server. This means that for the cert to work even after termination, the instance needs to start with the same internal (local) IP that was used to create the initial cert.")]),t._v(" "),s("h3",{attrs:{id:"security"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#security"}},[t._v("#")]),t._v(" Security")]),t._v(" "),s("p",[t._v("Our product is configured to allow any server to send it logs. The data will be sent over an ecrypted connection, but there is not a credential system to prevent instances from sending data. For this reason, this product should not be acessible from the public Internet. It was designed to be deployed in a private subnet within a VPC, to allow only local servers to send it logs.")]),t._v(" "),s("p",[t._v("You can block traffic and instances using ACL rules at the VPC or instance level.")]),t._v(" "),s("h1",{attrs:{id:"cloudformation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cloudformation"}},[t._v("#")]),t._v(" CloudFormation")]),t._v(" "),s("a",{attrs:{target:"_blank",href:"https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=zer0x4447-rsyslog&templateURL=https://s3.amazonaws.com/0x4447-drive-cloudformation/rsyslog-server.json"}},[s("img",{staticStyle:{float:"left",margin:"0 10px 0 0"},attrs:{align:"left",src:"https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"}})]),t._v(" "),s("p",[t._v("We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to check the CloudFormation yourself, follow "),s("a",{attrs:{href:"https://github.com/0x4447-Paid-Products/0x4447_product_paid_rsyslog",target:"_blank",rel:"noopener noreferrer"}},[t._v("this link"),s("OutboundLink")],1),t._v(".")]),t._v(" "),s("p",[t._v("Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the stack by hand, from this point on you'll find the manual on how to do so.")]),t._v(" "),s("hr"),t._v(" "),s("h1",{attrs:{id:"manual"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#manual"}},[t._v("#")]),t._v(" Manual")]),t._v(" "),s("p",[t._v("Before launching an instance, you'll have to do some manual inputs to make everything work correctly. Please follow these steps in the order displayed here:")]),t._v(" "),s("p",[s("strong",[t._v("WARNING")]),t._v(": text written in capital letters needs to be replaced with real values.")]),t._v(" "),s("h3",{attrs:{id:"custom-role"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#custom-role"}},[t._v("#")]),t._v(" Custom Role")]),t._v(" "),s("p",[t._v("You need to create an EC2 role to allow the Rsyslog Server to upload and get the certificate and bash script from S3. This allows you to reuse the same cert on termination, and allows for your clients to automatically pull the public cert when they boot up. Below is the Policy Document that you need add to create this:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Version"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"2012-10-17"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Statement"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Effect"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Allow"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"s3:PutObject"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"s3:GetObject"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"s3:ListBucket"')]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Resource"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"arn:aws:s3:::BUCKET_NAME/*"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"arn:aws:s3:::BUCKET_NAME"')]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Effect"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Allow"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Action"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"s3:ListAllMyBuckets"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"s3:HeadBucket"')]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"Resource"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"*"')]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"security-group"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#security-group"}},[t._v("#")]),t._v(" Security Group")]),t._v(" "),s("p",[t._v("A default security group will automatically be created for you from the product configuration, but if you'd like to make one by hand, you'll need to have these ports open towards the instance:")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("22")]),t._v(" over "),s("code",[t._v("TCP")]),t._v(" for remote managment.")]),t._v(" "),s("li",[s("code",[t._v("6514")]),t._v(" over "),s("code",[t._v("TCP")]),t._v(" for Rsyslog to take logs in.")])]),t._v(" "),s("h3",{attrs:{id:"bash-script-for-userdata"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#bash-script-for-userdata"}},[t._v("#")]),t._v(" Bash Script for UserData")]),t._v(" "),s("p",[t._v("When you start to automate your instance, the whole process will provide you with a bucket name so that we can copy the auto generate certificate over to S3, which must be used by the client to send encrypted data to the server.")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token shebang important"}},[t._v("#!/bin/bash")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("S3_BUCKET")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("BUCKET_NAME\n"),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("LOG_TTL")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("DAYS\n\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("S3_BUCKET")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$S3_BUCKET")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">>")]),t._v(" /home/ec2-user/.env\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("echo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("LOG_TTL")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$LOG_TTL")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">>")]),t._v(" /home/ec2-user/.env\n")])])]),s("p",[t._v("Explanation:")]),t._v(" "),s("ol",[s("li",[t._v("Set the name of the S3 bucket.")]),t._v(" "),s("li",[t._v("Append the S3 bucket anem to the .env file.")])]),t._v(" "),s("p",[s("strong",[t._v("Understand how UserData works")])]),t._v(" "),s("p",[t._v("It is important to note that the content of the UserData field will be only executed once, which occurs when the instance starts for the first time. This means that the content of the UserData won't be trigered if you stop and start the instance. If you choose to not enable resilience and want to skip the UserData script at boot time, then you won't be able to later update the UserData with the script and can't expect for the automation to take place. You have two options:")]),t._v(" "),s("ul",[s("li",[t._v("Either you follow "),s("a",{attrs:{href:"https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/",target:"_blank",rel:"noopener noreferrer"}},[t._v("this link"),s("OutboundLink")],1),t._v(" for a work around.")]),t._v(" "),s("li",[t._v("Or your start a new instance, this time with the right UserData, and then copy over all the configuration files from the old instance to the new one.")])]),t._v(" "),s("h3",{attrs:{id:"connect-to-the-server"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#connect-to-the-server"}},[t._v("#")]),t._v(" Connect to the server")]),t._v(" "),s("p",[t._v("Once the instance is up and running, get its IP and connect to the instance over SSH uisng the slected key at deployment time.")]),t._v(" "),s("h1",{attrs:{id:"automatic-client-setup"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#automatic-client-setup"}},[t._v("#")]),t._v(" Automatic Client Setup")]),t._v(" "),s("p",[t._v("Once the server is deployed correctly, you can configure your clients with the following "),s("code",[t._v("UserData")]),t._v(" to setup everything automatically. This ensures that everything will be automatically set up at boot time.")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token shebang important"}},[t._v("#!/bin/bash")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Set the main variables, Replace <S3_BUCKET_RSYSLOG> with the name of the S3 bucket that you provided as a parameter to the Cloud Formation")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("BUCKET_RSYSLOG")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("S3_BUCKET_RSYSLOG"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("RSYLOG_INTERNAL_IP")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("RSYLOG_INTERNAL_IP\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Pull the cert from S3")]),t._v("\naws s3 "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" s3://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$BUCKET_RSYSLOG")]),t._v("/certs/ca-cert.pem /tmp\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# move the cert in to the final destination")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("mv")]),t._v(" /tmp/ca-cert.pem /etc/ssl/ca-cert.pem\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Copy the bash script which will configure the client")]),t._v("\naws s3 "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" s3://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$BUCKET_RSYSLOG")]),t._v("/bash/rsyslog-client-setup.sh /home/ec2-user/rsyslog-client-setup.sh\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Make the script executable")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("chmod")]),t._v(" +x /home/ec2-user/rsyslog-client-setup.sh\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Configure the client to send the logs to the Rsyslog server")]),t._v("\n/home/ec2-user/rsyslog-client-setup.sh "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$RSYLOG_INTERNAL_IP")]),t._v("\n")])])]),s("h1",{attrs:{id:"manual-client-setup"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#manual-client-setup"}},[t._v("#")]),t._v(" Manual Client Setup")]),t._v(" "),s("p",[t._v("You can also setup a client manually if you can't use the EC2 UserData by executing the following commands on your client.")]),t._v(" "),s("h2",{attrs:{id:"copy-certs-and-client-setup-scripts-to-your-local-system"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#copy-certs-and-client-setup-scripts-to-your-local-system"}},[t._v("#")]),t._v(" Copy certs and client setup scripts to your local system")]),t._v(" "),s("p",[t._v("Run the following on your local system")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Copy the cert and rsyslog-client-setup from the AWS S3 bucket to your local system.")]),t._v("\naws s3 "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" s3://"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("S3_BUCKET_RSYSLOG"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("/certs/ca-cert.pem "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(".")]),t._v("\naws s3 "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" s3://"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("S3_BUCKET_RSYSLOG"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("/bash/rsyslog-client-setup.sh "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(".")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Now, copy both these files to the client you wish to setup")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scp")]),t._v(" ca-cert.pem rsyslog-client-setup.sh ec2-user@YOUR-CLIENT-IP\n")])])]),s("h2",{attrs:{id:"configure-your-client-to-send-logs-to-rsyslog"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#configure-your-client-to-send-logs-to-rsyslog"}},[t._v("#")]),t._v(" Configure your client to send logs to Rsyslog")]),t._v(" "),s("p",[t._v("Login to your Client represented by YOUR-CLIENT-IP, and run the following")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Move the cert to the SSL path on your client")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("mv")]),t._v(" ca-cert.pm /etc/ssl/\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("chmod")]),t._v(" +x rsyslog-client-setup.sh\n./rsyslog-client-setup.sh "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("RSYSLOG_SERVER_IP"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n")])])]),s("h1",{attrs:{id:"user-management"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#user-management"}},[t._v("#")]),t._v(" User Management")]),t._v(" "),s("p",[t._v("By default we create a custom user group in the system called "),s("code",[t._v("rsyslog")]),t._v(". This makes it easier for you to add developers as individual users to access the logs. Developers can then freely look at the logs without having access to the whole system.")]),t._v(" "),s("h3",{attrs:{id:"how-to-create-a-user"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#how-to-create-a-user"}},[t._v("#")]),t._v(" How to create a user")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useradd")]),t._v(" -g rsyslog USER_NAME\n")])])]),s("h3",{attrs:{id:"how-to-set-a-password"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#how-to-set-a-password"}},[t._v("#")]),t._v(" How to set a password")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("passwd")]),t._v(" USER_NAME\n")])])]),s("h3",{attrs:{id:"how-to-delete-a-user"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#how-to-delete-a-user"}},[t._v("#")]),t._v(" How to delete a user")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("userdel")]),t._v(" USER_NAME\n")])])]),s("h3",{attrs:{id:"how-to-change-a-password"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#how-to-change-a-password"}},[t._v("#")]),t._v(" How to change a password")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("passwd")]),t._v(" USER_NAME\n")])])]),s("h1",{attrs:{id:"where-are-my-logs"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#where-are-my-logs"}},[t._v("#")]),t._v(" Where are my logs?")]),t._v(" "),s("p",[t._v("The logs can be found in the "),s("code",[t._v("/var/log/0x4447-rsyslog")]),t._v(" folder. There you'll find folders for each client's sending logs. The client host name will be used for the folder names.")]),t._v(" "),s("h1",{attrs:{id:"test-the-setup"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#test-the-setup"}},[t._v("#")]),t._v(" Test The Setup")]),t._v(" "),s("p",[t._v("Be sure to test the server to make sure it behaves the way we advertise it; not becasue we don't belive it works correctly, but to make sure that you are confortable with the product and knows how it works, especially the resiliance mode.")]),t._v(" "),s("p",[t._v("Terminate the instance and start a new one with the correct UserData in order to see if everything works as expected after the instance booted.")]),t._v(" "),s("h1",{attrs:{id:"security-concerns"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#security-concerns"}},[t._v("#")]),t._v(" Security Concerns")]),t._v(" "),s("p",[t._v("Bellow we give you a list of potentail ideas to consider regarding security, but this list is not exhaustive – it is just a good starting point.")]),t._v(" "),s("ul",[s("li",[t._v("Never expose this server to the public. Use it only inside a private network to limit who can send it logs.")]),t._v(" "),s("li",[t._v("Allow logging only from specific subnets.")]),t._v(" "),s("li",[t._v("Block public SSH access.")]),t._v(" "),s("li",[t._v("Allow SSH connection only from limited subnets.")]),t._v(" "),s("li",[t._v("Ideally allow SSH connection only from another central instance.")]),t._v(" "),s("li",[t._v("Don't give root access to anyone but yourself.")])])])}),[],!1,null,null,null);e.default=n.exports}}]);