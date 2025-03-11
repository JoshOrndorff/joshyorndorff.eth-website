+++
title = "Blue Eyes Logic Puzzle - Preliminary Thoughts"
date = "2025-03-11"

tags = [
    "consensus",
    "puzzle",
    "math",
]
categories = []
image = "island-clip-art.jpg"
+++

I recently came across the ["blue eyes" logic puzzle](https://www.xkcd.com/blue_eyes.html). The writeup I linked is worded well and written by the author of XKCD! I don't think I've fully solved it yet, but I do have some thoughts that feel insightful and like real steps toward a solution. But they may also be totally wrong. I have not looked up anyone else's answers to this problem at all.

## Blue Eyes Problem

Here's a summary of the puzzle's structure in my own words, but it is best to read [Randall's writeup](https://www.xkcd.com/blue_eyes.html).

* There is a smallish (few hundred) group of people on an island, and they would like to get off the island.
* Each day there is ferry that will take anyone off the island if they can say what color their eyes are, but if they are wrong.... so they don't just guess.
* Nobody can see their own eyes, but they can see everyone else's eyes.
* The islanders cannot communicate with each other by speaking, writing, sign language, blinks, or any other silly thing you dream up; it's not a lateral thinking riddle.
* The one and only exception to the no-communicating rule is that one day, one islander called her the "Guru", is able to announce one true statement of the form, "I see at least __ islanders with eyes colored ___".

Randall's writeup goes on to give a specific instance of the problem:
* 100 blue eyes
* 100 brown eyes
* a single green eye who is the Guru
* the green-eyed guru says "I see at least one islander with blue eyes"

And then he asks, who gets off the island, and when. I'll approach the problem by considering some simple concrete examples and seeing whether we can build from there.

## When You See No Blue Eyed Fellows

To start, consider yourself as an inslander in a similar scenario.
Imagine a case where you look around the island and find that none of your islandmates have blue eyes.
If the guru says that at least one person has blue eyes, and none of the others have them, then we can conclude that it must be us with the blue eyes and we could leave tonight.

This case is much simpler than the original, but it is a start. Let's see if we can do a little better.

## When You See One Blue Eyed Fellow

Now consider that you see exactly one fellow islander with blue eyes.
Let's call this Blue-eyed fellow Blaine.
In this case you can see for yourself that there is at least one blue-eyed islander, namely Blaine, so it may seem like the guru's statement didn't really provide any new information to you.
Most of the other islanders are in a similar position you are: they can see Blaine's blue eyes too.

In fact the only person who can't see Blaine's blue eyes is Blaine.
Blaine has less info than you do because he doesn't know his own eye color.
However, he also has more information than you because he does know your eye color.
Perhaps we can use Blaine and his behavior to learn about our own eye color.

If Blaine sees that we do not have blue eyes, then he will conclude that he is the only person who has blue eyes and leave at the first Ferry.
Indeed if we do not have blue eyes, then Blaine is in the situation we described previously where he is the only blue eyed islander.
All you can conclude in this case is that you are not blue-eyed, just like all the other remaining islanders.

If Blaine does not leave on the first ferry, then he must not have concluded that he was the only blue eye on the island.
If Blaine didn't determine that he was the only blue-eyed islander, it means he saw another blue eye.
The only person Blaine was able to check that you were not able to check is you.
So you must have blue eyes.
Now you can leave on the next ferry, the second ferry overall.
It turns out that you were in a symmetrical situation to Blaine, and indeed he was watching your fist-ferry behaviour just as you were watching his.
When Blaine saw you skip the first Ferry, he concluded that he must also have blue eyes.

This is more progress.
Let's see if we can go another step to be convinced that induction is possible.

## When You See Two Blue Eyed Fellows

Imagine now that you see two blue eyed islanders, Blaine and Blaze.
You know that there are either exactly two blue eyed (Blaine and Blaze) or exactly three blue eyed (Blaine, Blaze, and yourself).
We already saw in the previous section that when there are exactly two blue eyed, they leave the island and mutually discover each other on the second night.

If Blaine and Blaze leave the island on the second night, we can conclude that they were in the situation described previously and they were the only blue eyed.
If they do not leave on the second night, then they must have seen another blue eyed person, and it must be us.
Similarly to before, we can leave on the next ferry.
This time it is the third ferry overall.

And so now we can see the inductive pattern.
So far it seems that, in the original problem, all the blue-eyed people can get off the island on the 100th ferry.

## A More Efficient Guru

So far we have modified the original problem by considering an island with fewer blue-eyed people than the original hundred.
Now let's stick to the original populations but consider a Guru who says a higher number.

If the guru says "I see at least 75 blue eyed islanders", then we can use the same inductive process as before, but we can cut off the first 75 rounds.

## What the Guru Tells Us?

One thing is the Guru says "Go"; "Let the games begin".
Another is that  the Guru chooses the one specific eye color who will be able to use the inductive logic.

But the Guru also gives us another piece of information, at least in some of the cases we have considered.
In the simplest case (we are the only blue eyed) it is obvious.
The guru tells us there is at least one blue eyed and we didn't know that before.

In the next case (we see Blaine has blue eyes) it is less obvious.
We already knew there was at least one blue eyed because we can see Blain directly.
But even in this case the Guru is telling us something useful.
She is telling us that ALL of the islanders know that there is at least one blue eyed.
Before the guru spoke you knew there was a blue-eyed.
But you did not know that Blaine knew there was a blue-eyed.
He may have only learned that when the Guru spoke.
Now that the Guru has spoken, regardless of whether Blaine previously knew there was at least one blue-eyed, he knows it now, and you know that he knows it.

This will be a recurring theme.
It is not only important that you know someone's eye color.
It is also important that they know that you know it.

## Getting Off the Island Faster

We previously considered that the Guru could speed up the process by telling us a higher starting number other than 1.
The Guru is able to do this beccause of her ability to communicate reliably with the islanders in a way that all islanders hear her and all islanders know that all islanders have heard her.
As we have seen, in cases with small numbers of blue eyed islanders (one or two, for example) the role of the Guru establishing this seed of known-everywhere truth is essential.
But we may be able to do better.

In the original problem, every individual inslander knows that there are at least 99 blue eyes.
We are able to conclude this because we know the eye color of everyone on the island.
However, the islanders themselves have less information: they don't know their own eye color.
Some of the islanders are not sure whether some of their fellow islanders have actually seen 99 blue eyed.

For example, when Blaine, a blue-eyed, looks out at his fellows and considers the perspective of his friend Blaze, also a blue-eyed.
In reality Blaze can see 99 blue eyed.
But because Blaine does not know that his own eyes are blue, he does not know that Blaze has seen 99 blue eyed.
As far as Blain knows, his own eyes may be yellow, and Blaze only sees 98 blue eyed.

To summarize:
* All islanders have seen 99 blue eyed
* Some islanders are unsure whether some of their fellow islanders have seen 99 blue eyed or not
* All islanders are sure that all other islanders have seen at least 98 blue eyed.

That last bullet is crucial!
There are at least 98 blue eyed on the island, and everyone knows it, **and everyone knows that everyone knows it**.
That means we don't actually need the Guru to tell it to us.
Even if the Guru says "at least one blue eyed", we can still start our protocol as if she had said "at least 98 blue eyed".

## Saving the Brown Eyes

We just saw that the Guru is not necessary to specify the starting number because the blue-eyes can establish a minimum starting bound themselves as long as there are at least three of them in total.
This is actually great news for the brown eyes!
They can also self-establish a lower starting bound of 98 adn use the same technique to get off the island as the blue-eyes did.
Decentralizing the Guru is great!

## My General Solution So Far

If you find youself on such an island you should do as follows:

* Count up the number of islanders in each eye color.
* Calcualte the maximum, minimum, and global minimum for each eye color.
  * Maximum is the number you saw plus (in case you have that color).
  * Local Minimum is the number you saw (in case you don't have that color).
  * Global minimum is the lowest possible local minimum that any islander could possibly have or the number given by the Guru, whichever is greater.
* Each time the ferry comes
  * If the global minimum for any eye color is greater than your local minimum for that color, get on the ferry; that is your eye color.
  * If not, increase the global minimum by one for each eye color.

Anytime an eye color has at least three islanders, those islanders can save themselves by observing that everyone knows that everyone knows that there is at least one person with that color.
If any eye color has fewer then three islanders, they need the Guru to give them a minimum.
If there are fewer than three and the guru does not give them a minimum, they are stuck on the island forever.

## My Specific Answer So Far

Applying this solution to the original problem.

All the blue- and brown-eyed islanders are able to bootstratp a global minimum of at least 98.
The first ferry rules out 98, the second ferry rules out 99, and they all leave on the third ferry.
The only person stuck on the island is the guru whose only useful contribution was saying "go".
