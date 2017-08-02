
var pi = Math.PI;

var e = Math.exp(1);


function factorial( n ) {

  if ( Number.isInteger(n) && n >= 0 ) {

    var result = 1;
    for ( var i = 2 ; i <= n ; i++ ) result *= i;
    return result;

  } else return gamma( n+1 );

}

function binomial( n, m ) {

  return factorial(n) / factorial(n-m) / factorial(m);

}


// Rounding functions

function roundTo( x, n ) {

  var exponent = Math.floor( Math.log10( Math.abs(x) ) );
  n = n - exponent;
  return Math.round( 10**n * x ) / 10**n;

}

function ceilTo( x, n ) {

  var exponent = Math.floor( Math.log10( Math.abs(x) ) );
  n = n - exponent;
  return Math.ceil( 10**n * x ) / 10**n;

}

function floorTo( x, n ) {

  var exponent = Math.floor( Math.log10( Math.abs(x) ) );
  n = n - exponent;
  return Math.floor( 10**n * x ) / 10**n;

}

function chop( x, tolerance=1e-10 ) {

  if ( isComplex(x) ) return { re: chop(x.re), im: chop(x.im) };

  if ( Math.abs(x) < tolerance ) x = 0;
  return x;

}



function besselJ( n, x ) {

  return (x/2)**n * hypergeometric0F1( n+1, -.25*x**2 ) / gamma(n+1);

}

function besselY( n, x ) {

  return ( besselJ(n,x) * cos(n*pi) - besselJ(-n,x) ) / sin(n*pi);


}

function besselI( n, x ) {

  return (x/2)**n * hypergeometric0F1( n+1, .25*x**2 ) / gamma(n+1);

}

function besselK( n, x ) {

  return pi/2 * ( besselI(-n,x) - besselI(n,x) ) / sin(n*pi);


}


function airyAi( x ) {

  if ( x > 0 ) return 1/pi * sqrt(x/3) * besselK(1/3, 2/3*x**(3/2));

  if ( x === 0 ) return 1 / 3**(2/3) / gamma(2/3);

  if ( x < 0 ) return sqrt(-x) / 2 * (  besselJ(1/3, 2/3*(-x)**(3/2))
                                       - besselY(1/3, 2/3*(-x)**(3/2)) / sqrt(3) );

}

function airyBi( x ) {

  if ( x > 0 ) return sqrt(x/3) * ( besselI(1/3, 2/3*x**(3/2))
                                    + besselI(-1/3, 2/3*x**(3/2)) );

  if ( x === 0 ) return 1 / 3**(1/6) / gamma(2/3);

  if ( x < 0 ) return -sqrt(-x) / 2 * ( besselJ(1/3, 2/3*(-x)**(3/2)) / sqrt(3)
                                        + besselY(1/3, 2/3*(-x)**(3/2)) );

}

function complex( x, y ) {

  var y = y || 0;
  return { re: x, im: y };

}

var C = complex;

var isComplex = isNaN


// JavaScript does not yet support operator overloading

function add( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re + y.re, im: x.im + y.im };

  } else return x + y;

}

function sub( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re - y.re, im: x.im - y.im };

  } else return x - y;

}

function mul( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    return { re: x.re * y.re - x.im * y.im,
             im: x.im * y.re + x.re * y.im };

  } else return x * y;

}

function div( x, y ) {

  // need to handle 0/0...

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    var ySq = y.re * y.re + y.im * y.im;
    return { re: ( x.re * y.re + x.im * y.im ) / ySq,
             im: ( x.im * y.re - x.re * y.im ) / ySq };

  } else return x / y;

}

function pow( x, y ) {

  if ( isComplex(x) || isComplex(y) ) {

    if ( !isComplex(x) ) x = complex(x,0);
    if ( !isComplex(y) ) y = complex(y,0);

    var r = Math.sqrt( x.re * x.re + x.im * x.im );
    var phi = Math.atan2( x.im, x.re );

    var R = r**y.re * Math.exp( -phi * y.im );
    var Phi = phi * y.re + y.im * Math.log(r);

    return { re: R * Math.cos(Phi), im: R * Math.sin(Phi) };

  } else return x**y;


}

function root( x, y ) { return pow( x, div( 1, y ) ); }

function sqrt( x ) {

  if ( isComplex(x) ) {

    var R = ( x.re * x.re + x.im * x.im )**(1/4);
    var Phi = Math.atan2( x.im, x.re ) / 2;

    return { re: R * Math.cos(Phi), im: R * Math.sin(Phi) };

  } else return Math.sqrt(x);

}



function jacobiTheta( n, x, q ) {

  switch( n ) {

    case 1:

      var s = 0;
      for ( var i = 0 ; i < 100 ; i++ ) s += (-1)**i * q**(i*i+i) * sin( (2*i+1) * x );
      return 2 * q**(1/4) * s;

    case 2:

      var s = 0;
      for ( var i = 0 ; i < 100 ; i++ ) s += q**(i*i+i) * cos( (2*i+1) * x );
      return 2 * q**(1/4) * s;

    case 3:

      var s = 0;
      for ( var i = 1 ; i < 100 ; i++ ) s += q**(i*i) * cos( 2*i * x );
      return 1 + 2 * s;

    case 4:

      var s = 0;
      for ( var i = 1 ; i < 100 ; i++ ) s += (-q)**(i*i) * cos( 2*i * x );
      return 1 + 2 * s;

    default:

      throw( 'Undefined Jacobi theta index' );

  }

}


function sn( x, m ) {


  return 1;

}

// Log of gamma less likely to overflow than gamma
// Lanczos approximation as evaluated by Paul Godfrey

function logGamma( x ) {

  var c = [ 57.1562356658629235, -59.5979603554754912, 14.1360979747417471,
            -0.491913816097620199, .339946499848118887e-4, .465236289270485756e-4,
            -.983744753048795646e-4, .158088703224912494e-3, -.210264441724104883e-3,
            .217439618115212643e-3, -.164318106536763890e-3, .844182239838527433e-4,
            -.261908384015814087e-4, .368991826595316234e-5 ];

  if ( isComplex(x) ) {

    if ( Number.isInteger(x.re) && x.re <= 0 && x.im === 0 )
      throw( 'Gamma function pole' );

    // reflection formula
    if ( x.re < 0 ) {
      var y = mul( -1, x );
      return sub( log( div( -pi, mul( y, sin( mul(pi,y) ) ) ) ), logGamma(y) );
    }

    var t = add( x, 5.24218750000000000 );
    t = sub( mul( add( x, 0.5 ), log(t)), t );
    var s = 0.999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s = add( s, div( c[j], add( x, j+1 ) ) );
    return add( t, log( mul( 2.5066282746310005, div( s, x ) ) ) );

  } else {

    if ( Number.isInteger(x) && x <= 0 )
      throw( 'Gamma function pole' ); 

    var t = x + 5.24218750000000000;
    t = ( x + 0.5 ) * log(t) - t;
    var s = 0.999999999999997092;
    for ( var j = 0 ; j < 14 ; j++ ) s += c[j] / (x+j+1);
    return t + log( 2.5066282746310005 * s / x );

  }

}

function gamma( x ) {

  // logGamma complex on negative axis
  if ( !isComplex(x) && x < 0 )
    return exp( logGamma( complex(x) ) ).re;
  else return exp( logGamma(x) );

}

function beta( x, y ) {

  return div( mul( gamma(x), gamma(y) ), gamma( add(x,y) ) ); 

}


function hypergeometric0F1( a, x ) {

  if ( Number.isInteger(a) && a < 0 ) throw( 'Hypergeometric function pole' );

  var s = 1;
  var p = 1;

  for ( var i = 1 ; i < 100 ; i++ ) {
    p *= x / a / i;
    s += p;
    a++;
  }

  return s;

}


function hypergeometric1F1( a, b, x ) {

  if ( Number.isInteger(b) && b < 0 ) throw( 'Hypergeometric function pole' );

  var s = 1;
  var p = 1;

  for ( var i = 1 ; i < 100 ; i++ ) {
    p *= x * a / b / i;
    s += p;
    a++;
    b++;
  }

  return s;

}


function hypergeometric2F1( a, b, c, x ) {

  if ( Number.isInteger(c) && c < 0 ) throw( 'Hypergeometric function pole' );

  if ( x === 1 ) return gamma(c) * gamma(c-a-b) / gamma(c-a) / gamma(c-b);

  var s = 1;
  var p = 1;

  for ( var i = 1 ; i < 1000 ; i++ ) {
    p *= x * a * b / c / i;
    s += p;
    a++;
    b++;
    c++;
  }

  return s;

}


function exp( x ) {

  if ( isComplex(x) )

    return { re: Math.exp(x.re) * Math.cos(x.im),
             im: Math.exp(x.re) * Math.sin(x.im) };

  else return Math.exp(x);

}


function log( x, base ) {

  if ( isComplex(x) ) {

    var r = sqrt( x.re * x.re + x.im * x.im );
    var phi = Math.atan2( x.im, x.re );

    return { re: log(r,base), im: log(e,base) * phi };

  } else if ( x < 0 ) return log( complex(x), base );

  else if ( base === undefined ) return Math.log(x);

  else return Math.log(x) / Math.log(base);

}

var ln = log;


function hermite( n, x ) {

  function coefficients( n ) {

    var minus2 = [ 1 ];
    var minus1 = [ 2, 0 ];
    var t, current;

    if ( n === 0 ) return minus2;
    if ( n === 1 ) return minus1;

    for ( var i = 2 ; i <= n ; i++ ) {
      current = [];
      t = minus1.slice();
      t.push( 0 );
      minus2.unshift( 0, 0 );
      for ( var k = 0 ; k < t.length ; k++ )
        current.push( 2*t[k] - 2*(i-1)*minus2[k] );
      minus2 = minus1;
      minus1 = current;
    }

    return current;

  }

  if ( Number.isInteger(n) && n >= 0 )
    return polynomial( x, coefficients(n) );

  else {

    var s = hypergeometric1F1( -n/2, 1/2, x**2 ) / gamma( (1-n)/2 )
            - 2 * x * hypergeometric1F1( (1-n)/2, 3/2, x**2 ) / gamma( -n/2 );
    return 2**n * sqrt(pi) * s;

  }

}


// Complex circular functions

function sin( x ) {

  if ( isComplex(x) )

    return { re: Math.sin(x.re) * Math.cosh(x.im),
             im: Math.cos(x.re) * Math.sinh(x.im) };

  else return Math.sin(x);

}

function cos( x ) {

  if ( isComplex(x) )

    return { re: Math.cos(x.re) * Math.cosh(x.im),
             im: -Math.sin(x.re) * Math.sinh(x.im) };

  else return Math.cos(x);

}

function tan( x ) {

  if ( isComplex(x) ) return div( sin(x), cos(x) );

  else return Math.tan(x);

 }

function cot( x ) {

 if ( isComplex(x) ) return div( cos(x), sin(x) );

  else return 1 / Math.tan(x);

}

function sec( x ) {

  if ( isComplex(x) ) return div( 1, cos(x) );

  else return 1 / Math.cos(x);

}

function csc( x ) {

  if ( isComplex(x) ) return div ( 1, sin(x) );

  else return 1 / Math.sin(x);

}


// Inverse circular functions

function arcsin( x ) {

  if ( isComplex(x) ) {

    var s = sqrt( sub( 1, mul( x, x ) ) );
    s = add( mul( complex(0,1), x ), s ); 
    return mul( complex(0,-1), log( s ) );

  } else if ( Math.abs(x) <= 1 ) return Math.asin(x);

  else return arcsin( complex(x) );

}

function arccos( x ) {

  if ( isComplex(x) ) {

    return sub( pi/2, arcsin(x) );

  } else if ( Math.abs(x) <= 1 ) return Math.acos(x);

  else return arccos( complex(x) );

}

function arctan( x ) {

  if ( isComplex(x) ) {

    var s = sub( log( sub( 1, mul( complex(0,1), x ) ) ),
                 log( add( 1, mul( complex(0,1), x ) ) ) );
    return mul( complex(0,1/2), s );

  } else return Math.atan(x);

}

function arccot( x ) {

  if ( isComplex(x) ) return arctan( div( 1, x ) );

  else return Math.atan( 1/x );

}

function arcsec( x ) {

  if ( isComplex(x) ) return arccos( div( 1, x ) );

  else if ( Math.abs(x) >= 1 ) return Math.acos( 1/x );

  else return arcsec( complex(x) );

}

function arccsc( x ) {

  if ( isComplex(x) ) return arcsin( div( 1, x ) );

  else if ( Math.abs(x) >= 1 ) return Math.asin( 1/x );

  else return arccsc( complex(x) );

}


// Complex hyperbolic functions

function sinh( x ) {

  if ( isComplex(x) )

    return { re: Math.sinh(x.re) * Math.cos(x.im),
             im: Math.cosh(x.re) * Math.sin(x.im) };

  else return Math.sinh(x);

}

function cosh( x ) {

  if ( isComplex(x) )

    return { re: Math.cos(x.re) * Math.cosh(x.im),
             im: Math.sin(x.re) * Math.sinh(x.im) };

  else return Math.cosh(x);

}

function tanh( x ) {

  if ( isComplex(x) ) return div( sinh(x), cosh(x) );

  else return Math.tanh(x);

}

function coth( x ) {

  if ( isComplex(x) ) return div( cosh(x), sinh(x) );

  else return 1 / Math.tanh(x);

}

function sech( x ) {

  if ( isComplex(x) ) return div( 1, cosh(x) );

  else return 1 / Math.cosh(x);

}

function csch( x ) {

  if ( isComplex(x) ) return div( 1, sinh(x) );

  else return 1 / Math.sinh(x);

}


// Inverse hyperbolic functions

function arcsinh( x ) {

  if ( isComplex(x) ) {

    var s = sqrt( add( mul( x, x ), 1 ) );
    s = add( x, s );
    return log( s );

  } else return Math.asinh(x);

}

function arccosh( x ) {

  if ( isComplex(x) ) {

    var s = mul( sqrt( add( x, 1 ) ), sqrt( sub( x, 1 ) ) );
    s = add( x, s ); 
    return log( s );

  } else if ( x >= 1 ) return Math.acosh(x);

  else return arccosh( complex(x) );

}

function arctanh( x ) {

  if ( isComplex(x) ) {

    var s = sub( log( add( 1, x ) ), log( sub( 1, x ) ) );
    return mul( 1/2, s );

  } else if ( Math.abs(x) <= 1 ) return Math.atanh(x);

  else return arctanh( complex(x) );

}

function arccoth( x ) {

  if ( isComplex(x) ) {

    if ( x.re === 0 && x.im === 0 ) throw( 'Indeterminate value' );

    return arctanh( div( 1, x ) );

  } else if ( Math.abs(x) > 1 ) return Math.atanh( 1/x );

  else return arccoth( complex(x) );

}

function arcsech( x ) {

  if ( isComplex(x) ) {

    if ( x.re === 0 && x.im === 0 ) throw( 'Indeterminate value' );

    // adjust for branch cut along negative axis
    if ( x.im === 0 ) x.im = -Number.MIN_VALUE;

    return arccosh( div( 1, x ) );

  } else if ( x > 0 && x < 1 ) return Math.acosh( 1/x );

  else return arcsech( complex(x) );

}

function arccsch( x ) {

  if ( isComplex(x) ) {

    return arcsinh( div( 1, x ) );

  } else return Math.asinh( 1/x );

}


function zeta( x ) {

  // functional equation
  if ( x < 0 ) return 2**x * pi**(x-1) * sin(pi*x/2) * gamma(1-x) * zeta(1-x); 

  // summation of Dirichlet eta function
  var s = 0;
  for ( var i = 1 ; i < 1e7 ; i++ ) {
    var last = s;
    s -= (-1)**i / i**x;
    if ( Math.abs(s-last) < 1e-8 ) break;
  }

  return s / ( 1 - 2**(1-x) );

}



function ode( f, y, [x0, x1], step=.001, method='euler' ) {

  if ( f(x0,y)[0] === undefined ) {
    g = f;
    f = function(x) { return [ g(x) ]; };
    y = [ y ];
  }

  var points = [ [x0].concat(y) ];

  switch( method ) {

    case 'euler':

      for ( var x = x0+step ; x <= x1 ; x += step ) {

        var k = [];
        for ( var i = 0 ; i < y.length ; i++ ) k.push( f(x,y)[i] * step );

        for ( var i = 0 ; i < y.length ; i++ ) y[i] += k[i];
        points.push( [x].concat(y) );

      }

      return points;

    case 'runge-kutta':

      for ( var x = x0+step ; x <= x1 ; x += step ) {

        var k1 = [], k2 = [], k3 = [], k4 = [];
        var y1 = [], y2 = [], y3 = [];

        for ( var i = 0 ; i < y.length ; i++ ) k1.push( f(x,y)[i] );
        for ( var i = 0 ; i < y.length ; i++ ) y1.push( y[i] + k1[i]*step/2 );
        for ( var i = 0 ; i < y.length ; i++ ) k2.push( f( x+step/2, y1 )[i] );
        for ( var i = 0 ; i < y.length ; i++ ) y2.push( y[i] + k2[i]*step/2 );
        for ( var i = 0 ; i < y.length ; i++ ) k3.push( f( x+step/2, y2 )[i] );
        for ( var i = 0 ; i < y.length ; i++ ) y3.push( y[i] + k3[i]*step );
        for ( var i = 0 ; i < y.length ; i++ ) k4.push( f( x+step, y3 )[i] );

        for ( var i = 0 ; i < y.length ; i++ )
          y[i] += ( k1[i] + 2*k2[i] + 2*k3[i] + k4[i] ) * step / 6;

        points.push( [x].concat(y) );

      }

      return points;

    default:

      throw( 'Unsupported method' );

  }

}





function diff( f, x, n=1, method='ridders' ) {

  // Central differences have h^2 error but division
  //   by h^n increases roundoff error
  // Step sizes chosen as epsilon^(1/(n+2)) to minimize error

  function difference() {

    var s = 0;
    for ( var i = 0 ; i <= n ; i++ )
      s += (-1)**i * binomial(n,i) * f( x + (n-2*i)*h );

    return s / (2*h)**n

  }

  switch( method ) {

    case 'naive':

      // only accurate for first couple derivatives
      var h = (1e-8)**(1/(n+2));
      return difference();

    case 'ridders':

      var h = (1e-5)**(1/(n+2));
      var error = Number.MAX_VALUE;
      var maxIter = 10;
      var result;

      var d = [];
      for ( var i = 0 ; i < maxIter ; i++ ) d.push( [] );

      // Richardson extrapolation as per C. Ridders
      d[0][0] = difference();

      for ( var i = 1 ; i < maxIter ; i++ ) {

        h /= 2;
        d[0][i] = difference();

        for ( var j = 1 ; j <= i ; j++ ) {

          d[j][i] = ( 4**j * d[j-1][i] - d[j-1][i-1] ) / ( 4**j - 1 );

          var delta = Math.max( Math.abs( d[j][i] - d[j-1][i] ),
                                Math.abs( d[j][i] - d[j-1][i-1] ) );
          if ( delta <= error ) {
            error = delta;
            result = d[j][i];
          }

        }

        if ( Math.abs( d[i][i] - d[i-1][i-1] ) > error ) break;

      }

      return result;

    default:

      throw( 'Unsupported method' );

  }

}

var D = diff;


function integrate( f, a, b, method='adaptive-simpson') {

  var h = ( b - a ) / 2;
  var s = ( f(a) + f(b) ) / 2 + f( (a+b)/2 );

  function nextIter() {

      h /= 2;
      var x = a + h;
      while ( x < b ) {
        // only add new function evaluations
        s += f(x);
        x += 2*h;
      }

  }

  switch( method ) {

    case 'euler-maclaurin':

      // Euler-Maclaurin summation formula

      var tolerance = 1e-10;
      var maxIter = 50;

      var result = h * s;
      var previous = result;

      for ( var i = 0 ; i < maxIter ; i++ ) {

        nextIter();
        result = h * s;
        if ( Math.abs( result - previous ) < tolerance * Math.abs(previous) ) return result;
        previous = result;

      }

      throw( 'Maximum interations reached' );

    case 'romberg':

      var error = Number.MAX_VALUE;
      var maxIter = 30;
      var result = h * s;

      var d = [];
      for ( var i = 0 ; i < maxIter ; i++ ) d.push( [] );

      // Richardson extrapolation of Euler-Maclaurin trapezoids
      d[0][0] = result;

      for ( var i = 1 ; i < maxIter ; i++ ) {

        nextIter();
        d[0][i] = h * s;

        for ( var j = 1 ; j <= i ; j++ ) {

          d[j][i] = ( 4**j * d[j-1][i] - d[j-1][i-1] ) / ( 4**j - 1 );

          var delta = Math.max( Math.abs( d[j][i] - d[j-1][i] ),
                                Math.abs( d[j][i] - d[j-1][i-1] ) );
          if ( delta <= error ) {
            error = delta;
            result = d[j][i];
          }

        }

        if ( Math.abs( d[i][i] - d[i-1][i-1] ) > error ) break;

      }

      return result;

    case 'adaptive-simpson':

      // algorithm by Charles Collins

      var tolerance = 1e-8;
      var maxIter = 50;

      function adaptiveSimpson( a, b, fa, fm, fb, s, tolerance, depth ) {

        var h = b - a;
        var f1 = f( a + h/4 );
        var f2 = f( b - h/4 )

        var s1 = ( fa + 4*f1 + fm ) * h / 12;
        var s2 = ( fm + 4*f2 + fb ) * h / 12;
        var ss = s1 + s2;
        var error = ( ss - s ) / 15;

        if ( Math.abs(error) < tolerance  || depth > maxIter ) return ss + error;
        else {
          var m = a + h/2;
          return adaptiveSimpson( a, m, fa, f1, fm, s1, tolerance/2, depth+1 )
                 + adaptiveSimpson( m, b, fm, f2, fb, s2, tolerance/2, depth+1 );
        }

      }

      var fa = f(a);
      var fm = f( (a+b)/2 );
      var fb = f(a);
      var s = ( fa + 4*fm + fb ) * (b-a) / 6;
      var depth = 0;

      return adaptiveSimpson( a, b, fa, fm, fb, s, tolerance, depth );

    default:

      throw( 'Unsupported method' );

  }

}


function discreteIntegral( values, step ) {

  // Euler-Maclaurin summation over fixed intervals

  var s = ( values[0] + values[ values.length - 1 ] ) / 2;

  for ( var i = 1 ; i < values.length - 1 ; i++ ) s += values[i];

  return s * step;

}





function polynomial( x, coefficients, derivative=false ) {

  // Horner's method with highest power coefficient first

  var p = coefficients[0];
  var q = 0;

  for ( var i = 1 ; i < coefficients.length ; i++ ) {
    if ( derivative ) q = p + q * x;
    p = coefficients[i] + p * x;
  }

  if ( derivative ) return { polynomial:p, derivative:q };
  else return p;

}


function findRoot( f, a, b, tolerance=1e-10, method='bisect' ) {

  switch( method ) {

    case 'bisect':

      var fa = f(a);
      var fb = f(b);

      if ( fa * f(b) >= 0 ) throw( 'Change of sign necessary for bisection' );

      var root, h;
      if ( fa < 0 ) {
        root = a;
        h = b - a;
      } else {
        root = b;
        h = a - b;
      }

      var maxIter = 100;
      for ( var i = 0; i < maxIter ; i++ ) {
        h /= 2;
        var mid = root + h;
        fmid = f(mid);
        if ( fmid <= 0 ) root = mid;
        if ( fmid === 0 || Math.abs(h) < tolerance ) return root;
      }

      throw( 'No root found for tolerance ' + tolerance );

    default:

      throw( 'Unsupported method' );

  }

}


function hessenbergForm( matrix ) {




}

function eigensystem( matrix ) {



}



function luDecomposition( matrix ) {







}

function determinant( matrix ) {


}


function matrix( rows, columns ) {

  var columns = columns || rows;

  var m = [];
  for ( var i = 0 ; i < rows ; i++ ) {
    m.push( [] );
    for ( var j = 0 ; j < columns ; j++ ) m[i].push( 0 );
  }

  return m;

}

function identity( rows ) {

  var m = matrix( rows );
  for ( var i = 0 ; i < rows ; i++ ) m[i][i] = 1;

  return m;

}


