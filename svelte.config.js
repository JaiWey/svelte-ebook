const sveltePreprocess = require("svelte-preprocess");

const production = !process.env.ROLLUP_WATCH;

module.exports = {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  compilerOptions: {
    //enable run-time checks when not in production
    dev: !production,
  },
};
