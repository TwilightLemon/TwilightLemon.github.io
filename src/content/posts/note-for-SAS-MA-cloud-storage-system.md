---
title: 论文笔记 《Device-Enhanced Secure Cloud Storage with Keyword Searchable Encryption and Deduplication》
published: 2025-02-23
description: ''
image: ''
tags: [Crypto]
category: 'Crypto'
draft: true 
lang: ''
---
原论文地址：
1. [Device-Enhanced Secure Cloud Storage with Keyword Searchable Encryption and Deduplication | SpringerLink](https://link.springer.com/chapter/10.1007/978-3-031-70903-6_20)
2. [Secure Communications over Insecure Channels Based on Short Authenticated Strings | SpringerLink](https://link.springer.com/chapter/10.1007/11535218_19)

# 双线性映射Bin-linear Map

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22400%22%2C%22position%22%3A%7B%22pageIndex%22%3A4%2C%22rects%22%3A%5B%5B39.40400871913795%2C212.336551831%2C385.19543709878843%2C222.428273756752%5D%2C%5B39.4025698368481%2C200.375553295%2C385.2086489790012%2C211.0848576768476%5D%2C%5B39.402826538581394%2C189.57869231754017%2C108.45759041264529%2C198.51514429687816%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22400%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=5">“Suppose that G is an additive group of prime order p and GT is a multiplicative group of the same order. A bilinear map e : G × G → GT has the following three properties”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22400%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 400</a></span>)</span>

suppose e is a map, e(param\[] elements) is a function call.

*   双线性This means that e respects the group operations in both groups, i.e., it is linear in both arguments. The exponents a and b act multiplicatively on the map.*此处的映射定义为加法群到乘法群*

*   $  e(Q,R) != 1, for\; all\; Q,R∈G, Q!=R  $1 denotes UNIT Element in Multiplicative Group

*   e 便于计算 ??

# MLE
~~不用说懂得都懂~~
# SAS-MA

including 2 channels:

*   open channel<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22401%22%2C%22position%22%3A%7B%22pageIndex%22%3A5%2C%22rects%22%3A%5B%5B285.1118094399563%2C545.9691749927056%2C399.444596736801%2C554.9056269720436%5D%2C%5B53.57700598028832%2C534.0170440678318%2C399.4107235783859%2C542.9534960471698%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22401%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=6">“allows for transmission of messages of arbitrary length, but is subject to man-in-the-middle adversaries.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22401%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 401</a></span>)</span> 允许传输任意长度的消息，但受制于中间人对手。

*   SAS channel<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22401%22%2C%22position%22%3A%7B%22pageIndex%22%3A5%2C%22rects%22%3A%5B%5B100.78179613468113%2C522.064913142958%2C361.072694015414%2C532.98743%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22401%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=6">“allows for transmission of up to t′-bit (e.g., 20-bit) messages”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22401%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 401</a></span>)</span> 允许传输高达 t′ 位（例如 20 位）的消息

“commitment“ is more alike a hash sign of Message m for authentication

# 威胁模型

*   CS \ KS:  compromised<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22402%22%2C%22position%22%3A%7B%22pageIndex%22%3A6%2C%22rects%22%3A%5B%5B180.2653873864164%2C218.70994444120265%2C385.22794465299063%2C227.64639642054064%5D%2C%5B39.40319356190381%2C206.74884717655024%2C385.25783275250546%2C215.68529915588823%5D%2C%5B39.40319356190381%2C194.79671625167646%2C385.27178017554456%2C203.73316823101445%5D%2C%5B39.40319356190381%2C182.83561898702405%2C217.14593540814747%2C191.77207096636204%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22402%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=7">“An honest-but-curious cloud server may compromise the key servers to launch offline brute-force attacks and offline KGA against files and keywords, respectively. The number of compromised key servers is assumed to be less than the threshold.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22402%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 402</a></span>)</span>

*   Open Channel:

    *   disclose pw & pw-derived sk
    *   pw is low-entropy
    *   A can reveal pw by existing \<pw,sk> pairs

*   Trusted device owned by R

cln. <span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22403%22%2C%22position%22%3A%7B%22pageIndex%22%3A7%2C%22rects%22%3A%5B%5B211.08968652198027%2C436.32279462013236%2C399.4137058101841%2C445.2592465994704%5D%2C%5B66.5273830842246%2C424.37066369525854%2C362.8977894069446%2C433.30711567459656%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22403%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=8">“secure against an honest-but-curious cloud server, compromised key servers, and man-in-the-middle adversaries”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22403%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 403</a></span>)</span>

# Construction

## phase 1.

### ParaGen:

*   KS\*n , 0\<t\<n : threshold

*   素数p阶加法群G，生成元P；p阶乘法群GT

*   e双线性映射：e: G × G -> GT

*   Hash functions

    *   H: \*->G
    *   h1: G&\*->K(secure para.)
    *   h2: GT->K
    *   h3: \*->K
    *   h4: G&\*->Zp\*

*   对称加密 SEnc\SDec

*   PKEnc\PKDec

### ServerSecretGen:

KS 进行分布式密钥生成，产生α和β, and ones for their own.

KS\_i owns αi & βi.

pk: V=α\*P , Q=β\*P and Vi Qi for KS\_i of their own.

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22403%22%2C%22position%22%3A%7B%22pageIndex%22%3A7%2C%22rects%22%3A%5B%5B276.7322854886617%2C158.5250944621%2C399.4017761988422%2C168.4876942161%5D%2C%5B53.57602892379428%2C146.9724637873616%2C399.3748729756876%2C155.90891576669958%5D%2C%5B53.57603217160175%2C133.86554353%2C399.391125895123%2C144.57494664150002%5D%2C%5B53.57731896793456%2C121.91364686200001%2C399.4062014756252%2C132.6229498155%5D%2C%5B53.579466303985384%2C109.952648327%2C325.05115699337745%2C120.6619522565%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22403%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=8">“the key servers perform the distributed secret generation algorithm illustrated in Algorithm 1 twice to create two secrets α and β that are shared among them. Each key server KSi (i ∈ [n]) owns the secret shares αi and βi. The public keys V = α · P , Q = β · P and the public shares Vi = αi · P , Qi = βi · P for i ∈ [n] are published.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22403%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/JH5RQ343">Jiang et al., 2024, p. 403</a></span>)</span>

> 运行算法两次得到的α和β分别用于File M和Keyword kw的签名

#### Algorithm 1:

> 实质是分布式密钥协商算法：
>
> The public key PK is shared and available, while each server only knows its own private share.

prepare(input): 安全参数K, 大素数p, KS index 1\~n, threshold t.

> P是 Zp\*的生成元

1.  for every KS\_i: , $$b_{i,0} \xleftarrow{\text\$} Z^*_p$$    $f_i(x) = poly_x: b_{i,(0~t)}$

2.  for every KS\_i: 计算$b_{i,(0~t-1)} \cdot P$  并公开，send $f_i(j)$  to every $KS_j$now, for all $KS_i$  owns all KS’s $b_{(index),(range: t)} \cdot P$> $b_{i,i} \cdot P$ ：目的是盲化$b_i$
    >
    > threshold参数在$poly_x$上体现，只需要t个KS协作即可完成认证

3.  all trusted KS verifies: $  f_j(para: index)\cdot P == \sum_{n=0}^{t-1}{i^n \cdot b_{j,n}}  $> 确保得到的$b_i$与$KS_i$所声明的一致（在KS群中保持一致，不可能存在一个腐败的KS，除非所有KS都欺骗Server）

4.  $KS_i$: 计算 $s_i = \sum_{q=1}^n{f_q(para:i)}$$PK_i$ = $s_i \cdot P$  \\\升阶(群内)盲化

5.  for all KS: 协商获得 pk:  $PK=\sum_{q=1}^{n}{b_{q,0} \cdot P}$

> OUTPUT:
>
> PK | {$PK_i \; for\; every\; KS_i$}
>
> ($\{s_i\}$ are stored inside KS as secure key)
>
> $s_i,\; α_i,\; β_i$
>
> use $PK_i (aka. \; V_i \; Q_i)\; to \; verify \; sign \; σ'_i$

### ReceiverKeyGen:

k∈Zp\* randomly (在device D中储存)

$$
\gamma = h_4(k \cdot H(pw) || pw ) ,  \Gamma = \gamma \cdot P
$$

(<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FA54BVCMA%22%2C%22pageLabel%22%3A%22404%22%2C%22position%22%3A%7B%22pageIndex%22%3A8%2C%22rects%22%3A%5B%5B67.99864627306988%2C371.180908692414%2C216.33279033116298%2C380.117360671752%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FJH5RQ343%22%5D%2C%22locator%22%3A%22404%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/A54BVCMA?page=9">“the password-derived public key Γ”</a></span> )

γ是私钥，Γ是公钥  used in PKEnc\PKDec

## phase 2.

### MLEKey & sdk(server-derived key) Gen:

prepare: File M and its Keywords {w\_j} T=|{wj}|

1.  $$r' \; and \; \{r_j\}: \; size\; of\; T\; \xleftarrow{\text{\$}} Z^*_p $$$M’ = r’ \cdot H(M)$    文件HASH盲化$w’_j=r_j \cdot H(w_j)$   Keyword hash盲化

2.  共享 M’ 与  $\{w’_j\}$  with All KS

3.  for KS\_i: Sign “the signatures  $σ'_i = α_i \cdot M′\; and \; δ_{i′,j} = β_i · w′_j \; for \; j = 1, 2, · · · , T .$   These signatures will be transmitted to S”

4.  Server verifies signs

    $$
    e(σ’_i,P)==e(M’,Vi)\; and \; e(δ’_{i,j},P) ==e(w’_j,Q_i)
    $$

kw: BLS signature \ Lagrange interpolation

***

补充知识：

### BLS签名的基本步骤

1.  **密钥生成**：

    *   选择一个椭圆曲线群 G 和双线性映射e

        $$
        e: G \times G \rightarrow G_T
        $$

    *   生成私钥$x \in \mathbb{Z}_q$（一个随机数，q 是群的阶）。

    *   计算公钥  $P = x \cdot G$ ，其中 G 是基点。

2.  **签名生成**：

    *   对消息 m 进行哈希处理，得到 H(m)，这里 H(m)是一个映射到椭圆曲线的点。

    *   使用私钥 x对 H(m) 进行签名：签名

        $$
        \sigma = x \cdot H(m)
        $$

3.  **签名验证**：

    *   验证者首先计算 H(m) 并得到消息的哈希值。

    *   使用公钥 P 和签名 σ 进行验证：检查是否满足以下等式：

        $$
        e(\sigma, G) = e(H(m), P)
        $$

    *   如果该等式成立，则签名是有效的，否则无效。

4.  **正确性验证(双线性)**:

    $$
    \sigma = x \cdot H(m)  
    $$

$$
P = x \cdot G  
$$

$$

e(\sigma.G) = e(H(m),G)^x
$$

$$
e(H(m),P) = e(H(m),G)^x
$$

**拉格朗日插值（Lagrange Interpolation）** 是一种多项式插值方法，用于通过已知的离散数据点（$x_i, y_i$​）构建一个多项式，该多项式通过这些数据点。具体来说，给定 n+1 个数据点 $(x_0, y_0), (x_1, y_1), \dots, (x_n, y_n)$，拉格朗日插值通过构造一个多项式 L(x)，使得：

$$
L(x_i) = y_i, \quad \forall i = 0, 1, \dots, n
$$

拉格朗日插值公式为：

$$
L(x) = \sum_{i=0}^{n} y_i \cdot \ell_i(x)
$$

其中，$\ell_i(x)$ 为第 i 个基拉格朗日多项式，其定义为：

$$
\ell_i(x) = \prod_{\substack{0 \leq j \leq n \\ j \neq i}} \frac{x - x_j}{x_i - x_j}
$$

这意味着每个基多项式  $ell_i(x)$ 在 $x_i$ 处为1，其他数据点处为0。最终，L(x) 就是通过所有数据点的加权组合。

***

### Encryption

1.  使用MLE Key $ek_M$对称加密M：

    $$
    C_M = SEnc(ek_M,M).
    $$

2.  Γ是用户的pw-derived pk，公钥加密MLE KEY:

    $$
    C_{ek_M} = PKEnc(\Gamma,ek_M)
    $$

3.  加密server-derived keywords , ξj 从Zp\*中随机选取：

    $$
    C_{sdk_wj} = (\xi_j \cdot P, h_x(\tau_j))
    $$



    $$
    where, \tau_j = e(H(sdk_wk,\xi_j \cdot \Gamma))
    $$

OUT SOURCE: $C_M$ , $C_(ek_M)$, ${C_(sdk_wj)}$ for j∈\[T]

### De-duplication

package:

$$
L_R := (Ind_{M^*}, C_{eK_{M^*}}, \{C_{sdk_{w^*_j}}\} )
$$

$$
L_G =\{ Ind_M*, X_M*, C_M*\} \; where, X_M* = h_3(C_m*)
$$

## phase 3. Data Access

### R: Key Recovery (SAS-MA)

> $input: pw \quad output: private-key \; \gamma$

1.  Client  interact with Device:

    $$
    r ∈ Z^*_p , \; z∈\{0,1\}^K, \; R_c ∈ \{0,1\}^{t'}
    $$



    $$
    盲化 pw'=r \cdot H(pw), \; Com=h_3(pw' || R_c||z)
    $$



    $$
    D: R_D ∈ \{0,1\}^{t'} → Client
    $$



    $$
    C: \Phi_C = R_C \oplus R_D \; send\; (R_C,z) \;to \;D
    $$

    在SAS信道中(C TO D)：

    $$
    \Phi_C = R_C \oplus R_D
    $$

    D 计算 checksum

    $$
    \Phi_D =R_C \oplus R_D \; == \Phi_C
    $$

    检查承诺

    $$
    Com == h_3(pw'||R_C||Z)
    $$

    成功则进行(实质是一个同态加密，pw经过盲化，只传输并操作pw’，C拥有盲化因子, k是Device拥有的私钥)并 send to C:

    $$
    v'= k \cdot pw'
    $$

    C 解盲化并得到私钥γ

    $$
    v=r^{-1} \cdot v' \; and \; private-key \; \gamma = h_4(v||pw)
    $$

    > 即得到私钥 $\gamma = h_4(k \cdot H(pw) || pw )$

### Kw Search

> $$
> input:\; keyword
> $$

1.  Client interacts with KS to blinds w\*, r\*∈Zp\*

    $$
    W^* =  r^* \cdot H(w^*) \;→ \; KS
    $$

2.  For  $KS_i$ :

    $$
    \xi'_i = \beta_i \cdot W^* \; → C
    $$

3.  Client Check  \* threshold by:

    $$
    e(\xi'_i,P) = e(W^*,Q_i)
    $$

    then computes:

    $$
    \xi = r^{*-1} \sum_{n∈L}\lambda_n \xi'_n
    $$

    computes server-derived kw:

    $$
    sdk_{w*} = h_1(\xi||w^*)
    $$

4.  $T_{sdk_{w^*}} = \gamma \cdot H(sdk_{w^*})$   send to CS

5.  query  $L_R$  for  $C_{sdk_w} =(A,B)$ \
    verify  $h_2(e(T_{sdk_{w^*}},A)) == B$ \
    send (enc)MLE Key $C_{ek_M}$   (and  $C_M$  ?) to C

### Decryption

$ek_M = PKDec(\gamma,C_{ek_M}) → MLE \; Key$

$ decrypts \; M=SDec(e_{k_M},C_M)$

