
suite('View#attrOptions()', function() {
  test('Should a key/value object of attirbute on the root element', function() {
    var Foo = viewjs.define({});
    var foo = new Foo();

    foo.el.setAttribute('foo', 'foo');
    foo.el.setAttribute('bar', 'bar');

    var options = foo.attrOptions();

    assert(options.foo === 'foo');
    assert(options.bar === 'bar');
  });

  test('Should node attrs should be accessible in `initialize` callback', function() {
    var Foo = viewjs.define({
      initialize: function(options) {
        assert(options.foo === 'foo');
        assert(options.bar === 'bar');
      }
    });

    var el = document.createElement('div');
    el.setAttribute('foo', 'foo');
    el.setAttribute('bar', 'bar');

    var foo = new Foo({ el: el });
  });

  test('Should ignore \'view-*\' attributes', function() {
    var Foo = viewjs.define({});
    var foo = new Foo();

    foo.el.setAttribute('foo', 'foo');
    foo.el.setAttribute('view-foo', 'view-foo');
    foo.el.setAttribute('foo-view-foo', 'foo-view-foo');

    var options = foo.attrOptions();

    assert(options.foo === 'foo');
    assert(options['view-foo'] === undefined);
    assert(options['foo-view-foo'] === 'foo-view-foo');
  });

  test('Should ignore \'id\' and \'class\' attributes', function() {
    var Foo = viewjs.define({});
    var foo = new Foo();

    var options = foo.attrOptions();

    assert(options.id === undefined);
    assert(options.class === undefined);
  });
});