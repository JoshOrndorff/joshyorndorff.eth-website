+++
title = "The Voting Problem"
date = "2015-08-27T00:05:11+00:00"
tags = ["Math"]
categories = []
+++

I was biking the other day and saw a few signs in a row saying "Stop the Power Plant!". I don't know anything about the power plant, but it got me thinking about voting and some fundamental problems with the system used in virtually every legal jurisdiction (that I know of (which isn't many)).

The problem is that someone needs to count the votes, but whoever counts the votes cannot fundamentally be trusted because she might have her own feelings about the power plant, or might be susceptible to bribery. Even if the entire voting population were somehow allowed to participate in the count, some must oversee the voting in the first place, and that person might add, change, or discard votes for the same corrupt reasons as the counter.

My mathematical spidey sense tells me that cryptography is the solution, although I haven't worked out the mechanics of the system. So I'm hoping you all can contribute some ides to help with that. Here are the requirements:
<ul>
<li>Any eligible voter has access to the votes and can perform his own independent count.</li>
<li>Any voter is able to verify that his vote has been included in the final set of votes.
(I'm willing to hear your input about whether a voter should be able to verify the identities of the other voters. On one hand a voter should know that no fake votes were cast, on the other hand eligible voters may not want their peers to know whether they chose to participate in the vote. For academic purposes, let's try to find systems of both kinds.)</li>
<li>Votes should be private. No voter is able to determine his peers' votes.</li>
</ul>

As always, I'm excited to hear your thoughts and ideas.
-Joshy


