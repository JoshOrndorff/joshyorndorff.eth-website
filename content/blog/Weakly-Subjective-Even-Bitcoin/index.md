+++
title = "Everything is Weakly Subjective, Even Bitcoin"
date = "2025-04-13"
draft = true

tags = [
    "blockchain",
    "consensus",
    "subjectivity",
    "simpsons",
    "plot twist",
    "reorg",
]
categories = []
# Image should be history of bitcoin chain with pizzas silk rd etch on one side and empty boring on other side.
image = ""
+++

There is a particular kind of plot twist that I really enjoy in fiction. It is when you realize very late in the story that the protagonist has been confused from the beginning about the very nature of the setting in which the story has taken place.

One of my favorite examples is the movie Shutter Island in which the protagonist is an investigator investigating a creepy mental hospital suspecting the director of inhumane human experiments. Near the end you learn that the protagonist is actually a patient in the hospital and the story you had believed to be true is a combination of hallucinations and a carefully designed psychiatric intervention. The audience is left to feel the same confusion and struggle for acceptance as the Protagonist.

## Re-Organizing History

This is analogous to a technical situation that arises in blockchain called a chain reorganization, or "re-org". A re-org happens when a blockchain node realizes that the chain that it thought was real, actually isn't, and it needs to switch to a different chain that is better or more real.

Insert Diagram

The goal of blockchain is to _eventually_ reach consensus on the history of that chain and decide which of the branches is "real". But of course more stuff is happening all the time, so the chain is constantly growing thus the job of reaching consensus is never done but rather ongoing. Again, this is similar to how populations of people come to an understanding of current events and transition them into the realm of history.

More on how blockchains work along with traditional social means to reach consensus shortly, but first let's understand re-orgs better with another example from fiction.

## Armen Tamzarian

In the Simpsons Episode, [The Principal and the Pauper](https://simpsons.fandom.com/wiki/The_Principal_and_the_Pauper), Principle Skinner reveals that he has long been a fraud filling the shoes of a person who had gone missing in Viet Nam. The other characters struggle to accept the truth, and in the end the agree to go on living with the fraud because nobody wanted to go back to the "real" truth.If you haven't seen the episode, I recommend torrenting it because it is awesome.

Before the episode, we know that Principle Skinner grew up in Springfield, served briefly in the army, returned home, became principle and nowadays has shenanigans with Bart and the kids. You can imaging his history looking something like the following in terms of a blockchain.

Insert diagram with skinner example

The plain blocks indicate that there are probably more details relevant to skinners past that we are not aware of and may eventually fill in as his character is developed more. During the episode we learn of another character, Armen Tamzarianm, who looks like Skinner and grew up as a bad boy in capital city. Tamzarien also joined the army around the same time as Skinner and indeed they met in Viet Nam. So far this is no problem, these details are all compatible with the Skinner we know and love. Indeed we love him more now for having learned more details of his past. We can now imagine Skinner's history like this.

TODO

But next we get the bombshell. The real Skinner never returned from Viet Nam. He has been held hostage ever since and only recently returned home. The man who we have known and loved for eight seasons is actually Tamzarien. TODO Scream face emoji. He has been living a lie all this time. The shenanigans that were had with Bart and the kids were with Tamzarian. And now the real Skinner is finally home and the truth is out and we are supposed to try to reorg.

TODO Full Figure

The characters in the Simpson's collectively choose to go on living as if the person they have known for decades is the real Skinner. This is despite real evidence (genetics, military records, Tamzarian's confession) of the fraud. Together they coordinate to all agree to continue living the previously understood reality thereby making it effectively "real". It certainly wouldn't work out if only some people went on believing the old truth while some accepted the new. Consensus is critical.

Just as the Simpson's Characters struggled to accept the new truth, so also did the real life audience. Fans generally dislike the episode, or even feel betrayed by it. The Simpsons wiki notes that the episode is considered non-canon. 

## Some Things Cannot be Re-Organized

Not all re-orgs are of the same seriousness in blockchain or is daily life. It's one thing when that news story you read this morning turns out to be false. It probably didn't affect you much and even if it did, it was only this morning. It's another thing to learn that your months-long romance turned out to be a pig butchering scam, and still another entirely to find out that your entire career as an investigator was false.

Principal Skinner is third character to speak in the entire series, and the first person outside the Simpson family.



In this post I will argue that **humans only have a finite willingness to reorganize their understanding of reality**. Much like Springfieldians who continue to treat Skinner as a Principal or a teenager who refuses to forsake their friends and neighbors and act as an agent to a foreign power they have never identified with, humans will not be willing to re-organize their most cherished memories away, and this extends to bitcoin with its supposed "objective" consensus rule.

Examples from religion / mythology

Noah's Ark
Mormon history in New World
"Doesn't ahve to be literally true, still good morals and practical lessons"
"IDK why the Book of Mormon says one thing, and the archeological record indicates another. Heavenly Father works in mysterious ways."

## Objectivity vs Subjectivity

The entire point of a blockchain network is to reach consensus on a single history. Many consensus mechanisms and variations thereof have been proposed. I love consensus and the many variations are endlessly interesting. But for the sake of this post, I will classify them broadly into three categories. For more details and technicals on this, see Vitalik's blog post: https://blog.ethereum.org/2014/11/25/proof-stake-learned-love-weak-subjectivity

### Objective Consensus

In objective Consensus, Anyone can tell which history is real just by looking at the history itself. No need to trust anyone have any doubts. The most famous example of this is Bitcoin-style proof of work. Each block has a certain amount of work attached to it by the miner. When ever there is a fork, the chain with the most weight is the real one.

TODO Figure

### Subjective Consensus

Is this a real thing? Are there any real examples of it?

### Weakly Subjective Consensus


## Bitcoin is Weakly Subjective

Bitcoin's rule about choosing the chain with the most accumulated work is certainly objective as I described above. But I will argue that there is a more fundamental consensus layer involved in Bitcoin even that the Objective PoW, and that is the Social layer. In the same way that humans struggle to disavow religious myths, so they will struggle and perhaps refuse to re-org their bitcoin history.

### Consider a Deep Re-Org

Take a mament to consider your favorite story from the history of Bitcoin. Think way back if you can. Is it the silk road? Is it bitcoin pizza guy? Is it the Ethereum ICO? Is it the Mt Gox Hack? Was it that first bitcoin you mined back in 2015 that you then lost and forgot about?

Now imagine that one day, maybe tomorrow, or next year, a bitcoin block chain is discovered that has more total proof of work than the chain that most of the nodes and explorers had been tracking. No problem; this is PoW; re-orgs happen. But imagine this chain is a very deep reorg. And the blocks are mostly empty. Someone must have a lot of secret mining power and have been mining this chain for a long time. Now they have revealed it publicly.

TODO Insert Figure with pizza and silk rd and etc on one side, and boring empty on the other.

What do you think would actually happen in this scenario? Don't read on yet. Actually consider it.

I propose that the **new chain would not be accepted despite its higher accumulated work**. We could not give up the history of bitcoin pizza guy. It is too important. We could not give up El Salvador's bitcoin.

### Decenting from Most Accumulated Work

We know that people are willing to descent from their general principles when it comes to deep re-orgs. A relifious astronomer may know and believe in science and perform it competently in day to day life. If they simultaneously believe that God created the cosmos in 6 days * 24 hours per days, they may not accept scientific evidence to the contrary, thus defecting from the objectivity of science that they claim to profess.

Similarly we may expect bitcoin users to defect from the most-accumuluated-work rule when it means they would no longer have those bitcoins they bought last month. And even more so if sticking to the most-accumulated-work means giving up their most charished myths (eg the pizzas).

Bitcoin is weakly subjective. Your life is weakly subjective.

Every bitcoin node operator has their own weak subjectivity checkpoint. Where they would not consider reverting past that. Just like how every person in a market has their own valuation for a good. Currently bitcoiners are not allowed to talk about this like how puritans are not allowed to talk about sex. But if there ever is a deep re-org, then we will discover how deep they are willing to re-org.




