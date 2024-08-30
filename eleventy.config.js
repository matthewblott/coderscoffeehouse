import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { execSync } from "child_process";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import * as cheerio from 'cheerio'

export default (eleventyConfig) => {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy("./src/assets");

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  const markdownLib = markdownIt(options).use(markdownItAttrs);

  eleventyConfig.setLibrary("md", markdownLib);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addFilter("toUTCString", (value) => value.toISOString().substring(0, 10));

  eleventyConfig.addFilter("stripHtml", (value) => {
    function extractFirst50Words(text) {
      const words = text.split(/\s+/);
      const first50Words = words.slice(0, 50);
      return first50Words.join(' ') + (words.length > 50 ? ' ...' : '');
    }

    const $ = cheerio.load(value);

    let text = $.text();

    return extractFirst50Words(text); 
  });

  eleventyConfig.on('afterBuild', () => {
    execSync('pnpm build:index', { stdio: 'inherit' });
  });

  return {
    dir: {
      input: "src",
      output: "www",
    },
  };
};
