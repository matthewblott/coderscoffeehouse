const cheerio = require("cheerio");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const xmlFiltersPlugin = require("eleventy-xml-plugin");

module.exports = (eleventyConfig) => {
  eleventyConfig.setUseGitIgnore(false);

  // No passthrough required as this file is created with postcss
  eleventyConfig.addWatchTarget("./public/bundle/bundle.css");

  // Cannot copy the parent img by itself because it contains
  // the symlinked 'tech' folder which requires a hard copy (see below)
  eleventyConfig.addPassthroughCopy("./src/assets/img/hero");

  eleventyConfig.addPassthroughCopy("./src/assets/img/angle-right.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/coffee.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/facebook.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/github.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/hamburger.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/hero.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/macbook-1.jpg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/macbook-2.jpg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/search.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/twitter.svg");
  eleventyConfig.addPassthroughCopy("./src/assets/img/youtube.svg");

  // This is the path to another git repo but the image files need to be included
  eleventyConfig.addPassthroughCopy({ "./src/tech/img": "assets/img/tech" });
  eleventyConfig.addPassthroughCopy({ "./src/tech/old": "assets/img/posts" });

  eleventyConfig.addPassthroughCopy("./src/assets/js");

  eleventyConfig.addWatchTarget("./src/assets/img");

  eleventyConfig.addFilter("toUTCString", (value) =>
    value.toISOString().substring(0, 10)
  );

  eleventyConfig.addFilter("escapeBackslash", (value) =>
    value.replaceAll("\\", "\\\\")
  );

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("stripHtml", (value) => {
    const $ = cheerio.load(value);
    let text = $.text();

    return text.substring(0, 150) + " ...";
  });

  eleventyConfig.addPlugin(xmlFiltersPlugin);

  // eleventyConfig.addPlugin(UpgradeHelper);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "www",
    },
  };
};
