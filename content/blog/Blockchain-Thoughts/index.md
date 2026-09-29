+++
title = "Miscellaneous Blockchain Thoughts"
date = "2026-09-29"

tags = [
    "Blockchain",
    "Brain Dump",
    "Incomplete",
    "Bitcoin",
    "Ethereum",
]
categories = []
image = "JoshyThinkingAboutBlockchain.jpg"
+++

I have a list of blog posts that I intend to write at some point. Some of the ideas there are from almost two years ago and I haven't made any progress on them. In this post, I'll dump four separate blockchain related blog ideas to get them out of my queue.

## BTC Asset Lasts But Bitcoin POW Chain Dies

> Originally drafted on 13 November 2024

Maybe proof of work is just the distribution mechanism for bitcoin. It is a good sorta permissionless way to do an initial distribution open to anyone who hears and believes.
But Vitalik says that We want security to be very one-sided: Easy to make something secure and take a ton of effort to crack it like cryptography. Pow is more like arms race or arm wrestling: grinding against each other. The chain may have trouble affording the expensive energy demands required to keep it secure as Lyn Alden says.

But the 21 million meme runs deep, and people like the sound money idea. Maybe the BTC asset will survive as the sound world reserve currency, and lasting unit of account. Maybe we really will pay for coffee with sats. But all secured by Ethereum. Coins will come over a few at a time by one bridge or another. Eventually maybe there will be one or a few main community accepted routes for having come over that are basically interchangeable like how USDT and USDC are today.

The PoW chain will be less relevant as its high fees, energy appetite, and long inconsistent block time lead to a death spiral of ever decreasing security.

Some maxis will stay until the 51% attacks start.

## Prevention vs Recourse

> Originally drafted on 18 February 2025

Alex's EPS (Ethereum Protocol Studies) consensus lecture said instead of using an exogenous signal like work, we can use an endogenous signal like stake.

In-protocol signal allows for penalties, not just rewards.
I get that slashing is useful and maybe even critical. But there is something nice about "all prevention, no recourse". It is like physics. In physics you simply cannot break the laws. With human laws, you can break them but you might get caught and punished, and therefore there is a cost benefit analysis and sometimes people do crimes.

## Merging DAG Branches

> Originally drafted 10 March 2025

How to merge dag branches efficiently:

* ZK Validity Proofs
* Optimistically
* Partial Re-execution:

Any given consensus set or validator set chooses some portion of the state that they care about and that they are trying to reach consensus over. When Any block comes in. They only execute the parts that contain transactions relevant to the state that they care about. When they are merging a decently sized "foreign" branch, it will be mostly empty of transactions that they care about.


## Why Decentralized

> Originally drafted **6 January** 2026

I got into blockchain to put an end to centralized power. Anyone who would cheer on an oligarch to pump their bags is the antithesis of what crypto stands for. And I would ask them to kindly fuck off from our experiment.

But alas, the blockchain is permissionless and they probably won't fuck off. The blockchain is better this way. For in my desire to banish the looters and exploiters, I demonstrate the very reason that power must be decentralized: Who is the bad guy is in the eye of the beholder.

