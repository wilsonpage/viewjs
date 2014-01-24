
suite('View#prependTo', function() {

  test('Should inject the root element as the first child', function() {
    var Foo = view.define({});
    var foo = new Foo();

    foo.prependTo(document.body);

    assert(foo.el === document.body.firstChild);
  });

  test('Should still work if target is empty', function() {
    var target = document.createElement('div');
    var Foo = view.define({});
    var foo = new Foo();

    foo.prependTo(target);

    assert(foo.el === target.firstChild);
  });

  test('Should fire an \'insert\' event', function() {
    var target = document.createElement('div');
    var callback = sinon.spy();
    var Foo = view.define({});
    var foo = new Foo();

    foo.on('insert', callback);
    foo.prependTo(target);

    assert(callback.called);
  });

  test('Should fail silently', function() {
    var target = document.querySelector('.doesnt-exist');
    var Foo = view.define({});
    var foo = new Foo();

    foo.prependTo(target);

    assert(true);
  });

  test('Should not fire the \'inserted\' event on failure', function() {
    var target = document.querySelector('.doesnt-exist');
    var callback = sinon.spy();
    var Foo = view.define({});
    var foo = new Foo();

    foo.on('inserted', callback);
    foo.prependTo(target);

    assert(!callback.called);
  });

});