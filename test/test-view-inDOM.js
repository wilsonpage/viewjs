
suite('View#inDOM', function() {

  test('Should return true when in DOM', function() {
    var Foo = view.define({});
    var foo = new Foo();

    document.body.appendChild(foo.el);

    assert(foo.inDOM() === true);
  });

  test('Should return false when not in DOM', function() {
    var Foo = view.define({});
    var foo = new Foo();

    assert(foo.inDOM() === false);
  });

});