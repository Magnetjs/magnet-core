import magnet from "magnet-core";

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  require("newrelic");
}

export default magnet(
  require(`./${process.env.RECIPE || "api"}`).modules
).catch(function(err) {
  console.error(err);
});
