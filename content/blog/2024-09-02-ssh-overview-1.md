---
layout: blog
title: Lets go SSH
date: 2024-09-02T05:11:56.773Z
category: System Design
---

### Let's Go SSH (Secure Shell)

## Before SSH

Client -> Sniffer in Internet -> Server
Packets went open and anyone can see what your sending and reciving which is a big problem. 

## Overview
Above is the use case of SSH.
In this blog, we will try to demystify the SSH commands, how to SSH into a remote server, and the must-know commands for every developer out there.

## Background
In this setup, if a sniffer can see the packets, then when you log in to the server with the server's username and password, it's clear as day, and bam, your server is compromised. So what to do?

Options:
What if the packets sent and received from the client to the server are encrypted? For example, if packets are coming wrapped in a box (not visible), then it doesn’t matter how many packets are coming, as the sniffer can’t infer what’s inside the packets.

So with SSH, communication looks like this:

```bash
Client -> SSH Encrypt --> Sniffer --> SSH Decrypt -> Server    

                      <   INTERNET   >

```

With this new setup, we are airtight ? well, not really, but we are in a better position.

## Theory
Now let’s understand the theory part too. After this, you’ll be able to impress your nerdy friends about this new SSH tech and commands you can run.

There are two things running: one is the SSH client and the other is the SSH server.

### 1. Password Authentication
How does initiating the connection look?

A. The client types the command:
```bash
ssh username@remoteServerUrl
```
Let’s say `username` = kanishk.

What Happens When You Run This Command?
1. The client asks to connect to the server.
2. The server sends the public key and asks the client to validate with the "kanishk" password (password on the remote server).
3. The client saves the kanishk public key in `known_hosts`, and if it provides the correct password, the SSH connection is established.

For a new ssh session:
The above process is repeated.

Now it’s all great, but how does it solve our problem? We are still providing a password for the remote server. Yes, you understand it right. Keys solve this problem.

### How Exactly Key Authentication Works
**Overview:**
You generate a public/private key pair and store the public key of the client in the server directory `~/.ssh/authorized_keys`:
    ```bash
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```
    The above command generates two keys: `id_rsa` and `id_rsa.pub`.

Then you can save the content of `id_rsa.pub` to the server file `~/.ssh/authorized_keys`.

The above process can be automated using:
    ```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@remoteServerUrl
    ```

Automation is good, but you still have to enter the password for the first time.

To prevent that part too:
Go to your remote host (physically), then copy the public key of the client to the directory `~/.ssh/authorized_keys`, and voilà, you’re done.

With keys, the command steps:
```bash
ssh -i ~/.ssh/your_private_key username@remoteServerUrl
```
or
```bash
ssh -i ~/.ssh/id_rsa kanishk@remoteServerUrl
```

The steps remain the same, with the change that if a matching key is found, the server will allow you to log in without prompting for a password.

Yes, we’ve done it. Not really; Tatu Ylönen did it—a nerdy joke :P.

## Bonus Section
You are good to go, but here’s a little tip for those going the extra mile.

**Configure SSH for Convenience (Optional):**

Create this file:
```bash
vi ~/.ssh/config
```
Contents:
```
Host serverAlias
    HostName remoteServerUrl
    User username
    IdentityFile ~/.ssh/id_rsa
```

Now, the command instead of `ssh -i ~/.ssh/id_rsa kanishk@remoteServerUrl` looks like:
```bash
ssh serverAlias
```

Awesome, this wraps up. If you have any suggestions, please feel free to reach out.

P.S. Some great videos/contents on SSH:
* [Video 1](https://www.youtube.com/watch?v=YS5Zh7KExvE&list=PPSV) (A little long but worth every minute).
* [Video 2](https://www.youtube.com/watch?v=5JvLV2-ngCI)