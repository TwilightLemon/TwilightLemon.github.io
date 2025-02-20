---
title: 论文笔记 《Password-Based Credentials with Securiy Against Server Compromise》
published: 2025-02-20
description: ''
image: ''
tags: [Crypto]
category: 'Crypto'
draft: false 
lang: ''
---
原论文地址：[Password-Based Credentials with Security Against Server Compromise | SpringerLink](https://link.springer.com/chapter/10.1007/978-3-031-50594-2_8)
# 四个安全目标：

- 强不可伪造性：敌手A知道password并且服务器妥协，但不知道用户 ask (authenticated secret key)，无法伪造验证令牌
- 在线不可伪造性：A知道ask，服务器未妥协，则A只能通过在线猜测password来伪造令牌
    
    > 服务器可发现异常行为从而阻断
    
- 离线不可伪造性：A知道ask，服务器妥协，则A能使用离线暴力猜测password
    
    > 使用强口令是最后一道防线
    
- 口令隐藏性：服务器储存的avk(针对multi-key PBC 在服务器端储存的用户独有的验证凭据)不会泄露关于password的任何信息
    
    > 目的是对抗服务器妥协时泄露口令信息和服务器内部模拟用户
    

# 已有的方案

1\. “Password-based authentication” 基于密码的身份验证: 不能应对服务器妥协和弱密码猜测

2\. “FIDO”: 高熵密钥(私钥)由用户拥有(通过加密硬件和软件管理，不便携)，服务器端只拥有用于验证的公钥(不会泄露用户信息)

3\. ZWY 框架下的single-key PBC

# ZWY single-key PBC

“ZWY framework(skPBC)”: 安全等级近似于key-based方案，无需用户储存密钥信息；

- 在注册时获取 cryptographically strong access credential，可以随意安置(via untrusted cloud providers or copied on low-security devices)
- 在线不可伪造性(服务器未妥协的情况下)
- 达不到强不可伪造性和离线不可伪造性
- 服务器妥协失去所有安全性：无需恢复密钥即可模拟所有用户验证
- 不需要Pw-Hiding

服务器拥有一个全局MAC密钥,用户凭证本质是服务器对uid生成的MAC密钥副本，注册时使用用户的password对MAC密钥进行对称加密。认证时，用户解密凭证恢复MAC密钥并与消息绑定后发送给服务器。(敌手可以让不诚实的用户注册后获取MAC密钥，但是此方案不考虑”corrupt users”的存在）

敌手不知服务器的高熵MAC密钥，则无法验证解密后的值是否有效，从而确保在线不可伪造性。

## skPBC Syntax

包括五个算法 “KGen, 〈RegU, RegS〉, Sign, Vf”，两个阶段“a registration phase and an authentication phase” ，两个参与方Server / User.

Server: 长期单一密钥“KGen(λ) → (ssk, spk)”用于注册和验证所有用户，“ssk”是服务器的长期单一密钥，“spk”是与之对应的公钥

注册阶段：用户:RegU(spk,uid,pw) → ask ; 服务器: 使用ssk签出ask并储存uid

验证阶段：用户拟发送消息m，“Sign(uid, ask, pw, m) → τ”,将token τ和消息m发送给服务器，服务器执行“Vf(ssk, uid, m, τ ) → 0/1”

## ZWY Framework的安全目标和威胁模型

选择消息和选择验证请求攻击下存在不可伪造性(“Existential Unforgeability under Chosen Message and Chosen Verification Queries Attack (EUF-CMVA)” (Dayanikli 和 Lehmann, 2024, p. 151))

1. 经典的不可伪造：A只知道用户pw，对ask和server ssk一无所知
2. 达到在线不可伪造性，A知道用户ask

## Game of weak/strong UNF for A in skPBC(λ)：

现有用户列表`uid_1~n`,及其对应`pw_1~n`

敌手A可选择用户访问预言机`Sign` \ `Vf` 获取ask_i对挑战消息m进行签名和执行验证，请求过的(i,m)和i会被记录(分别在`Q`和`RevCred`中)

A获胜条件：A给出uid_j (j∈[1,n],j∉RevCred,即合法的、从未请求过的用户)、新鲜的消息m\*和签名τ\*，如果验证通过则A获胜

strongUNF实验中为A额外提供服务器私钥ssk

Weak/Strong Unforgeability定义为对所有PPT敌手获胜以上实验的概率≤negl(λ)

## skPBC达不到Strong(and Offline) Unforgeability

一旦敌手A得知服务器的密钥ssk，就能用自己选择的口令重新注册任意诚实的用户U，以获得有效的用户凭证，并以U的名义创建令牌。在skPBC方案下，敌手赢得strongUNF的概率为1。

# mkPBC

skPBC不可能具有强不可伪造性，故引入多密钥的PBC。关键的区别在于，服务器不再具有单个密钥来颁发用户凭证和验证其令牌。而是为每个注册用户生成一个特定于用户的验证密钥，并在验证用户的令牌时使用该特定于用户的密钥。

## Syntax

“A multi-key PBC scheme mkPBC = (Setup, 〈RegU, RegS〉, Sign, Vf)”

Setup(λ)->pp: 输出公共参数，作为其他算法的隐式输入

〈RegU(uid, pw), RegS(uid)〉 → (ask; avk): 注册交互，用户输出凭证ask，服务器输出用户特定的验证密钥 avk

Sign(uid,ask,pw,m)  → τ : 对消息m生成授权令牌

Vf(uid, avk, m, τ ) → 0/1 : 验证有效性

## Game of xUNF for A in mkPBC(λ) where x∈{strong,online,offline}

现有合法注册的用户uid,pw,ask,avk，敌手在特定条件下多轮访问特定预言机后，给出新的m\*,τ\*，若通过验证则敌手获胜

条件如下：

- x=strong: 给予敌手avk和pw, 可访问Sign预言机(O_Sign会记录挑战消息m)
- x=online: 给予敌手ask, 可访问Sign和Vf预言机
- x=offline: 给予敌手ask, avk, 可访问Sign和TestPW预言机((pw’)=>pw==pw’)

## Game of PW-Hiding for A in mkPBC(λ)

现有合法用户uid，均匀随机选取两个可能合法的pw: pw0和pw1，给予敌手avk(敌手此时只知道pw0和pw1,不知道具体选取的是哪一个)并访问Sign预言机(预言机知道选取的pw)，之后敌手输出选取的是哪一个pw，正确则敌手获胜。

## mkPBC的安全定义

对于一个mkPBC方案和所有PPT敌手A：

- “Strong Unforgeability” ：Pr[Game of strongUNF for A in mkPBC(λ)=1]≤negl(λ)
- “Online Unforgeability” ：Pr[Game of onlineUNF for A in mkPBC(λ)=1]≤(q_Vf+1)/|Dpw|+negl(λ)，q_Vf是猜测次数(即访问Vf预言机次数)，|Dpw|是口令域长度
- “Offline Unforgeability” ：Pr[Game of offlineUNF for A in mkPBC(λ)=1]≤qf/|Dpw|+negl(λ)，qf是请求TestPW预言机次数
- “Pw-Hiding” ：Pr[Game of PW-Hiding for A in mkPBC(λ)=1]≤1/2+negl(λ)

## 构建Sign-Then-Encrypt的PBC方案

需要三个密码学原语：

- 一个安全的伪随机函数PRF “F : {0, 1}^λ × X → Y”
    
    > “安全的”意味着函数F(key, · )与同域的随机函数不可区分
    
- 一个达到`IND-CCA安全`的非对称加密算法 ΠEnc:=(KGenE,Enc,Dec)
- 一个达到`EUF-CMA安全`的签名算法：ΠSign:=(SetupS,KGenS,SignS,VfS)
    
    > 要求实现“Complete Robustness”(CROB-Security)：即对于所有PPT敌手难以找到一对(消息,签名)能在两个不同的公钥下验证通过；
    > 
    > 以及“Randomness Injectivity” (RI)（可注入的随机性？可控的随机性？）： 所有PPT敌手难以找到对于两个不同的注入参数，使得KGen输出相同的公私钥；暗含：公钥和私钥唯一匹配，对于注入参数而言是确定性生成的。
    

## Scheme

一个基于签名后加密的多密钥PBC方案：

- Setup(λ): pp ←SetupS(λ)
- User与Server注册阶段 RegU(uid,pw) 和 RegS(uid):
    
    U: 均匀随机选取PRF密钥k←{0,1}^λ，运行KGenS(pp,F(k,pw))生成签名公私钥pkSig和skSig;
    
    运行KGenE(λ)生成加密用的公私钥pkEnc和skEnc;
    
    发送(uid,avk:=(pkSig,skEnc))到S,输出ask:=(k,pkEnc);
    
      
    *签名和非对称加密的公私钥对都在客户端生成，发送签名公钥和加密私钥作为avk，保留PRF密钥k和加密公钥作为ask*
    
    S: 接收(uid,avk)储存即可，RegS输出avk
    
- Sign(uid,ask,pw,m)
    
    运行σ←SignS(skSig,(uid,m)) 对消息和uid签名
    
    运行τ←Enc(pkEnc,σ)
    
    输出τ作为token
    
- Vf(uid,avk,m,τ)
    
    解密σ←Dec(skEnc,τ)，输出VfS(pkSig,(uid,m),σ)
    

## Theorem & Proof

### 1.如果F是安全的PRF并且ΠSign是EUF-CMA安全的签名方案，则该PBC是强不可伪造的

在服务器妥协(泄露avk)、用户pw泄露但是敌手不知道ask的情况下：敌手持有pkSig和skEnc，可解出令牌τ并得知其对应的(uid,m)；未知ask则无法运行F(k,pw)，就无法获得skSig。则可将问题归因到在未知skSig的情况下伪造签名，由于ΠSign是EUF-CMA安全，则不可行。即证明该PBC是强不可伪造的。

### 2\. 如果F是随机预言机，ΠSign具有complete robustness和randomness injectivity，且ΠEnc具有CCA安全，则该PBC是在线不可伪造的

敌手具备 ask:=(k,pkEnc) 和 uid，未知avk:=(pkSign,skEnc)和pw。敌手通过猜测pw生成伪造的(pkSig’,skSig’):=KGenS(pp,F(k,pw’))和伪造签名σ’；由于ΠEnc具有CCA安全，则访问Sign预言机不会泄露任何关于签名σ的信息；由于未知pkSign则无法自行验证生成的签名，唯一的方法是访问Vf预言机。CROB确保Vf只会泄露pkSig的相等性，可注入随机性确保pkSig‘只能映射到单一pw猜测上，则敌手只能与Vf预言机一次猜测一次交互。至此该PBC是在线不可伪造的。

### 3\.  如果F是随机预言机，ΠSign是EUF-CMA安全的，并且具有可注入随机性，则该PBC是离线不可伪造的

敌手具备ask,avk,uid,未知pw（作者在这里强调“具备ask”是指具备PRF密钥k，而不是签名私钥。注意到文中提及ask不储存而是即用即生成）。要伪造token τ则需要伪造skSig；此时敌手要么选择直接伪造签名(绕过skSig,但是ΠSign具有EUF-CMA安全则不可行)，要么通过离线暴力破解pw以生成skSig。且由于F是随机预言机、ΠSign有可注入随机性则只有唯一的pw能计算出正确的skSig。此时敌手的每一次猜测必须访问一次随机预言机F，则该PBC是离线不可伪造的。

### 4\. 如果F是安全的PRF,则该PBC具有口令隐藏性

方案中唯一依赖pw的是生成签名公私钥之时敌手知道pkSig但未知k，获取的方式是与Sign预言机交互。由于k是随即均匀选取的，且通过安全的PRF转换，则无法区分pkSig是由r=F(k,pw_b)还是从随机预言机中选取(此时avk独立于pw存在)。

# Appendix

“The DSA, Schnorr and BLS signature scheme all achieve randomness injectivity information-theoretically. DSA and Schnorr are CROBsecure assuming a collision-resistant hash function, and BLS is informationtheoretically CROB-secure.” (Dayanikli 和 Lehmann, 2024, p. 165) DSA、Schnorr 和 BLS 签名方案在理论上都实现了随机性注入性信息。DSA 和 Schnorr 是假设具有抗碰撞哈希函数的 CROB安全，而 BLS 在信息理论上是 CROB 安全的。

# 一些疑问

1. 用户需要携带两个密钥（一个自己的password和一个PRF密钥k）牺牲了便携性。在具体的方案中，PRF应该使用流密码(e.g. AES)、HMAC或其他基于椭圆曲线构造的方案。其中某些方案并不支持所有k的长度，意味着要么选择HMAC这样支持所有长度的方案，然后让用户记住2个密钥，要么使用其他方案，k交由密钥管理器或安全芯片保管(没有FIDO的便捷性强，但是对保管方的安全性要求不高)。
    
    > “We therefore do not store (or even generate) the key normally, but derive it deterministically as (pkSig, skSig) := KGenS(pp; F (k, pw)) from a PRF key k and the user’s password pw. The user now only stores the PRF key k and re-derives the signature key pair when she wants to generate an authentication token.” (Dayanikli 和 Lehmann, 2024, p. 158)
    
2. 设想一个简单的“用户名+密码(口令)”授权登录的方式：服务器储存用户id和对应的口令加盐哈希，用户端请求注册和登录时提交口令明文的哈希（避免明文网络传输），在服务器内部对比后生成授权：
    
    - 不满足强不可伪造和离线不可伪造，服务器妥协时(泄露用户信息表，加盐算作服务器私钥的一部分)无需口令即可通过验证
    - 在线不可伪造：仅能通过访问服务器暴力破解
    - Pw-Hiding: 虽然满足，但是不能阻止服务器内部模拟用户
    
    如果再加一个口令是否会更安全？不会，只会更麻烦
    
    那么mkPBC的方案我认为优势就在于以下几点：
    
    - 避免服务器内部腐败，擅自模拟用户操作
    - 强不可伪造和离线不可伪造：服务器妥协和其中一个密钥(k;pw)泄露都无法获取授权
    - password可以是便于用户记住的口令，k可以像FIDO方案一样储存，但是对储存方式安全性要求较低