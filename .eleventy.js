import { execSync } from "child_process";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import * as cheerio from 'cheerio'

export default function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy({ "./src/other-stuff/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "./src/tech/assets": "assets" });

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  const markdownLib = markdownIt(options).use(markdownItAttrs);

  eleventyConfig.setLibrary("md", markdownLib);
  eleventyConfig.addPlugin(syntaxHighlight);
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

  eleventyConfig.on('eleventy.after', () => {
    if (process.env.ELEVENTY_RUN_MODE === "build") {
      execSync("bun lightningcss --minify --bundle src/assets/css/site.css -o _site/assets/css/site.min.css");
    }
    execSync('bun build:index', { stdio: 'inherit' });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
