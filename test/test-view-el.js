

suite('View#el', function() {

	test('Should create an element if one not passed to constructor', function() {
    var Foo = View.extend({});
    var foo = new Foo();

    assert(foo.el);
	});

  test('Should use the element passed as the root element', function() {
    var Foo = View.extend({});
    var rootEl = document.createElement('div');
    var foo = new Foo({ el: rootEl });

    assert(foo.el === rootEl);
  });

  test('Should have the module name as a class', function() {
    var Foo = View.extend({ name: 'foo' });
    var foo = new Foo();

    assert(foo.el.classList.contains('foo'));
  });

  test('Should have the defined className in the el.className', function() {
    var Foo = View.extend({ className: 'some classes' });
    var foo = new Foo();

    assert(foo.el.classList.contains('some'));
    assert(foo.el.classList.contains('classes'));
  });

  test('Should maintain classes if custom element passed in', function() {
    var el = document.createElement('div');
    el.className = 'foo bar';

    var Foo = View.extend({});
    var foo = new Foo({ el: el });

    assert(foo.el.classList.contains('foo'));
    assert(foo.el.classList.contains('bar'));
  });

  test('Should not add additional classes to custom root element', function() {
    var el = document.createElement('div');
    el.className = 'foo bar';

    var Foo = View.extend({ className: 'some classes' });
    var foo = new Foo({ el: el });

    assert(!foo.el.classList.contains('some'));
    assert(!foo.el.classList.contains('classes'));
  });

  test('Should be assigned a unique id', function() {
    var Foo = View.extend({});
    var foo = new Foo();

    assert(foo.el.id);
  });

});