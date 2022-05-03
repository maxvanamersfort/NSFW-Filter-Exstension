# NSFW Filter, Chrome-Extension
#### Video Demo: https://youtu.be/euD8SCvhK3U
#### Description: 

DISCLAIMER: I used the PorNo filter from github to block nsfw domains in my extension but edited it to work with my extension. To build one
entirely from scratch was a little much for me so I used this open-source script to work with my self build censor extension. As most
programmers say: Google is your best friend! 
The extension mostly runs on my censor script though.
Author of PorNo script: mrvivacious

NSFW Filter:
Small Intro: So I started this journey with a quick reddit search for ideas on Reddit. After I looked at some ideas, I decided to go with a
profanity filter with also a built in porn blocker. As this is quite hard to make a well working version of, I loved to challenge myself with
it and to finally built a working version. So without further ado, let's dive into how it works and what it essentially does.

Main Function: The main function of the extension is to filter nsfw words on websites, and make sure you can't acces websites with nsfw words
or pornsites. Also it makes sure that if the website opens, the words get censored by *** like in subtitles. This is a simple explanation of
the main functions, let's now get underneath the hood and find out how it works!

The files: So as we delve into the files and find out how it works, we'll go from the top file to the bottom file and explain the works.
Also I'll tell the decisions I made to go with certain solutions, and what problems I had to fix to get it working(It's a lot ; )).

Icons Directory: So because I build a Chrome-Extension, I had to add some logo's to my extension directory to make it look proffesional.
It's just some png's with different sizes to display and call in the manifest.js.

Node_Modules: The node_modules directory is to use node inside my extensions scripts. Also it includes a library of naugty words wich I wanted
to use, but eventually ended up not using because of loading time. 
So to add to the loading time, let me explain!
I had some troubles with making the library work when called from my censor.js file. I ended up fixing the problem with the help of Google, 
but the library ended up taking centuries to load. So I ended up using the english library only and to use make the array inside my censor.js
file. It also makes sure the Scunthorpe problem is way more easy to solve because it's just one language.

Background.js: A file I  don't do much with but is actually quite important for my filter to work. So let's dive into it!
So because my censor.js is also designed to break links with the nsfw words into it, you aren't able to get to nsfw websites or links.
This means Chrome will get to error pages some times and we have to redirect back to the Google search page. Initially this gave some problems
with how I could implement that redirect. So let's look at how I fixed it.
The problem was Chrome didn't get a propper href so a redirect trough censor.js was almost impossible. So again with the help of Google, I found
a work around. With a background service_service worker I could make my extension listen to an error from Chrome, and redirect back to
Google.com. That's what this file does.

Censor.js: Here is where we really start looking into the functionality of the extension. So let's dive in!
censor.js is the file that makes sure the nsfw words are censored by ***. It also breaks links if the href has nsfw words in them.
Furthermore it also holds my array of bad words that is used for knowing wich words have to be censored. As mentioned above I had some problems
with how to redirect if it broke the link and how I fixed that. But, it wasn't the only problem I walked into with this script. Let me explain!
At first we start with the Scunthorpe problem, a problem most all people walk into with this kind of filters. I fixed this problem actually 
quite simply by adding spaces at the end of the words in my array that had the Scunthorpe problem. This way it only filters if it really is
the word used in a sentence or in a link.
The next problem was the loading time and the refresh time. This was actually a really easy problem to fix, just add a setinterval with the 
time you like.

FirebassStuff.js: This is quite a simple one. This is a script that uses firebass database's if you choose to use them instead of the
PorNo database from github.

Jquery.min: The jquery usage file.

Linkmanager.js: This file is basically a helper file for the PornNo.js file and the popup.html file. It has functions pre built to use in these
two file's mentioned above. Functions are calling the database of banned url's to use in PorNo.js and make all the links work in all file's.

Lists.js: This file as it's so called, holds the list of banned url's which the extension will not open but redirect to Google.com.

Manifest: The manifest file every Chrome extension must have. It ofcourse calls all scripts to use and when, and all the info of the extension.
I had one small problem wich I fixed with this file. Let me explain!
So the PorNo.js and the censor.js had kind of a fight every time I loaded a site. The PorNo.js file and it's attributes needed to load before
the DOM had fully loaded, to make sure the porn blocker worked and no nsfw was shown. This meant that the cesnor.js never had the change to
censor the site's that weren't porn. So to fix that we had to split the scripts inside the manifest and make PornNo.js and it's attributes
load at document_start. And make censor load when the document was loaded fully.

NSFWScrollerDetection.js: This file is to detect if user has 18+ enabled.

NSFWSubredditDetection.js: This file detects subreddits with nsfw content and blocks it.

The package file's: These are for the node modules to work.

Popup.html: Html file for the extension with a build in nsfw emergency button when the user finds a way through the filter. Also a function to
add links to the database you want to block. With at the end a link for more resources and a link to email me if something bugs. To end it off,
a heart with Thanks for your support. The emergency button redirects to resources for porn addiction as does the link on the bottom.

PorNo.js: The main porn blocker script. it's used for blocking the nsfw websites and redirecting to Google.com.
The file does this from the database and makes sure the website is blocked and redirects before the document start. I had a 
few problems with this one, so let's dive into it and explain how I solved them.
The first problem was when I implented the PorNo filter from github was that my censor didn't work anymore. So what I had to do is delete
some functions that I found a little to much. This meant that I wanted only to call upon the blocker if you actually went to a porn domain,
and not if you searched for nsfw things. After I deleted the functions for Google search and the redirect to porn addiction resources if an
nsfw word was detected. Now the censor worked again!

So to end the description of my extension and final project I will also say that I learned a lot from building this extension. I learned how
an extension is build and actually learnt a lot of javascript. It took some major problem solving wich was sometimes quite frustrating!
But to solve the problems and build a working extension felt really good!
Also I would like to add that I really enjoyed CS50 and I really learnt a lot from it, so I'm really grateful for that!

This is me signing off,

Regards,

Max van Amersfort



  