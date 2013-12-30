
suite('View#remove', function() {

  test('Should remove the root element from the DOM', function() {
    var Foo = View.extend({});
    var foo = new Foo();

    document.body.appendChild(foo.el);
    foo.remove();

    assert(!foo.el.parentNode);
  });

  test('Should fail silently if the root element has no context', function() {
    var Foo = View.extend({});
    var foo = new Foo();

    foo.remove();

    assert(true);
  });

  test('Should fire a \'remove\' event', function() {
    var callback = sinon.spy();
    var Foo = View.extend({});
    var foo = new Foo();

    document.body.appendChild(foo.el);
    foo.on('remove', callback);
    foo.remove();

    assert(callback.called);
  });

});