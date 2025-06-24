const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
const PROBLEM_KEY = "PROBLEM_KEY";

const observer = new MutationObserver(() => {
    addBookmarkButton();
});

observer.observe(document.body, {childList: true, subtree: true});

addBookmarkButton();

function onProblemsPage() {
  return /problem|challenge|task/i.test(window.location.href);
}
                          
function getFirstMatchingElementByClass(classNames) {
  for (let className of classNames) {
    const el = document.querySelector(className);
    if (el) return el;
  }
  return null;
}
function getFirstMatchingElementById(idList) {
  for (let id of idList) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}
  
  
function addBookmarkButton() {
    console.log("Trigerring");
    if(!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.width = "30px";

    const askDoubtButton = getFirstMatchingElementByClass([
      ".time-limit",
      ".coding_problem_info_heading__G9ueL",
      ".problem-statement",
      ".title",
      ".text-title-large",
      ".problem-statement",

      ".property-title",
      "._problem-statement__inner__container_1gdez_109 .notranslate + h3",
    ]);
      

      if (!askDoubtButton) {
        
        console.warn("No matching element found for askDoubtButton");
        return;
      }

    askDoubtButton.parentNode.insertAdjacentElement("afterend", bookmarkButton);

    bookmarkButton.addEventListener("click", addNewBookmarkHandler);
}
function getProblemNameFromClasses(classList) {
  for (const className of classList) {
    const element = document.querySelector(className);
    if (element) return element.innerText;
  }
  return "Unknown Problem";
}
  
async function addNewBookmarkHandler() {
    const currentBookmarks = await getCurrentBookmarks();

    const ProblemUrl = window.location.href;
    const uniqueId = extractUniqueId(ProblemUrl);
    const problemName = getProblemNameFromClasses([
      ".Header_resource_heading__cpRp1",
      ".problem-title",
      ".text-title-large .no-underline",
      ".heading",
      ".problem-statement .title",
      "._problem-statement__inner__container_1gdez_109 .notranslate + h3",
    ]);
      

    if(currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

    const bookmarkObj = {
        id: uniqueId,
        name: problemName,
        url: ProblemUrl
    }

    const updatedBookmarks = [...currentBookmarks, bookmarkObj];

    chrome.storage.sync.set({PROBLEM_KEY: updatedBookmarks}, () => {
        console.log("Updated the bookmarks correctly to ", updatedBookmarks);
    })
}
function extractUniqueId(url) {
    // const start = url.indexOf("problems/") + "problems/".length;
    // const end = url.indexOf("?", start);
    return url;
}

function getCurrentBookmarks() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([PROBLEM_KEY], (results) => {
            resolve(results[PROBLEM_KEY] || []);
        });
    });
}
