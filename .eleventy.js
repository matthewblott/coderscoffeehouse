import * as cheerio from 'cheerio'
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import xmlFiltersPlugin from "eleventy-xml-plugin";

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  // No passthrough required as this file is created with postcss
  eleventyConfig.addWatchTarget("./public/bundle/bundle.css");

  eleventyConfig.addPassthroughCopy("./src/assets");

  // Add a conditional check for the tech folder and any accompanying image folder
  eleventyConfig.addPassthroughCopy({
    "./src/tech/assets/img": "assets/img",
  });

  eleventyConfig.addWatchTarget("./src");

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

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "www",
    },
  };
};
