---
title: Manuscript for "Identity-Based Encryption from the Weil Pairing"
published: 2025-03-04
description: ''
image: ''
tags: [Crypto]
category: 'Crypto'
---
Paper reference: [Identity-Based Encryption from the Weil Pairing | SpringerLink](https://link.springer.com/chapter/10.1007/3-540-44647-8_13)

# Known Public Encryption Scheme  

*   Setup: Generate  global system parameters and a `master-key`

*   Extract: use the `master-key` to generate the `private-key`  corresponding to an `public-key` string  $ID ∈ \{0,1\}^*$

*   Enc: encrypt M with ID → C

*   Dec: decrypt C with private-key

# Application

(interesting)

## Revocation of Public Keys

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22215%22%2C%22position%22%3A%7B%22pageIndex%22%3A2%2C%22rects%22%3A%5B%5B149.70940037000003%2C484.58142187000004%2C480.66033437%2C494.54442187%5D%2C%5B134.76490037000002%2C472.62582187000004%2C480.61540123999987%2C482.58882187%5D%2C%5B134.76480073999997%2C460.67022187000003%2C261.2849377400001%2C470.63322187%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22215%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=3">“One could potentially make this approach more granular by encrypting e-mail for Bob using “bob@hotmail.com ‖ current-date”. This forces Bob to obtain a new private key every day.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22215%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/D9XP6B7N">Boneh and Franklin, p. 215</a></span>)</span>

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22215%22%2C%22position%22%3A%7B%22pageIndex%22%3A2%2C%22rects%22%3A%5B%5B381.72764474%2C400.89222187%2C480.7399387399999%2C410.85522187%5D%2C%5B134.76480073999997%2C388.93662187%2C480.66023474%2C398.89962187%5D%2C%5B134.76480073999997%2C376.98102187%2C291.50271674%2C386.94402187%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22215%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=3">“This approach enables Alice to send messages into the future: Bob will only be able to decrypt the e-mail on the date specified by Alice”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22215%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/D9XP6B7N">Boneh and Franklin, p. 215</a></span>)</span>

## Delegation of Decryption Keys

1.  bind \<pk,sk> pairs with dates so that private-key can be stored in a vulnerable device: only thoses pairs are compromised and the Master-key is unharmed.
2.  delegations of duties or other title as a skill to distribute private keys.

# Construction

## preparation

### Bilinear Map:  e.g. Weil pairing

$$
 e: G_1 \times G_1 \rightarrow G_2
$$

, where $G_1$ and $G_2$ are two CYCLIC groups of some large prime order $p$ .

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22216%22%2C%22position%22%3A%7B%22pageIndex%22%3A3%2C%22rects%22%3A%5B%5B175.40282900000003%2C431.93851%2C480.096666%2C442.64928%5D%2C%5B134.765%2C418.29671934000004%2C480.64607099999995%2C432.06751%5D%2C%5B134.75561850000005%2C408.02853%2C264.157754%2C418.73827%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22216%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=4">“In our system, G1 is the group of points of an elliptic curve over Fp and G2 is a subgroup of F∗p2 . Therefore, we view G1 as an additive group and G2 as a multiplicative group.”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22216%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/D9XP6B7N">Boneh and Franklin, p. 216</a></span>)</span>

*   Bilinear  $ e(aP,bQ) =e(P,Q)^{ab} \; for \; all \; P,Q∈G_1 \; and \; all \; a,b ∈ Z$

*   DH problem is hard in  $G_1$

### Properties of the Weil Pairing

Build:

$$
E:\; y^2=x^3+1 \; over \; \mathbb{F}_p,
$$

where prime $p$ satisfies $ p =2 \; (mod \; 3) \; and \; p=6q-1 \; for \; some \; prime \; q$

## Syntax

*   **Setup**:  k -> sys param (publicly shared) | master key (owned by PKG (<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22216%22%2C%22position%22%3A%7B%22pageIndex%22%3A3%2C%22rects%22%3A%5B%5B194.46929001%2C189.19395407000002%2C303.8032520100001%2C199.15695407%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22216%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=4">“Private Key Generator”</a></span> ))

*   **Extract(master-key K,string ID) **=> private decryption key d.> ID is used as a public key    

*   **Enc/Dec**

## Secure Models

*   IND-ID-CCA: <span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22218%22%2C%22position%22%3A%7B%22pageIndex%22%3A5%2C%22rects%22%3A%5B%5B411.2665887000001%2C530.4193803699999%2C480.6289947000001%2C540.38238037%5D%2C%5B134.75348670000005%2C518.4637803699999%2C210.6615837000001%2C528.42678037%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22218%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=6">“adaptive chosen ciphertext attack”</a></span><span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22218%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/D9XP6B7N">Boneh and Franklin, p. 218</a></span>)</span>

*   ID-OWE(one-way encryption): Given random public key  $K_{pub}$  and ciphertext C which is the encryption of a random message M using  $K_{pub}$  , A’s goal is to recover M.

models above allow A to conduct multi-round queries of \<ID,d(private key)> pairs;

## Scheme

### MapToPoint(string ID)=> Point

$G: \; \{0,1\}^* \rightarrow \mathbb{F}_b$ , where in the security analysis  G is viewed as a `random oracle`.

1.  Compute  $ y_0 = G(ID)$   and  $ y_0 \rightarrow E:\;x_0=(y^2_0 -1)^{1/3} =(y^2_0-1)^{(2p-1)/3}\;mod\;p$

2.  return  $Q_{ID} = 6(x_0,y_0) ∈ E/\mathbb{F}_b$

### Basic IBE (BasicIdent)

security parameter: $k$

#### Setup

Step 1: Choose a large k-bit prime p such that p = 2 mod 3 and p = 6q − 1 for some prime q > 3. Let E be the elliptic curve defined by $y^2 = x^3 + 1$  over $\mathbb{F}_b$ . Choose an arbitrary $P ∈ E/\mathbb{F}_p$  of order q.

Step 2: Pick a random $s ∈ Z^*_q$  and set $P_{pub} = sP$ .

Step 3: Choose a cryptographic hash function $H: \; F_{p^2} → \{0, 1\}^n$  for some n. Choose a cryptographic hash function $G: \; \{0, 1\}^∗ → \mathbb{F}_p$. The security analysis will view H and G as random oracles.

> output: system params :=$<p,n,P,P_{pub},G,H>$ , master-key : $s∈\mathbb{Z}_q$ picked in Step 2.
>
> Message space is $ M =\{0,1\}^n$
>
> Ciphertext space is $ C= E/\mathbb{F}_b \times \{0,1\}^n$  

#### Extract(string ID)

Step 1. $ Q_{ID} = MapToPoint(ID)$

Step 2. private key $d_{ID}=sQ_{ID}$, where s is the master key.

#### Encrypt

$$
Q_{ID} = MapToPoint(ID)
$$

$$
r \xleftarrow{\text\$} \mathbb{Z}_q
$$

$$
C=<rP,M \oplus H(g^r_{ID})> \; where \; g_{ID}=e(Q_{ID},P_{pub})
$$

#### Decrypt

<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FBQTNBP2M%22%2C%22pageLabel%22%3A%22222%22%2C%22position%22%3A%7B%22pageIndex%22%3A9%2C%22rects%22%3A%5B%5B182.47192882999997%2C546.8013%2C480.63134203999965%2C556.7643%5D%2C%5B143.26931716999997%2C534.09952%2C480.59374037000003%2C544.80929%5D%2C%5B143.26549007000006%2C522.64177%2C339.58197999999993%2C532.85427%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22222%22%7D%7D" ztype="zhighlight"><a href="zotero://open/library/items/BQTNBP2M?page=10">“Let C = 〈U, V 〉 ∈ C be a ciphertext encrypted using the public key ID. If U ∈ E/Fp is not a point of order q reject the ciphertext. Otherwise, to decrypt C using the private key dID compute:”</a></span> <span class="citation" data-citation="%7B%22citationItems%22%3A%5B%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F16470860%2Fitems%2FD9XP6B7N%22%5D%2C%22locator%22%3A%22222%22%7D%5D%2C%22properties%22%3A%7B%7D%7D" ztype="zcitation">(<span class="citation-item"><a href="zotero://select/library/items/D9XP6B7N">Boneh and Franklin, p. 222</a></span>)</span>

$$
M = V \oplus H(e(d_{ID},U))
$$

proof:

$$
e(d_{ID},U)=e(d_{ID},rP) =e(Q_{ID},P)^{sr} = e(Q_{ID},P_{pub}), \; where \; P_{pub}=sP \; is \; sys-param
$$

### IND-CCA Security: enhanced by Fujisaki-Okamoto transform

#### Fujisaki-Okamoto transform

Suppose $<PEnc,PDec>$ is a public key encryption scheme.H and G are hash functions(viewed as random oracles): $ H: \{0,1\}^n \times \{0,1\}^n \rightarrow \mathbb{F}_q$ , $G: \{0,1\}^n \rightarrow \{0,1\}^n$

$$
\sigma \xleftarrow{\text\$} Key \; Domain \; of \; H
$$

$$
 Enc_{FO}: C_K = PEnc(pk,\sigma; H(\sigma,M)) , \; C_M= G(\sigma) \oplus M
$$

$$
Dec_{FO}: \sigma = PDec(sk,C_K), \; verify \; C_K == Enc_{FO}(·).C_K \; then \; M= C_M \oplus G(\sigma)
$$

> Comparing with conventional Hybrid Encryption, FO transform  surpasses as follows:
>
> *   IND-CCA Security
> *   using Hash functions to blind random seeds and message
> *   check keys before decryption

#### Encrypt

$$
Q_{ID} = MapToPoint(ID)
$$

$$
\sigma \xleftarrow{\text\$} \{0,1\}^n, \; then \; r=H(\sigma,M)
$$

$$
C=<rP,\sigma \oplus H(g^r_{ID}), M \oplus G(\sigma)>
$$

> Notice that $g^r_{ID} =e(Q_{ID,P_{pub}})^r$  binds with both the message M and the random seed $\sigma$ ,functioning as $H(\sigma,M)$ as that above.

#### Decrypt: receive C=\<U,V,W>

1.  Check if  $U ∈ E/\mathbb{F}_p$  is not a point of order q, otherwise reject C

2.  Compute  $ \sigma = V \oplus H(e(d_{ID},U))$

3.  Decrypt  $ M=W \oplus G(\sigma)$

4.  re-compute and check   $r=H(\sigma,M) == U =rP$
