const cheerio = require("cheerio");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = ((eleventyConfig) => {

  eleventyConfig.setUseGitIgnore(false);

  // No passthrough required as this file is created with postcss
  eleventyConfig.addWatchTarget("./public/dist/bundle.css");

  eleventyConfig.addPassthroughCopy("./src/assets/img");

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