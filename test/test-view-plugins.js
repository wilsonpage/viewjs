
suite('View#plugins', function() {

  beforeEach(function() {
    view.Base.prototype.plugins = [];
  });

  test('Should run plugins defined on the class at definition', function() {
    var plugin = sinon.spy();
    var Foo = view.define({ plugins: [plugin] });
    var foo = new Foo();

    assert(plugin.called);
  });

  test('Should be passed the view instance as the first argument to the plugin', function() {
    var plugin = sinon.spy();
    var Foo = view.define({ plugins: [plugin] });
    var foo = new Foo();

    assert(plugin.calledWith(foo));
  });

  test('Should apply plugins on the prototype for every view', function() {
    var plugin = sinon.spy();

    view.plugin(plugin);

    var Foo = view.define({});
    var foo = new Foo();

    assert(plugin.called);
  });

  test('Should run class plugins as well as prototype plugins', function() {
    var plugin1 = sinon.spy();
    var plugin2 = sinon.spy();

    view.plugin(plugin1);

    var Foo = view.define({ plugins: [plugin2] });
    var foo = new Foo();

    assert(plugin1.called);
    assert(plugin2.called);
  });

  test('Should not allow the same plugin to be added to prototype twice', function() {
    var plugin = sinon.spy();

    view
      .plugin(plugin)
      .plugin(plugin);

    var Foo = view.define({});
    var foo = new Foo();

    assert(plugin.calledOnce);
    assert(view.Base.prototype.plugins.length === 1);
  });

  test('Should not allow the same plugin to be added to an instance twice', function() {
    var plugin = sinon.spy();

    view.plugin(plugin);

    var Foo = view.define({ plugins: [plugin]});
    var foo = new Foo();

    assert(plugin.calledOnce);
    assert(view.Base.prototype.plugins.length === 1);
  });

});