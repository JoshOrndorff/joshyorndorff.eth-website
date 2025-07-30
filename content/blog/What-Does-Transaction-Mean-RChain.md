+++
date = '2018-11-12'
title = "What does Transaction mean for RChain?"

tags = [
    "RChain",
    "Blockchain",
]
categories=[]
+++

The concept of a <a href="https://en.bitcoin.it/wiki/Transaction">bitcoin transaction</a> is pretty clear. It is a financial payment from one party to another. While there are some nuances when it comes to things like multi-signature wallets, or P2PK vs P2PKH, bitcoin transactions don't generally vary by orders of magnitude in complexity. That being the case, it is natural to discuss the performance of the bitcoin network in terms of how many transactions it can handle per second (TPS). When other cryptocurrencies like litecoin came along, it was natural to compare their performance by comparing TPS.

When the second generation of blockchain platforms surfaced, starting with Ethereum, the concept of transaction became blurred because, unlike bitcoin, ethereum <em>can and does</em> support arbitrarily complex transactions. So it no longer makes sense to directly compare TPS without being more specific about what you mean by "transaction".

<h2>Many Useful Notions of Transaction</h2>
RChain is a smart contract platform like ethereum and it has the same ability to run arbitrarily complex code. Like bitcoin, smart contract platforms also support financial transaction along with many other types of transactions. Everyone agrees that we need to make fair comparisons and not compare different types of transaction to one another especially if doing so gives a false impression about a platform's actual performance. This has led several groups to make claims such as, "I declare, once and for all, that transaction means ...". But this approach is inherently problematic because there exist many useful notions of transaction. There isn't just one, and the one that is relevant to you depends on what you're talking about. So rather than make another once-and-for-all declaration, my goal is to describe several different useful notions of transactions as they arise in the RChain world.

<h2>Transactions - Disambiguation</h2>
<ul>
<li><strong>Comm Event</strong> - The <a href="https://www.sciencedirect.com/science/article/pii/S1571066105051893">RhoVM</a> is based on communicating over channels. When a message is sent and received, it is a communication event. This is the atomic unit of computation in RChain and the most rigorous mathematical notion of transaction. This term is not relevant to platforms that are based on a Von Neumann architecture, like ethereum.</li>

<li><strong>Deploy</strong> - Anyone can deploy code to RChain that sends messages, receives them, or both. Not all deploys will cause actual computation to happen (imagine sending a message that is not yet received). So every deploy will create zero or more comm events.</li>

<li><strong>Token Transfer</strong> - Bitcoin-like payment transactions that move REV (RChain’s utility token) or other tokens around are common and can be used for reasonably fair comparisons to cryptocurrency platforms. These transactions generally require around a dozen comm events.</li>

<li><strong>Contract Invocation</strong> - These occur when you deploy code that sends a message to an existing smart contract and causes some computation. Contract Invocation is the most general kind of transaction and will produce one or more comm events. Because these transactions vary so widely in complexity, they are not a good metric for comparing platforms.</li>
</ul>

<h2>How to Talk About Transactions</h2>
When context makes it clear what notion of transaction you mean, just say "transaction" and get on with your life. On the other hand, if you're in the likely case that clarity is needed, try to use one of the less ambiguous terms I proposed above. At the end of the day, just try to be honest and communicate in good faith. If we all do that, confusion will be greatly reduced.


