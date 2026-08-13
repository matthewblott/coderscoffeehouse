const data = {
  env: process.env.ELEVENTY_RUN_MODE === "build" ? "production" : "development",
};

export default data;
