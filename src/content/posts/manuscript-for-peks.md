---
title: Manuscript for "Public Key Encryption with Keyword Search"
published: 2025-03-03
description: ''
image: ''
tags: [Crypto]
category: 'Crypto'
draft: false 
---
Paper reference: [Public Key Encryption with Keyword Search | SpringerLink](https://link.springer.com/chapter/10.1007/978-3-540-24676-3_30)

# PEKS using Bilinear Maps

## Construction

### 素数p阶群, （乘法群）定义双线性映射：

非退化性：

*   $ e(g,g) \rightarrow g' , \; where \; g' \; is \; a \; generator \; of \; G_2$

### Hash functions:

*   $ H_1: \{0,1\}^* \rightarrow G_1$
*   $ H_2 : G_2 \rightarrow \{0,1\}^{\log{p}}$

## PEKS Scheme

$$
PEKS \; Scheme:=(KeyGen,PEKS,Trapdoor,Test)
$$

### KeyGen:

input 安全参数$\lambda$ , 群阶p, $G_1$ ,$G_2$ ，$$ \alpha \xleftarrow{\text\$} Z^*_p$$, g是 $G_1$ 的一个生成元

output $ A_{pub} = [g,h=g^\alpha] \; and \; A_{priv} =\alpha$

> 一个典型的RSA公私钥分发

### PEKS($A_{pub},W$):

$$ r \xleftarrow{\text\$} Z^*_p$$ 
, then compute $ t = e(H_1(W),h^r)$

output $S=[g^r,H_2(t)]$

### $ Trapdoor(A_{priv},W) => T_W =H_1(W)^\alpha$

> Notice that $ t ∈ G_2$  and $ T_W ∈ G_1$

### Test($A_{pub}$, S, $T_W$)

S=\[A,B]

output $H_2(e(T_W,A)) == B$

### proof:

$$
H_2(e(T_W,A)) = H_2(e(H_1(W)^\alpha,g^r)) = H_2(e(H_1(W),g)^{\alpha r})
$$

$$
H_2(t) = H_2(e(H_1(W),h^r)) = H_2(e(H_1(W),g^{\alpha r}))= H_2(e(H_1(W),g)^{\alpha r})
$$

## BDH Assumption

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2F263DSXDA%22%2C%22pageLabel%22%3A%22512%22%2C%22position%22%3A%7B%22pageIndex%22%3A6%2C%22rects%22%3A%5B%5B134.76133%2C350.8833972%2C480.50933480000003%2C360.5445306%5D%2C%5B134.76129%2C339.0033972%2C480.6450542%2C350.71035%5D%2C%5B134.76151%2C327.0033972%2C480.55128557999967%2C336.66458059999997%5D%2C%5B134.7604%2C315.9373418%2C296.1176583800001%2C324.78413059999997%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FKYUKPHCB%22%5D%2C%22locator%22%3A%22512%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/263DSXDA?page=7">“Bilinear Diffie-Hellman Problem (BDH): Fix a generator g of G1. The BDH problem is as follows: given g, ga, gb, gc ∈ G1 as input, compute e(g, g)abc ∈ G2. We say that BDH is intractable if all polynomial time algorithms have a negligible advantage in solving BDH.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FKYUKPHCB%22%5D%2C%22locator%22%3A%22512%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/KYUKPHCB">Boneh et al., 2004, p. 512</a></span>)</span>

## 安全性证明

### 定理1. 非交互式PEKS在`适应性选择关键词攻击`下具有语义安全，如果BDH是难解问题。

*   **<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">安全目标</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">：在自适应选择关键词攻击下语义安全。</span></span>

*   <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">归约到BDH问题</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">：</span></span>

    *   <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">假设存在攻击者 </span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">A</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 能以优势 </span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">ϵ</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 区分关键词加密，构造算法 </span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">B</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 利用 </span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">A</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 解决BDH问题。</span></span>

    *   <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">模拟过程</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">：</span></span>

        1.  *<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">B</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 接收BDH挑战 </span></span> $(g,g^α,g^β,g^γ)$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">，模拟公钥 </span></span> $h=g^α$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">。</span></span>

        2.  <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">对 </span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">A</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 的陷门查询，若关键词关联 </span></span> $g^β$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">，则终止；否则返回合法陷门。</span></span>

        3.  <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">挑战阶段，随机选择 </span></span> $W^b$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​，构造密文 </span></span> $(g^γ,H_2​(e(g^β,g^{αγ})))$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">。</span></span>

        4.  <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">攻击者成功时，</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">B</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 从哈希列表提取</span></span> $ e(g,g)^{αβγ}$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">。</span></span>

*   <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">优势分析</span></span>**<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">：</span></span>

    *   *<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">B</span></span>*<span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)"> 的成功概率为 </span></span> $  ϵ/(e \cdot q_T \cdot ​q_{H_2}​​ )  $ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">，其中 </span></span> $q_T$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​ 为陷门查询次数，</span></span> $q_{H_2}$ <span style="color: rgba(255, 255, 255, 0.9)"><span style="background-color: rgb(33, 33, 33)">​​ 为哈希查询次数。</span></span>
