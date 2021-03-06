var at = require('basisjs-tools-ast').js;

(module.exports = function(flow){
  var fconsole = flow.console;

  //
  // process l10n keys paths
  //
  fconsole.start('Relink l10n token references in templates');
  flow.l10n.tmplRefs.forEach(function(entry){
    //  entity -> {
    //    file: this.file,
    //    name: name,
    //    dictionary: dictionary,
    //    key: l10nTokenRef,
    //    host: bindings,
    //    idx: i
    //  }

    entry.host[entry.idx] = 'l10n:' + entry.name + '@' + entry.dictionary.file.jsRef;//.replace(/\.l10n$/, '');
    fconsole.log('l10n:' + entry.key + ' -> ' + entry.host[entry.idx]);
  });
  fconsole.endl();

  //
  // process basis.l10n.dictionary()
  //
  fconsole.start('Relink basis.l10n.dictionary()');
  for (var path in flow.l10n.dictionaries)
  {
    var dictionary = flow.l10n.dictionaries[path];

    for (var i = 0, ref; ref = dictionary.ref[i]; i++)
      if (ref.refToken)
      {
        var old = at.translate(ref.refToken);
        ref.refToken[2][0] = ['string', './' + dictionary.file.jsRef];
        fconsole.log(old + ' -> ' + at.translate(ref.refToken));
      }
  }
  fconsole.endl();

  //
  // process basis.l10n.dictionary()
  //
  fconsole.start('Relink markup tokens');
  for (var path in flow.l10n.dictionaries)
  {
    var dictionary = flow.l10n.dictionaries[path];

    dictionary.markupTokens.forEach(function(info){
      if (!info.branch)
        return;

      var newContent = 'path:' + info.templatePath;
      info.branch[info.key] = newContent;
      fconsole.log(info.name + ' -> ' + newContent);
    });
  }
  fconsole.endl();

}).handlerName = '[l10n] Relink';

module.exports.skip = function(flow){
  if (!flow.l10n)
    return 'basis.l10n not found';
};
