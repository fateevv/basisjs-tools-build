// <?xml version="1.0" encoding="utf-8"?>
// <testsuite name="basis lint" tests="1" failures="2">
//     <testcase name="filename.js" failures="2">
//         <failure>...</failure>
//         <failure>...</failure>
//         ...
//     </testcase>
// </testsuite>

var utils = require('../../common/utils');

function escapeString(str){
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = function(data){
  var warns = Object.keys(data).sort();
  var totalFailuresCount = 0;
  var output = [];

  warns.forEach(function(fn){
    var count = data[fn].length;

    totalFailuresCount += count;

    output.push(
      '\t<testcase name="' + fn + '" failures="' + count + '">',
      data[fn].map(function(w){
        var loc = w.loc;

        if (!loc)
          loc = ':1:1';
        if (!Array.isArray(loc))
          loc = [loc];

        return loc.map(function(loc){
          var line = 1;
          var column = 1;
          var m = loc.match(/:(\d+):(\d+)$/);

          if (m)
          {
            line = m[1];
            column = m[2];
          }

          return '\t\t<failure>' + escapeString(w.message + ':' + line + ':' + column) + '</failure>';
        }).join('\n');
      }).join('\n'),
      '\t</testcase>'
    );
  });

  output.unshift(
    '<?xml version="1.0" encoding="utf-8"?>',
    '<testsuite name="basis lint" tests="' + warns.length + '" failures="' + totalFailuresCount + '">',
    '\t<properties>',
    '\t\t<property name="basisjs-tools" value="' + utils.getToolsId() + '"/>',
    // (flow.js.basisId ? '\n\t\t<property name="basisjs" value="' + flow.js.basisId + '"/>' : ''),
    '\t</properties>'
  );
  output.push(
    '</testsuite>'
  );

  return output.join('\n');
};
