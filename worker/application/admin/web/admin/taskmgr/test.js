var ob = {
  dsnudbfs: {
    cpu: 36,
  },
  edfdgfdg: {
    cpu: 12,
  },

  f4ewsdfewsdfe: {
    cpu: 77,
  },

  gr4sdfewsdf: {
    cpu: 3,
  },
  fgdfgdgdf: {
    cpu: 42,
  },
};

// get order by cpu
var keys = Object.keys(ob);
keys.sort(function (a, b) {
  return ob[b].cpu - ob[a].cpu;
});
// sort ob using keys
var newOb = [];
for (var i = 0; i < keys.length; i++) {
  newOb[i] = ob[keys[i]];
}
console.log("xxx", newOb);
