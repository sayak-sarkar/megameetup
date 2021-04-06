function urlParser(url) {
 const str = url.split("/");
 const lastIndex = str.length-1;
 const result = [];
 
 if (!str[lastIndex] === "") {
   result.push(str[3], str[lastIndex]);
 }
 result.push(str[3], str[lastIndex-1]);

}