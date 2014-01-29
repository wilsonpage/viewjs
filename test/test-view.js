suite('viewjs()', function() {
  test('Should accept a JSON like object', function() {
    var Foo = viewjs.define({ name: 'foo' });
    var foo = viewjs({ name: 'foo' });

    assert(foo.name === 'foo');
    assert(foo instanceof viewjs.Base);
  });

  test('Should accept a DOM element', function() {
    var Foo = viewjs.define({ name: 'foo' });

    var html = '<div id="view1" name="foo"></div>';
    var container = document.createElement('div');
    container.innerHTML = html;
    var el = container.firstElementChild;

    var foo = viewjs(el);

    assert(foo.name === 'foo');
    assert(foo.el === el);
    assert(foo instanceof viewjs.Base);
  });

  test('Should fail silently if name not found', function() {
    var foo = viewjs({ name: 'foo' });
  });
});