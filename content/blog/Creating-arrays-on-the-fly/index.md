+++
title = "Creating arrays on the fly"
date = "2011-03-26T22:38:53+00:00"
tags = ["Computers", "programming"]
categories = []
+++

I recently started writing a treatment of dimensionality. As I have been slowly working through the writing process I have discovered several other interesting questions and problems that need to be solved before I can continue.  I want to share one of those problems with you here, and perhaps others will follow.

Any educational work or book is incomplete without a series of diagrams, pictures, and if possible, interactive demonstrations.  This being the case, I began coding an example that would be simple and intuitive for a user to understand, yet simultaneously insightful.  But despite the simplicity for the end user, this demo has proved less-than-trivial to code.

The demo is a basic tic-tac-toe children's game with a few classical restrictions removed.  Namely, the game is not limited to two players, two dimensions, or three cells per dimension.  Among other options, the user will be free to choose the number of dimensions and the length of each dimension.  So instead of just playing a 3 X 3 board the game supports a 1 X 1 board, or a 4 X 4 X 4 board.  Essentially, it supports any n-dimensional board with each dimension being of length l for a total of l<sup>n</sup> cells.

This is simple enough in concept and the obvious implementation in code would be to have an n-dimensional array where each array element represents a cell in the playing board.  The trouble is that the array has to be generated on-the-fly <em>after</em> the user has selected its characteristics, n and l.

One possible solution is to do something like:

```javascript
var board = new Array(l);
if (n==2) {
  for( var i = 0 ; i < l ; i++) {
    board[i] = new Array(l);
  }
} elseif (n==3) {
  //two nested for loops
} elesif (n==4) {
  //three nested for loops
}
```

First let me point out some interesting and insightful things about this code:
<ol>
<li>It does not use a multidimensional array, but rather a series of nested one-dimensional arrays.  This is necessary in Javascript as multidimensional arrays do not exist.  As we will see shortly, this nested array approach is the method that I would take even if multidimensional arrays were supported.</li>
<li><img style="float: right;" src="/sites/default/files/photos/build-normal.gif" />For any given values of n and l, it generates the array in a way that is totally natural to me.  It first makes one dimension, then extends that dimension perpendicular to itself giving us two dimensions, and then extend those two dimensions perpendicular to themselves giving us a third dimension.</li>
</ol>

Now, some of the many things that are wrong with this code:
<ol>
<li>This code is very long, and requires manually retyping several lines of very similar code.</li>
<li>This method inherently imposes a limit on the number of dimensions that be created.  Further, if the coder later decides that the limit should be increased, he must add additional increasingly long branches to the if statement.</li>
<li>The author of this kind of code has to live with the knowledge that if the coding police ever find out about it, they will lock him up and throw away the key.</li>
</ol>

So now that we know a few things to avoid, let's get onto what we should do.  It took me nearly an hour of thinking, drawing, and starting over to come up with a good solution, but eventually I had an idea.  Recursion to the rescue!  I've seen recursive algorithms several times, and I'm always impressed with their conciseness and elegance, but I've had never written one of my own until now.

<img style="float: right;" src="/sites/default/files/photos/build-recursive.gif" />Before I show the code, let me first discuss one fundamental difference between my ultimate solution, and the method above.  Rather than building my array by first building one dimension, then adding a second dimension to every element, then adding a third dimension, The new code starts with a single element, and tests whether it is a member of enough dimensions.  If not, it adds a dimension to just that one element, and tests again.  And if ever the element in question is a member of enough dimensions, it moves on the the next element until none are left.

So here is the code as it is actually implemented in my tic-tac-toe project (in javascript):

```javascript
var numberDimensions = 2; //can be changed by user
var lengthDimensions = 3; //can be changed by user

// set up the board array
var board = new Array(0);
addDimension(board, 0);

function addDimension(currentElement, currentDimensions){
  if (currentDimensions < numberDimensions){
    currentElement.length = lengthDimensions;
    for(var i = 0; i < currentElement.length; i++) {
      currentElement[i] = new Array(0);
      addDimension(currentElement[i], currentDimensions + 1);
    }
  }
}
```

So there it is.  One thing you will notice about this code is that it has to work around what is, in my opinion, a deficiency of javascript.  In javascript arrays are passed by reference and integers are passed by value.  No exception.  This makes the code just a little longer, but not significantly less readable.

Here is a rundown of how the code works:
<ol>
<li>Gather the necessary information about number of dimensions and length of dimensions into appropriate variables</li>
<li>Create a variable to represent the board.  Initially this variable is an array with only a single element</li>
<li>Pass this tiny array into the addDimension function along with the information that it is currently zero-dimensional</li>
<li>Test to see if the current element has enough dimensions (which it does not the first time through)</li>
<li>Expand the array to be one dimensional and set the first dimensions length to the value specified by the user.</li>
<li>Now, the recursive step.  Send the first element of the first dimension to the addDimension function along with the information that it has one more dimension than the last call to this same function.</li>
<li>Eventually this very first element will have enough dimensions, and we will move on to the next element.</li>
<li>When every element has enough dimensions, the function finally exits and our array is complete.</li>
</ol>

Please post any thoughts, ideas, or improvements in the comments.
love, Joshy Woshy


