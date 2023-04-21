function replaceMarkdown(str) {
    str = str.replaceAll("&#x2F;", "/");
    Array.from(str.matchAll(/\*\*\*[^*]+\*\*\*/gm)).forEach((match) => { //Bold Italics
        str = str.replace(match[0], `<b><i>${match[0].substring(3,match[0].length-3)}</i></b>`);
    });
    Array.from(str.matchAll(/\*\*[^*]+\*\*/gm)).forEach((match) => { //Bold
        str = str.replace(match[0], `<b>${match[0].substring(2,match[0].length-2)}</b>`);
    });
    Array.from(str.matchAll(/\*[^*]+\*/gm)).forEach((match) => { //Italics
        str = str.replace(match[0], `<i>${match[0].substring(1,match[0].length-1)}</i>`);
    });
    Array.from(str.matchAll(/\[img](.*)\[\/img]/gm)).forEach((match) => { //Image
        str = str.replace(match[0], `<img class="post-image" src="${match[1].substring(0, match[0].length-5)}">`);
    });
    Array.from(str.matchAll(/\[quote](.*)\[\/quote]/gm)).forEach((match) => { //Quote
        str = str.replace(match[0], `<blockquote>${match[1]}</blockquote>`);
    });
    Array.from(str.matchAll(/\[code](.*)\[\/code]/gm)).forEach((match) => { //Code
        str = str.replace(match[0], `<code>${match[1]}</code>`);
    });
    Array.from(str.matchAll(/\[spoiler](.*)\[\/spoiler]/gm)).forEach((match) => { //Spoiler
        str = str.replace(match[0], `<span class="spoiler">${match[1]}</span>`);
    });
    return str;
}
module.exports = replaceMarkdown;