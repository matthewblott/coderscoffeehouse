const cheerio = require("cheerio");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = ((eleventyConfig) => {

  eleventyConfig.setUseGitIgnore(false);

  // No passthrough required as this file is created with postcss
  eleventyConfig.addWatchTarget("./public/dist/bundle.css");

  // Cannot copy the parent img by itself because it contains
  // the symlinked 'tech' folder which requires a hard copy (see below)
  eleventyConfig.addPassthroughCopy("./src/assets/img/hero");
  eleventyConfig.addPassthroughCopy("./src/assets/img/posts");

  // This is the path to another git repo but the image files need to be included
  eleventyConfig.addPassthroughCopy({ "./src/tech/img": "assets/img/tech" });
  eleventyConfig.addPassthroughCopy({ "./src/tech/old": "assets/img/posts" });

  eleventyConfig.addPassthroughCopy("./src/assets/js");

  eleventyConfig.addWatchTarget("./src/assets/img");

  eleventyConfig.addFilter("toUTCString", (value) => value.toISOString().substring(0, 10));

  eleventyConfig.addPlugin(syntaxHighlight);

  // todo: strip templateContent to the first line for the home page
  eleventyConfig.addFilter("stripHtml", (value) => {

    const $ = cheerio.load(value);

    let text = $.text();

    return text.substring(0, 150) + ' ...';
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "www",
    },
  };

});