module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the build output.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Blog collection: every Markdown file under src/blog/, oldest -> newest.
  eleventyConfig.addCollection("post", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => a.date - b.date)
  );

  // --- Filters -------------------------------------------------------------
  // Format a date as e.g. "2 September 2026" in Bahasa Melayu.
  const BULAN = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ];
  eleventyConfig.addFilter("tarikhBM", (value) => {
    const d = new Date(value);
    return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  });

  // ISO date (for <time datetime> and the RSS feed).
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString());

  // Take the first N items of an array.
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // Reverse a copy of an array (newest-first listings).
  eleventyConfig.addFilter("reverseCopy", (arr) => (arr ? [...arr].reverse() : []));

  // Serialise a value to JSON for inline <script type="application/json"> blocks.
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  // Plain-text excerpt from rendered HTML.
  eleventyConfig.addFilter("excerpt", (html, words = 40) => {
    const text = String(html)
      .replace(/<[^>]+>/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    const parts = text.split(" ");
    return parts.length > words ? parts.slice(0, words).join(" ") + "…" : text;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
};
