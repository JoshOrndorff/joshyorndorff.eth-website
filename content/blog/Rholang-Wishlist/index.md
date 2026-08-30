+++
title = "Rholang Wishlist"
date = "2018-09-23T20:39:01+00:00"
tags = ["Rholang","RChain"]
categories = []
+++

I've been programming rholang for about 5 months now and in general I love it and am super happy I learned. If you want to join in that journey, checkout out <a href="https://github.com/JoshOrndorff/LearnRholangByExample">my tutorial</a>. In those five months, though, I've also noticed a few pain points where I think syntactic changes would go a long ways. I've opened issues or started discussions about some of these already. But I'll write them down here too.

<h2>Contract Definitions</h2>
The syntax for a contract definition requires an equal sign which isn't required in similar constructs like <code>for</code>.

<pre>
// The current way
contract x(y) = {
  Nil
}

// The wishlist way
contract x(y) {
  Nil
}
</pre>


<h2>Trailing Pars</h2>
Styleguides (like <a href="https://github.com/airbnb/javascript#commas--dangling">this one</a>) often recommend including a trailing comma in multi-line list, tuple, object , etc literals. I would like to do the same with my pars in rholang. It makes them feel more like the familiar semicolons at the end of each line. The semantics are that the unary par is sugar for a par with the stopped process.

<pre>
// The current way
new x in {
  @0!(Nil) |
  @1!(Nil)
}

// The wishlist way
new x in {
  @0!(Nil) |
  @1!(Nil) |
}
</pre>

<h2>Convenient Unforgeable Processes</h2>
It's great to pattern match data with a preceding <code>@</code> sign when you want to use it as a process. I want to do the same thing with my <code>new</code>s.

<pre>
// The current way
new x in { *x }

// The wishlist way
new @x in { x }
</pre>

We don't need all of pattern matching there. Just this one special case for then I want to make a new ack channel and immediately send it.

<h2>Less Nesting From New Names</h2>
Rholang code gets really deeply nested. Some of that nesting feels natural like in <code>contract</code>s or <code>for</code>s. But it's really common to then create new names immediately inside causing more deeply nested code. I wish we could combine those things.

<pre>
// The current way
for (a &lt;- b) {
  new x, y, z in {
    Nil
  }
}

// The wishlist way
new x, y, z in for (a &lt;- b) {
  Nil
}

// Alternate wishlist way
for (a &lt;- b) {
  new x, y, z here |
  Nil
}
</pre>

<h2>The Peek Operator</h2>
I believe there are already plans tom implement this <code>&lt;!</code> peek operator. It receives a message from a channel, and concurrently writes the same value back to the channel.

<pre>
// The current way
contract getVal(return) = {
  for (@val &lt;- valCh) {
    return!(val) |
    valCh!(val)
  }
}

// The wishlist way
contract getVal(return) = {
  for (@val &lt;! valCh) {
    return!(val)
  }
}
</pre>

A crazier idea is to do the same kind of thing for receives instead of just sends.  As soon as I receive, immediately put the continuation back listening. I guess this might be hard or impossible. Is it even possible to do that manually in rholang?

<h2>Sane Sequential Programming</h2>
Rholang is inherently concurrent. It's a wonderful new way of thinking and I'm glad it's so easy to do now. There are also times when things need to happen sequentially. Like printing the heading of a table before the data rows, or integration testing. Sequential code gets really deeply nested, and thus really hard to read. What if we bring back the classic <code>;</code> from sequential languages such as c or java for this task.

<pre>
// The current way
new ack in {
  stdoutAck!("This is a haiku", *ack) |
  for (_ &lt;- ack) {
    stdoutAck!("So the line order matters", *ack) |
    for (_ &lt;- ack) {
      stdoutAck!("Because syllables!") |
    }
  }
}

// The wishlist way
// The contracts must be of the right form so an ack can be appended to the arg list
new ack(`;`) in {
  stdoutAck!("This is a haiku");
  stdoutAck!("So the line order matters");
  stdoutAck!("Because syllables!");
}
</pre>

This combines extremely nicely with my trailing | idea, so I've writing it that way. Remember there is an implicit <code>Nil</code> after the trailing par. That Nil will become the body of the last <code>for</code> comprehension during desugaring. Thus the programmer can call the same contract that expects an ack every time and not have to write a special one (equivalent of <code>stdout</code> without the Ack) to handle the last call.

<h2>Timer in Powerbox</h2>
This would be useful for writing games and stuff, but probably not for the blockchain. And it may encourage bad practices for handling race conditions. But still, I need to to implement a realistic AI in my game.

This one works brilliantly with my sequential idea from above, so I'll write it that way. But this could still be implemented without that previous enhancement. It would just lead to deep nesting.

<pre>
// There is no current way

// The wishlist way
new timer(`rho:os:timer`) in {
  stdoutAck!("three");
  timer!(1000); // milliseconds
  stdoutAck!("two");
  timer!(1000);
  stdoutAck!("one");
  timer!(1000);
  stdoutAck!("blastoff");
}
</pre>

<h2>Console Access in REPL</h2>
The REPL (read, evaluate, print, loop) is a convenient way to test little snippets of rholang code interactively. Such a thing is precedented in other languages like python's interactive mode, haskell's ghci, and every browser's javascript console. It is extremely common to print an output to the screen for quick evaluation. But in rholang it takes a lot of code to get access to such capabilities which is a pain to type each time.

<pre>
// The current way
new stdout(`rho:io:stdout`) in {
  stdout!("Hello World")
}

// The wishlist way (REPL ONLY!)
stdout!("Hello World") // Just works ;)
</pre>


I'd love to hear any thoughts or ideas!
-Joshy



