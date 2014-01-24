
suite('View#render', function() {

  test('Should emit event hooks', function() {
    var Foo = view.define({ render: function() {} });
    var callback = sinon.spy();
    var foo = new Foo();

    foo.on('before render', callback);
    foo.on('render', callback);

    foo.render();
    assert(callback.calledTwice);
  });

});