
let links = [];
let counter = 0;
let safeSearch = "&safe=active";
let defaultLink = "https://www.google.com";
// 'https://fiftyshadesoflove.org/#connection'

// Let's go
main();

// Evaluates current site for ban status
function main() {

  // ROUTE LOCALSTORAGE ( [ideally is] MOST UP TO DATE )
  chrome.storage.local.get("realtimeBannedLinks", function (returnValue) {
    let firebaseLinks = returnValue.realtimeBannedLinks;
    let hostname = location.hostname;

    // console.log(firebaseLinks);
    // If the url is a porn site, PorNo!
    if (isBannedFirebase(firebaseLinks)) {
      if (isHostnameInSafeList(hostname)) {
        return;
      } else {
        PorNo();
      }
    }
    // Else, if the url has four or more "banned words",
    //  check the url's category through the IBM XFORCE API
    // Four because there are four inner planets in our solar system
    // jk I don't have a better system for checking these links faster than the page
    //  can load
    else {
      // checkURL(); commented out because this function is empty atm
    }
  });

  // ROUTE HARDCODED ( FASTER but does not contain latest links )
  // If the url is a porn site, PorNo!
  if (isBannedURL()) {
    let hostname = window.location.hostname;

    if (isHostnameInSafeList(hostname)) {
      return;
    } else {
      // todo: if url contains 'reddit', regex the url (check with pathname or smth)
      PorNo();
    }
  }
}

function isHostnameInSafeList(hostname) {
  return (
    hostname.includes("google") ||
    hostname.includes("gmail") ||
    hostname.includes("youtube") ||
    hostname.includes("amazon") ||
    hostname.includes("instagram") ||
    hostname.includes("is.muni.cs") ||
    hostname.includes("virtual-addiction")
  );
}

// If our local route fails, the database route will still be checked.
// This is because local will finish before the database (due to the storage.local.get)
// If the database route fails, then we check our url to see if we need to call
//  the IBM api
function checkURL() {
  // if (evaluateWords()) { // rip ibm
  //   checkWithIBM();
  // }
  // checkTitle();
}

// Adds links from storage to our links array so that
// openLink() can select a random wholesome link to fill the user's window with
function PorNo() {
  window.stop();

  window.location.href = defaultLink;
    

  addRedirectionEventToHistory();
}

function addRedirectionEventToHistory() {
  chrome.storage.sync.get("redirectionHistory", function (returnValue) {
    // https://stackoverflow.com/questions/4673527
    let redirectionHistory = returnValue.redirectionHistory;
    let currentTimeInMillis = new Date().getTime();

    if (!redirectionHistory) {
      chrome.storage.sync.set({ redirectionHistory: [currentTimeInMillis] });
    } else {
      redirectionHistory.push(currentTimeInMillis);
      chrome.storage.sync.set({
        redirectionHistory: redirectionHistory,
      });
    }
  });
}

// Redirects users to a random website from their wholesome sites lists
// Runs only after links[] is fully filled with the links from storage

// Counts the number of banned words in the current URL
function evaluateWords() {
  let counter = 0;

  let url = window.location.href.toLowerCase();

  // Remove all "url buffers" for easier parsing
  while (url.indexOf("-") != -1) {
    url = url.replace("-", " ");
  }
  while (url.indexOf("+") != -1) {
    url = url.replace("+", " ");
  }

  // mfw 12000~ length
  // console.log(url);
  // console.log('evaluateWords() -- List of keywords:');
  for (let i = 0; i < bannedWordsList.length; i++) {
    if (url.includes(bannedWordsList[i].toLowerCase())) {
      // console.log(bannedWordsList[i]);
      counter++;
    }
    // >== because I don't know how async works and I don't want async
    //  to increment counter from four to five+ too fast
    if (counter >= 4) {
      return true;
    }
  }

  // If we reach here, counter is < 4
  return false;
}

// Evaluates the title of the current page for porn clues
// NOT a better indicator than the URL (don't use!)

function store(url) {
  // Save domain without www.
  if (url.includes("www.")) {
    let idxOfPeriod = url.indexOf(".");
    url = url.substring(idxOfPeriod + 1, url.length);
  }

  // Begin database process
  chrome.storage.local.set(
    {
      [url]: url,
    },
    function () {}
  );

  // Meanwhile, update local storage list
  chrome.storage.local.get("realtimeBannedLinks", function (returnValue) {
    let urls = returnValue.realtimeBannedLinks;
    urls.push(url);

    chrome.storage.local.set(
      {
        realtimeBannedLinks: urls,
      },
      function () {}
    );
  });
}

// Extract the domain name from the inputted url and check if the input's
//  domain name is a porn site domain
// Ya boi Vivek out here writing a porn filter
// @param url The url whose domain name we check against the porn sites
function isBannedFirebase(linksFromFirebase) {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let url = window.location.href.toLowerCase();

  // fightthenewdrug was flagged...create a safeList checker method
  if (
    linksFromFirebase &&
    !url.includes("fightthenewdrug") &&
    !url.includes("github")
  ) {
    // O(n) worst case feels bad but whO(l)esome porn-checker feels good
    for (let i = 0; linksFromFirebase[i]; i++) {
      if (url.includes(linksFromFirebase[i].toLowerCase())) {
        return true; // gtfo
      }
    }
  }

  // Inconclusive
  return false;
}

function isBannedURL() {
  // Header(s) removed so that we can find the correct period to substring to
  //  in order to collect only the domain name
  let host = window.location.hostname.toLowerCase();
  let idx = host.indexOf(".");
  let trimmedUrl; //todo re-evaluate 4chan strategy

  let href = window.location.href.toLowerCase();
  let hrefWithPath = href.substring(href.indexOf("://") + 3, href.length);

  // 8 to account for sites with extended intros (ie. boards.4chan)
  // This evaluates to false for a URL that looks like abcdefgh.name.com
  // Here's to hoping that there aren't too many of those URLs around
  if (idx < 8) {
    // todo rethink this strategy...
    trimmedUrl = host.substring(idx + 1);
  }

  // O(1) and whO(l)esome
  if (pornMap[host] || pornMap[trimmedUrl] || pornMap[hrefWithPath]) {
    window.stop();
    return true;
  }

  // Inconclusive
  return false;
}

function checkWithIBM() {
  let url = window.location.hostname;
  let api = "https://api.xforce.ibmcloud.com/url/" + url;

  if (!url.includes("fightthenewdrug")) {
    // Too slow -- some websites load before PorNo! executes
    // $.getJSON(api, function(data) {
    //   if (data.result.cats.Pornography) {
    //     alert('PorNo!');
    //     PorNo();
    //   }
    // });

    // The "Vanilla JS" version of $.getJSON(), but with async turned off ('GET', api, false)
    // This allows us to delay website load by just a teeny bit (hopefully teeny) enough
    //  to get to PorNo! if needed
    // Thank you, http://youmightnotneedjquery.com/#json
    let request = new XMLHttpRequest();
    request.open("GET", api, false);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        let data = JSON.parse(request.responseText);
        if (data.result.cats.Pornography) {
          window.stop();
          PorNo();
          store(url);
        }
      } else {
        // We received an error from the api!
        // console.log('PorNo! is having some errors, hmmm....');
      }
    };

    request.onerror = function () {
      // There was another error, not from the api,
      // alert('PorNo! : Error');
    };
    request.send();
  }
}

